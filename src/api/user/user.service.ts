import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import { logger } from '../../config/logger';
import { tokenType } from '../../constants/common.constants';
import { cryptoUtil } from '../../utils/crypto.util';
import { updateDateTime } from '../../utils/date_time.util';
import { CreateUserDto } from './dto/create-user.dto';
import { Phone } from './entities/phone.entity';
import { User } from './entities/user.entity';
import { MailerService } from '../../config/mail';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
    private readonly mailService: MailerService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const addedUser = await this.getUserDetails({
      where: [
        {
          email: createUserDto.email,
          deletedAt: null,
        },
        { phone: createUserDto.phone, deletedAt: null, deletedBy: null },
      ],
    });

    if (addedUser) throw new ConflictException('User already exists');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    // construct phone
    const phone = new Phone();
    phone.area_code = createUserDto.phone.area_code;
    phone.number = createUserDto.phone.number;
    // construct user
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.phone = phone;
    // save phone
    const savedPhone = await this.phoneRepository.save(phone);
    if (!savedPhone) return false;
    // save user
    const savedUser = await this.userRepository.save(user);
    if (!savedUser) return false;
    // generate unique activation token

    const tokenDetails = {
      type: tokenType.ACTIVATE_LOGIN,
      payload: { userId: savedUser.uid.toString() },
      expires_in: Number(updateDateTime(new Date(), '1h', 1, 'h').format('X')),
    };
    // TODO: send activation link

    logger.log(
      `${this.constructor.name}.create: Activation token : ${cryptoUtil.encrypt(
        JSON.stringify(tokenDetails)
      )}`
    );
    await this.mailService.sendEmail(
      user.email,
      'Activation Link',
      `http://localhost:3000/v1/api/user/activate?token=${cryptoUtil.encrypt(
        JSON.stringify(tokenDetails)
      )}`
    );

    return true;
  }

  // this token is the decrypted activation token
  async isTokenExpired(token: string): Promise<boolean> {
    const tokenDetails = JSON.parse(token);
    if (tokenDetails?.type !== tokenType.ACTIVATE_LOGIN) return false;
    // check if token is expired
    if (tokenDetails?.expires_in * 1000 < new Date().getTime()) return false;
    return true;
  }

  async activateLogin(token: string): Promise<boolean> {
    const decodedToken = cryptoUtil.decrypt(token);
    const isExpired = this.isTokenExpired(decodedToken);
    if (!isExpired) return false;
    const tokenDetails = JSON.parse(decodedToken).payload;
    const updateUser = await this.userRepository.update(
      {
        uid: tokenDetails.userId,
        deletedAt: IsNull(),
        isActive: false,
      },
      {
        isActive: true,
        updatedBy: tokenDetails.userId,
      }
    );
    return !!updateUser.affected;
  }

  async getUserDetails(filter: FindOneOptions<User>) {
    return await this.userRepository.findOne(filter);
  }
}
