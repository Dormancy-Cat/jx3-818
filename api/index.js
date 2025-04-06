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
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI: ' + MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@')); // 隐藏敏感信息

mongoose.connect(MONGODB_URI, {
  // 连接选项，提高连接稳定性
  serverSelectionTimeoutMS: 5000, // 服务器选择超时设置为5秒
  maxPoolSize: 10, // 连接池大小
  socketTimeoutMS: 45000, // Socket超时设置为45秒
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    console.error('Error details:', JSON.stringify({
      code: err.code,
      codeName: err.codeName,
      name: err.name,
      message: err.message
    }));
  });

// 导入Story模型
const Story = require('./models/Story');

// 健康检查路由
app.get('/api', (req, res) => {
  res.json({ message: '剑网三818江湖录 API' });
});

// API路由
// 获取所有故事
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 搜索故事 - 必须在ID路由之前定义
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
    
    console.log('Search query:', JSON.stringify(query));
    const stories = await Story.find(query).sort({ createdAt: -1 });
    console.log(`Found ${stories.length} stories matching the search criteria`);
    res.json(stories);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// 获取单个故事 - 通过ID
app.get('/api/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: '找不到818' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新故事
app.post('/api/stories', async (req, res) => {
  const story = new Story(req.body);
  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 为了Vercel serverless函数导出应用
module.exports = app; 