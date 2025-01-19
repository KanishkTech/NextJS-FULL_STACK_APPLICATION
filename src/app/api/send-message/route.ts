import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { messageSchema } from "@/Schemas/messageSchema";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMassage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.log("an unexpected Error occurred", error);
    return Response.json(
        {
          status: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
  }
}
