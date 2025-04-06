import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import { Story, getStory } from '../services/api';
import { getSchoolColor, getSchoolIconUrl } from '../utils/schoolUtils';
import { alpha } from '@mui/material/styles';

// 定义时间线项的接口
interface TimelineItem {
  date: string;
  content: string;
}

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const loadStory = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getStory(id);
      setStory(data);
      
      // 解析时间线文本为数组项
      if (data.timeline) {
        const items = data.timeline
          .split('\n')
          .filter((item: string) => item.trim() !== '')
          .map((item: string) => {
            // 尝试将时间线项分为日期和内容部分
            const parts = item.split(/[：:]/);
            return {
              date: parts.length > 1 ? parts[0] : '',
              content: parts.length > 1 ? parts.slice(1).join(':') : item
            };
          });
        setTimelineItems(items);
      }
    } catch (error) {
      console.error('加载818详情失败:', error);
    }
  }, [id]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  if (!story) {
    return <div>加载中...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          返回列表
        </Button>

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
          <Typography variant="h4" component="h1" gutterBottom>
            {story.title}
          </Typography>
          
          <Typography color="textSecondary" gutterBottom>
            区服: {story.server}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            被8人昵称: {story.characterId}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            被8人UID: {story.characterUid}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography color="textSecondary" sx={{ mr: 1 }}>
              门派:
            </Typography>
            {story.school ? (
              <Chip 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{story.school}</span>
                    <Box
                      component="img"
                      src={getSchoolIconUrl(story.school)}
                      alt={story.school}
                      sx={{
                        width: 20,
                        height: 20,
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
                  bgcolor: `${getSchoolColor(story.school)}20`,
                  color: getSchoolColor(story.school),
                  fontWeight: 'medium'
                }}
              />
            ) : (
              <Typography color="textSecondary">未知</Typography>
            )}
          </Box>
          <Typography color="textSecondary" gutterBottom>
            发布时间: {new Date(story.createdAt).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            事件简述
          </Typography>
          <Typography paragraph>
            {story.summary}
          </Typography>

          <Typography variant="h6" gutterBottom>
            事件时间线
          </Typography>
          
          {timelineItems.length > 0 ? (
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
                  {item.date && (
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      {item.date}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    {item.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography paragraph>
              {story.timeline}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default StoryDetail; 