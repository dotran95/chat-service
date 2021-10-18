import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseObj } from 'src/utils/ReponseObj';
import { AddFriendDTO } from './dto/add-friend.dto';
import { FriendsService } from './friends.service';
import { Request } from 'express';
import { AcceptFriendDTO } from './dto/accept-friend.dto';

@Controller('friends')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class FriendsController {

    constructor(private readonly friendsService: FriendsService) { }

    @Post('add')
    async addFriend(@Req() req: Request, @Body() body: AddFriendDTO) {
        const currentUserId = req.user["id"];
        const addFriendUserId = body.userId;
        const obj = await this.friendsService.addFriend(currentUserId, addFriendUserId);
        return responseObj(obj);
    }

    @Get()
    async listFriend(@Req() req: Request) {
        const currentUserId = req.user["id"];
        const obj = await this.friendsService.getListFriend(currentUserId);
        return responseObj(obj);
    }

    @Post('accept')
    async accept(@Req() req: Request, @Body() body: AcceptFriendDTO) {
        const currentUserId = req.user["id"];
        const friendId = body.friendId;
        const accept = body.accept;
        const obj = await this.friendsService.acceptFriend(currentUserId, friendId, accept);
        return responseObj(obj);
    }
}
