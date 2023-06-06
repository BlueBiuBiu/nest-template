import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }

    const verifyPsw = await argon2.verify(user.password, password);

    if (!verifyPsw) {
      throw new ForbiddenException('用户名或者密码错误');
    }

    const token = await this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });

    return {
      statusCode: 200,
      access_token: token,
    };
  }

  async signUp(username: string, password: string) {
    const isExist = await this.userService.findOneByUsername(username);
    if (isExist) {
      throw new ForbiddenException('用户已存在');
    }

    const res = await this.userService.create({
      username,
      password,
    } as CreateUserDto);

    if (res) {
      return {
        statusCode: 200,
        message: '注册成功',
      };
    }
  }
}
