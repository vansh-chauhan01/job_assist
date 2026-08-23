import { signInSchema, signUpSchema } from "../zodSchema/userSchema.js";
import { prisma } from "../db_init.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudfare from "../services/cloudfare.js";
export const signUp = async (req, res) => {
    try {
        const parsedData = signUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.message
            });
        }
        const { username, password, email, token } = parsedData.data;
        // const formData = new FormData();
        // formData.append("secret", process.env.CLOUD_SECRET_KEY!);
        // formData.append("response", token);
        // const result = await fetch(
        // 	"https://challenges.cloudflare.com/turnstile/v0/siteverify",
        // 	{
        // 		method: "POST",
        // 		body: formData,
        // 	},
        // );
        // const notABot = (await result.json()).success;
        const notABot = await cloudfare(token);
        if (!notABot) {
            return res.status(409).json({
                message: "you are a bot"
            });
        }
        const alreadyExsist = await prisma.user.findFirst({
            where: {
                userName: username
            }
        });
        if (alreadyExsist) {
            return res.status(401).json({
                message: "user already exsist with this name"
            });
        }
        const hashPass = await bcrypt.hash(password, 10);
        console.log("api hit");
        const newUser = await prisma.user.create({
            data: {
                userName: username,
                email: email,
                password: hashPass
            }
        });
        return res.status(201).json({
            message: "new user Created"
        });
    }
    catch (e) {
        return res.status(401).json({
            message: e
        });
    }
};
export const signIn = async (req, res) => {
    try {
        const parsedData = signInSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.message
            });
        }
        const { username, password } = parsedData.data;
        const currUser = await prisma.user.findFirst({
            where: {
                userName: username
            }
        });
        if (!currUser) {
            return res.status(404).json({
                message: "couldnt find this user"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, currUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "your password is incorrect"
            });
        }
        const { password: _, ...newUser } = currUser;
        const token = jwt.sign({ userId: currUser.id }, process.env.JWT_SECRET);
        return res.status(200).cookie("access_token", token, {
            httpOnly: true,
        }).json({
            newUser
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e
        });
    }
};
//# sourceMappingURL=user.controller.js.map