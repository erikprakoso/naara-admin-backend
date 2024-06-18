// app.ts
import express, { Application } from 'express';
import home from './api/home/routes/home';
import dotenv from 'dotenv';
import user from './api/user/routes/user';

dotenv.config();

const app: Application = express();
const port: number = 3000;

app.use(express.json());

app.use('/', home);
app.use('/api/v1/auth', user);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
