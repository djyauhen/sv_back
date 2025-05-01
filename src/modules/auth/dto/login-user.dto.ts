import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsNotEmpty({message: 'Логин не может быть пустым'})
    @MinLength(3, {message: 'Логин должен содержать минимум 3 символа'})
    login: string;

    @IsString()
    @IsNotEmpty({message: 'Пароль не может быть пустым'})
    @MinLength(3, {message: 'Пароль должен содержать минимум 3 символа'})
    password: string;
}