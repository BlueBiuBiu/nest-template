import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
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

    let token = await this.redis.get(user.username);

    if (!token) {
      token = await this.jwtService.sign({
        username: user.username,
        sub: user.id,
      });
      await this.redis.set(user.username, token);
    }

    // 设置token

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

  /**
   * #官网 https://docs.nestjs.cn/9/techniques?id=%e5%ae%9a%e6%97%b6%e4%bb%bb%e5%8a%a1
   * 定时任务
   */
  @Interval(2000)
  handleExpired() {
    console.log('每两秒执行一次');
  }
}
