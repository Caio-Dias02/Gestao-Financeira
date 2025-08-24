import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {  
    // Validação dos dados recebidos
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
    
    if (!createUserDto.name) {
      throw new Error('Name is required');
    }
    
    if (!createUserDto.email) {
      throw new Error('Email is required');
    }
    
    console.log('Creating user with data:', {
      name: createUserDto.name,
      email: createUserDto.email,
      passwordLength: createUserDto.password?.length
    });
    
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
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return {
      message: 'User deleted successfully',
    };
  }
}