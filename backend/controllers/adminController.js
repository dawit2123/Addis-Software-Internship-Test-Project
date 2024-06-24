import AdminJs, { Edit } from "adminjs";
import AdminJsExpress from "@adminjs/express";
import * as AdminJsMongoose from "@adminjs/mongoose";
import passwordsFeature from "@adminjs/passwords";
import path from "path";
import bcrypt from "bcryptjs";
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
          properties: { password: { isVisible: false } },
        },
        listProperties: [
          "firstName",
          "lastName",
          "profileImage",
          "email",
          "role",
        ],
        showProperties: ["firstName", "lastName", "email", "role"],
        editProperties: ["firstName", "lastName", "email", "role", "password"],
        features: [
          passwordsFeature({
            properties: {
              componentLoader,
              encryptedPassword: "password",
              password: "password",
            },
            hash: (password) => bcrypt.hash(password, 12),
          }),
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
        editProperties: ["title", "artistName", "duration"],
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
const router = AdminJsExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
});

export { adminJs, router };
