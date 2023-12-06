const request = require("supertest");
const { app, server } = require("../index.js");

describe("GET All Therapy", () => {
  it("should return all therapy", async () => {
    const response = await request(app).get("/api/therapy/all");
    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const expectedResponseBody = {
      message: "Successfully retrieved therapy data!",
      status: 200,
      data: {
        therapy: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            data: expect.objectContaining({
              therapy: expect.any(String),
              description: expect.arrayContaining([expect.any(String)]),
              category: expect.any(String),
              type: expect.arrayContaining([expect.any(String)]),
            }),
          }),
        ]),
      },
    };

    expect(response.body).toEqual(expectedResponseBody);
  }, 10000);
});

describe("GET Therapy by Id", () => {
  it("should return a therapy by ID", async () => {
    const userId = "QQPfLmVxfHbddh5KQHkg";
    const response = await request(app).get(`/api/therapy/${userId}`);
    expect(response.status).toBe(200);

    const expectedResponseBody = {
      message: "Successfully retrieved therapy data by ID!",
      status: 200,
      data: {
        therapy: {
          data: {
            therapy: expect.any(String),
            description: expect.arrayContaining([expect.any(String)]),
            category: expect.any(String),
            type: expect.arrayContaining([expect.any(String)]),
          },
        },
      },
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
