import api from '@/services/axios';
import { ProfileResponse, UpdateProfileDto } from '@/types/profile';

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get('/api/getProfile');
  return response.data;
};

export const createProfile = async (data: UpdateProfileDto): Promise<ProfileResponse> => {
  const response = await api.post('/api/createProfile', data);
  return response.data;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<ProfileResponse> => {
  const response = await api.put('/api/updateProfile', data);
  return response.data;
};
