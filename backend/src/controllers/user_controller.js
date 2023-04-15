import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env;

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);

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
export { signUp };
