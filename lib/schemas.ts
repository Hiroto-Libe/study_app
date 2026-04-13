import { z } from 'zod';

export const GeneratedQuestionSchema = z.object({
    body: z.string().min(1),
    answer: z.string().min(1),
    hint: z.string().nullable().optional(),
    unit: z.string().min(1),
    grade: z.number().int().min(1).max(6),
    input_type: z.enum(['voice', 'photo', 'keypad', 'choice', 'stroke']),
    kanji: z.string().nullable().optional()
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;
