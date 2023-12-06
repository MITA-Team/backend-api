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
      data: {
        child: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            data: expect.objectContaining({
              nama: expect.any(String),
              rekomendasi: expect.any(String),
              domisili: expect.any(String),
              tanggal_lahir: expect.any(String),
              keluhan: expect.any(String),
            }),
          }),
        ]),
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
