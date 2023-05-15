import { Phone } from './phone.entity';
export declare class User {
    uid: string;
    email: string;
    password: string;
    phone: Phone;
    isActive: boolean;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
    updateUID(): void;
}
