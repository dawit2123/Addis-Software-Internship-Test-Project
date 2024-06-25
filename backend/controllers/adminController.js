import AdminJs, { Edit } from "adminjs";
import AdminJsExpress from "@adminjs/express";
import * as AdminJsMongoose from "@adminjs/mongoose";
import path from "path";
import { Music } from "../models/musics/musicModel.js";
import User from "../models/users/userModel.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Directory setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load environment variables
const result = dotenv.config({
  path: path.resolve(`${__dirname}../../`, `config.env`),
});
AdminJs.registerAdapter({
  Database: AdminJsMongoose.Database,
  Resource: AdminJsMongoose.Resource,
});

// Define the AdminJS instance with resources
const adminJs = new AdminJs({
  resources: [
    {
      resource: User,
      options: {
        parent: {
          name: "User Management",
        },
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: "password",
            isVisible: {
              list: false,
              show: false,
              edit: false,
              filter: false,
            },
          },
        },
        listProperties: ["firstName", "lastName", "email", "role"],
        showProperties: ["firstName", "lastName", "email", "role"],
        editProperties: ["firstName", "lastName", "email", "role", "password"],
      },
    },
    {
      resource: Music,
      options: {
        parent: {
          name: "Music Management",
        },
        listProperties: ["title", "artistName", "duration"],
        editProperties: ["title", "artistName", "duration"],
        showProperties: ["title", "_id", "artistName", "duration", "addedBy"],
      },
    },
  ],
  rootPath: "/admin",
});

// Admin credentials
const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

// Build and export the router
const router = AdminJsExpress.buildRouter(adminJs);

export { adminJs, router };
