import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Profile } from '../../users/dto/profile.dto';

export type FriendDocument = Friend & Document;

@Schema()
export class Friend {

    @Prop({ required: true, type: Object })
    profile1: Profile;

    @Prop({ required: true, type: Object })
    profile2: Profile;

    @Prop({ required: true, type: String }) //UserID1_UserID2
    key: string;

    @Prop({ type: Boolean, default: false })
    accept: boolean;

    @Prop({ required: true, type: String })
    userRequest: string;

    @Prop({ type: Date, default: Date.now() })
    createdAt: Date;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);