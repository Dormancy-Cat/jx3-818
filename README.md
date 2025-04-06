# 剑网三818江湖录

分享你的江湖经历，记录每一次江湖恩怨。

## 功能

- 浏览818故事列表
- 查看故事详情
- 提交新的818故事
- 按角色、服务器等搜索故事

## 技术栈

- 前端: React, Material-UI
- 后端: Node.js, Express, MongoDB

## 开发环境设置

### 前端

```bash
cd frontend
npm install
npm start
```

### 后端

```bash
cd backend
npm install
npm run dev
```

## 部署

本项目使用Vercel进行部署。

### 部署步骤

1. Fork或克隆本仓库
2. 在Vercel上导入项目
3. 设置环境变量（尤其是MongoDB连接字符串）
4. 部署

## 环境变量

创建一个`.env`文件，参考`.env.example`设置以下环境变量：

- `MONGODB_URI`: MongoDB连接字符串

## 贡献

欢迎通过Pull Request或Issue贡献代码或提出建议。

## 许可证

[MIT](LICENSE) 