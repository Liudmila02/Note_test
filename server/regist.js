// @flow

/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */

import bcrypt from 'bcrypt';
import db from './models/index';

export async function login({email, password}){
  const user = await db.User.findOne({
    where: { email: email }
  });

  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    throw new Error("Incorrect email or password");
  }
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username
  };
}

export async function register(args) {
  let user = await db.User.findOne({
    where: { email: args.email }
  });

  if (user) {
    throw new Error("Email already exist");
  }

  try {
    user = await db.User.create({
      email: args.email,
      password_hash: hashPassword(args.password),
      first_name: args.first_name,
      last_name: args.last_name,
      username: args.username || args.first_name + args.last_name
    })
  } catch (err) {
    throw new Error("An error occured, try again later");
  }
  
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username 
  };
}

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

