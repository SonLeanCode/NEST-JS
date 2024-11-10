import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Body,Post,Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/user.entity';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){ }
    @Post('register')
    register(@Body() registerUserDto:RegisterUserDto):Promise<User>{
        console.log(registerUserDto);
       return this.authService.register(registerUserDto)
        
    }
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto:LoginUserDto ):Promise<any>{
        return this.authService.login(loginUserDto)
    }
    @Post('refresh-token')
    refreshToken(@Body() {refresh_token}):Promise<any>{
        console.log('refresh');
        
      return this.authService.refreshToken(refresh_token)
        
    }

}
