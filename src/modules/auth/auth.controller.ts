import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from './auth.service';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true}) res: Response) {
        const {access_token, refresh_token} = await this.authService.login(
            loginUserDto.login,
            loginUserDto.password,
        );

        // Устанавливаем refresh_token в HTTP-only cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 дней, как у токена
        });

        return {access_token}; // Возвращаем только access_token в теле ответа
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Req() req: any, @Res({passthrough: true}) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const {access_token, refresh_token} = await this.authService.refresh(refreshToken);

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        return {access_token};
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Req() req: any, @Res({passthrough: true}) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (refreshToken) {
            try {
                const payload = await this.jwtService.verify(refreshToken);
                await this.authService.invalidateRefreshToken(payload.sub);
            } catch (e) {
                // Игнорируем ошибки, если токен недействителен
            }
        }

        // Очищаем cookie
        res.clearCookie('refresh_token');
        return {message: 'Успешно вышли'};
    }
}