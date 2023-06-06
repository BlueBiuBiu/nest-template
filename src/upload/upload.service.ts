import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly userService: UserService,
  ) {}

  async createOrUpdate(id: number, uploadDto: CreateUploadDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return new NotFoundException('用户不存在');
    }

    const tempFile = await this.uploadRepository.find({ where: { user } });

    const tempObj = {
      filename: uploadDto.filename,
      mimetype: uploadDto.mimetype,
      size: uploadDto.size,
    } as CreateUploadDto;

    if (!tempFile.length) {
      // 没有用户头像时创建
      const upload = await this.uploadRepository.create(tempObj);
      const file = await this.uploadRepository.save(upload);
      file.user = user;
      return this.uploadRepository.save(file);
    } else {
      // 有用户头像则替换
      const newFile = this.uploadRepository.merge(tempFile[0], tempObj);
      return this.uploadRepository.save(newFile);
    }
  }
}
