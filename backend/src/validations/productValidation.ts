import { z } from 'zod';

export const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().gt(0, 'Price must be greater than 0'),
    oldPrice: z.coerce.number().nonnegative().optional(),
    stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
    brand: z.string().min(1, 'Brand is required'),
    size: z.string().min(1, 'Size is required'),
    category: z.string().min(1, 'Category is required'),
    rating: z.coerce.number().min(0).max(5, 'Rating must be between 0 and 5'),
    reviews: z.array(
        z.object({
            user: z.string().min(1, 'User is required'),
            comment: z.string().min(1, 'Comment is required'),
        })
    ),
    photoUrl: z.string().url('Invalid image URL'),
});
