import api from '@/services/axios';
import { LoginDto, RegisterDto } from '@/types/auth';

export const login = async (data: LoginDto) => {
  const isCompanyApi = api.defaults.baseURL?.includes('techtest.youapp.ai');
  
  // Local Backend (NestJS) is strict: it might reject 'username' if not in DTO
  // Company API might require 'username' or 'email'
  const payload: any = {
    email: data.email,
    password: data.password
  };

  // Only add username if it's the Company API to be safe
  if (isCompanyApi) {
    payload.username = data.email;
  }

  const response = await api.post('/login', payload);
  
  // Normalize response structure
  const resData = response.data;
  // Handle nested data structures or different key names (access_token vs accessToken)
  const access_token = 
    resData.access_token || 
    resData.accessToken || 
    (resData.data && (resData.data.access_token || resData.data.accessToken));
  
  if (access_token) {
    // Ensure the frontend always sees 'access_token'
    resData.access_token = access_token;
  }
  
  return resData;
};



export const register = async (data: RegisterDto) => {
  const response = await api.post('/register', data);
  return response.data;
};


