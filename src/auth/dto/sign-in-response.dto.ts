import { isNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDTO {

    @ApiProperty({ required: true, type: String })
    @IsString()
    access_token: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    username: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    id: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    fullname: string;
}