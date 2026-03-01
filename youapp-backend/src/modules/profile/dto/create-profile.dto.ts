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

export class CreateProfileDto {
  @ApiProperty({ example: 'Toriq', description: 'Display name' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ example: '2000-01-15', description: 'Birthday (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Birthday must be a valid date string (YYYY-MM-DD)' })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Other'], description: 'Gender' })
  @IsEnum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 175, description: 'Height in cm' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 70, description: 'Weight in kg' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: ['coding', 'gaming', 'music'], description: 'List of interests' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Profile image URL' })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
