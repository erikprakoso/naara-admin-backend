// app.ts
import express, { Application } from 'express';
import helloRouter from './routes/helloRoutes';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const port: number = 3000;

app.use(express.json());

app.use('/', helloRouter);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
