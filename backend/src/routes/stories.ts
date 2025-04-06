import express from 'express';
import Story from '../models/Story';

const router = express.Router();

// 获取所有故事
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: '获取故事列表失败' });
  }
});

// 创建新故事
router.post('/', async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: '创建故事失败' });
  }
});

// 搜索故事
router.get('/search', async (req, res) => {
  try {
    const { characterId, characterUid, server } = req.query;
    const query: any = {};
    
    if (characterId) query.characterId = characterId;
    if (characterUid) query.characterUid = characterUid;
    if (server) query.server = server;
    
    const stories = await Story.find(query).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: '搜索故事失败' });
  }
});

// 获取单个故事详情
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: '故事不存在' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: '获取故事详情失败' });
  }
});

export default router; 