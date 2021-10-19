import { ApiProperty } from "@nestjs/swagger";
import { IsNegative, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessagesDTO {

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    page: number;

    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    limit: number;
}
