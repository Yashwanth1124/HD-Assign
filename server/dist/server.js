"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const notes_1 = __importDefault(require("./routes/notes"));
const google_1 = __importDefault(require("./routes/google"));
// Load env from project root (.env)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI).then(() => console.log('MongoDB connected')).catch((e) => {
    console.error('MongoDB connection error', e);
    process.exit(1);
});
app.use('/api/auth', auth_1.default);
app.use('/api/auth', google_1.default);
app.use('/api/notes', notes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
