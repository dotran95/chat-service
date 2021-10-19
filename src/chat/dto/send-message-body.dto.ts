import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDTO {
  @ApiProperty({ type: 'string', required: false })
  message: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  conversationId: string;

  @ApiProperty({ type: 'string', required: false })
  imageURL: string;
}
