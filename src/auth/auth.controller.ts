import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn (
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signIn({
      email,
      password,
    }); 
  }

  @Post('signup')
  signUp (
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signUp({
      email,
      password,
    });
  }
}
