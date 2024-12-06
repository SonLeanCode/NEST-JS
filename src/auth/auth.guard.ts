import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate{
    //canActive có nhiệm vụ   req  có tiếp tục đi tiếp vào controller hay kh nếu true, thì tiếp tục nếu false thì từ chối
    constructor(private jwtService:JwtService, private configService:ConfigService){}
    async canActivate(context: ExecutionContext):Promise<boolean>{
        const  request =context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request)
        if(!token){ 
            throw new UnauthorizedException()
        }
        try{
            const payload = await this.jwtService.verifyAsync(token,{
            secret:this.configService.get<string>('SECRET') // cho  nó thêm secret  ở đây là khi gửi lên server  đảm bảo thông 
            // tin nó sẽ không thay đỏi 
            // và khi gửi lên server nó sẽ tách ra 3 cái là header , payload , sercet  kiểm tra coi có hop lệ hay kh  
            // secret   +  header(mã hóa)  + payload(mã hóa) - >  signature
            //và  thêm dòng  secret:this.configService.get<string>('SECRET')  này  giúp server kiểm tra xem 
            //signature trong token với signature server 
            })
            request['user_data'] = payload
        }catch{
            throw new UnauthorizedException()
        }
        return true
    }
    private extractTokenFromHeader(request:Request):string|undefined{
        const[type,token] =  request.headers.authorization ? request.headers.authorization.split(' ') : [];
        return type === 'Bearer' ? token : undefined
    }
}