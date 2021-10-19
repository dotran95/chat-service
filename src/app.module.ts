import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, AuthModule, MongooseModule.forRoot(process.env.DATABASE_URI), ChatModule, FriendsModule, FileModule],
  controllers: [AppController, ChatController],
  providers: [AppService],
})
export class AppModule { }
