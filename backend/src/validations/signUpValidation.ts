import { z } from 'zod';

// Enhanced email regex (RFC 5322 compliant-ish)
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

// Strong password regex: min 8, 1 upper, 1 lower, 1 digit, 1 special character
const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

const weakPatterns = new Set([
    'password', '123', '1234', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'abc', 'abc123', 'iloveyou', 'test', 'pass', 'root'
]);

const containsWeakPattern = (str: string): boolean => {
    const lower = str.toLowerCase();
    for (const pattern of weakPatterns) {
        if (lower.includes(pattern)) return true;
    }
    return false;
};

const hasSequentialDigits = (str: string, minLength: number = 3): boolean => {
    for (let i = 0; i <= str.length - minLength; i++) {
        let isIncreasing = true;
        let isDecreasing = true;

        for (let j = 0; j < minLength - 1; j++) {
            const curr = parseInt(str[i + j]);
            const next = parseInt(str[i + j + 1]);

            if (isNaN(curr) || isNaN(next)) {
                isIncreasing = false;
                isDecreasing = false;
                break;
            }

            if (next !== curr + 1) isIncreasing = false;
            if (next !== curr - 1) isDecreasing = false;

            if (!isIncreasing && !isDecreasing) break;
        }

        if (isIncreasing || isDecreasing) return true;
    }
    return false;
};

export const signUpSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(6, 'Email must be at least 6 characters long')
        .max(100, 'Email must not exceed 100 characters')
        .regex(emailRegex, 'Invalid email format')
        .refine((email) => {
            const blockedDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com'];
            const domain = email.split('@')[1]?.toLowerCase();
            return domain && !blockedDomains.includes(domain);
        }, { message: 'Disposable email addresses are not allowed' }),

    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),

    age: z
        .number()
        .int('Age must be an integer')
        .min(13, 'You must be at least 13 years old')
        .max(120, 'Age must be less than 120'),

    mobile: z
        .string()
        .regex(/^[6-9][0-9]{9}$/, 'Mobile number must be 10 digits starting with 6-9')
        .refine((mobile) => !/^(.)\1{9}$/.test(mobile), {
            message: 'Mobile number cannot have all identical digits',
        }),
    address: z
        .string()
        .min(10, 'Address must be at least 10 characters long')
        .max(200, 'Address must not exceed 200 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must not exceed 64 characters')
        .regex(strongPasswordRegex, 'Password must include uppercase, lowercase, number, and special character')
        .refine((value) => {
            if (containsWeakPattern(value)) return false;
            if (hasSequentialDigits(value, 3)) return false;
            return true;
        }, {
            message: 'Password must not contain weak or sequential/reverse-sequential patterns',
        }),
});
