import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(3),
  description: z.string().min(10),
});

export const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
});
