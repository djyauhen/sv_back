import {IsNotEmpty, IsNumber, IsString, MinLength} from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Заголовок должен содержать минимум 3 символа' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Анонс должен содержать минимум 10 символов' })
    preface: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(20, { message: 'Текст должен содержать минимум 20 символов' })
    text: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;
}
