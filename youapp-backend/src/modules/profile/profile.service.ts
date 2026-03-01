import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from '../../schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { calculateZodiac } from '../../utils/zodiac.util';
import { calculateHoroscope } from '../../utils/horoscope.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    // Check if profile already exists
    const existingProfile = await this.profileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    // Build profile data with auto-calculated zodiac & horoscope
    const profileData: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
      ...createProfileDto,
    };

    // Auto-calculate zodiac and horoscope from birthday
    if (createProfileDto.birthday) {
      const birthdayDate = new Date(createProfileDto.birthday);
      profileData.birthday = birthdayDate;
      profileData.zodiac = calculateZodiac(birthdayDate);
      profileData.horoscope = calculateHoroscope(birthdayDate);
    }

    const profile = new this.profileModel(profileData);
    return profile.save();
  }

  async getProfile(userId: string): Promise<ProfileDocument> {
    const profile = await this.profileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileDocument> {
    const updateData: Record<string, unknown> = { ...updateProfileDto };

    // Auto-recalculate zodiac and horoscope if birthday is updated
    if (updateProfileDto.birthday) {
      const birthdayDate = new Date(updateProfileDto.birthday);
      updateData.birthday = birthdayDate;
      updateData.zodiac = calculateZodiac(birthdayDate);
      updateData.horoscope = calculateHoroscope(birthdayDate);
    }

    const profile = await this.profileModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found. Please create a profile first.');
    }

    return profile;
  }
}
