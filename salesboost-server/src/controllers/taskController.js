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
        const { title, desc, points, type, deadline, taskImage } = req.body;
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
        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title, desc, points: parseInt(points), type, deadline, status
            }
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
