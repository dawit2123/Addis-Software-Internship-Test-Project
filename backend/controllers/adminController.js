import AdminJs, { Edit } from "adminjs";
import AdminJsExpress from "@adminjs/express";
import * as AdminJsMongoose from "@adminjs/mongoose";
import { Music } from "../models/musics/musicModel.js";
import User from "../models/users/userModel.js";

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

// Build and export the router
const router = AdminJsExpress.buildRouter(adminJs);

export { adminJs, router };
