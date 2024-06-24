import AdminJs from "adminjs";
import AdminJsExpress from "@adminjs/express";
import * as AdminJsMongoose from "@adminjs/mongoose";
import path from "path";
import { Music } from "../models/musics/musicModel.js";
import User from "../models/users/userModel.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from "dotenv";

const result = dotenv.config({
  path: path.resolve(`${__dirname}../../`, `config.env`),
});

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Parsed .env file:", result.parsed);
}

console.log(
  "The process.env file is",
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_PASSWORD,
  process.env.SECRET_KEY
);

AdminJs.registerAdapter(AdminJsMongoose);

const adminJs = new AdminJs({
  resources: [
    {
      resource: User,
      options: {
        parent: {
          name: "User Management",
        },
      },
    },
    {
      resource: Music,
      options: {
        parent: {
          name: "Music Management",
        },
      },
    },
  ],
  rootPath: "/admin",
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = AdminJsExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: "adminCookie",
  cookiePassword: process.env.SECRET_KEY,
});

export { adminJs, router };
