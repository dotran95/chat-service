import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptFriendDTO {

    @ApiProperty({ required: true, type: Boolean })
    @IsBoolean()
    accept: boolean;

    @ApiProperty({ minLength: 4, maxLength: 20, required: true, type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    friendId: string;
}