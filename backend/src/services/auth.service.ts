import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client'
import { prisma } from '../db/client';
import { signJwt, decodeJwt } from '../utils/auth';
import { UserLogin } from '@shared-types/User';

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

export const verifyEmail = async (userID: number) => {
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
    //TODO

    const token = signJwt({ userID: user.userID }, true);
    const verificationLink = `https://yourapp.com/verify-email/${user.userID}?token=${token}`;
    
    // Send email logic goes here (e.g., using nodemailer or any other service)
    
    console.log(`Verification link for ${user.email}: ${verificationLink}`);

    return true; // Return true if email sent successfully
}
