import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private readonly hashingService: HashingService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) throw new ConflictException('Email já registrado');

    const hashed = await this.hashingService.hash(createUserDto.password);
    await prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });

    return { message: 'Usuário criado' };
  }

  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async getById(id: number) {
    const user = prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  async getByPublicId(publicId: string) {
    const user = await prisma.user.findUnique({
      where: { publicId },
      select: { id: true, name: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }
}
