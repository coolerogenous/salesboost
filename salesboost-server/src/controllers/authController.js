import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(401).json({ message: '工号不存在，请联系管理员' });
        }

        // In production, use bcrypt.compare(password, user.password)
        // For now, since seed data uses plain text or we need to hash it.
        // Let's assume user.password is hashed.
        const isMatch = await bcrypt.compare(password, user.password);

        // Fallback for initial admin/seed data if not hashed (for dev convenience)
        if (!isMatch && password === user.password) {
            // Consider migrating to hash on successful login if needed, or just allow plain text for dev seed
        } else if (!isMatch) {
            return res.status(401).json({ message: '密码错误，请重试' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                points: user.points,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
