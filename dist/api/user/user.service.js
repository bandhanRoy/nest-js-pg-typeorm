"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const logger_1 = require("../../config/logger");
const common_constants_1 = require("../../constants/common.constants");
const crypto_util_1 = require("../../utils/crypto.util");
const date_time_util_1 = require("../../utils/date_time.util");
const phone_entity_1 = require("./entities/phone.entity");
const user_entity_1 = require("./entities/user.entity");
const mail_1 = require("../../config/mail");
let UserService = class UserService {
    constructor(userRepository, phoneRepository, mailService) {
        this.userRepository = userRepository;
        this.phoneRepository = phoneRepository;
        this.mailService = mailService;
    }
    async create(createUserDto) {
        const addedUser = await this.getUserDetails({
            where: [
                {
                    email: createUserDto.email,
                    deletedAt: null,
                },
                { phone: createUserDto.phone, deletedAt: null, deletedBy: null },
            ],
        });
        if (addedUser)
            throw new common_1.ConflictException('User already exists');
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const phone = new phone_entity_1.Phone();
        phone.area_code = createUserDto.phone.area_code;
        phone.number = createUserDto.phone.number;
        const user = new user_entity_1.User();
        user.email = createUserDto.email;
        user.password = hashedPassword;
        user.phone = phone;
        const savedPhone = await this.phoneRepository.save(phone);
        if (!savedPhone)
            return false;
        const savedUser = await this.userRepository.save(user);
        if (!savedUser)
            return false;
        const tokenDetails = {
            type: common_constants_1.tokenType.ACTIVATE_LOGIN,
            payload: { userId: savedUser.uid.toString() },
            expires_in: Number((0, date_time_util_1.updateDateTime)(new Date(), '1h', 1, 'h').format('X')),
        };
        logger_1.logger.log(`${this.constructor.name}.create: Activation token : ${crypto_util_1.cryptoUtil.encrypt(JSON.stringify(tokenDetails))}`);
        await this.mailService.sendEmail(user.email, 'Activation Link', `http://localhost:3000/v1/api/user/activate?token=${crypto_util_1.cryptoUtil.encrypt(JSON.stringify(tokenDetails))}`);
        return true;
    }
    async isTokenExpired(token) {
        const tokenDetails = JSON.parse(token);
        if ((tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.type) !== common_constants_1.tokenType.ACTIVATE_LOGIN)
            return false;
        if ((tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.expires_in) * 1000 < new Date().getTime())
            return false;
        return true;
    }
    async activateLogin(token) {
        const decodedToken = crypto_util_1.cryptoUtil.decrypt(token);
        const isExpired = this.isTokenExpired(decodedToken);
        if (!isExpired)
            return false;
        const tokenDetails = JSON.parse(decodedToken).payload;
        const updateUser = await this.userRepository.update({
            uid: tokenDetails.userId,
            deletedAt: (0, typeorm_2.IsNull)(),
            isActive: false,
        }, {
            isActive: true,
            updatedBy: tokenDetails.userId,
        });
        return !!updateUser.affected;
    }
    async getUserDetails(filter) {
        return await this.userRepository.findOne(filter);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(phone_entity_1.Phone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_1.MailerService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map