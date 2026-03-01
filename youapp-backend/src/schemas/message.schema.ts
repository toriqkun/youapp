import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['sent', 'delivered'], default: 'sent' })
  status: string;

  @Prop()
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
