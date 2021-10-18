import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {

    @ApiProperty({ minLength: 4, maxLength: 20, required: true, type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({ minLength: 8, maxLength: 20, required: true, type: String })
    @IsString()
    @MinLength(8, { message: 'Password is too short (8 characters min)' })
    @MaxLength(20, { message: 'Password is too long (20 characters max)' })
    password: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    fullname: string;

    @ApiProperty({ type: String, required: false })
    avatar?: string;
}