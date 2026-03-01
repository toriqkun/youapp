export interface UserProfile {
  email?: string;
  username?: string;
  name?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  interests?: string[];
  horoscope?: string;
  zodiac?: string;
  gender?: string;
  image?: string;
}

export interface ProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UpdateProfileDto extends UserProfile {}
