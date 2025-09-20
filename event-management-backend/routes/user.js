const { Router } = require("express");

const userValidator = require("../utils/validators/userValidator");
const checkAdmin = require("../middleware/checkAdmin");
const { getFilteredUsers, createUser, deleteUser, editUser } = require("../controllers/user");

const userRouter = Router();

userRouter.get("/users",userValidator.getUsers, checkAdmin, getFilteredUsers);
userRouter.post("/createUser", checkAdmin, createUser);
userRouter.post("/updateUser", checkAdmin, editUser);
userRouter.post("/deleteUser", checkAdmin, deleteUser);

module.exports = userRouter;