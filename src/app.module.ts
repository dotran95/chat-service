import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [UsersModule, AuthModule, MongooseModule.forRoot('mongodb://localhost/cv_dev'), ChatModule, FriendsModule],
  controllers: [AppController, ChatController],
  providers: [AppService],
})
export class AppModule { }
