import { SendMessageDTO } from './dto/send-message-body.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseObj } from 'src/utils/ReponseObj';
import { ChatService } from './chat.service';
import { ReadMessageDTO } from './dto/read-message.dto';
import { MessagesDTO } from './dto/messages.dto';

@Controller('chat')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('list')
  @ApiQuery({ type: 'string', name: 'page', required: false })
  @ApiQuery({ type: 'string', name: 'limit', required: false })
  async listFriend(
    @Req() req: Request,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const currentUserId = req.user['id'];
    const pageNumber = Number(page) || 0;
    const limitNumber = Number(limit) || 10;
    const obj = await this.chatService.getListChat(
      currentUserId,
      pageNumber,
      limitNumber,
    );
    return responseObj(obj, { pageNumber, limitNumber });
  }

  @Post('send-message')
  async sendMessage(@Req() req: Request, @Body() body: SendMessageDTO) {
    const currentUserId = req.user['id'];
    const obj = await this.chatService.sendMessage(currentUserId, body);
    console.log(obj)
    return responseObj(obj);
  }

  @Post('read-message')
  async readMessage(@Req() req: Request, @Body() body: ReadMessageDTO) {
    const currentUserId = req.user['id'];
    const obj = await this.chatService.readMessage(body.messageId, currentUserId);
    return responseObj(obj);
  }

  @Post('list-message')
  async getListMessage(@Req() req: Request, @Body() body: MessagesDTO) {
    const currentUserId = req.user['id'];
    const obj = await this.chatService.getListMessage(currentUserId, body);
    return responseObj(obj);
  }

  @Get('new-message')
  async checkNewMessage(@Req() req: Request) {
    const currentUserId = req.user['id'];
    const obj = await this.chatService.newMessage(currentUserId);
    return responseObj(obj);
  }
}
