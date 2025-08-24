import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseUuidIdPipe } from 'src/commom/pipes/parse-uuid-id.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	me(@Req() req: any) {
		return req.user;
	}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(ParseUuidIdPipe)
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(ParseUuidIdPipe)
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(ParseUuidIdPipe)
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
