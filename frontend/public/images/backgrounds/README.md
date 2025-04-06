# 818背景图片文件夹

这个文件夹用于存放818卡片的背景图片。请按照以下步骤添加图片：

1. 将您喜欢的剑网三场景图片放入此文件夹中
2. 建议使用以下命名格式：`bg1.jpg`, `bg2.jpg`, `bg3.jpg` 等
3. 推荐图片尺寸为 800x450 像素或类似的 16:9 比例
4. 建议使用JPG或PNG格式，以保持良好的加载性能

## 文件名与代码的对应关系

图片文件名需要与 `src/components/StoryList.tsx` 文件中的 `backgroundImageFiles` 数组保持一致。如果您添加了新的图片或修改了文件名，请相应地更新该数组。

例如：

```typescript
const backgroundImageFiles = [
  'bg1.jpg',
  'bg2.jpg',
  'bg3.jpg',
  // 添加更多图片...
];
```

## 图片来源建议

您可以从以下地方获取剑网三的场景图片：

1. 剑网三游戏中的截图
2. JX3BOX官方壁纸: https://www.jx3box.com/app/design/wallpaper?tab=jdt7th
3. 剑网三官方网站或论坛

请确保您有权使用这些图片，以避免版权问题。 