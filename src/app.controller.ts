import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AutoDTO } from './auth/dto/Auth.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateUserDTO } from './users/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ status: 200, description: 'Successfully.' })
  @ApiResponse({ status: 400, description: 'Failed.' })
  @ApiBody({
    description: 'Loggin',
    type: AutoDTO,
  })
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('sign-up')
  @ApiResponse({ status: 200, description: 'Successfully.' })
  @ApiResponse({ status: 400, description: 'Failed.' })
  async signUp(@Body() body: CreateUserDTO) {
    return await this.authService.signUp(body);
  }
}
