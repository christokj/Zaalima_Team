import { z } from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    name: z.string().min(1, 'Name is required'),
    age: z.number().int().min(1, 'Age must be a positive number'),
    mobile: z
        .string()
        .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});
