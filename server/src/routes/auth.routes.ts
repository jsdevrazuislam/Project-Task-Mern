import { getMe, login, logout, register } from '@/controller/auth.controller';
import { requireAuth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { loginSchema, registerSchema } from '@/validation_schemas/auth.schema';
import express from 'express';

const router = express.Router();

router.post('/register', validateData(registerSchema), register);
router.post('/login', validateData(loginSchema), login);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export const basePath = '/auth';
export default router;
