import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleService } from '../role/role.service';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const temp = this.userRepository.create(createUserDto);
    temp.password = await argon2.hash(temp.password);
    return this.userRepository.save(temp);
  }

  findAll() {
    return this.userRepository.find({
      relations: { roles: true },
    });
  }

  async findOneByUsername(username: string) {
    const res = await this.userRepository.findOne({
      where: { username },
      relations: { roles: true },
    });

    if (!res) {
      throw new NotFoundException('用户不存在');
    }

    return res;
  }

  async findOne(id: number) {
    const res = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true, avatar: true },
    });

    if (!res) {
      throw new NotFoundException('用户不存在');
    }

    return res;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userOld = await this.findOne(id);
    if (!userOld) {
      throw new NotFoundException('用户不存在');
    }

    const newUser = await this.userRepository.merge(userOld, updateUserDto);
    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return this.userRepository.remove(user);
  }

  async addRoleToUser(id: number, body: { roles: string[] }) {
    const { roles } = body;
    const user = await this.findOne(id);

    roles.map(async (item: string) => {
      const role = await this.roleService.findOneBname(item);

      if (!user.roles.some((iten: any) => iten.name === item)) {
        user.roles.push(role);
      }
    });

    return await this.userRepository.save(user);
  }

  async getAvatar(id: number, res: any) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 未上传头像
    if (!user.avatar) {
      return '';
    }

    res.set({
      'content-type': user.avatar.mimetype,
    });
    const file = fs.createReadStream(
      `${process.cwd()}/uploads/${user.avatar.filename}`,
    );

    return file.pipe(res);
  }
}
