import { Injectable, NotFoundException, Inject, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Message, MessageDocument } from '../../schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @Optional() @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy | null,
  ) {}

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto): Promise<MessageDocument> {
    const { receiverId, message } = sendMessageDto;

    // Create and save message
    const newMessage = new this.messageModel({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      message,
      status: 'sent',
    });

    const savedMessage = await newMessage.save();

    // Publish event to RabbitMQ if available
    if (this.rabbitClient) {
      try {
        this.rabbitClient.emit('message_sent', {
          messageId: savedMessage._id.toString(),
          senderId,
          receiverId,
          message,
          timestamp: savedMessage.createdAt,
        });
      } catch {
        // RabbitMQ not available, message still saved to DB
      }
    }

    return savedMessage;
  }

  async viewMessages(userId: string, otherUserId: string): Promise<MessageDocument[]> {
    const userObjectId = new Types.ObjectId(userId);
    const otherObjectId = new Types.ObjectId(otherUserId);

    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userObjectId, receiverId: otherObjectId },
          { senderId: otherObjectId, receiverId: userObjectId },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }

  async updateMessageStatus(messageId: string, status: 'sent' | 'delivered'): Promise<MessageDocument> {
    const message = await this.messageModel
      .findByIdAndUpdate(
        messageId,
        { $set: { status } },
        { new: true },
      )
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
