import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard)

    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'item_per_page' })
    @ApiQuery({ name: 'search' })

    @Get()
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        console.log(query);

        return this.userService.findAll(query)
    }
    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(Number(id))
    }
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto)

    }
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(Number(id), updateUserDto)
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(Number(id))
    }
    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar', {
        // client gửi request upload file (thường là dạng multipart/form-data), FileInterceptor
        storage: storageConfig('avatar'),
        // fileFilter chạy đầu tiên  kiểm tra loại file và kích thước trước khi lưu trữ 
        fileFilter: (req, file, cb) => {
           const ext  = extname(file.originalname); // extname lấy đuôi tên file 
           const allowedExtArr = ['.jpg','.png','.jpeg'];
           if(!allowedExtArr.includes(ext)){
            req.fileValidationError = ` Wrong   extenstion type. Accepted file ext are: ${allowedExtArr.toString()}`
            cb(null,false)
           }else{
            const  fileSize = parseInt(req.headers['content-length'])  
            if(fileSize > 1024 * 1024 * 5){
                req.fileValidationError = `File  size is too large . Accepted file size is less than  5 MB`;
                cb(null,false)
            }else{
                cb(null,true)
            }
           }
        }
    }))

    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) { 
        //@Req(): Dùng để truy xuất toàn bộ đối tượng request, bao gồm :headers, params, query string, file uploads,body
        // @UploadedFile()  nhận file từ request  ở hàm xử lý  FileInterceptor
        // Express.Multer.File nó sẽ nhận lại đối tượng từ  @UploadedFile() bao gồm  : 
        // : destination,__filename,originalname ,size ,path...
        console.log("upload avt");
        console.log("uuser", req.user_data);
        console.log(file);
        // sở dĩ có hàm if này là do   mặc dù multer nó đã báo lỗi ở trên rồi nhưng mà  báo lỗi ở trên thằng req.fileValidationError 
        //  nó  kh ném ra lỗi HTPP kh hiển thị  cho ng dùng xem dc 
        //   nên để  nếu lỡ có lỗi gì  thì phải ném lỗi cho   cho ng dùng biết bằng  BadRequestException    
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(!file){
            throw new BadRequestException('File is required !')
        }
        this.userService.updateAvatar(req.user_data.id, file.destination + `/` + file.filename)

    }


}
