import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, desc, points, type, deadline } = req.body;
        const taskImage = req.file ? `/uploads/${req.file.filename}` : req.body.taskImage; // Allow string url if provided (e.g. edit without changing image)

        const task = await prisma.task.create({
            data: {
                title,
                desc,
                points: parseInt(points),
                type,
                deadline,
                taskImage
            }
        });
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc, points, type, deadline, status } = req.body;

        // Prepare data
        const data = {
            title, desc, points: parseInt(points), type, deadline, status
        };
        if (req.file) {
            data.taskImage = `/uploads/${req.file.filename}`;
        }

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: data
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
