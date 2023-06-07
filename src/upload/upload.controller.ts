import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { CreateUploadDto } from './dto/create-upload.dto';

@Controller('upload')
@UseInterceptors(new TransformInterceptor(CreateUploadDto))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传头像
   */
  @Post('/avatar/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@Param('id') id: string, @UploadedFile() file) {
    return this.uploadService.createOrUpdate(+id, file);
  }
}
