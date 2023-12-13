const request = require("supertest");
const { app, server } = require("../index.js");

describe("GET Users by Id", () => {
    it("should return a user by ID", async () => {
      const userId = "Z1KiPS9E4JDuGXG5T91Q";
      const response = await request(app).get(`/api/users/${userId}`);

      console.log("Response Status:", response.status);
      console.log("Response Body:", response.body);

      expect(response.status).toBe(200);

      const expectedResponseBody = {
        message: "Successfully retrieved user data by ID!",
        status: 200,
        data: {
          username: expect.any(String),
          email: expect.any(String),
          domicile: expect.any(String),
          birthDate: expect.any(String),
        }
      };

      expect(response.body).toEqual(expectedResponseBody);
    }, 10000);
  });

afterAll((done) => {
  server.close(() => {
    console.log("Server closed");
    done();
  });
});
