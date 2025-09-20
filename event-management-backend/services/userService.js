const { user } = require("../models");
const { CustomError } = require("../utils/Errors");
const { Op } = require("sequelize");
const Logger = require("../utils/logger/logger");

async function getUsersCount() {
  return await user.count();
}

async function getUsers(params) {
  const {
    filter = "",
    page = 1,
    limit = 10,
    orderBy = "email",
    order = "ASC",
  } = params;

  const offset = (page - 1) * limit;

  const users = await user.findAll({
    attributes: ["id", "email", "isAdmin"],
    order: [[orderBy, order]],
    limit: limit,
    offset: offset,
    where: {
      email: {
        [Op.like]: `%${filter}%`,
      },
    },
    raw: true,
  });
  let usersData = {
    data: users,
    total_users: await user.count(),
    count: users.length,
    page: page,
  };

  return usersData;
}

async function createUserRecord(body, email) {
  var userMail = body.email;
  userMail=userMail.toLowerCase();
  var userRec = await _findUser(userMail);
  if(userRec) {
    throw new CustomError("User already exist!", 409);
  } 
  var isAdmin = body.isAdmin ? true : false;
  _validateEmail(userMail);
  let createdUser = await user.create({
    email: userMail,
    isAdmin: isAdmin,
    createdBy: email,
  }
  );
  Logger.info("user created", createdUser.dataValues);
  return userMail;
}

async function updateUser(body, email) {
  var userMail = body.email;
  userMail=userMail.toLowerCase();
  var isAdmin = body.isAdmin ? true : false;
  _validateEmail(userMail);
  await user.update(
    { isAdmin: isAdmin },
    {
      where: {
        email: userMail,
      }
    }
  )
  Logger.info("user udpated by: " + email, userMail);
  return userMail;
}

async function deleteUser(userMail, email) {
  userMail=userMail.toLowerCase();
  _validateEmail(userMail);
  await user.destroy({
    where: { email: userMail },
  });
  return userMail;
}

async function _findUser(email) {
  email = email.toLowerCase();
  _validateEmail(email);
  email = email.split('@')[0] + "@google.com";
  return await user.findOne(
      {
          attributes: ["otp", "generateDate"],
          where: {
              email: email
          },
          raw: true,
      })
}
function _validateEmail(email) {
  if (!email) {
    throw new CustomError('User email is required', 400);
  }
  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]*@(?:google\.com)$/;
  if (!emailRegex.test(email)) {
    throw new CustomError('Invalid email', 400);
  }
}

module.exports = {
  getUsersCount,
  getUsers,
  createUserRecord,
  updateUser,
  deleteUser
}
