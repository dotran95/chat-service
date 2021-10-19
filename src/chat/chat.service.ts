import { LIMIT, StatusCodes } from './../constants';
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { SendMessageDTO } from './dto/send-message-body.dto';
import { Conversation, ConversationDocument, } from './schemas/conversations.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Profile } from 'src/users/dto/profile.dto';
import { CreateConversationDTO } from './dto/create-conversation.dto';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessagesDTO } from './dto/messages.dto';
const { ObjectId } = Types;

@Injectable()
export class ChatService {

	private readonly logger = new Logger(ChatService.name);

	constructor(
		@InjectModel(Conversation.name)
		private conversationModel: Model<ConversationDocument>,
		@InjectModel(Message.name) private messageModel: Model<MessageDocument>,
		private usersService: UsersService,
	) { }

	async getListChat(userId: string, page: number, limit: number): Promise<any> {
		try {
			let conversations = await this.conversationModel
				.find({ "members.userId": new ObjectId(userId) })
				.sort({ lastUpdate: 'desc' })
				.limit(limit)
				.skip(page * limit)

			//check seen message
			const items = [];
			for (const conversation of conversations) {
				const isNew = await this.checkNewMessage(conversation._id, userId);
				items.push({ ...conversation["_doc"], isNew });
			}
			return items
		} catch (error) {
			throw new HttpException('Server error', StatusCodes.fail);
		}
	}

	async checkNewMessage(conversationId: string, userId: string): Promise<boolean> {
		const exist = await this.messageModel.findOne({
			conversationId,
			'seens.userId': new ObjectId(userId)
		})
		return !exist
	}

	async createConversation(currentUser: Profile, toUser: Profile): Promise<Conversation> {
		const newConversationObj: CreateConversationDTO = {
			members: [currentUser, toUser],
			host: currentUser.userId,
			lastUpdate: new Date()
		}

		try {
			const createdConversation = new this.conversationModel(newConversationObj);
			return await createdConversation.save();
		} catch (error) {
			return null
		}
	}

	async sendMessage(userId: string, body: SendMessageDTO): Promise<boolean> {
		try {
			const currentUser = await this.usersService.findOneById(userId);
			const { message, imageURL, conversationId } = body;

			if (userId === conversationId) {
				throw new HttpException('Conversation not found', StatusCodes.fail);
			}

			//find conversation
			let conversation: Conversation = await this.conversationModel.findById(conversationId);
			if (!conversation) {
				//create new conversation
				const toUser = await this.usersService.findOneById(conversationId);
				if (!toUser) {
					throw new HttpException('Conversation not found', StatusCodes.fail);
				}

				let existConversation = await this.conversationModel
					.findOne({
						$and: [
							{ "members.userId": new ObjectId(userId) },
							{ "members.userId": new ObjectId(toUser.userId) },
							{ "isGroup": false }
						]
					})
				if (existConversation) {
					conversation = existConversation
				} else {
					const newConversation = await this.createConversation(currentUser, toUser);
					if (newConversation) {
						conversation = newConversation
					}
				}
			}

			if (!conversation) {
				throw new HttpException('Conversation not found', StatusCodes.fail);
			}

			const newConversationId = conversation['_id']

			const newMessage: CreateMessageDTO = {
				message,
				conversationId: newConversationId,
				image: imageURL,
				own: currentUser,
				seens: [currentUser]
			}
			const createdMessage = new this.messageModel(newMessage);
			await createdMessage.save();

			await this.conversationModel.findByIdAndUpdate(newConversationId, { lastMessage: message, lastUpdate: new Date() })

			return true;

		} catch (error) {
			this.logger.log("Co loi roi: ", error);
			throw error;
		}
	}

	async readMessage(messageId: string, userId: string): Promise<boolean> {
		try {
			if (!ObjectId.isValid(messageId) || !ObjectId.isValid(userId)) {
				throw new HttpException("Message not found", StatusCodes.fail);
			}
			const currentUser = await this.usersService.findOneById(userId);
			const message = await this.messageModel.findById(messageId);
			if (!message) {
				throw new HttpException("Message not found", StatusCodes.fail);
			}

			const seens = message.seens.filter(user => {
				return user.userId.toString() === userId
			});
			console.log(seens);
			if (seens.length > 0) {
				return true
			}

			const conversation = await this.conversationModel.findOne({
				conversationId: message.conversationId,
				'members.userId': new ObjectId(userId)
			});
			if (!conversation) {
				throw new HttpException("Message not found", StatusCodes.fail);
			}

			await this.messageModel.findByIdAndUpdate(messageId, { $push: { seens: currentUser } });
			return true
		} catch (error) {
			this.logger.log("Co loi roi: ", error);
			throw error;
		}
	}

	async getListMessage(userId: string, body: MessagesDTO): Promise<any> {
		try {
			const { conversationId, page, limit } = body;

			const conversation = await this.conversationModel.findOne({
				conversationId: conversationId,
				'members.userId': new ObjectId(userId)
			});
			if (!conversation) {
				throw new HttpException("Conversation not found", StatusCodes.fail);
			}

			return await this.messageModel.find({ conversationId }).sort({ lastUpdate: 'desc' }).limit(limit).skip(page * limit)
		} catch (error) {
			this.logger.log("Co loi roi: ", error);
			throw error;
		}

	}

	async newMessage(userId: string): Promise<boolean> {
		try {
			let conversations = await this.conversationModel
				.find({ "members.userId": new ObjectId(userId) })
				.sort({ lastUpdate: 'desc' })
				.limit(LIMIT)

			for (const conversation of conversations) {
				const isNew = await this.checkNewMessage(conversation._id, userId);
				if (isNew) {
					return isNew
				}
			}
			return false
		} catch (error) {
			throw new HttpException('Server error', StatusCodes.fail);
		}
	}
}
