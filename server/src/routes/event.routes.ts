import { createEvent, deleteEvent, getAllEvents, getMyEvents, joinEvent, updateEvent } from '@/controller/event.controller';
import { requireAuth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { createEventSchema } from '@/validation_schemas/event.schema';
import express from 'express';

const router = express.Router();

router.use(requireAuth)

router.post('/', validateData(createEventSchema), createEvent);
router.get('/', getAllEvents);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post('/:id/join', joinEvent);
router.get('/my', getMyEvents)

export const basePath = '/event';
export default router;
