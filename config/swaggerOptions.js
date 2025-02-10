import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for Company Name',
    },
    servers: [
      {
        url: process.env.PROD_SERVER,
        description: 'Production Server',
      },
      {
        url: `http://localhost:${process.env.PORT || 8003}`,
        description: 'Development Server',
      },
    ],
    tags: [
      {
        name: "News",
        description: "Endpoints related to news",
      },
      {
        name: "Users",
        description: "Endpoints related to users",
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
export default specs;
