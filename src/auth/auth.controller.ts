import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUserDto } from './dto/sign-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() dto: SignUserDto) {
    const { username, password } = dto;
    return this.authService.signIn(username, password);
  }

  @Post('/signup')
  async signUp(@Body() dto: SignUserDto) {
    const { username, password } = dto;
    return this.authService.signUp(username, password);
  }
}
