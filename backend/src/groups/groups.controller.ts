import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseUuidIdPipe } from '../commom/pipes/parse-uuid-id.pipe';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    return this.groupsService.create(createGroupDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @UsePipes(ParseUuidIdPipe)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.groupsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UsePipes(ParseUuidIdPipe)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @Req() req: any) {
    return this.groupsService.update(id, updateGroupDto, req.user.id);
  }

  @Delete(':id')
  @UsePipes(ParseUuidIdPipe)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.groupsService.remove(id, req.user.id);
  }

  @Post(':id/users')
  @UsePipes(ParseUuidIdPipe)
  addUser(@Param('id') id: string, @Body() addUserDto: AddUserToGroupDto, @Req() req: any) {
    return this.groupsService.addUser(id, addUserDto, req.user.id);
  }

  @Delete(':id/users/:userId')
  @UsePipes(ParseUuidIdPipe)
  removeUser(@Param('id') id: string, @Param('userId') userId: string, @Req() req: any) {
    return this.groupsService.removeUser(id, userId, req.user.id);
  }
}
