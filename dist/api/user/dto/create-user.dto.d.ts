declare class Phone {
    readonly area_code: string;
    readonly number: string;
}
export declare class CreateUserDto {
    email: string;
    phone: Phone;
    password: string;
    confirm_password: string;
}
export {};
