import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  create(createGroupDto: CreateGroupDto, userId: string) {
    return this.prisma.$transaction(async () => {
      // Criar o grupo
      const group = await this.prisma.group.create({
        data: createGroupDto,
      });

      // Adicionar o criador como ADMIN
      await this.prisma.userGroup.create({
        data: {
          userId,
          groupId: group.id,
          role: 'ADMIN',
        },
      });

      return group;
    });
  }

  findAll(userId: string) {
    return this.prisma.group.findMany({
      where: {
        userGroups: {
          some: {
            userId,
          },
        },
      },
      include: {
        userGroups: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.group.findFirst({
      where: {
        id,
        userGroups: {
          some: {
            userId,
          },
        },
      },
      include: {
        userGroups: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: string, updateGroupDto: UpdateGroupDto, userId: string) {
    // Verificar se o usuário é ADMIN do grupo
    return this.prisma.userGroup.findFirst({
      where: {
        groupId: id,
        userId,
        role: 'ADMIN',
      },
    }).then((userGroup) => {
      if (!userGroup) {
        throw new ForbiddenException('Apenas administradores podem editar o grupo');
      }

      return this.prisma.group.update({
        where: { id },
        data: updateGroupDto,
      });
    });
  }

  remove(id: string, userId: string) {
    // Verificar se o usuário é ADMIN do grupo
    return this.prisma.userGroup.findFirst({
      where: {
        groupId: id,
        userId,
        role: 'ADMIN',
      },
    }).then((userGroup) => {
      if (!userGroup) {
        throw new ForbiddenException('Apenas administradores podem deletar o grupo');
      }

      return this.prisma.group.delete({
        where: { id },
      });
    });
  }

  addUser(groupId: string, addUserDto: AddUserToGroupDto, adminUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Verificar se o usuário que está adicionando é ADMIN
      const adminUserGroup = await tx.userGroup.findFirst({
        where: {
          groupId,
          userId: adminUserId,
          role: 'ADMIN',
        },
      });

      if (!adminUserGroup) {
        throw new ForbiddenException('Apenas administradores podem adicionar usuários');
      }

      // Verificar se o usuário já está no grupo
      const existingUserGroup = await tx.userGroup.findUnique({
        where: {
          userId_groupId: {
            userId: addUserDto.userId,
            groupId,
          },
        },
      });

      if (existingUserGroup) {
        throw new ForbiddenException('Usuário já está no grupo');
      }

      // Adicionar usuário ao grupo
      return tx.userGroup.create({
        data: {
          userId: addUserDto.userId,
          groupId,
          role: addUserDto.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  removeUser(groupId: string, userId: string, adminUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Verificar se o usuário que está removendo é ADMIN
      const adminUserGroup = await tx.userGroup.findFirst({
        where: {
          groupId,
          userId: adminUserId,
          role: 'ADMIN',
        },
      });

      if (!adminUserGroup) {
        throw new ForbiddenException('Apenas administradores podem remover usuários');
      }

      // Verificar se o usuário está no grupo
      const userGroup = await tx.userGroup.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      if (!userGroup) {
        throw new NotFoundException('Usuário não está no grupo');
      }

      // Remover usuário do grupo
      return tx.userGroup.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });
    });
  }
}
