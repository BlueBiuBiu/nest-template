import { IsNotEmpty } from 'class-validator';

export class CreateUploadDto {
  // @IsNotEmpty()
  // readonly userId: string;

  @IsNotEmpty()
  readonly filename: string;

  @IsNotEmpty()
  readonly mimetype: string;

  @IsNotEmpty()
  readonly size: string;
}
