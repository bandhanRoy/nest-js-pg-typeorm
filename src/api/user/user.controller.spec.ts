import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Phone),
          useClass: Repository,
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  //Test Create user
  describe('controller.create', () => {
    it('should return created user', async () => {
      const results = true;
      const createUserSpy = jest
        .spyOn(service, 'create')
        .mockImplementation(async () => Promise.resolve(results));
      expect(
        await controller.create({
          email: 'abc@gmail.com',
          phone: {
            area_code: '1234',
            number: '9880240955',
          },
          password: 'Tester@123',
          confirm_password: 'Tester@123',
        })
      ).toStrictEqual({
        message: 'User added successfully',
        result: null,
        statusCode: 201,
      });
      expect(createUserSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledTimes(1);
    });
  });
  //Test activate user
  describe('controller.activateLogin', () => {
    it('should activate user', async () => {
      const results = true;
      const activateUserSpy = jest
        .spyOn(service, 'activateLogin')
        .mockImplementation(async () => Promise.resolve(results));
      expect(await controller.activateLogin('Activation_String')).toStrictEqual(
        {
          message: 'User activated successfully',
          result: null,
          statusCode: 201,
        }
      );
      expect(activateUserSpy).toHaveBeenCalled();
      expect(activateUserSpy).toHaveBeenCalledTimes(1);
    });
  });
});
