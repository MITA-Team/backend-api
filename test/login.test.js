const axios = require('axios');

const base_url = 'http://34.128.115.4';
let token = null; // Token akan diset setelah login berhasil

describe('Authentication Tests', () => {
  test('POST login should return a valid token', async () => {
    const loginResponse = await axios.post(`${base_url}/api/users/login`, {
      identifier: 'yanto@gmail.com',
      password: '12345678',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.message).toBe('Login successfully');
    expect(loginResponse.data.token).toBeTruthy();

    // Set the token for the next request
    token = loginResponse.data.token;
  });

  test('POST logout should return a success message', async () => {
    // Ensure that the token is set before making the request
    expect(token).toBeTruthy();

    const logoutResponse = await axios.post(`${base_url}/api/users/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.data.message).toBe('Logout successful');
  });
});
