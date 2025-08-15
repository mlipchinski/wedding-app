import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client'
import { prisma } from '../db/client';
import { signJwt } from '../utils/auth';
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

    return signJwt(user);
}

