import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user";

interface IUser {
    save(): unknown;
    generateJWTToken(): string | PromiseLike<string>;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    phone: string;
    age: string;
    password: string;
    answer: string;
    post: any[];
}

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            first_name,
            last_name,
            email,
            gender,
            phone,
            age,
            password,
            answer,
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !gender ||
            !phone ||
            !age ||
            !password ||
            !answer
        )
            return res.status(400).json({ message: "All fields are required!" });

        const existedEmail = await User.findOne({ email });
        const existedPhone = await User.findOne({ phone });

        if (existedEmail)
            return res
                .status(400)
                .json({ success: false, message: "Email is already exists " });
        if (existedPhone)
            return res
                .status(400)
                .json({ success: false, message: "Phone number is already exists " });

        const user: IUser = await User.create({
            first_name,
            last_name,
            email,
            gender,
            phone,
            age,
            password,
            answer,
            post: [],
        });

        await user.save();
        res.status(201).json({
            success: true,
            message: "Registration Successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
};

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required!" });

        const user: IUser | null = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid data!" });
        const comparePassword: boolean = await bcrypt.compare(
            password,
            user.password
        );

        if (!comparePassword)
            return res.status(400).json({ message: "Invalid data!" });
        const token: string = await user.generateJWTToken();
        res.status(200).json({
            success: true,
            token,
            message: "Login Successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
};

const profile = async (req: Request, res: Response): Promise<any> => {
    const id: string | undefined = req.id;
    const user: IUser | null = await User.findById(id).populate("post");
    res.status(200).json({
        success: true,
        message: "LoggedIn",
        user,
    });
};

const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users: IUser[] = await User.find().populate("post");
        if (!users)
            return res.status(400).json({ success: false, message: "No any user!" });
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
};

const forgetPassword = async (req: Request, res: Response): Promise<any> => {
    const { email, answer, password } = req.body;
    const user: IUser | null = await User.findOne({ email });
    if (!answer || !password)
        return res.status(400).json({ message: "Answer required!" });
    if (answer !== user?.answer)
        return res.status(400).json({ message: "Invalid Answer " });

    user!.password = password;
    await user!.save();
    res.status(201).json({
        success: true,
        message: "Password reset successfully..!",
        user,
    });
};

const updateProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const id: string | undefined = req.id;

        if (!id) return res.status(400).json({ message: "User Not Login" });
        const user: IUser | null = await User.findById(id);

        if (!user) return res.status(400).json({ message: "User Not exist" });

        const {
            first_name,
            last_name,
            gender,
            phone,
            age,
            answer,
        } = req.body;
        const existingPhone: IUser | null = await User.findOne({ phone: phone });

        if (existingPhone && phone !== user.phone)
            return res
                .status(400)
                .json({ message: "Phone number is already exists" });

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.gender = gender || user.gender;
        user.phone = phone || user.phone;
        user.age = age || user.age;
        user.answer = answer || user.answer;

        await user.save();
        res.status(201).json({
            success: true,
            message: "Profile Updated Successfully!",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
};

export {
    register,
    login,
    profile,
    forgetPassword,
    updateProfile,
    getUsers,
};
