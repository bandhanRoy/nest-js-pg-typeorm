import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Phone } from './entities/phone.entity';
import { User } from './entities/user.entity';
import { MailerService } from '../../config/mail';
export declare class UserService {
    private readonly userRepository;
    private readonly phoneRepository;
    private readonly mailService;
    constructor(userRepository: Repository<User>, phoneRepository: Repository<Phone>, mailService: MailerService);
    create(createUserDto: CreateUserDto): Promise<boolean>;
    isTokenExpired(token: string): Promise<boolean>;
    activateLogin(token: string): Promise<boolean>;
    getUserDetails(filter: FindOneOptions<User>): Promise<User>;
}
