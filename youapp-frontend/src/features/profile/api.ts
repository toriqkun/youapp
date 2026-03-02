import api from '@/services/axios';
import { ProfileResponse, UpdateProfileDto, UserProfile } from '@/types/profile';

// Helper to normalize profile data
const normalizeProfile = (data: any): UserProfile => {
  if (!data) return {};
  
  let birthday = data.birthday;
  // If birthday is in ISO format (2000-01-15T00:00:00.000Z or 2000-01-15)
  // convert it back to DD MM YYYY for frontend consistency
  if (birthday && (birthday.includes('T') || birthday.includes('-'))) {
    const date = new Date(birthday);
    if (!isNaN(date.getTime())) {
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      birthday = `${d} ${m} ${y}`;
    }
  }

  return {
    ...data,
    birthday,
    name: data.name || data.displayName,
    image: data.image || data.profileImage,
  };
};


// Helper to normalize response
const normalizeResponse = (res: any): ProfileResponse => {
  // If it's already in { message, data } format (Company API)
  if (res.data && res.data.data) {
    return {
      ...res.data,
      data: normalizeProfile(res.data.data)
    };
  }
  // If it's a direct profile object (My Local Backend)
  return {
    message: 'Success',
    data: normalizeProfile(res.data)
  };
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get('/getProfile');
    return normalizeResponse(response);
  } catch (error: any) {
    // If profile not found (404), return empty data so frontend can handle it as "new user"
    if (error.response?.status === 404) {
      return {
        message: 'Profile not found',
        data: {} as UserProfile
      };
    }
    throw error;
  }
};

// Helper to format date for backend (DD MM YYYY -> YYYY-MM-DD)
const formatBirthdayForBackend = (birthday?: string): string | undefined => {
  if (!birthday) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return birthday;
  
  const parts = birthday.split(/[\s-/]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    if (d.length === 4) {
      return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`;
    }
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return birthday;
};

// Helper to prepare clean DTO for backend
const prepareDto = (data: UpdateProfileDto) => {
  const isCompanyApi = api.defaults.baseURL?.includes('techtest.youapp.ai');
  
  const baseDto: any = {
    birthday: formatBirthdayForBackend(data.birthday),
    gender: data.gender,
    height: data.height ? Number(data.height) : undefined,
    weight: data.weight ? Number(data.weight) : undefined,
    interests: data.interests,
  };

  if (isCompanyApi) {
    // Company API uses 'name' and 'image'
    return {
      ...baseDto,
      name: data.name || (data as any).displayName,
      image: data.image || (data as any).profileImage,
    };
  } else {
    // Local Backend uses 'displayName' and 'profileImage'
    return {
      ...baseDto,
      displayName: data.name || (data as any).displayName,
      profileImage: data.image || (data as any).profileImage,
    };
  }
};


export const createProfile = async (data: UpdateProfileDto): Promise<ProfileResponse> => {
  const preparedData = prepareDto(data);
  const response = await api.post('/createProfile', preparedData);
  return normalizeResponse(response);
};

export const updateProfile = async (data: UpdateProfileDto): Promise<ProfileResponse> => {
  const preparedData = prepareDto(data);
  const response = await api.put('/updateProfile', preparedData);
  return normalizeResponse(response);
};





