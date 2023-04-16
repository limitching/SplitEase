import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env;

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    const result = await User.signUp(name, email, password);
    if (result.error) {
        return res.status(403).json({ error: result.error });
    }

    const user = result.user;
    if (!user) {
        return res
            .status(500)
            .json({ error: "Server Error: Database Query Error" });
    }
    const accessToken = jwt.sign(
        {
            id: user.id,
            provider: user.provider,
            name: user.name,
            email: user.email,
            image: user.picture,
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
        },
    });
};

const signIn = async (req, res) => {
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
        default:
            result = { error: "Request Error: Wrong Request" };
    }
    if (result.status === 400) {
        return res.status(400).send({ error: result.error });
    }
    const user = result.user;
    if (!user || result.status === 500) {
        return res.status(500).send({ error: result.error });
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            provider: user.provider,
            name: user.name,
            email: user.email,
            image: user.picture,
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
        },
    });
};

const nativeSignIn = async (email, password) => {
    try {
        return await User.nativeSignIn(email, password);
    } catch (error) {
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
                error: "Permissions Error: LINE access code can not get line_id, name, image or email",
            };
        }
        return await User.lineSignIn(name, email, image, line_id);
    } catch (error) {
        return { error: error };
    }
};

const getUserGroups = async (req, res) => {
    const { id } = req.user;
    console.log(req.user);
    const groupsIds = await User.getUserGroupsIds(id);
    const groups = await User.getGroupsInformation(groupsIds);
    return res.status(200).json(groups);
};

const getUserProfile = async (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        provider: req.user.provider,
        name: req.user.name,
        image: req.user.image,
    });
};
export { signUp, signIn, getUserGroups, getUserProfile };
