import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ArticlesModule} from './modules/articles/articles.module';
import {MessageModule} from './modules/message/message.module';
import {SitemapController} from './modules/sitemap/sitemap.controller';
import {SitemapModule} from "./modules/sitemap/sitemap.module";

@Module({
    controllers: [AppController, SitemapController],
    providers: [AppService],
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
        ArticlesModule,
        MessageModule,
        SitemapModule
    ],
})
export class AppModule {
}
