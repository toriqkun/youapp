'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X } from 'lucide-react';
import { getProfile, updateProfile, createProfile } from '@/features/profile/api';
import { UserProfile } from '@/types/profile';

export default function InterestsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const profileData = response.data || {};
        
        const storedImage = localStorage.getItem('profile_image');
        if (storedImage && !profileData.image) {
          profileData.image = storedImage;
        }
        const storedGender = localStorage.getItem('profile_gender');
        if (storedGender && !profileData.gender) {
          profileData.gender = storedGender;
        }
        
        setProfile(profileData);
        setInterests(profileData.interests || []);
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!interests.includes(inputValue.trim())) {
        setInterests([...interests, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dto = {
        name: profile?.name || '',
        birthday: profile?.birthday || '',
        height: profile?.height || 0,
        weight: profile?.weight || 0,
        interests: interests,
      };
      
      if (!profile || (!profile.name && !profile.birthday)) {
        await createProfile(dto);
      } else {
        await updateProfile(dto);
      }
      router.push('/profile');
    } catch (error) {
      console.error('Failed to save interests:', error);
      alert('Failed to save interests.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-gradient text-white flex flex-col px-6 pt-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-16">
        <button onClick={() => router.back()} className="flex items-center font-bold">
          <ChevronLeft size={24} />
          Back
        </button>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="text-white font-bold"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </header>

      {/* Content */}
      <div className="px-2">
        <p className="text-[#D6B88A] font-bold text-sm mb-2">
          Tell everyone about yourself
        </p>
        <h1 className="text-xl font-bold mb-8">What interest you?</h1>

        <div className="w-full bg-white/5 rounded-xl p-4 min-h-[60px] flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <div
              key={index}
              className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              {interest}
              <button 
                onClick={() => handleRemoveInterest(interest)}
                className="hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] bg-transparent outline-none text-white text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddInterest}
            autoFocus
          />
        </div>
        <p className="text-white/40 text-[10px] mt-2 ml-1">
          Press enter to add interest
        </p>
      </div>
    </div>
  );
}
