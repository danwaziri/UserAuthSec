import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Get the unique device fingerprint
 * @returns {Promise<string>}
 */
export const getDeviceFingerprint = async (): Promise<string> => {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Error getting device fingerprint:', error);
        return 'unknown';
    }
};
