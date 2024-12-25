import storage from 'electron-json-storage'

interface StoragePayload {
    license: string;
}

export default class LicenseStorage {
    /**
     * Save license into storage.
     * 
     * @param {string} license 
     * @returns {Promise<void>}
     */
    async saveLicense(license: any): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.set('app-license', { license }, (error: any) => {
                if (error) {
                    return reject(error);
                }

                resolve();
            });
        });
    }

    /**
     * Get license from storage.
     * 
     * @returns {Promise<string|null>}
     */
    async getLicense(): Promise<string|null> {
        return new Promise((resolve, reject) => {
            storage.get('app-license', (error, data) => {
                if (error) {
                    return reject(error);
                }

                if (!data) {
                    resolve(null);
                }

                const { license } = data as StoragePayload;

                resolve(license);
            });
        });
    }


    /**
     * Remove license from storage.
     * 
     * @returns {Promise<void>}
     */
    async removeLicense(): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.remove('app-license', (error) => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }
}