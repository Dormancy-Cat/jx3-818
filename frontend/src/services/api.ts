import axios from 'axios';

// 根据环境选择API基础URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';
const JX3BOX_API_URL = 'https://spider2.jx3box.com/api/spider/server/server_state';

export interface Story {
  _id: string;
  characterId: string;
  characterUid: string;
  server: string;
  school: string;
  title: string;
  summary: string;
  timeline: string;
  createdAt: string;
}

export interface ServerInfo {
  zone_name: string;
  server_name: string;
  ip_address: string;
  ip_port: string;
  channel: string;
  connect_state: boolean;
  heat: string;
  maintain_time: number;
  main_server: string;
}

export const getStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);
  return response.data;
};

export const getStory = async (id: string) => {
  const response = await axios.get(`${API_URL}/stories/${id}`);
  return response.data;
};

export const searchStories = async (params: {
  characterId?: string;
  characterUid?: string;
  server?: string;
}) => {
  const response = await axios.get(`${API_URL}/stories/search`, { params });
  return response.data;
};

export const createStory = async (story: Omit<Story, '_id' | 'createdAt'>) => {
  const response = await axios.post(`${API_URL}/stories`, story);
  return response.data;
};

export const getServerList = async (): Promise<ServerInfo[]> => {
  try {
    const response = await axios.get(JX3BOX_API_URL);
    return response.data;
  } catch (error) {
    console.error('获取服务器列表失败:', error);
    return [];
  }
}; 