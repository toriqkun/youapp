import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'toriq@example.com', description: 'User email or username' })
  @IsString()
  @IsNotEmpty({ message: 'Email or username is required' })
  email: string;

  @ApiProperty({ example: 'toriqkun', description: 'User username (optional)', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'StrongP@ss123', description: 'User password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

