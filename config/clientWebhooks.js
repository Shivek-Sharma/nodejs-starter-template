import dotenv from "dotenv";
dotenv.config();

export const webhooks = [
  {
    url: "https://my-website.com/webhook",
    secret: process.env.SECRET_KEY,
  },
];
