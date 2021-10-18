import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDTO {

    @ApiProperty({ minLength: 4, maxLength: 20, required: true, type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    userId: string;
}