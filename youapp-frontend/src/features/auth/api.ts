import api from '@/services/axios';
import { LoginDto, RegisterDto } from '@/types/auth';

export const login = async (data: LoginDto) => {
  const response = await api.post('/api/login', data);
  return response.data;
};

export const register = async (data: RegisterDto) => {
  const response = await api.post('/api/register', data);
  return response.data;
};
