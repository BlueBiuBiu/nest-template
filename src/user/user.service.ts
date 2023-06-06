import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleService } from '../role/role.service';
import { Roles } from '../role/entities/role.entity';

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

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: { roles: true },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
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
}
