import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('user')
@UseInterceptors(new TransformInterceptor(CreateUserDto))
@UseFilters(TypeormFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  /**
   * 给用户添加权限
   */
  @Post('/role/:id')
  addRoleToUser(@Param('id') id: string, @Body() body: { roles: string[] }) {
    return this.userService.addRoleToUser(+id, body);
  }
}
