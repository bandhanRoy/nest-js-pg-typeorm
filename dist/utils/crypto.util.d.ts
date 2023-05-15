export declare const cryptoUtil: {
    encrypt: (msg: string, algorithm?: string, ivLength?: number, key?: string) => string;
    decrypt: (encodedCipher: string, algorithm?: string, key?: string) => string;
};
