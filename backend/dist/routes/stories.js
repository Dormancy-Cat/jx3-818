"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Story_1 = __importDefault(require("../models/Story"));
const router = express_1.default.Router();
// 获取所有故事
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stories = yield Story_1.default.find().sort({ createdAt: -1 });
        res.json(stories);
    }
    catch (error) {
        res.status(500).json({ message: '获取故事列表失败' });
    }
}));
// 创建新故事
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const story = new Story_1.default(req.body);
        yield story.save();
        res.status(201).json(story);
    }
    catch (error) {
        res.status(400).json({ message: '创建故事失败' });
    }
}));
// 搜索故事
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId, characterUid, server } = req.query;
        const query = {};
        if (characterId)
            query.characterId = characterId;
        if (characterUid)
            query.characterUid = characterUid;
        if (server)
            query.server = server;
        const stories = yield Story_1.default.find(query).sort({ createdAt: -1 });
        res.json(stories);
    }
    catch (error) {
        res.status(500).json({ message: '搜索故事失败' });
    }
}));
// 获取单个故事详情
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const story = yield Story_1.default.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ message: '故事不存在' });
        }
        res.json(story);
    }
    catch (error) {
        res.status(500).json({ message: '获取故事详情失败' });
    }
}));
exports.default = router;
