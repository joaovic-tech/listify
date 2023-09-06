"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/user.router.ts
var user_router_exports = {};
__export(user_router_exports, {
  userRoutes: () => userRoutes
});
module.exports = __toCommonJS(user_router_exports);
var import_express = require("express");

// src/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/entities/user/interface/user.interface.ts
var import_zod = require("zod");
var userSchemas = import_zod.z.object({
  name: import_zod.z.string().min(3, { message: "O nome precisa de 3 caracteres." }).max(50, { message: "O nome precisar ter menos de 50 caracteres" }),
  username: import_zod.z.string().min(3, { message: "O nome precisa de 3 caracteres." }).max(50, { message: "O nome precisar ter menos de 50 caracteres" }),
  email: import_zod.z.string().email({ message: "E-mail inv\xE1lido" }),
  password: import_zod.z.string(),
  createAt: import_zod.z.date().optional(),
  updateAt: import_zod.z.date().optional()
});

// src/entities/user/useCases/user.create.ts
var CreateUserUseCase = class {
  async execute(userData) {
    const user = userSchemas.parse(userData);
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    });
    if (userAlreadyExists) {
      throw new Error("User Already Exist");
    }
    const userCreated = await prisma.user.create({
      data: user
    });
    return userCreated;
  }
};
var user_create_default = new CreateUserUseCase();

// src/entities/user/controllers/user.controller.ts
var import_zod2 = require("zod");
var UserController = class {
  async handle(req, res) {
    try {
      const result = await user_create_default.execute(req.body);
      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return res.json({ status: "error", message: err.issues });
      }
    }
  }
};
var user_controller_default = new UserController();

// src/routes/user.router.ts
var userRoutes = (0, import_express.Router)();
userRoutes.post("/user", user_controller_default.handle);
userRoutes.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});