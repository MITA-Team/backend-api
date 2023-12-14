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
      list: expect.arrayContaining([
        expect.objectContaining({
          id: "MyCAK7CmRVcj26VlDoXG",
          data: {
            therapy: {
              name: "Menirukan suara hewan",
              description: [
                "Ayah atau Ibu atau orang yang bertanggungjawab lainnya dapat memberikan anak mainan yang berupa hewan.",
                "Setiap bermain dengan mainan tersebut bersama anak, tirukan suara dari hewan tersebut. (meong, mbeeek, dsb)",
                "Lakukan sesering mungkin, namun tidak terlalu lama (5-10 menit setiap hari).",
                "Jika dirasa tidak ada perubahan, silahkan pertemukan anak dengan orang profesional untuk penanganan lebih"
              ],
            },
            category: "A1",
            type: [
              "Speech/Language/Communication",
              "Sociability",
              "Sensori/Kognitif"
            ]
          }
        })
      ])
    };
    
    expect(response.body).toEqual(expectedResponseBody);
    
  }, 10000);
});

describe("GET Therapy by Id", () => {
  it("should return a therapy by ID", async () => {
    const userId = "MyCAK7CmRVcj26VlDoXG";
    const response = await request(app).get(`/api/therapy/${userId}`);
    expect(response.status).toBe(200);

    const expectedResponseBody = {
      message: "Successfully retrieved therapy data by ID!",
      status: 200,
      list: {
        data: {
          category: "A1",
          therapy: {
            name: "Menirukan suara hewan",
            description: [
              "Ayah atau Ibu atau orang yang bertanggungjawab lainnya dapat memberikan anak mainan yang berupa hewan.",
              "Setiap bermain dengan mainan tersebut bersama anak, tirukan suara dari hewan tersebut. (meong, mbeeek, dsb)",
              "Lakukan sesering mungkin, namun tidak terlalu lama (5-10 menit setiap hari).",
              "Jika dirasa tidak ada perubahan, silahkan pertemukan anak dengan orang profesional untuk penanganan lebih"
            ]
          },
          type: [
            "Speech/Language/Communication",
            "Sociability",
            "Sensori/Kognitif"
          ]
        }
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
