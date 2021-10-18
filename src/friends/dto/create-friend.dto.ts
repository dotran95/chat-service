import { IsNotEmptyObject, IsObject, IsString, MaxLength, MinLength } from 'class-validator';
import { Profile } from '../../users/dto/profile.dto';

export class CreateFriendDTO {

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    userRequest: string;

    @IsObject()
    @IsNotEmptyObject()
    profile1: Profile;

    @IsObject()
    @IsNotEmptyObject()
    profile2: Profile;

    @IsString()
    @MinLength(8)
    @MaxLength(40)
    key: string;
}