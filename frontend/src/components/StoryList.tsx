import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Chip,
  Divider,
  IconButton,
  Collapse,
  alpha,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { Story, getStories, searchStories, getServerList, ServerInfo } from '../services/api';
import { getSchoolColor, getSchoolIconUrl } from '../utils/schoolUtils';

// 示例背景图片名称，后续用户可以将图片放入 public/images/backgrounds 文件夹
// 并更新此数组中的文件名
const backgroundImageFiles = [
  '万花.jpg',
  '冷龙峰老二.png',
  '唐门.jpg',
  '雨轻红.png',
  '冷龙峰入口.png',
  '冷龙峰老一.png',
  '冷龙峰壁纸1.png',
  '冷龙峰壁纸2.png',
  '冷龙峰山顶.png',
  '冷龙峰山洞.png',
  '五毒.png'
];

// 获取指定索引的背景图片，确保每个卡片使用不同的背景
const getBackgroundByIndex = (index: number) => {
  const wrappedIndex = index % backgroundImageFiles.length;
  return `/images/backgrounds/${backgroundImageFiles[wrappedIndex]}`;
};

// 简单的字符串转数字哈希函数
const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
};

const StoryList: React.FC = () => {
  const theme = useTheme();
  const [stories, setStories] = useState<Story[]>([]);
  const [searchParams, setSearchParams] = useState({
    characterId: '',
    characterUid: '',
    server: '',
  });
  const [serverList, setServerList] = useState<ServerInfo[]>([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedSearch, setExpandedSearch] = useState(false);

  // 剑网三门派列表
  const schoolList = [
    '天策', '万花', '纯阳', '七秀', '少林', 
    '藏剑', '丐帮', '明教', '五毒', '唐门', 
    '苍云', '长歌', '霸刀', '蓬莱', '凌雪', 
    '衍天', '药宗', '刀宗', '万灵', '段氏'
  ];

  useEffect(() => {
    loadStories();
    loadServerList();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('加载818列表失败:', error);
    }
  };

  const loadServerList = async () => {
    try {
      const data = await getServerList();
      setServerList(data);
    } catch (error) {
      console.error('获取服务器列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取唯一的大区列表，过滤掉国际服和缘起大区
  const zones = Array.from(new Set(serverList.map(server => server.zone_name)))
    .filter(zone => zone !== '國際服' && zone !== '缘起大区')
    .sort();

  // 根据选择的大区过滤服务器
  const filteredServers = serverList.filter(server => server.zone_name === selectedZone);

  const handleSearch = async () => {
    try {
      const data = await searchStories(searchParams);
      setStories(data);
    } catch (error) {
      console.error('搜索818失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    
    if (name === 'zone') {
      setSelectedZone(value);
      // 重置服务器选择
      setSearchParams({ ...searchParams, server: '' });
    } else if (name === 'server') {
      setSearchParams({ ...searchParams, server: value });
    }
  };

  // 切换搜索面板展开状态
  const toggleSearchPanel = () => {
    setExpandedSearch(!expandedSearch);
  };

  // 获取故事卡片的文本摘要和标题摘要
  const getSummaryExcerpt = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTitleExcerpt = (text: string, maxLength: number = 18) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* 顶部内容区 */}
      <Box 
        sx={{
          width: '100%',
          textAlign: 'center',
          mb: 4,
          mt: 1
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 1,
            textShadow: '2px 2px 5px rgba(0,0,0,0.9)'
          }}
        >
          剑网三818江湖录
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            maxWidth: '600px',
            mx: 'auto',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
          }}
        >
          分享你的江湖经历，记录每一次江湖恩怨
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {/* 搜索区域 */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(3px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: expandedSearch ? 2 : 0
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={toggleSearchPanel}   
            >
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ mr: 1 }} /> 搜索818
              </Typography> 
              <IconButton size="small">
                {expandedSearch ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Button 
              component={Link}  
              to="/submit" 
              variant="contained" 
              size="small"
              startIcon={<AddIcon />}
              sx={{ 
                px: 2,
                py: 0.5,
                fontSize: '0.9rem',
              }}
            >
              提交新的818
            </Button>
          </Box>
          
          <Collapse in={expandedSearch} timeout={300} mountOnEnter unmountOnExit>
            <Box>
              <Divider sx={{ mb: 2, mt: 1 }} />
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="被8人昵称"
                    name="characterId"
                    value={searchParams.characterId}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="被8人UID"
                    name="characterUid"
                    value={searchParams.characterUid}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="zone-search-label">大区</InputLabel>
                    <Select
                      labelId="zone-search-label"
                      id="zone-search-select"
                      name="zone"
                      value={selectedZone}
                      label="大区"
                      onChange={handleSelectChange}
                      disabled={loading}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300
                          }
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>全部</em>
                      </MenuItem>
                      {zones.map((zone) => (
                        <MenuItem key={zone} value={zone}>
                          {zone}
                        </MenuItem>
                      ))}
                    </Select>
                    {loading && <FormHelperText>加载大区列表中...</FormHelperText>}
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel id="server-search-label">服务器</InputLabel>
                    <Select
                      labelId="server-search-label"
                      id="server-search-select"
                      name="server"
                      value={searchParams.server}
                      label="服务器"
                      onChange={handleSelectChange}
                      disabled={!selectedZone || loading}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300
                          }
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>全部</em>
                      </MenuItem>
                      {filteredServers.map((server) => (
                        <MenuItem key={server.server_name} value={server.server_name}>
                          {server.server_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                >
                  搜索
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>
        
        {/* 内容列表 */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(3px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minHeight: stories.length > 0 ? 'auto' : '200px'
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 3, 
              pb: 1, 
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              fontWeight: 'bold'
            }}
          >
            最新818列表
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',                    // 手机端一列
                  sm: 'repeat(2, 1fr)',         // 平板端两列
                  md: 'repeat(4, 1fr)'          // 桌面端四列
                },
                gap: 2.5
              }}
            >
              {stories.map((story) => (
                <Card 
                  key={story._id}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    bgcolor: alpha(theme.palette.background.paper, 0.65),
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  <CardActionArea 
                    component={Link} 
                    to={`/stories/${story._id}`} 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'stretch', 
                      height: '100%'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={getBackgroundByIndex(stringToHash(story._id))}
                      alt="剑网三场景"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      p: 2
                    }}>
                      <Box sx={{ display: 'flex', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip 
                          label={story.server} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 'medium',
                            height: '20px'
                          }}
                        />
                        {story.school && (
                          <Chip 
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <span>{story.school}</span>
                                <Box
                                  component="img"
                                  src={getSchoolIconUrl(story.school)}
                                  alt={story.school}
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    ml: 0.5,
                                    objectFit: 'contain',
                                  }}
                                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </Box>
                            }
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(getSchoolColor(story.school), 0.1),
                              color: getSchoolColor(story.school),
                              fontWeight: 'medium',
                              height: '20px'
                            }}
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="subtitle1" 
                        component="h3"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%'
                        }}
                      >
                        {getTitleExcerpt(story.title)}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.825rem',
                            lineHeight: 1.5
                          }}
                        >
                          {getSummaryExcerpt(story.summary, 70)}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1, fontSize: '0.75rem' }}
                      >
                        被8人: {story.characterId} (UID: {story.characterUid})
                      </Typography>
                    </CardContent>
                    <Box 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        mt: 'auto'
                      }}
                    >
                      <Typography 
                        variant="button" 
                        color="primary"
                        sx={{ fontWeight: 'medium', fontSize: '0.8rem' }}
                      >
                        查看详情
                      </Typography>
                      <ArrowForwardIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>
        
        {stories.length === 0 && (
          <Box 
            sx={{ 
              py: 8, 
              textAlign: 'center',
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(3px)',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              mt: 4
            }}
          >
            <Typography variant="h6" color="text.secondary">
              暂无数据，来提交第一个818吧！
            </Typography>
            <Button 
              component={Link}
              to="/submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              提交818
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default StoryList; 