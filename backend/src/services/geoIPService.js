const axios = require('axios');

/**
 * Service to fetch geolocation data from an IP address
 */
class GeoIPService {
    /**
     * Lookup geolocation data for a given IP
     * @param {string} ip 
     * @returns {Promise<Object>}
     */
    static async lookup(ip) {
        try {
            // In a production environment, you might use MaxMind's local database for speed and privacy.
            // For this implementation, we use a public API.
            // Note: localhost (127.0.0.1) will not return meaningful results from external APIs.

            if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
                return {
                    country: 'Localhost',
                    city: 'Local',
                    region: 'Local',
                    lat: 0,
                    lon: 0,
                    isp: 'Internal'
                };
            }

            const response = await axios.get(`http://ip-api.com/json/${ip}`);

            if (response.data && response.data.status === 'success') {
                return {
                    country: response.data.country,
                    countryCode: response.data.countryCode,
                    region: response.data.regionName,
                    city: response.data.city,
                    lat: response.data.lat,
                    lon: response.data.lon,
                    isp: response.data.isp
                };
            }

            return null;
        } catch (error) {
            console.error('GeoIP Lookup Error:', error.message);
            return null;
        }
    }
}

module.exports = GeoIPService;
