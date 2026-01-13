const axios = require('axios');

// Test CJ API Key
const CJ_API_KEY = 'CJ4993440@api@160f4bee24334291a076be12cf3450fd';
const CJ_API_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

async function testCJAuth() {
    try {
        console.log('🔑 Testing CJ API Key...');
        console.log('API Key:', CJ_API_KEY);

        const response = await axios.post(
            `${CJ_API_URL}/authentication/getAccessToken`,
            {
                apiKey: CJ_API_KEY,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }
        );

        console.log('✅ Success!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Failed!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testCJAuth();
