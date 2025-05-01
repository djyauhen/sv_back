import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Users} from "../user/entities/user.entity";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private jwtService: JwtService,
    ) {}

    async validateUser(login: string, password: string): Promise<Users | null> {
        const user = await this.usersRepository.findOne({ where: { login } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(login: string, password: string) {
        const user = await this.validateUser(login, password);
        if (!user) {
            throw new UnauthorizedException('Не верный логин или пароль');
        }

        const payload = { sub: user.id, login: user.login };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '5d' });

        // Хэшируем и сохраняем refresh token в базе
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(user.id, { refreshToken: hashedRefreshToken });

        return {
            access_token: accessToken,
            refresh_token: refreshToken, // Возвращаем для установки в cookie
        };
    }

    async refresh(refreshToken: string) {
        try {
            // Проверяем валидность refresh token
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });

            if (!user || !user.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Проверяем соответствие хэша refresh token
            const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isValid) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Генерируем новый access token
            const newPayload = { sub: user.id, login: user.login };
            const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '1h' });

            return { access_token: newAccessToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async invalidateRefreshToken(userId: number) {
        // Очищаем refresh token в базе (для логаута)
        await this.usersRepository.update(userId, { refreshToken: null });
    }
}
