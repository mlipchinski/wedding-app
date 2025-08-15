import z from 'zod';

export const createUserRegistrationSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30),
        email: z.string().email().optional(),
        password: z.string().min(6).max(100),
        confirmPassword: z.string().min(6).max(100),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
    })
});

export const createUserLoginSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30),
        password: z.string().min(6).max(100),
    }).refine(data => data.username && data.password, {
        message: "Username and password are required",
    })
});