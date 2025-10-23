import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get('public-link')
  @UseGuards(JwtAuthGuard)
  async getPublicLink(@TokenPayloadParam() token: TokenPayloadDto) {
    const user = await this.usersService.getById(token.sub);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return {
      publicId: user.publicId,
      link: `favorites/public/${user.publicId}`,
    };
  }
}
