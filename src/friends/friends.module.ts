import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from 'src/friends/schemas/friend.schema';
import { UsersModule } from 'src/users/users.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  controllers: [FriendsController],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }])
  ],
  providers: [FriendsService],
})
export class FriendsModule { }
