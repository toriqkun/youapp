import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}

@ApiTags('Profile')
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('createProfile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439011',
        displayName: 'Toriq',
        birthday: '2000-01-15T00:00:00.000Z',
        gender: 'Male',
        height: 175,
        weight: 70,
        zodiac: 'Capricorn',
        horoscope: 'Dragon',
        interests: ['coding', 'gaming'],
        profileImage: 'https://example.com/avatar.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(
    @Request() req: AuthenticatedRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(req.user.userId, createProfileDto);
  }

  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439011',
        displayName: 'Toriq',
        birthday: '2000-01-15T00:00:00.000Z',
        gender: 'Male',
        height: 175,
        weight: 70,
        zodiac: 'Capricorn',
        horoscope: 'Dragon',
        interests: ['coding', 'gaming'],
        profileImage: 'https://example.com/avatar.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Put('updateProfile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439011',
        displayName: 'Toriq Updated',
        birthday: '2000-01-15T00:00:00.000Z',
        gender: 'Male',
        height: 180,
        weight: 75,
        zodiac: 'Capricorn',
        horoscope: 'Dragon',
        interests: ['coding', 'reading'],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }
}
