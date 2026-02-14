import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderboard = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'employee' },
            orderBy: { points: 'desc' },
            select: {
                id: true,
                name: true,
                points: true,
                avatar: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, role: true, points: true, avatar: true // Excluding password
            }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin only: Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, role: true, points: true, avatar: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { id, name, role, password, avatar } = req.body;
        // In prod, hash password here: const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { id, name, role, password, avatar } // Use hashed password
        });
        res.json({ id: user.id, name: user.name, role: user.role });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ message: 'User already exists' });
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    // Implement update logic (name, avatar, etc.)
    res.json({ message: 'Not implemented yet' });
}

export const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
