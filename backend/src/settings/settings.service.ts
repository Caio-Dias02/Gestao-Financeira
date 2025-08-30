import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDto & { userId: string }) {
    try {
      const existingSetting = await this.prisma.setting.findUnique({
        where: {
          userId_key: {
            userId: createSettingDto.userId,
            key: createSettingDto.key,
          },
        },
      });

      if (existingSetting) {
        throw new ConflictException('Configuração já existe para este usuário');
      }

      const setting = await this.prisma.setting.create({
        data: {
          key: createSettingDto.key,
          value: createSettingDto.value,
          userId: createSettingDto.userId,
        },
      });

      return {
        message: 'Configuração criada com sucesso',
        data: setting,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar configuração');
    }
  }

  async findAllByUser(userId: string) {
    const settings = await this.prisma.setting.findMany({
      where: { userId },
      orderBy: { key: 'asc' },
    });

    return {
      message: 'Configurações encontradas',
      data: settings,
    };
  }

  async findByKey(userId: string, key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuração não encontrada');
    }

    return {
      message: 'Configuração encontrada',
      data: setting,
    };
  }

  async updateByKey(userId: string, key: string, updateSettingDto: UpdateSettingDto) {
    await this.findByKey(userId, key);

    try {
      const setting = await this.prisma.setting.update({
        where: {
          userId_key: {
            userId,
            key,
          },
        },
        data: {
          value: updateSettingDto.value,
          updatedAt: new Date(),
        },
      });

      return {
        message: 'Configuração atualizada com sucesso',
        data: setting,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar configuração');
    }
  }

  async upsertSetting(userId: string, key: string, value: string) {
    try {
      const setting = await this.prisma.setting.upsert({
        where: {
          userId_key: {
            userId,
            key,
          },
        },
        update: {
          value,
          updatedAt: new Date(),
        },
        create: {
          key,
          value,
          userId,
        },
      });

      return {
        message: 'Configuração salva com sucesso',
        data: setting,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao salvar configuração');
    }
  }

  async removeByKey(userId: string, key: string) {
    await this.findByKey(userId, key);

    try {
      await this.prisma.setting.delete({
        where: {
          userId_key: {
            userId,
            key,
          },
        },
      });

      return {
        message: 'Configuração excluída com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao excluir configuração');
    }
  }

  async getDefaultSettings(userId: string) {
    const defaultSettings = [
      { key: 'theme', value: 'light' },
      { key: 'language', value: 'pt-BR' },
      { key: 'currency', value: 'BRL' },
      { key: 'dateFormat', value: 'DD/MM/YYYY' },
      { key: 'notifications', value: 'enabled' },
    ];

    const existingSettings = await this.prisma.setting.findMany({
      where: { userId },
    });

    const existingKeys = existingSettings.map(s => s.key);
    const settingsToCreate = defaultSettings.filter(s => !existingKeys.includes(s.key));

    if (settingsToCreate.length > 0) {
      await this.prisma.setting.createMany({
        data: settingsToCreate.map(setting => ({
          ...setting,
          userId,
        })),
      });
    }

    const allSettings = await this.prisma.setting.findMany({
      where: { userId },
      orderBy: { key: 'asc' },
    });

    return {
      message: 'Configurações padrão aplicadas',
      data: allSettings,
    };
  }
}