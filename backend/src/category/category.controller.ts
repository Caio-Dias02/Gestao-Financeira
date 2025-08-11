import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() body: CreateCategoryDto, @Req() req: any) {
    return this.categoryService.create({ ...body, userId: req.user.id });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.categoryService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.categoryService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto, @Req() req: any) {
    return this.categoryService.update(req.user.id, id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.categoryService.remove(req.user.id, id);
  }
}


