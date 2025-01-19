import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { authOption } from "../Auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "You are not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if(!user || user.length===0){
        return Response.json({
            status: false,
            message: "No user found",
        },{
            status: 404,
        })
    }
    return Response.json({
        status: true,
        message:user[0].messages
    },{status:200});
  } catch (error: any) {
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
