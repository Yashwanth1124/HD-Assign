"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Note_1 = __importDefault(require("../models/Note"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/notes
router.get('/', auth_1.requireAuth, async (req, res) => {
    const notes = await Note_1.default.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ notes });
});
// POST /api/notes
router.post('/', auth_1.requireAuth, (0, express_validator_1.body)('title').isLength({ min: 1 }).withMessage('Title required'), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { title, body: bodyText } = req.body;
    const note = await Note_1.default.create({ user: req.userId, title, body: bodyText });
    res.status(201).json({ note });
});
// DELETE /api/notes/:id
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const { id } = req.params;
    const note = await Note_1.default.findOneAndDelete({ _id: id, user: req.userId });
    if (!note)
        return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
});
exports.default = router;
