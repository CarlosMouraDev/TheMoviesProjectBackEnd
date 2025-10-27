import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users/register
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  // GET /users/public-link
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

  // GET /users/info
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@TokenPayloadParam() token: TokenPayloadDto) {
    const user = await this.usersService.getById(token.sub);
    return {
      name: user?.name,
      email: user?.email,
    };
  }

  // PATCH /users/password
  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @TokenPayloadParam() token: TokenPayloadDto,
  ) {
    return this.usersService.updatePassword(
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
      token.sub,
    );
  }
}
