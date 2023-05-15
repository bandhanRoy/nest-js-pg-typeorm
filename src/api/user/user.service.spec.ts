import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as shortUUID from 'short-uuid';
import { Repository } from 'typeorm';
import { cryptoUtil } from '../../utils/crypto.util';
import { Phone } from './entities/phone.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let phoneRepository: Repository<Phone>;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const PHONE_REPOSITORY_TOKEN = getRepositoryToken(Phone);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PHONE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    phoneRepository = module.get<Repository<Phone>>(PHONE_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('phoneRepository should be defined', () => {
    expect(phoneRepository).toBeDefined();
  });

  describe('userService.create', () => {
    const userPayload = {
      email: 'bandhan.roy1@gmail.com',
      phone: {
        area_code: '+91',
        number: '0123456789',
      },
      password: 'Password@1234',
      confirm_password: 'Password@1234',
    };

    it('should create an user with an encrypted password', async () => {
      const saltMock = jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(
          async (_rounds, _minor) => await Promise.resolve('random_salt')
        );
      const bcryptMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          async (_pass, _salt) => await Promise.resolve('hashedPassword')
        );
      await service.create(userPayload);
      expect(bcryptMock).toBeCalled();
      expect(saltMock).toBeCalled();
      expect(bcryptMock).toBeCalledTimes(1);
      expect(saltMock).toBeCalledTimes(1);
      expect(bcryptMock).toBeCalledWith(userPayload.password, 'random_salt');
    });

    it('should create an user', async () => {
      const bcryptMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          async (_pass, _salt) => await Promise.resolve('hashedPassword')
        );
      const userUID = shortUUID.generate();
      const phoneRepoMock = jest
        .spyOn(phoneRepository, 'save')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            area_code: userPayload.phone.area_code,
            number: userPayload.phone.number,
          })
        );
      const userRepoMock = jest
        .spyOn(userRepository, 'save')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            uid: userUID,
            email: 'bandhan.roy1@gmail.com',
            password: 'hashedPassword',
            createdAt: new Date(),
            createdBy: userUID,
            isActive: true,
            phone: new Phone(),
          })
        );
      const createdData = await service.create(userPayload);
      expect(bcryptMock).toBeCalled();
      expect(createdData).toBe(true);
      expect(userRepoMock).toBeCalled();
      expect(phoneRepoMock).toBeCalled();
    });

    it('should throw conflict exception', async () => {
      try {
        const userUID = shortUUID.generate();
        const userRepoMock = jest
          .spyOn(userRepository, 'findOne')
          .mockReturnValueOnce(
            Promise.resolve({
              id: 1,
              uid: userUID,
              email: 'bandhan.roy1@gmail.com',
              password: 'hashedPassword',
              createdAt: new Date(),
              createdBy: userUID,
              isActive: true,
              phone: new Phone(),
            })
          );
        await service.create(userPayload);
        expect(userRepoMock).toBeCalled();
        expect(userRepoMock).toBeCalledWith({
          where: [
            {
              email: userPayload.email,
              deletedAt: null,
            },
            { phone: userPayload.phone, deletedAt: null, deletedBy: null },
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });
  describe('userService.activateLogin', () => {
    const utilOutput = JSON.stringify({
      type: 'activate_login',
      payload: { userId: 'pBW5Az8AKoG9yDojCHaJGF' },
      expires_in: 1674996705,
    });
    const token = 'Token';
    it('should activate user', async () => {
      const utilMock = jest
        .spyOn(cryptoUtil, 'decrypt')
        .mockImplementation((_token) => {
          return utilOutput;
        });
      const updateMock = jest
        .spyOn(userRepository, 'update')
        .mockReturnValue(
          Promise.resolve({ generatedMaps: [], raw: [], affected: 1 })
        );
      const activateUser = await service.activateLogin(token);

      expect(utilMock).toBeCalled();
      expect(updateMock).toBeCalled();
      expect(activateUser).toBe(true);
    });
  });
});
