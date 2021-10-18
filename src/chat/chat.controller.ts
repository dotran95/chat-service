import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseObj } from 'src/utils/ReponseObj';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class ChatController {

    constructor(private readonly chatService: ChatService) { }

    @Get('list')
    @ApiQuery({ type: 'string', name: 'page', required: false })
    @ApiQuery({ type: 'string', name: 'limit', required: false })
    async listFriend(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
        const currentUserId = req.user["id"];
        const pageNumber = Number(page) || 0;
        const limitNumber = Number(limit) || 10;
        const obj = await this.chatService.getListChat(currentUserId, pageNumber, limitNumber);
        return responseObj({ obj, pageNumber, limitNumber });
    }
}
