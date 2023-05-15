import * as bcrypt from 'bcrypt';
import * as shortUUID from 'short-uuid';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../../src/api/user/dto/update-user.dto';
import { Phone } from '../../src/api/user/entities/phone.entity';
import { User } from '../../src/api/user/entities/user.entity';
import { tokenType } from '../../src/constants/common.constants';
import { cryptoUtil } from '../../src/utils/crypto.util';
import { updateDateTime } from '../../src/utils/date_time.util';

export const createNewUser = async (
  userRepository: Repository<User>,
  phoneRepository: Repository<Phone>,
  userPayload: UpdateUserDto
): Promise<User> => {
  const phoneRepoReturn = await phoneRepository.query(
    'INSERT INTO "phone" ("area_code","number") VALUES($1,$2) RETURNING id',
    [userPayload.phone.area_code, userPayload.phone.number]
  );
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(userPayload.password, salt);
  const userRepoReturn = await userRepository.query(
    'INSERT INTO "user" ("uid","email","password","phoneId") VALUES($1,$2,$3,$4) RETURNING *',
    [
      shortUUID.generate(),
      userPayload.email,
      hashedPassword,
      phoneRepoReturn[0]['id'],
    ]
  );

  return userRepoReturn[0];
};

export const getActivationToken = async (uid: string): Promise<string> => {
  const mockTokenDetails = {
    type: tokenType.ACTIVATE_LOGIN,
    payload: { userId: uid },
    expires_in: Number(updateDateTime(new Date(), '1h', 1, 'h').format('X')),
  };
  return cryptoUtil.encrypt(JSON.stringify(mockTokenDetails));
};
