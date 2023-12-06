const request = require("supertest");
const { app, server } = require("../index.js");

describe("GET All User", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/user/all");
    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const expectedResponseBody = {
      message: "Successfully retrieved user data!",
      status: 200,
      data: {
        user: expect.arrayContaining([
          expect.objectContaining({
            uid: expect.any(String),
            email: expect.any(String),
            emailVerified: expect.any(Boolean),
            disabled: expect.any(Boolean),
          }),
        ]),
      },
    };

    expect(response.body).toEqual(expectedResponseBody);
  }, 10000);
});

describe("GET User by Id", () => {
  it("should return a user by ID", async () => {
    const userId = "JUCtlnRoDqbRMFc2OO4IwzitcMa2";
    const response = await request(app).get(`/api/user/${userId}`);
    expect(response.status).toBe(200);

    const expectedResponseBody = {
      message: "Successfully retrieved user data by ID!",
      status: 200,
      data: {
        user: expect.objectContaining({
          uid: userId,
          email: expect.any(String),
          emailVerified: expect.any(Boolean),
          disabled: expect.any(Boolean),
        }),
      },
    };

    expect(response.body).toEqual(expectedResponseBody);
  }, 10000);
});

afterAll((done) => {
  server.close(() => {
    console.log('Server closed');
    done();
  });
});
