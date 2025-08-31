import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/notes
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ notes });
});

// POST /api/notes
router.post('/', requireAuth, body('title').isLength({ min: 1 }).withMessage('Title required'), async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, body: bodyText } = req.body as { title: string, body?: string };
  const note = await Note.create({ user: req.userId!, title, body: bodyText });
  res.status(201).json({ note });
});

// DELETE /api/notes/:id
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id, user: req.userId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Deleted' });
});

export default router;