import {Body, Controller, Post} from '@nestjs/common';
import {MessageService} from './message.service';
import {MessageDto} from "./dto/message.dto";

@Controller('send-message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {
    }

    @Post()
    sendMessage(@Body() messageDto: MessageDto) {
        return this.messageService.sendMessage(messageDto);
    }
}
