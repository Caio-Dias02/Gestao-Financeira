import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, CategoryType } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCategoryDto & { userId: string }) {
    const category = await this.prisma.category.create({
      data: {
        name: input.name,
        type: input.type as CategoryType,
        color: input.color,
        icon: input.icon,
        userId: input.userId,
      },
    });

    return { message: 'Category created', category };
  }

  async findAllByUser(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { message: 'Categories fetched', categories };
  }

  async findOne(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException('Category not found');
    return { message: 'Category fetched', category };
  }

  async update(userId: string, id: string, input: UpdateCategoryDto) {
    const existing = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Category not found');

    const category = await this.prisma.category.update({
      where: { id },
      data: { ...input },
    });
    return { message: 'Category updated', category };
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Category not found');
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}


