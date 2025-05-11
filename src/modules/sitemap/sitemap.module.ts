import {Module} from '@nestjs/common';
import {SitemapController} from "./sitemap.controller";
import {ArticlesService} from "../articles/articles.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Article} from "../articles/entities/article.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Article])],
    controllers: [SitemapController],
    providers: [ArticlesService],
})
export class SitemapModule {
}
