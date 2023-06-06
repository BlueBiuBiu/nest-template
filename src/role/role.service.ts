import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles) private readonly roleRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const isExist = await this.findOneBname(createRoleDto.name);
    if (isExist) {
      throw new ForbiddenException('权限已存在');
    }

    const temp = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(temp);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOneBname(name: string) {
    return this.roleRepository.findOne({
      where: { name },
    });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const roleOld = await this.findOne(id);
    if (!roleOld) {
      throw new NotFoundException('用户不存在');
    }

    const newRole = await this.roleRepository.merge(roleOld, updateRoleDto);
    return this.roleRepository.save(newRole);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('用户不存在');
    }

    return this.roleRepository.remove(role);
  }
}
