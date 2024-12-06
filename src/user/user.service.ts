import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userReponsitory:Repository<User>){}
    //get
    async findAll(query:FilterUserDto):Promise<any>{
        const item_per_page = Number(query.item_per_page) || 10 
        const page =Number(query.page) || 1
        const skip = (page - 1) * item_per_page
        const search = query.search || '';
           const  [result , total] = await  this.userReponsitory.findAndCount({
            //  sử dụng findAndCount ngoài  trả về cái reslut nó còn trả về cái total nữa  tức là tổng số phần tử 
            // trong  csdl
            where:[
                {frist_name:Like('%' + search + '%')},
                {last_name:Like('%' + search + '%')},
                {email:Like('%' + search + '%')},

            ],
            order:{create_at:"DESC"}, // sắp xếp giảm dần , cái nào mới nhất dc dưa lên đầu
            take:item_per_page,  // lấy sl item show ra mỗi trang
            skip:skip,
            select:['id','frist_name','last_name','email','status']
})
        const lastPage =  Math.ceil(total/item_per_page); // tổng số trang 
        const nextPage =  page + 1 > lastPage ? null : page + 1
        const prevPage =  page - 1 < 1 ? null : page - 1 
        return{
            data:result,
            total,
            crrentPage:page,
            nextPage,
            prevPage,
            lastPage
        }
    }
    // get:id   
    async findOne(id:number):Promise<User>{
        return await this.userReponsitory.findOneBy({id})
    }
    //post
    async create( createUserDto:CreateUserDto):Promise<User>{
        await bcrypt.hash(createUserDto.password,10)
        return this.userReponsitory.save(createUserDto)
    }
    //put 
    async update(id:number,updateUserDto:UpdateUserDto):Promise<UpdateResult>{
            return await this.userReponsitory.update(id,updateUserDto)
    }
    //delete
    async delete(id:number):Promise<DeleteResult>{
        return await this.userReponsitory.delete(id)
    }
    async updateAvatar(id:number,avatar:string):Promise<UpdateResult>{
        return await   this.userReponsitory.update(id,{avatar})
    }

}
