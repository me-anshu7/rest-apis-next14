import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connect from '@/lib/db';
import User from '@/lib/models/user';
import Category from '@/lib/models/category';
import Blog from '@/lib/models/blog';

export const GET = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing userId' }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing categoryId' }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing blogId' }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: 'User not found' }),
                { status: 404 }
            );
        }

        const category = await Category.findById(categoryId);
        if (!categoryId) {
            return new NextResponse(
                JSON.stringify({ message: 'Category not found' }),
                { status: 404 }
            );
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        });
        if (!blog) {
            return new NextResponse(
                JSON.stringify({ message: 'Blog not found' }),
                { status: 404 }
            )
        }

        return new NextResponse(
            JSON.stringify({ blog }),
            { status: 200 }
        );
    } catch (err: any) {
        return new NextResponse('Error in fetching a blog' + err.message,
            { status: 500 }
        );
    }
};

export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing userId' }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing blogId' }),
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description } = body;

        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: 'User not found' }),
                { status: 404 }
            );
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId });
        if (!blog) {
            return new NextResponse(
                JSON.stringify({ message: 'Blog not found' }),
                { status: 404 }
            );
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({ message: 'Blogupdated', blog: updatedBlog }),
            { status: 200 }
        );
    } catch (err: any) {
        return new NextResponse('Error in updating a blog' + err.message,
            { status: 500 }
        )
    }
};

export const DELETE = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing userId' }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing blogId' }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: 'User not found' }),
                { status: 404 }
            );
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId });
        if (!blog) {
            return new NextResponse(
                JSON.stringify({ message: 'Blog not found' }),
                { status: 404 }
            );
        }

        await Blog.findByIdAndDelete(blogId);
        return new NextResponse(
            JSON.stringify({ message: 'Blog is deleted' }),
            { status: 200 }
        );
    } catch (err: any) {
        return new NextResponse("Error in deleting a blog" + err.message,
            { status: 500 }
        );
    }
};