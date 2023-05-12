import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import { customizedError } from "../utils/error.js";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env;

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  const result = await User.signUp(name, email, password);
  if (result.error) {
    return next(customizedError.forbidden(result.error));
  }

  const user = result.user;
  if (!user) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  const accessToken = jwt.sign(
    {
      id: user.id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      image: user.image,
      line_binding_code: user.line_binding_code,
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRE }
  );

  return res.status(200).json({
    access_token: accessToken,
    access_expired: TOKEN_EXPIRE,
    login_at: user.login_at,
    user: {
      id: user.id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      image: user.image,
      line_binding_code: user.line_binding_code,
    },
  });
};

const signIn = async (req, res, next) => {
  const data = req.body;
  let result;
  switch (data.provider) {
    case "native":
      result = await nativeSignIn(data.email, data.password);
      break;
    case "line":
      const { code, state } = data;
      result = await lineSignIn(code, state);
      break;
    case "liff":
      result = await liffSignIn(data);
      break;
    default:
      result = { error: "Request Error: Wrong Request" };
  }
  if (result.status === 400) {
    return next(
      customizedError.badRequest("Request Error: Account does not exist")
    );
  }
  const user = result.user;
  if (!user || result.status === 500) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      image: user.image,
      line_binding_code: user.line_binding_code,
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRE }
  );

  return res.status(200).json({
    access_token: accessToken,
    access_expired: TOKEN_EXPIRE,
    login_at: user.login_at,
    user: {
      id: user.id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      image: user.image,
      line_binding_code: user.line_binding_code,
    },
  });
};

const nativeSignIn = async (email, password) => {
  try {
    return await User.nativeSignIn(email, password);
  } catch (error) {
    // Log error
    console.error(
      `[${new Date().toISOString()}] User ${email} native sign in error: ${error}`
    );
    return { error };
  }
};

const lineSignIn = async (code, state) => {
  if (!code || !state) {
    return {
      error: "Request Error: code and state is required.",
      status: 400,
    };
  }
  try {
    const profile = await User.getLineProfile(code, state);
    const { name, email, image, line_id } = profile;

    if (!name || !email || !image || !line_id) {
      return {
        error:
          "Permissions Error: LINE access code can not get line_id, name, image or email",
      };
    }
    return await User.lineSignIn(name, email, image, line_id);
  } catch (error) {
    return { error: error };
  }
};

const liffSignIn = async (data) => {
  if (!data) {
    return {
      error: "Request Error: signIn data is required.",
      status: 400,
    };
  }
  try {
    const { name, email, image, line_id } = data;
    return await User.lineSignIn(name, email, image, line_id);
  } catch (error) {
    // Log error
    console.error(
      `[${new Date().toISOString()}] User ${email} liff sign in error: ${error}`
    );
    return { error: error };
  }
};

const getUserGroups = async (req, res) => {
  const { id } = req.user;
  const { is_archived } = req.query;
  const groupsIds = await User.getUserGroupsIds(id);
  if (groupsIds.length === 0) {
    return res.status(200).json([]);
  }
  const groups = await User.getGroupsInformation(groupsIds, is_archived);
  return res.status(200).json(groups);
};

const getUserProfile = async (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    provider: req.user.provider,
    email: req.user.email,
    name: req.user.name,
    image: req.user.image,
    line_binding_code: req.user.line_binding_code,
  });
};

const updateUserProfile = async (req, res) => {
  const user_id = req.user.id;
  const modifiedUserProfile = req.body;
  const profile = await User.updateProfile(user_id, modifiedUserProfile);

  if (profile.error) {
    return next(customizedError.internal("Internal Server Error (MySQL)"));
  }

  const user = {
    id: req.user.id,
    provider: req.user.provider,
    email: req.user.email,
    line_binding_code: req.user.line_binding_code,
    ...profile.data,
  };

  const accessToken = jwt.sign(user, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRE,
  });
  return res.status(200).json({
    access_token: accessToken,
    access_expired: TOKEN_EXPIRE,
    user: user,
  });
};

export { signUp, signIn, getUserGroups, getUserProfile, updateUserProfile };
