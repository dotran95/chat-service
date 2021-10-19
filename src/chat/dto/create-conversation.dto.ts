import { IsArray, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";
import { Profile } from "src/users/dto/profile.dto";

export class CreateConversationDTO {

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsArray()
    @IsNotEmpty()
    members: Profile[];

    @IsString()
    avatar?: string;

    @IsString()
    title?: string;

    @IsDate()
    @IsNotEmpty()
    lastUpdate: Date

    @IsString()
    lastMessage?: string
}
