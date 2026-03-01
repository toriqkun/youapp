'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { UserProfile, UpdateProfileDto } from '@/types/profile';
import { getHoroscope, calculateHoroscopeFromBirthday } from '@/utils/horoscope';
import { getZodiac, calculateZodiacFromBirthday } from '@/utils/zodiac';
import { calculateAge } from '@/utils/age';
import { createProfile, updateProfile } from '@/features/profile/api';

interface AboutSectionProps {
  profile: UserProfile | null;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    birthday: '',
    gender: '',
    height: 0,
    weight: 0,
    interests: [],
    horoscope: '',
    zodiac: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        birthday: profile.birthday || '',
        gender: profile.gender || '',
        height: profile.height || 0,
        weight: profile.weight || 0,
        interests: profile.interests || [],
        horoscope: profile.horoscope || '',
        zodiac: profile.zodiac || '',
        image: profile.image || '',
        username: profile.username || '',
        email: profile.email || '',
      });
    }
  }, [profile, isEditing]);

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, birthday: value }));

    const parts = value.split(/[\s-]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const horoscope = getHoroscope(day, month);
        const zodiac = getZodiac(year);
        setFormData(prev => ({ ...prev, horoscope, zodiac }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setFormData(prev => ({ ...prev, image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dto: UpdateProfileDto = {
        name: formData.name,
        birthday: formData.birthday,
        height: Number(formData.height),
        weight: Number(formData.weight),
        interests: formData.interests || profile?.interests || [],
        horoscope: formData.horoscope,
        zodiac: formData.zodiac,
      };

      let response;
      if (!profile || (profile && !profile.name && !profile.birthday)) {
        response = await createProfile(dto);
      } else {
        response = await updateProfile(dto);
      }
      
      // Persist image and gender locally since API doesn't store them
      if (formData.image) {
        localStorage.setItem('profile_image', formData.image);
      }
      if (formData.gender) {
        localStorage.setItem('profile_gender', formData.gender);
      }
      
      // Use formData as source of truth merged with API response
      // This ensures ALL fields update realtime including name, gender, image
      const updatedData: UserProfile = {
        ...profile,
        ...response.data,
        name: formData.name || response.data?.name,
        birthday: formData.birthday || response.data?.birthday,
        height: Number(formData.height) || response.data?.height,
        weight: Number(formData.weight) || response.data?.weight,
        horoscope: formData.horoscope || response.data?.horoscope,
        zodiac: formData.zodiac || response.data?.zodiac,
        image: formData.image || profile?.image,
        gender: formData.gender || profile?.gender,
        username: profile?.username,
        email: profile?.email,
      };
      
      onProfileUpdate(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    const hasAbout = profile && (profile.birthday || profile.height || profile.weight);
    const horoscope = profile?.birthday ? calculateHoroscopeFromBirthday(profile.birthday) : (profile?.horoscope || '');
    const zodiac = profile?.birthday ? calculateZodiacFromBirthday(profile.birthday) : (profile?.zodiac || '');
    const age = profile?.birthday ? calculateAge(profile.birthday) : null;

    return (
      <div className="bg-[#0E191F] rounded-2xl p-6 mb-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-base text-white">About</h2>
          <button onClick={() => setIsEditing(true)}>
            <Edit2 size={16} className="text-white" />
          </button>
        </div>

        {!hasAbout ? (
          <p className="text-white/50 text-sm">
            Add in your your to help others know you better
          </p>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center">
              <span className="text-white/40 w-24">Birthday:</span>
              <span className="text-white">
                {profile?.birthday} {age !== null ? `(Age ${age})` : ''}
              </span>
            </div>
            {horoscope && (
              <div className="flex items-center">
                <span className="text-white/40 w-24">Horoscope:</span>
                <span className="text-white">{horoscope}</span>
              </div>
            )}
            {zodiac && (
              <div className="flex items-center">
                <span className="text-white/40 w-24">Zodiac:</span>
                <span className="text-white">{zodiac}</span>
              </div>
            )}
            {profile?.height ? (
              <div className="flex items-center">
                <span className="text-white/40 w-24">Height:</span>
                <span className="text-white">{profile.height} cm</span>
              </div>
            ) : null}
            {profile?.weight ? (
              <div className="flex items-center">
                <span className="text-white/40 w-24">Weight:</span>
                <span className="text-white">{profile.weight} kg</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#0E191F] rounded-2xl p-6 mb-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-base text-white">About</h2>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="text-[#D6B88A] text-sm font-medium"
        >
          {loading ? 'Saving...' : 'Save & Update'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 bg-[#162329] rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden border border-white/5"
          >
            {formData.image ? (
              <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Plus size={24} className="text-[#D6B88A]" />
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          <span className="text-xs text-white">Add image</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Display name:</label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white focus:outline-none focus:border-[#D6B88A]"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Gender:</label>
          <select
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white focus:outline-none focus:border-[#D6B88A] appearance-none"
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
          >
            <option value="" disabled className="text-right">Select Gender</option>
            <option value="Male" className="text-right">Male</option>
            <option value="Female" className="text-right">Female</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Birthday:</label>
          <input
            type="text"
            placeholder="DD MM YYYY"
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white focus:outline-none focus:border-[#D6B88A]"
            value={formData.birthday}
            onChange={handleBirthdayChange}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Horoscope:</label>
          <input
            type="text"
            placeholder="--"
            readOnly
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white/40 focus:outline-none cursor-not-allowed"
            value={formData.horoscope}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Zodiac:</label>
          <input
            type="text"
            placeholder="--"
            readOnly
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white/40 focus:outline-none cursor-not-allowed"
            value={formData.zodiac}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Height:</label>
          <input
            type="number"
            placeholder="Add height"
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white focus:outline-none focus:border-[#D6B88A]"
            value={formData.height || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-white/40 w-1/3">Weight:</label>
          <input
            type="number"
            placeholder="Add weight"
            className="w-2/3 bg-[#162329] border border-white/10 rounded-lg p-2 text-xs text-right text-white focus:outline-none focus:border-[#D6B88A]"
            value={formData.weight || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  );
};
