import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Profile } from 'src/users/dto/profile.dto';

export type MessageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({ required: true, type: String })
    conversationId: string;

    @Prop({ required: false, type: String })
    message: string;

    @Prop({ required: false, type: String })
    image: string;

    @Prop({ required: true, type: Object })
    own: Profile;

    @Prop({ type: Array, default: [] })
    seens: Profile[]

    @Prop({ type: Date, default: Date.now() })
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);