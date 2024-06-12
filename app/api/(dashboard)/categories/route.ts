import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connect from '@/lib/db';
import User from '@/lib/models/user';
import Category from '@/lib/models/category';

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing userId' }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: 'User not found in the database' }),
                { status: 400 }
            );
        }

        const catergories = await Category.find({
            user: new Types.ObjectId(userId),
        })

        return new NextResponse(
            JSON.stringify(catergories),
            { status: 200 }
        )
    } catch (err: any) {
        return new NextResponse("Error in fetching categories" + err.message,
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const { title } = await request.json();
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid or missing userId' }),
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

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        });
        await newCategory.save();

        return new NextResponse(
            JSON.stringify({ message: 'Category is created', category: newCategory }),
            { status: 200 }
        );
    } catch (err: any) {
        return new NextResponse("Error in creating category",
            { status: 500 }
        );
    }
};