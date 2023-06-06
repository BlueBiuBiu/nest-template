import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  @Exclude()
  readonly password: string;

  @IsOptional()
  readonly sex: string;

  @IsOptional()
  readonly avatar: string;
}
