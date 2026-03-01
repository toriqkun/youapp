import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Toriq Updated', description: 'Display name', required: false })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ example: '2000-01-15', description: 'Birthday (YYYY-MM-DD)', required: false })
  @IsDateString({}, { message: 'Birthday must be a valid date string (YYYY-MM-DD)' })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Other'], description: 'Gender', required: false })
  @IsEnum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 180, description: 'Height in cm', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 75, description: 'Weight in kg', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: ['coding', 'reading'], description: 'List of interests', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ example: 'https://example.com/new-avatar.jpg', description: 'Profile image URL', required: false })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
