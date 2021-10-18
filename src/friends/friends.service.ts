import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusCodes } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { CreateFriendDTO } from './dto/create-friend.dto';
import { Friend, FriendDocument } from './schemas/friend.schema';

@Injectable()
export class FriendsService {

    private readonly logger = new Logger(FriendsService.name);

    constructor(@InjectModel(Friend.name) private friendModel: Model<FriendDocument>, private usersService: UsersService) { }

    async addFriend(currentUserId: string, friendId: string): Promise<any> {
        try {
            const currentUser = await this.usersService.findOneById(currentUserId);
            const friendUser = await this.usersService.findOneById(friendId);

            if (friendUser && currentUser) {
                const key = `${currentUserId}_${friendId}`;
                const friendExist = await this.friendModel.findOne({ key });
                if (friendExist) {
                    this.logger.log(`Friend exist ${friendExist}`);
                } else {
                    const friendDto: CreateFriendDTO = { key, profile1: currentUser, profile2: friendUser, userRequest: currentUserId };
                    const friend = new this.friendModel(friendDto);
                    await friend.save();
                }
                return true;
            }
        } catch (error) {
            throw error;
        }

        throw new HttpException('User not found', StatusCodes.fail)
    }

    async acceptFriend(currentUserId: string, friendId: string, accept: boolean): Promise<any> {
        try {

            const keys = [`${currentUserId}_${friendId}`, `${friendId}_${currentUserId}`];
            const record = await this.friendModel.findOne({ key: { $in: keys }, accept: false });
            if (record) {
                if (accept) {
                    await this.friendModel.updateOne({ _id: record._id }, { accept });
                } else {
                    await this.friendModel.deleteOne({ _id: record._id });
                }
                return true;
            }
            throw new HttpException('Request Friend not found', StatusCodes.fail);
        } catch (error) {
            throw error;
        }
    }

    async getListFriend(userId: string): Promise<any> {
        const allFriends = await this.friendModel.find({ key: { $regex: userId } });

        const friends = allFriends.filter(friend => friend.accept).map(friend => {
            return friend.profile1.userId != userId ? friend.profile2 : friend.profile1;
        });

        const requestFriends = allFriends.filter(friend => {
            return !friend.accept && friend.userRequest != userId
        }).map(friend => {
            return friend.profile1.userId != userId ? friend.profile2 : friend.profile1;
        });

        return { friends, requestFriends };
    }
}
