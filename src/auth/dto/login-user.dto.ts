import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
export class LoginUserDto{
    @ApiProperty()  // ĐỊNH NGHĨA DỮ LIỆU TRÊN SWAGGER  
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsNotEmpty()
    password:string;
}