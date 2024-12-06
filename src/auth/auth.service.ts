import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
        //repository cung cấp   các phương thức như find(), save(), update(), v.v., để thực hiện các thao tác cơ sở dữ liệu.
        private jwtService:JwtService,
        private configService:ConfigService
    ){}
    async register(registerUserDto:RegisterUserDto):Promise<User>{
        const hashPassword = await this.hashPassword(registerUserDto.password)
        return  await this.userRepository.save({...registerUserDto, refresh_token:"refresh",password:hashPassword})
    } 
    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne(
            {
                where:{email:loginUserDto.email}
            }
        )
        if(!user){
            throw new HttpException("Email is not exits 1",HttpStatus.UNAUTHORIZED)
        }
        const checkPassword  = bcrypt.compareSync(loginUserDto.password, user.password)
        if(!checkPassword){
            throw new HttpException("password is not correct",HttpStatus.UNAUTHORIZED)
        }
         // generate access token and  refresh token 
         const payload = {id:user.id,email:user.email}
         return this.generateToken(payload)
        }
        async refreshToken(refresh_token: string): Promise<any> {
            console.log('Refresh token:', refresh_token);
            try {
              const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET'),
              });
              console.log('Verified token:', verify);
              const checkExistToken =  await this.userRepository.findOneBy({email:verify.email,refresh_token})
              if(checkExistToken){
                return this.generateToken({id:verify.id,email:verify.email})
              }else{
                throw new HttpException('Refresh token is not valid',HttpStatus.BAD_REQUEST)
              }
            } catch (error) {
              console.error('Error verifying token:', error);  // Thêm log lỗi để kiểm tra
            }
          }
    // private Chỉ có thể truy cập phương thức hoặc biến này từ bên trong lớp đó.
    private  async generateToken(payload:{id:number,email:string}){
    // access_token(ngắn hạn)
       const acess_token  =  await  this.jwtService.signAsync(payload)
    //   refresh_token(dài hạn)  giúp người dùng không phải đăng nhập lại sau khi access token hết hạn. và lưu vào trong 
    // bảng dữ liệu: giúp kiểm tra xem tính hợp lệ của refresh token,coi nó đã hết hạn ch 
    // , refresh_token nếu nó còn hạn  thì  sử dụng nó tạo ra 1 accesstoken mới  và ngược lại
       const refresh_token = await this.jwtService.signAsync(payload,{
        secret: this.configService.get<string>('SECRET'),
        expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
       })
       await this.userRepository.update(
        {email:payload.email},
        {refresh_token:refresh_token}
       )
       return {acess_token , refresh_token}
    }
    private async hashPassword(password:string):Promise<string>{
        const saltRound = 10;
        const pass = await  bcrypt.genSalt(saltRound) //  genSalt là phương thức tạo ra chuỗi ngẫu nhiên 
        const hash = await bcrypt.hash(password,pass) // hash là bâm 
        return hash
    }
}
