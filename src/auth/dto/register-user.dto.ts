import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    // file dto này  dùng để xác định  cấu trúc dữ liệu   của output , input 
    @ApiProperty()  
    frist_name:string;
    @ApiProperty()  
        last_name:string;
        @ApiProperty()  
        email:string;
        @ApiProperty()  
        password:string;
        @ApiProperty()  
        status:number
}