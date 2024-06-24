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

AdminJs.registerAdapter({
  Database: AdminJsMongoose.Database,
  Resource: AdminJsMongoose.Resource,
});

const adminJs = new AdminJs({
  resources: [
    {
      resource: User,
      options: {
        parent: {
          name: "User Management",
        },
        listProperties: [
          "firstName",
          "lastName",
          "profileImage",
          "email",
          "role",
        ],
      },
    },
    {
      resource: Music,
      options: {
        parent: {
          name: "Music Management",
        },
        listProperties: ["title", "artistName", "duration"],
      },
    },
  ],
  rootPath: "/admin",
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = AdminJsExpress.buildRouter(adminJs);
export { adminJs, router };
