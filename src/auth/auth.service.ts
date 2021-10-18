import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { StatusCodes } from 'src/constants';
import { responseObj } from 'src/utils/ReponseObj';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user) {
            const valid = await bcrypt.compare(pass, user.password);
            if (valid) {
                return { username: user.username, id: user["_id"], fullname: user.fullname, avatar: user.avatar };
            }
        }
        return null;
    }

    async signUp(authCredentialsDto: CreateUserDTO): Promise<any> {
        const { username, password, fullname, avatar } = authCredentialsDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await this.usersService.create({ username, password: hashedPassword, fullname, avatar })
            return responseObj();
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException('Username or password was wrong', StatusCodes.fail);
            }
            throw error;
        }
    }

    async login(user: any) {
        const data = {
            access_token: this.jwtService.sign(user),
            ...user
        };
        return responseObj(data);
    }
}
