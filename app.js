import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;
