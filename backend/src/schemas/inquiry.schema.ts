import { z } from 'zod';

export const createInquirySchema = z.object({
    body: z.object({
        name: z.string().min(1).max(120),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        guestCount: z.number().int().min(1).max(1000),
        preferredLocation: z.string().max(200).optional(),
        mood: z.string().max(200).optional(),
        requestedDate: z.string().datetime().optional(),
        budgetMin: z.number().int().min(0).optional(),
        budgetMax: z.number().int().min(0).optional(),
        message: z.string().max(5000).optional()
    }).refine(
        (b) => !(b.budgetMin && b.budgetMax) || (b.budgetMin! <= b.budgetMax!),
        { message: 'budgetMin must be <= budgetMax', path: ['budgetMin'] }
    )
});
