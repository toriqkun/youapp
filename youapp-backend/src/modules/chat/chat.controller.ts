import {
  Controller,
  Post,
  Get,
  Body,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}

@ApiTags('Chat')
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439013',
        senderId: '507f1f77bcf86cd799439011',
        receiverId: '507f1f77bcf86cd799439012',
        message: 'Hello, how are you?',
        status: 'sent',
        createdAt: '2026-03-01T04:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  async sendMessage(
    @Request() req: AuthenticatedRequest,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.userId, sendMessageDto);
  }

  @Get('viewMessages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'View messages between current user and another user' })
  @ApiQuery({ name: 'userId', description: 'Other user ID to view conversation with', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439013',
          senderId: '507f1f77bcf86cd799439011',
          receiverId: '507f1f77bcf86cd799439012',
          message: 'Hello!',
          status: 'sent',
          createdAt: '2026-03-01T04:00:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439014',
          senderId: '507f1f77bcf86cd799439012',
          receiverId: '507f1f77bcf86cd799439011',
          message: 'Hi! I am fine.',
          status: 'delivered',
          createdAt: '2026-03-01T04:01:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  async viewMessages(
    @Request() req: AuthenticatedRequest,
    @Query('userId') otherUserId: string,
  ) {
    return this.chatService.viewMessages(req.user.userId, otherUserId);
  }
}
