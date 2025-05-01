import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import {join} from "path";
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.use(cookieParser());
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:4200',
                'https://77.222.38.178',
                'http://77.222.38.178',
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,POST,PUT,DELETE,PATCH',
        allowedHeaders: 'Content-Type, Authorization, X-Custom-Header',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    // Раздача статических файлов из папки uploads
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    await app.listen(3000);
}

bootstrap();
