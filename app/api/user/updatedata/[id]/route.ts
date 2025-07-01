import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    req: NextRequest,
    context: {
        params: Promise<{ id: string }>;
    },
) => {
    const { fullName, email } = await req.json();
    console.log("Data : ", { fullName, email });

    const id = (await context.params).id;

    try {
        return NextResponse.json(
            {
                data: id,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
};
