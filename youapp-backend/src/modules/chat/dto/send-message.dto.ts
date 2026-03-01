import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Receiver user ID' })
  @IsMongoId({ message: 'Receiver ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Receiver ID is required' })
  receiverId: string;

  @ApiProperty({ example: 'Hello, how are you?', description: 'Message content' })
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message: string;
}
