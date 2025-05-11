import {Module} from '@nestjs/common';
import {SitemapController} from "./sitemap.controller";
import {ArticlesService} from "../articles/articles.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users])],
    controllers: [SitemapController],
    providers: [ArticlesService],
})
export class SitemapModule {
}
