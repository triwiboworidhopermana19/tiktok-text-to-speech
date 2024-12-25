import crypto from 'crypto';
import moment from 'moment-timezone'
import LicenseStorage from './license-storage'

/**
 * The license payload.
 */
export interface LicensePayload {
    /**
     * The timezone when the license is sign-in.
     */
    timezone: string;

    /**
     * The date & time when the license is expired.
     */
    expiredAt: string | Date;
}

export default class LicenseChecker {
    /**
     * The decryptor object of license checker.
     */
    protected readonly decryptor: Decryptor;

    /**
     * The license storage object to obtain license.
     */
    protected readonly licenseStorage: LicenseStorage;

    /**
     * Create a new license checker instance.
     * 
     * @param {string} publicKey 
     * @param {LicenseStorage} licenseStorage 
     */
    constructor(publicKey: string, licenseStorage: LicenseStorage) {
        this.decryptor = new Decryptor(publicKey);
        this.licenseStorage = licenseStorage;
    }

    /**
     * Check the validity of license.
     * 
     * @param {string} license
     * @returns {Promi<boolean>} 
     */
    async isValid(license: string): Promise<boolean> {
        try {
            const payload = JSON.parse(this.decryptor.decrypt(license)) as LicensePayload

            if (!payload || Object.keys(payload).length === 0) {
                return false
            }

            const result = moment().tz(payload.timezone).isBefore(moment(payload.expiredAt));

            if (!result) {
                await this.licenseStorage.removeLicense();
            }

            return result;
        } catch (error) {
            return false;
        }
    }
}

export class Encryptor {
    /**
    * Create a new encryptor instance.
    * 
    * @param {string} privateKey Private key for encryption.
    */
    constructor(private privateKey: string) { }

    /**
     * Encrypts a given payload using the provided private key.
     *
     * This method utilizes RSA private key cryptography to securely encrypt
     * an object. The object is first serialized into a JSON string, converted 
     * into a Buffer, and then encrypted using the private key. The resulting 
     * encrypted data is returned as a base64-encoded string.
     *
     * @param {object} payload - The object to encrypt.
     * @returns {string} - The base64-encoded encrypted data.
     * @throws {Error} - If encryption fails due to invalid input or key.
     */
    public encrypt(payload: object): string {
        try {
            const serializedPayload = JSON.stringify(payload);
            const encryptedBuffer = crypto.privateEncrypt(
                this.privateKey,
                Buffer.from(serializedPayload, 'utf-8')
            );
            return encryptedBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }
}

export class Decryptor {
    /**
     * Create a new decryptor instance.
     * 
     * @param {string} publicKey Public key for decryption.
     */
    constructor(private publicKey: string) { }

    /**
     * Decrypts a given signature using the provided public key.
     *
     * This method leverages RSA public key cryptography to decrypt a string 
     * that was likely encrypted with a corresponding private key. It converts 
     * the input signature into a Buffer, decrypts it using the public key, 
     * and returns the resulting plaintext as a UTF-8 string.
     *
     * @param {string} signature - The encrypted string to decrypt.
     * @returns {string} - The decrypted plaintext as a UTF-8 string.
     * @throws {Error} - If decryption fails due to invalid input or key.
     */
    public decrypt(signature: string): string {
        try {
            const decryptedBuffer = crypto.publicDecrypt(
                this.publicKey,
                Buffer.from(signature, 'base64')
            );
            return decryptedBuffer.toString('utf-8');
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}