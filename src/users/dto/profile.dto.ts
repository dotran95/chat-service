import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class Profile {

    @IsString()
    @MinLength(4)
    @ApiProperty({ required: true, type: String })
    userId: string;

    @IsString()
    @MinLength(4)
    @ApiProperty({ required: true, type: String })
    fullname: string;

    @ApiProperty({ required: false, type: String })
    avatar: string;
}