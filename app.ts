import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { sequelize } from './models/db';
import  { requestLogger } from './middlewares/requestLogger'
const { PORT = 5000 } = process.env;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);
app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Серевер запущент на порту: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
