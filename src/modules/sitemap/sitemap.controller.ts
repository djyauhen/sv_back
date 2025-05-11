import {Controller, Get, Res} from '@nestjs/common';
import {SitemapStream, streamToPromise} from "sitemap";
import {ArticlesService} from "../articles/articles.service";
import { Response } from 'express';

@Controller('sitemap')
export class SitemapController {
    constructor(private readonly articlesService: ArticlesService) {}
    @Get()
    async generateSitemap(@Res() res: Response) {
        const sitemap = new SitemapStream({ hostname: 'https://true8lawyer.ru' });

        // Статические страницы (Angular маршруты)
        const staticPages = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/blog', changefreq: 'daily', priority: 0.8 },
        ];

        // Добавление статических страниц
        staticPages.forEach(page => {
            sitemap.write(page);
        });

        // Динамические страницы (пример: статьи из базы данных)
        // Предположим, у вас есть сущность Article с полем slug
        const articles = await this.articlesService.findAll(); // Замените на ваш сервис
        articles.forEach(article => {
          sitemap.write({
            url: `/blog/${article.id}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: article.date,
          });
        });

        sitemap.end();

        const sitemapXml = await streamToPromise(sitemap);
        res.header('Content-Type', 'application/xml');
        res.send(sitemapXml.toString());
    }
}
