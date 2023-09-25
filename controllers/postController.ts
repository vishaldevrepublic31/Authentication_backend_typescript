import { Request, Response } from "express";
import { Post } from "../models/post";
import { User } from "../models/user";

interface IPost {
    save(): unknown;
    title: string;
    description: string;
    avatar: string;

}

const getAllPost = async (req: Request, res: Response): Promise<any> => {
    try {
        const posts = await Post.find().populate("creator");
        if (!posts)
            return res
                .status(400)
                .json({ success: false, message: "Not any post here!" });
        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Somthing wenr wrong!",
            error,
        });
    }
};

const createPost = async (req: Request, res: Response): Promise<any> => {
    const { title, description, avatar }: IPost = req.body;
    const userId: string | undefined = req.id;

    try {
        if (!title || !description)
            return res
                .status(400)
                .json({ success: false, message: "Please fill all data!" });
        const post: IPost = await Post.create({
            title,
            description,
            avatar:
                avatar ||
                "https://myteddyworld.com/image/cache/catalog/basel-demo/blog-1140x700.png",
            creator: userId,
        });
        const user: any = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "user not found!" });
        } else {
            await post.save();
            user.post.push(post);
            await user.save();

            res.status(201).json({
                success: true,
                message: "Post created successFully",
                post,
            });
        }
    } catch (error) { }
};

const updatePost = async (req: Request, res: Response): Promise<any> => {
    const postId: string = req.params.id;
    const userId: string | undefined = req.id;
    const { title, description }: IPost = req.body;
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res
                .status(400)
                .json({ success: false, message: "post not found!" });
        }

        if (post.creator.toString() !== userId!.toString())
            return res
                .status(400)
                .json({ success: false, message: "Unauthenticate User!" });

        const updatePost = await Post.findByIdAndUpdate(
            postId,
            {
                title,
                description,
            },
            { new: true }
        );
        if (!updatePost)
            return res
                .status(400)
                .json({ success: false, message: "Post not update" });

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Somthing wenr wrong!",
            error,
        });
    }
}


const deletePost = async (req: Request, res: Response): Promise<any> => {
    try {
        const postId: string = req.params.id;
        const userId: string | undefined = req.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ success: false, message: "Post not found!" });
        }

        if (post.creator.toString() !== userId.toString()) {
            return res
                .status(400)
                .json({ success: false, message: "Unauthorized User!" });
        }

        const deletedPost = await Post.findByIdAndDelete(postId).populate("creator");

        if (!deletedPost) {
            return res
                .status(400)
                .json({ success: false, message: "Failed to delete the post!" });
        }

        const user: any = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        user.post.pull(deletedPost);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
};

const getUserPosts = async (req: Request, res: Response): Promise<any> => {
    const userId: string = req.params.id;
    try {
        const user: any = await User.findById(userId).populate("post");
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "user not found!" });
        }

        res.status(200).json({
            success: true,
            posts: user.post || [],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Somthing wenr wrong!",
            error,
        });
    }
};

const myPosts = async (req: Request, res: Response): Promise<any> => {
    const id = req.id;
    const user = await User.findById(id).populate("post");
    res.status(200).json({
        success: true,
        message: "LoggedIn",
        posts: user!.post,
    });
};


export {
    getAllPost,
    createPost,
    deletePost,
    updatePost,
    getUserPosts,
    myPosts,
};
