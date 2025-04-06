const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接到MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jx3-818';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// 导入Story模型
const Story = require('./models/Story');

// API路由
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: '找不到818' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/stories', async (req, res) => {
  const story = new Story(req.body);
  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 健康检查路由
app.get('/api', (req, res) => {
  res.json({ message: '剑网三818江湖录 API' });
});

// 搜索路由
app.get('/api/stories/search', async (req, res) => {
  try {
    const { keyword, characterId, characterUid, server, region, school } = req.query;
    const query = {};
    
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { summary: { $regex: keyword, $options: 'i' } },
        { timeline: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (characterId) query.characterId = { $regex: characterId, $options: 'i' };
    if (characterUid) query.characterUid = { $regex: characterUid, $options: 'i' };
    if (server) query.server = server;
    if (region) query.region = region;
    if (school) query.school = school;
    
    const stories = await Story.find(query).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// 为了Vercel serverless函数导出应用
module.exports = app; 