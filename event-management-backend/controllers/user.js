const userService = require("../services/userService");
const { CustomError } = require("../utils/Errors");


async function getFilteredUsers(req, res, next) {
  try {
    const users = await userService.getUsers(req.query);
    return res.json(users);
  } catch (e) {
    next(e);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.createUserRecord(req.body, req.user.email);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

async function editUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.body, req.user.email);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userService.deleteUser(req.body.email, req.user.email);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getFilteredUsers,
  createUser,
  editUser,
  deleteUser
}
