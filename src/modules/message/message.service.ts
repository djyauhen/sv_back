import {Injectable} from '@nestjs/common';
import {MessageDto} from "./dto/message.dto";
import * as TelegramAPI from "node-telegram-bot-api";

@Injectable()
export class MessageService {
    private token: string = '7182522870:AAEe1W-UUYKonFPLk6EmG3vvLiwNxYuXY94';
    private bot = new TelegramAPI(this.token, {polling: true});
    private svetlanaId: number = 1082531680;
    // private devId: number = 1069494391;

    constructor() {
    }

    sendMessage(messageDto: MessageDto) {
        const {name, phone, question} = messageDto;

        return this.bot.sendMessage(this.svetlanaId,
            `Светлана, здравствуйте!\nВам новое сообщение!\nОт: ${name}\nНомер телефона: +7${phone}\nВопрос: ${question}`
        );
    }
}
