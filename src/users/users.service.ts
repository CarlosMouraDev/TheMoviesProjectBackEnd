import {
  ConflictException,
  ForbiddenException,
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

  // Creates an user accordingly to provided data
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

  // Return user info found by email
  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  // Return user info found by id
  async getById(id: number) {
    const user = prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  // Return user info found by public id
  async getByPublicId(publicId: string) {
    const user = await prisma.user.findUnique({
      where: { publicId },
      select: { id: true, name: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  // Updates password if password provided matches with current password
  async updatePassword(
    currentPassword: string,
    newPassword: string,
    userId: number,
  ) {
    const user = await this.getById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const isPasswordValid = await this.hashingService.compare(
      currentPassword,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Senha incorreta.');
    }

    const hashedPassword = await this.hashingService.hash(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
