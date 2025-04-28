import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { fullName, email, password } = body;
    //check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          data: null,
          message: "User with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    //hashing the password
    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });
    return NextResponse.json(
      {
        data: newUser,
        message: "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
};
