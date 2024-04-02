import { Body, Controller, Post, Headers   } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn (
    @Headers('authorization') rawToken: string, 
    // @Body('email') email: string, 
    // @Body('password') password: string,
  ) {
    // email:password을 base64로 utf-8 형식으로 encoding하면 dXNlcjEwQGVtYWlsLmNvbToxMjM0MTIzNA== 같은 값이 나옴
    const token = this.authService.takeTokenFromHeader(rawToken, false) 
    const credentials = this.authService.decodeBasicToken(token); 
    return this.authService.signIn(credentials);
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
