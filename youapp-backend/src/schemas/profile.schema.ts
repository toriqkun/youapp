import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ trim: true })
  displayName: string;

  @Prop()
  birthday: Date;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  zodiac: string;

  @Prop()
  horoscope: string;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  profileImage: string;

  @Prop()
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
