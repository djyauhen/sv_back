import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Article} from "./entities/article.entity";
import {Repository} from "typeorm";
import * as fs from 'fs/promises';
import {join} from 'path';
import {validate} from "class-validator";

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger(ArticlesService.name);

    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
    ) {
    }

    async create(createArticleDto: CreateArticleDto, imagePath?: string): Promise<Article> {
        this.logger.log(`Creating article with image: ${imagePath}`);
        const article = this.articlesRepository.create({
            ...createArticleDto,
            image: imagePath,
        });

        // Валидация Entity перед сохранением
        const errors = await validate(article);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
        }

        return this.articlesRepository.save(article);
    }

    async findAllByPage(page: number, itemsPerPage: number): Promise<{
        articles: Article[];
        totalCount: number;
        pages: number
    }> {
        const [articles, totalCount] = await this.articlesRepository.findAndCount({
            skip: itemsPerPage * (page - 1),
            take: itemsPerPage,
            order: {
                date: 'DESC', // Сортировка по убыванию даты создания
            },
        });

        return {
            articles,
            totalCount,
            pages: Math.ceil(totalCount / itemsPerPage),
        };
    }

    async findAll(): Promise<Article[]> {
        return this.articlesRepository.find({
            order: {
                date: 'DESC', // Сортировка по убыванию даты создания
            }
        });
    }

    async findOne(id: number): Promise<Article> {
        const article = await this.articlesRepository.findOne({where: {id}});
        if (!article) {
            throw new NotFoundException(`Статья с таким id: ${id} не найдена`);
        }
        return article;
    }

    async update(id: number, updateArticleDto: UpdateArticleDto, imagePath?: string): Promise<Article> {
        const article = await this.findOne(id);

        // Удаление старого изображения
        if ((imagePath || updateArticleDto.imageDelete) && article.image) {
            this.logger.log(`Removing old image: ${article.image}`);
            await fs.unlink(join(process.cwd(), article.image)).catch((err) => {
                this.logger.warn(`Failed to remove old image: ${err.message}`);
            });
            article.image = imagePath || null; // Установить null, если imageDelete=true
        } else if (imagePath) {
            this.logger.log(`Updating with new image: ${imagePath}`);
            article.image = imagePath;
        }

        // Обновление остальных полей
        Object.assign(article, updateArticleDto);
        delete updateArticleDto.imageDelete; // Удалить imageDelete, чтобы не мешало валидации Entity

        // Валидация
        const errors = await validate(article);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
        }

        return this.articlesRepository.save(article);
    }

    async remove(id: number): Promise<Article> {
        const article = await this.findOne(id);
        if (article.image) {
            this.logger.log(`Removing image: ${article.image}`);
            await fs.unlink(join(process.cwd(), article.image)).catch(() => {
            });
        }
        const res = await this.articlesRepository.remove(article);
        return res;
    }
}
