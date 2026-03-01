import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ViewMessagesDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Other user ID to view conversation with' })
  @IsMongoId({ message: 'User ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}
