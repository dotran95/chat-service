import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profile } from 'src/users/dto/profile.dto';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {

    @Prop({ required: true, type: String })
    host: string;

    @Prop({ required: true, type: Types.DocumentArray })
    members: Profile[];

    @Prop({ required: false, type: String })
    avatar: string;

    @Prop({ required: false, type: String })
    title: string;

    @Prop({ type: Boolean, default: false })
    isGroup: boolean;

    @Prop({ type: Date, default: Date.now() })
    lastUpdate: Date

    @Prop({ required: false, type: String })
    lastMessage: string

    @Prop({ type: Date, default: Date.now() })
    createdAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);