import { SuccessResponseType } from '../../@types';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<SuccessResponseType<null>>;
    activateLogin(token: string): Promise<SuccessResponseType<null>>;
}
