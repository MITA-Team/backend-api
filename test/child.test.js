const request = require("supertest");
const { app, server } = require("../index.js");

describe("GET All Child", () => {
  it("should return all child", async () => {
    const response = await request(app).get("/api/child/all");
    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toMatch(/application\/json/);

    const expectedResponseBody = {
      message: "Successfully retrieved child data!",
      status: 200,
        child: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            data: {
              name: expect.any(String),
              born: expect.any(String),
              city: expect.any(String),
              gender: expect.any(String),
              diagnose: expect.any(String),
              recommendation: expect.arrayContaining([expect.any(String)]),
            },
          }),
        ]),
      };
    expect(response.body).toEqual(expectedResponseBody);
  }, 10000);
});

describe("GET Child by Id", () => {
  it("should return a child by ID", async () => {
    const userId = "DndDLpRT4195V69kVTWJ";
    const response = await request(app).get(`/api/child/${userId}`);
    expect(response.status).toBe(200);

    const expectedResponseBody = {
      message: "Successfully retrieved child data by ID!",
      status: 200,
      id: expect.any(String),
        child: {
          data: {
            name: expect.any(String),
            born: expect.any(String),
            city: expect.any(String),
            gender: expect.any(String),
            diagnose: expect.any(String),
            recommendation: expect.arrayContaining([expect.any(String)]),
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
