// 门派名称到文件名的映射
const schoolToFileName: Record<string, string> = {
  '天策': 'tianche',
  '万花': 'wanhua',
  '纯阳': 'chunyang',
  '七秀': 'qixiu',
  '少林': 'shaolin',
  '藏剑': 'cangjian',
  '丐帮': 'gaibang',
  '明教': 'mingjiao',
  '五毒': 'wudu',
  '唐门': 'tangmen',
  '苍云': 'cangyun',
  '长歌': 'changge',
  '霸刀': 'badao',
  '蓬莱': 'penglai',
  '凌雪': 'lingxue',
  '衍天': 'yantian',
  '药宗': 'yaozong',
  '刀宗': 'daozong',
  '万灵': 'wanling',
  '段氏': 'duanshi'
};

/**
 * 获取门派图标URL
 * @param school 门派名称
 * @returns 门派图标URL或undefined（如果门派不存在）
 */
export const getSchoolIconUrl = (school: string): string | undefined => {
  const fileName = schoolToFileName[school];
  if (!fileName) return undefined;
  
  return `/images/schools/${fileName}.svg`;
};

/**
 * 获取门派的对应颜色
 * @param school 门派名称
 * @returns 门派对应的颜色值（CSS颜色字符串）
 */
export const getSchoolColor = (school: string): string => {
  const colorMap: Record<string, string> = {
    '天策': '#c23c2a', // 红色
    '万花': '#ffc0cb', // 粉色
    '纯阳': '#f7c242', // 橙色
    '七秀': '#7ec0ee', // 浅蓝色
    '少林': '#ffd700', // 金色
    '藏剑': '#5f9ea0', // 青色
    '丐帮': '#8b4513', // 棕色
    '明教': '#ff4500', // 橙红色
    '五毒': '#7cfc00', // 亮绿色
    '唐门': '#4b0082', // 靛青色
    '苍云': '#6495ed', // 矢车菊蓝
    '长歌': '#ba55d3', // 紫色
    '霸刀': '#696969', // 深灰色
    '蓬莱': '#00ffff', // 青绿色
    '凌雪': '#e6e6fa', // 淡紫色
    '衍天': '#9370db', // 中紫色
    '药宗': '#228b22', // 森林绿
    '刀宗': '#a9a9a9', // 暗灰色
    '万灵': '#ff69b4', // 粉红色
    '段氏': '#ffff00'  // 黄色
  };
  
  return colorMap[school] || '#888888'; // 默认灰色
};

export default {
  getSchoolIconUrl,
  getSchoolColor
}; 