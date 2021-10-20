import { LIMIT } from './../constants';
import { Controller, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseObj } from 'src/utils/ReponseObj';
import { UsersService } from './users.service';
import _ from 'lodash';

@Controller('users')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('profile')
    @ApiQuery({ name: 'id', type: 'string', required: false, description: 'userId (optional)' })
    async getProfile(@Req() req: Request, @Query('id') userId: string) {
        const id = userId || req.user["id"];
        const userProfile = await this.userService.findOneById(id);
        return responseObj(userProfile);
    }

    @Get('search')
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiQuery({ type: 'string', name: 'page', required: false })
    @ApiQuery({ type: 'string', name: 'limit', required: false })
    async search(@Req() req: Request,
        @Query('name') name?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        const pageNumber = Number(page) ?? 0;
        const limitNumber = Number(limit) ?? LIMIT;
        const keyword = typeof name === 'string' ? name : '';
        const userProfile = await this.userService.search(keyword, pageNumber, limitNumber);
        return responseObj(userProfile);
    }
}
