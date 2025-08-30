import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() body: CreateReportDto, @Req() req: any) {
    return this.reportsService.create({ ...body, userId: req.user.id });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.reportsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.reportsService.findOne(req.user.id, id);
  }

  @Post(':id/generate')
  generateData(@Param('id') id: string, @Req() req: any) {
    return this.reportsService.generateReportData(req.user.id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateReportDto, @Req() req: any) {
    return this.reportsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reportsService.remove(req.user.id, id);
  }
}