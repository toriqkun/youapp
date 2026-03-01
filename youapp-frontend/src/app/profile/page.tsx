'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreHorizontal, Edit2 } from 'lucide-react';
import { getProfile } from '@/features/profile/api';
import { UserProfile } from '@/types/profile';

import { AboutSection } from '@/components/profile/AboutSection';
import { calculateHoroscopeFromBirthday } from '@/utils/horoscope';
import { calculateZodiacFromBirthday } from '@/utils/zodiac';
import { calculateAge } from '@/utils/age';
import { getHoroscopeIcon, getZodiacIcon } from '@/utils/icons';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();
        const profileData = response.data || {};
        
        // Restore locally-stored image since API doesn't persist it
        const storedImage = localStorage.getItem('profile_image');
        if (storedImage && !profileData.image) {
          profileData.image = storedImage;
        }
        
        // Restore locally-stored gender since API might not persist it
        const storedGender = localStorage.getItem('profile_gender');
        if (storedGender && !profileData.gender) {
          profileData.gender = storedGender;
        }

        setProfile(profileData);
        
        // Use the real username from API if available
        if (profileData.username) {
          setUsername(profileData.username);
          localStorage.setItem('username', profileData.username);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('username') : '';
    if (storedUser) setUsername(storedUser);

    fetchProfileData();
  }, [router]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    
    // Also update the username state if name changed
    if (updatedProfile.name) {
      // name is the display name, keep username for @handle
    }
    if (updatedProfile.username) {
      setUsername(updatedProfile.username);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const hasInterests = profile && profile.interests && profile.interests.length > 0;
  const horoscope = profile?.birthday ? calculateHoroscopeFromBirthday(profile.birthday) : (profile?.horoscope || '');
  const zodiac = profile?.birthday ? calculateZodiacFromBirthday(profile.birthday) : (profile?.zodiac || '');
  const age = profile?.birthday ? calculateAge(profile.birthday) : null;
  const rawDisplayName = profile?.name || profile?.username || username;
  const formatUsername = (str: string) => str.toLowerCase().replace(/\s+/g, '');
  const displayName = formatUsername(rawDisplayName);
  const headerUsername = formatUsername(profile?.username || username);
  const horoscopeIcon = horoscope ? getHoroscopeIcon(horoscope) : '';
  const zodiacIcon = zodiac ? getZodiacIcon(zodiac) : '';

  return (
    <div className="min-h-screen bg-[#09141A] text-white flex flex-col px-4 pt-10 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center font-bold text-sm">
          <ChevronLeft size={24} />
          Back
        </button>
        <span className="font-bold text-center flex-1 pr-6">@{headerUsername}</span>
        <MoreHorizontal size={24} />
      </header>

      {/* Profile Info Card */}
      <div 
        className="relative w-full h-48 bg-[#162329] rounded-2xl overflow-hidden mb-6 flex flex-col justify-end p-4 border border-white/5"
        style={profile?.image ? { backgroundImage: `url(${profile.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {/* Dark overlay when image exists for better text readability */}
        {profile?.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-[1]" />
        )}
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">@{displayName}{age !== null ? `, ${age}` : ''}</span>
          </div>
          {profile?.gender && <p className="text-sm text-white/80">{profile.gender}</p>}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {horoscope && (
              <div className="flex items-center gap-2 bg-[#1A2C33]/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white">
                {horoscopeIcon && (
                  <img src={horoscopeIcon} alt={horoscope} className="w-4 h-4 brightness-0 invert" />
                )}
                <span>{horoscope}</span>
              </div>
            )}
            {zodiac && (
              <div className="flex items-center gap-2 bg-[#1A2C33]/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white">
                {zodiacIcon && (
                  <img src={zodiacIcon} alt={zodiac} className="w-4 h-4 brightness-0 invert" />
                )}
                <span>{zodiac}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection profile={profile} onProfileUpdate={handleProfileUpdate} />

      {/* Interest Section */}
      <div className="bg-[#0E191F] rounded-2xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-base">Interest</h2>
          <button onClick={() => router.push('/profile/interests')}>
            <Edit2 size={16} />
          </button>
        </div>
        
        {!hasInterests ? (
          <p className="text-white/50 text-sm">
            Add in your interest to find a better match
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile?.interests?.map((interest, index) => (
              <div
                key={index}
                className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white"
              >
                {interest}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
