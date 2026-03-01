import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatConsumer {
  private readonly logger = new Logger(ChatConsumer.name);

  constructor(private readonly chatService: ChatService) {}

  @EventPattern('message_sent')
  async handleMessageSent(@Payload() data: { messageId: string; senderId: string; receiverId: string; message: string }) {
    this.logger.log(`Received message_sent event for messageId: ${data.messageId}`);
    
    // Simulate updating status to 'delivered' via RabbitMQ event
    try {
      await this.chatService.updateMessageStatus(data.messageId, 'delivered');
      this.logger.log(`Updated message ${data.messageId} status to delivered`);
    } catch (error) {
       const err = error as Error;
      this.logger.error(`Failed to update message status: ${err.message}`);
    }
  }
}
