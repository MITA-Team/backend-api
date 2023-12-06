const request = require("supertest");
const { app, server } = require("../index.js");

describe("GET All Question", () => {
  it("should return all question", async () => {
    const response = await request(app).get("/api/question/all");
    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const expectedResponseBody = {
      message: "Successfully retrieved question data!",
      status: 200,
      data: {
        question: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            data: expect.objectContaining({
              question: expect.any(String),
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

describe("GET Question by Id", () => {
  it("should return a question by ID", async () => {
    const userId = "Lcfzhr40T37ufB6O8IhG";
    const response = await request(app).get(`/api/question/${userId}`);
    expect(response.status).toBe(200);

    const expectedResponseBody = {
      message: "Successfully retrieved question data by ID!",
      status: 200,
      data: {
        question: {
          data: {
            question: expect.any(String),
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
