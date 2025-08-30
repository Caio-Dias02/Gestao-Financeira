import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() body: CreateSettingDto, @Req() req: any) {
    return this.settingsService.create({ ...body, userId: req.user.id });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.settingsService.findAllByUser(req.user.id);
  }

  @Get('defaults')
  getDefaults(@Req() req: any) {
    return this.settingsService.getDefaultSettings(req.user.id);
  }

  @Get(':key')
  findByKey(@Param('key') key: string, @Req() req: any) {
    return this.settingsService.findByKey(req.user.id, key);
  }

  @Put(':key')
  upsert(@Param('key') key: string, @Body() body: { value: string }, @Req() req: any) {
    return this.settingsService.upsertSetting(req.user.id, key, body.value);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() body: UpdateSettingDto, @Req() req: any) {
    return this.settingsService.updateByKey(req.user.id, key, body);
  }

  @Delete(':key')
  remove(@Param('key') key: string, @Req() req: any) {
    return this.settingsService.removeByKey(req.user.id, key);
  }
}