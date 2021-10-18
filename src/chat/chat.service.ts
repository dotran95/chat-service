import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversations.schema';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>
    ) { }

    async getListChat(userId: string, page: number, limit: number): Promise<any> {
        try {
            let conversations = await this.conversationModel.find({
                "members.userId": {
                    "$eq": userId,
                    "$exists": true
                }
            })
                .sort({ lastUpdate: 'desc' })
                .limit(limit)
                .skip(page * limit)
                .exec();
            return conversations;
        } catch (error) {
            throw error;
        }
    }
}
