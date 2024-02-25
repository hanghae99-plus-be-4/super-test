import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { User } from './entities/user.entity';
import {CreateUserDto} from "./dto/create-user.dto";


@Injectable()
export class UserService {
    private readonly users: User[] = [];

    private validCreateDto = (dto: CreateUserDto) : Boolean => {
        return !(dto.name == 'err');

    }
    private userCreateDtoToEntity = (dto: CreateUserDto) : User => {
        if(!this.validCreateDto(dto)) return null;

        let user = new User();
        user.email = dto.email;
        user.name = dto.name;
        user.password = dto.password;
        return user;
    }

    async create(createUserDto: CreateUserDto) : Promise<User>{
        let user = this.userCreateDtoToEntity(createUserDto);
        if(!!user){
            this.users.push(user);
            return user;
        }else{
            throw new NotFoundException()
        }

    }

    async findAll(): Promise<User[]> {
        return this.users;
    }
}