import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { authOption } from "../Auth/[...nextauth]/options";

export async function POST(request: Request) {
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
  const userId = user?._id;
  const { acceptingMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMassage: acceptingMessage,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User updated successfully",
        updatedUser
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error while sending request of accepting message", error);
    return Response.json(
      {
        status: false,
        message: "Error while sending request of accepting message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request){
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
    const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success:false,
                message: "User not found",
            },{status:404})
        }
        
        return Response.json({
            success:true,
            isAcceptingMessage: foundUser?.isAcceptingMassage
        },{
            status:200
        })
    } catch (error:any) {
        return Response.json(
            {
              status: false,
              message: "Error while fetching user acceptance status",
            },
            {
              status: 500,
            }
          );
        
    }
}
