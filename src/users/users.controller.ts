import { Controller, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, } from '@nestjs/swagger';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseObj } from 'src/utils/ReponseObj';
import { UsersService } from './users.service';

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
}
