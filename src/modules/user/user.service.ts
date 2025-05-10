import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Users} from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {
    }

    async findOne(id: number): Promise<Users> {
        return this.usersRepository.findOneBy({id});
    }
}
