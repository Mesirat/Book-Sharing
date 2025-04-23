import { MailtrapClient } from "mailtrap"; 
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MAILTRAP_TOKEN) {
  throw new Error("MAILTRAP_TOKEN is not set in environment variables");
}


export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: process.env.SEDER_EMAIL || "hello@demomailtrap.com",
  name: process.env.SENDER_NAME || "Mesirat Belete",
};
