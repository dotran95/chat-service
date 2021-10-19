import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReadMessageDTO {

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    messageId: string;
}
