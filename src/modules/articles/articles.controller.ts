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

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (!body.title) {
      throw new BadRequestException('Заголовок обязателен');
    }
    const createArticleDto: CreateArticleDto = {
      title: body.title,
      preface: body.preface,
      text: body.text,
      duration: parseInt(body.duration, 10),
    };
    return this.articlesService.create(createArticleDto, file?.path);
  }

  @Get()
  async findAll(@Query('page') page: string = '1') {
    const itemsPerPage = 6;
    const pageNumber = parseInt(page, 10) || 1;

    const response = await this.articlesService.findAll(pageNumber, itemsPerPage);

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
  async update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const updateArticleDto: UpdateArticleDto = {
      title: body.title,
      preface: body.preface,
      text: body.text,
      duration: body.duration ? parseInt(body.duration, 10) : undefined,
    };
    return this.articlesService.update(+id, updateArticleDto, file?.path);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<Article> {
    return this.articlesService.remove(+id);
  }
}
