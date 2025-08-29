import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      // Erro de email duplicado (Prisma error P2002)
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Este email já está em uso');
      }
      // Outros erros não esperados
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return {
      message: 'Users fetched successfully',
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };
  }

  async findOne(id: string) {       
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return {
      message: 'User fetched successfully',
      user,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    return {
      message: 'User fetched successfully',
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = {};
      
      if (updateUserDto.name) {
        updateData.name = updateUserDto.name;
      }
      
      if (updateUserDto.email) {
        updateData.email = updateUserDto.email;
      }
      
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      
      return {
        message: 'User updated successfully',
        user,
      };
    } catch (error) {
      // Usuário não encontrado (Prisma error P2025)
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      // Email duplicado (Prisma error P2002)
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Este email já está em uso');
      }
      // Outros erros
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      // Usuário não encontrado (Prisma error P2025)
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      // Outros erros (ex: constraint violations)
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }
}