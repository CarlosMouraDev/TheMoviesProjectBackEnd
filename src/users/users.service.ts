import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { PrismaClient } from 'generated/prisma';
import { NotFoundError } from 'rxjs';
import { LoginDto } from './dto/login.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private readonly hashingService: HashingService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashed = await this.hashingService.hash(createUserDto.password);
    return prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });
  }

  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async login(body: LoginDto) {
    const user = await this.getByEmail(body.email);

    const match = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!match) throw new UnauthorizedException('Senha incorreta');

    return { message: 'Login bem-sucedido', userId: user.id };
  }
}
