import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateArticleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Заголовок должен содержать минимум 3 символа'})
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(10, {message: 'Анонс должен содержать минимум 10 символов'})
    preface?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(20, {message: 'Текст должен содержать минимум 20 символов'})
    text?: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Min(1, {message: 'Длительность должна быть больше 0'})
    @Transform(({ value }) => (value ? Number(value) : undefined))
    duration?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    imageDelete?: boolean;
}
