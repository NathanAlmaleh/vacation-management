import express from 'express';
import cors from 'cors';

import requestRoutes from './routes/request.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/requests', requestRoutes);
app.use('/users', userRoutes);

export default app;
