import { IsArray, IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";
import { Profile } from "src/users/dto/profile.dto";

export class CreateMessageDTO {

    @IsString()
    message: string;

    @IsString()
    @IsNotEmpty()
    conversationId: string;

    image: string;

    @IsObject()
    @IsNotEmptyObject()
    own: Profile;

    @IsArray()
    seens: Profile[]
}
