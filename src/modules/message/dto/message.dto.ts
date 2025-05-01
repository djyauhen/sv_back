import {IsNotEmpty, IsString} from "class-validator";

export class MessageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    question: string;
}