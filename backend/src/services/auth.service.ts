import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client'
import { prisma } from '../db/client';
import { signJwt, verifyJwt } from '../utils/auth';
import { UserLogin } from '@shared/types';
import { sendEmail, verifyEmailTemplate } from 'src/utils/mailer';

type CreateUserData = Prisma.UserCreateInput;

export const createUser = async (data: CreateUserData): Promise<User> => {
    let hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        },
    });
};

export const loginUser = async (data: UserLogin) => {
    let user: User = await prisma.user.findUnique({
        where: { userName: data.username },
    });

    if (!user) {
        throw new Error('User not found');
    }

    let isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    if (!user.emailVerifiedAt) {
        throw new Error('Email not verified');
    }

    return signJwt(user);
}

export const verifyEmail = async (token) => {
    const decoded: User = verifyJwt(token, true);
    if (!decoded) {
        throw new Error('Invalid or expired token');
    }

    const userID = Number(decoded.userID);

    let user = await prisma.user.findUnique({
        where: { userID: userID },
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.emailVerifiedAt) {
        throw new Error('Email already verified');
    }

    return prisma.user.update({
        where: { userID: userID },
        data: {
            emailVerifiedAt: new Date(),
        },
    });
}

export const sendVerificationEmail = async (user: User): Promise<boolean> => {
    const token = signJwt(user, true);
    const link = `${process.env.APP_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;
    
    await sendEmail({
        to: user.email,

        subject: 'Email Verification',
        html: verifyEmailTemplate(link),
    });
    
    console.log(`Verification link for ${user.email}: ${link}`);

    return true; 
}
