import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _, { get } from 'lodash';
import { Model, Types } from 'mongoose';
import { StatusCodes } from 'src/constants';
import { CreateUserDTO } from './dto/create-user.dto';
import { Profile } from './dto/profile.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createCatDto: CreateUserDTO): Promise<User> {
        const createdUser = new this.userModel(createCatDto);
        return await createdUser.save();
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async findOneById(id: string): Promise<Profile | undefined> {

        if (Types.ObjectId.isValid(id)) {
            const userProfile = await this.userModel.findById(id).exec();
            if (userProfile) {
                return { userId: get(userProfile, "_id", ""), fullname: get(userProfile, "fullname", ""), avatar: get(userProfile, "avatar", null) }
            }
        }

        throw new HttpException("User not found", StatusCodes.fail);
    }

    async search(name: string, page: number, limit: number): Promise<Profile[]> {
        try {
            let users: any[] = [];
            if (name.length === 0) {
                users = await this.userModel.find().limit(limit).skip(page * limit);
            } else {
                users = await this.userModel.find({ fullname: { $regex: name, $options: 'i' } }).limit(limit).skip(page * limit);
            }
            return users.map(user => {
                return { userId: get(user, "_id", ""), fullname: get(user, "fullname", ""), avatar: get(user, "avatar", null) }
            })

        } catch (error) {
            throw error;
        }
    }
}
