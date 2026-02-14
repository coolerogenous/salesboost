import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSubmissions = async (req, res) => {
    try {
        const { status, userId } = req.query; // Admin might filter by status, Employee see own
        const where = {};
        if (status) where.status = status;
        if (userId) where.userId = userId;

        // If not admin, restrict to own submissions unless it's a "public" feed (not specified, assuming own)
        // But audit view needs all.
        if (req.user.role !== 'admin' && !userId) {
            where.userId = req.user.id;
        }

        const submissions = await prisma.submission.findMany({
            where,
            include: { task: true, user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createSubmission = async (req, res) => {
    try {
        const { taskId, note, userName } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!imageUrl) return res.status(400).json({ message: 'Image is required' });

        const submission = await prisma.submission.create({
            data: {
                taskId: parseInt(taskId),
                userId: req.user.id,
                userName: req.user.name, // Redundant but useful
                imageUrl,
                note
            }
        });

        res.status(201).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const auditSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        const submission = await prisma.submission.findUnique({
            where: { id: parseInt(id) },
            include: { task: true }
        });

        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        if (submission.status !== 'pending') return res.status(400).json({ message: 'Already audited' });

        await prisma.$transaction(async (tx) => {
            await tx.submission.update({
                where: { id: parseInt(id) },
                data: { status }
            });

            if (status === 'approved') {
                await tx.user.update({
                    where: { id: submission.userId },
                    data: { points: { increment: submission.task.points } }
                });
            }
        });

        res.json({ message: `Submission ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
