import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import storiesRouter from './routes/stories';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/stories', storiesRouter);

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jx3-818';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB连接成功'))
  .catch((error) => console.error('MongoDB连接失败:', error));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 