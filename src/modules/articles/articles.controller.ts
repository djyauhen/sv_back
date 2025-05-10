import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile, BadRequestException, Query, HttpStatus
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {JwtAuthGuard} from "../../guards/jwt-auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOptions} from "../../common/multer.config";
import {Article} from "./entities/article.entity";
import * as fs from 'fs/promises';
import { join } from 'path';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.articlesService.create(createArticleDto, file?.path);
      return result;
    } catch (error) {
      // Удаляем файл, если он был загружен и произошла ошибка
      if (file?.path) {
        await fs.unlink(join(process.cwd(), file.path)).catch((err) => {
          console.warn(`Failed to delete file ${file.path}: ${err.message}`);
        });
      }
      throw error; // Пробрасываем ошибку дальше
    }
  }

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get('page')
  async findAllByPage(@Query('page') page: string = '1') {
    const itemsPerPage = 6;
    const pageNumber = parseInt(page, 10) || 1;

    const response = await this.articlesService.findAllByPage(pageNumber, itemsPerPage);

    return {
      statusCode: HttpStatus.OK,
      data: response,
    };
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.articlesService.update(+id, updateArticleDto, file?.path);
      return result;
    } catch (error) {
      // Удаляем файл, если он был загружен и произошла ошибка
      if (file?.path) {
        await fs.unlink(join(process.cwd(), file.path)).catch((err) => {
          console.warn(`Failed to delete file ${file.path}: ${err.message}`);
        });
      }
      throw error; // Пробрасываем ошибку дальше
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<Article> {
    return this.articlesService.remove(+id);
  }
}
