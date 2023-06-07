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
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { JwtGuard } from '../guards/jwt.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

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
  @Roles(Role.Admin)
  @UseGuards(JwtGuard)
  @Post('/role/:id')
  addRoleToUser(@Param('id') id: string, @Body() body: { roles: string[] }) {
    return this.userService.addRoleToUser(+id, body);
  }

  /**
   * 获取用户头像
   */
  @Get('/avatar/:id')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    const image = await this.userService.getAvatar(+id, res);

    // 确保流返回完全生成图片数据
    setTimeout(() => {
      return image;
    });
  }
}
