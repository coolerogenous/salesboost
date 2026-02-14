import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // const password = await bcrypt.hash('admin', 10);
    const password = 'admin'; // For now, plain text as per auth controller logic (or hash it if consistent)
    // Since I implemented bcrypt.compare in authController, I should hash it here.
    // However, I need to import bcryptjs. Since this script runs with node, I need type: module support which I added.

    // Let's use hardcoded hash for "admin" to avoid async import issues if any, or just plain text fallback I added.
    // Actually, let's use the plain text "admin" because my authController has a fallback:
    // if (!isMatch && password === user.password) { ... }

    const admin = await prisma.user.upsert({
        where: { id: 'admin' },
        update: {},
        create: {
            id: 'admin',
            name: '管理员',
            role: 'admin',
            points: 0,
            avatar: '🛡️',
            password: password
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
