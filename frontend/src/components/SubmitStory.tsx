import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  IconButton,
  Paper,
  Stack,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { createStory, getServerList, ServerInfo } from '../services/api';
import { getSchoolIconUrl, getSchoolColor } from '../utils/schoolUtils';

// 定义时间线项的接口
interface TimelineItem {
  date: string;
  content: string;
}

const SubmitStory: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    characterId: '',
    characterUid: '',
    server: '',
    school: '',
    title: '',
    summary: '',
    timeline: '',
  });

  // 时间线项数组状态
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    { date: '', content: '' }
  ]);

  const [serverList, setServerList] = useState<ServerInfo[]>([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [loading, setLoading] = useState(true);

  // 获取服务器列表
  useEffect(() => {
    const fetchServerList = async () => {
      try {
        const data = await getServerList();
        setServerList(data);
      } catch (error) {
        console.error('获取服务器列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServerList();
  }, []);

  // 当时间线项变化时，自动更新formData中的timeline字段
  useEffect(() => {
    // 将时间线项数组转换为格式化字符串
    const timelineString = timelineItems
      .filter(item => item.date.trim() !== '' || item.content.trim() !== '')
      .map(item => `${item.date}：${item.content}`)
      .join('\n');
    
    setFormData(prev => ({
      ...prev,
      timeline: timelineString
    }));
  }, [timelineItems]);

  // 获取唯一的大区列表，过滤掉国际服和缘起大区
  const zones = Array.from(new Set(serverList.map(server => server.zone_name)))
    .filter(zone => zone !== '國際服' && zone !== '缘起大区')
    .sort();

  // 根据选择的大区过滤服务器
  const filteredServers = serverList.filter(server => server.zone_name === selectedZone);

  // 剑网三门派列表
  const schoolList = [
    '天策', '万花', '纯阳', '七秀', '少林', 
    '藏剑', '丐帮', '明教', '五毒', '唐门', 
    '苍云', '长歌', '霸刀', '蓬莱', '凌雪', 
    '衍天', '药宗', '刀宗', '万灵', '段氏'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStory(formData);
      navigate('/');
    } catch (error) {
      console.error('提交818失败:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    
    if (name === 'zone') {
      setSelectedZone(value);
      // 重置服务器选择
      setFormData({ ...formData, server: '' });
    } else if (name === 'server') {
      setFormData({ ...formData, server: value });
    } else if (name === 'school') {
      setFormData({ ...formData, school: value });
    }
  };

  // 处理时间线项的变化
  const handleTimelineItemChange = (index: number, field: 'date' | 'content', value: string) => {
    const newItems = [...timelineItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setTimelineItems(newItems);
  };

  // 添加新的时间线项
  const addTimelineItem = () => {
    setTimelineItems([...timelineItems, { date: '', content: '' }]);
  };

  // 删除时间线项
  const removeTimelineItem = (index: number) => {
    if (timelineItems.length > 1) {
      const newItems = timelineItems.filter((_, i) => i !== index);
      setTimelineItems(newItems);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 3,
          textShadow: '2px 2px 5px rgba(0,0,0,0.9)'
        }}>
          提交818
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: alpha('#fff', 0.5),
            backdropFilter: 'blur(3px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="标题"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            {/* 昵称与门派放在同一行 */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, mb: 1 }}>
              <TextField
                fullWidth
                label="被8人昵称"
                name="characterId"
                value={formData.characterId}
                onChange={handleChange}
                required
              />
              
              {/* 门派选择 */}
              <FormControl fullWidth required>
                <InputLabel id="school-label">门派</InputLabel>
                <Select
                  labelId="school-label"
                  id="school-select"
                  name="school"
                  value={formData.school}
                  label="门派"
                  onChange={handleSelectChange}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {schoolList.map((school) => (
                    <MenuItem key={school} value={school} sx={{ color: getSchoolColor(school) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>{school}</span>
                        <Box
                          component="img"
                          src={getSchoolIconUrl(school)}
                          alt={school}
                          sx={{
                            width: 16,
                            height: 16,
                            ml: 1,
                            objectFit: 'contain',
                          }}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
            <TextField
              fullWidth
              label="被8人UID"
              name="characterUid"
              value={formData.characterUid}
              onChange={handleChange}
              margin="normal"
              helperText="选填"
            />
            
            {/* 大区和服务器选择放在同一行 */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, mb: 1 }}>
              {/* 大区选择 */}
              <FormControl fullWidth required>
                <InputLabel id="zone-label">大区</InputLabel>
                <Select
                  labelId="zone-label"
                  id="zone-select"
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
                  {zones.map((zone) => (
                    <MenuItem key={zone} value={zone}>
                      {zone}
                    </MenuItem>
                  ))}
                </Select>
                {loading && <FormHelperText>加载大区列表中...</FormHelperText>}
              </FormControl>
              
              {/* 服务器选择 */}
              <FormControl fullWidth required>
                <InputLabel id="server-label">服务器</InputLabel>
                <Select
                  labelId="server-label"
                  id="server-select"
                  name="server"
                  value={formData.server}
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
                  {filteredServers.map((server) => (
                    <MenuItem key={server.server_name} value={server.server_name}>
                      {server.server_name}
                    </MenuItem>
                  ))}
                </Select>
                {!selectedZone && <FormHelperText>请先选择大区</FormHelperText>}
              </FormControl>
            </Stack>
            
            <TextField
              fullWidth
              label="事件简述"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                事件时间线
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                请按照时间顺序添加事件，填写时间和事件描述。
              </Alert>
              
              <Box 
                sx={{ 
                  position: 'relative',
                  maxWidth: '100%',
                  margin: '0 auto',
                  paddingLeft: { xs: '40px', sm: '40px' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: '18px',
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    bgcolor: 'primary.main',
                    borderRadius: '4px',
                  }
                }}
              >
                {timelineItems.map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      position: 'relative',
                      mb: 3,
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '16px',
                        height: '16px',
                        left: '-30px',
                        top: '20px',
                        bgcolor: 'background.paper',
                        border: '4px solid',
                        borderColor: 'primary.main',
                        borderRadius: '50%',
                        zIndex: 1,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <IconButton 
                        size="small"
                        color="error" 
                        onClick={() => removeTimelineItem(index)}
                        disabled={timelineItems.length === 1}
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="时间"
                      value={item.date}
                      onChange={(e) => handleTimelineItemChange(index, 'date', e.target.value)}
                      placeholder="2023-01-01"
                      size="small"
                      margin="dense"
                      sx={{ mb: 1 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="事件描述"
                      value={item.content}
                      onChange={(e) => handleTimelineItemChange(index, 'content', e.target.value)}
                      placeholder="请描述发生的事件"
                      multiline
                      rows={3}
                      margin="dense"
                    />
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addTimelineItem}
                  variant="contained"
                  color="primary"
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                  }}
                >
                  添加事件
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                提交
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SubmitStory; 