import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MTC Backend API",
      version: "1.0.0",
      description: "Multi-Tenant Configuration API",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/docs/*.docs.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
