import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {JwtAuthGuard} from "../../guards/jwt-auth/jwt-auth.guard";

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
