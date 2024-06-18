import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const { email, password, fullname } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (!fullname) {
        return res.status(400).json({ message: 'Fullname is required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, fullname }
        });
        console.log(user);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
        console.log(e);
        
        res.status(400).json({ message: 'Email already exists' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.status(200).json({
        token,
        data: { id: user.id, email: user.email, fullname: user.fullname }
    });
};

export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } else if (!user.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
    } else if (oldPassword === newPassword) {
        return res.status(400).json({ message: 'New password must be different from old password' });
    } else if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    } else if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ message: 'New password must contain at least one uppercase letter' });
    } else if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({ message: 'New password must contain at least one lowercase letter' });
    } else if (!/\d/.test(newPassword)) {
        return res.status(400).json({ message: 'New password must contain at least one number' });
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword)) {
        return res.status(400).json({ message: 'New password must contain at least one special character' });
    } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: Number(userId) }, data: { password: hashedPassword } });
        res.status(200).json({ message: 'Password changed successfully' });
    }
}