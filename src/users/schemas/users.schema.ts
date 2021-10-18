import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullname: string;

    @Prop()
    avatar: string;

    @Prop({ type: Date, default: Date.now() })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);