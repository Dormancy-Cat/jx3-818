"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const stories_1 = __importDefault(require("./routes/stories"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 路由
app.use('/api/stories', stories_1.default);
// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jx3-818';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB连接成功'))
    .catch((error) => console.error('MongoDB连接失败:', error));
// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
