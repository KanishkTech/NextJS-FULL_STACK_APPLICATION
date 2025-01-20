import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth";
import { User } from "next-auth";
import userModel from "@/models/User";
import { authOption } from "../../Auth/[...nextauth]/options";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 400 }
    );
  }

  try {
    const updateResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already updated",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message updated successfully",
      },
      { status: 200 }
    );
  } catch (error:any) {
     return Response.json({
        success: false,
        message : "Error updating message",
     },{ status:500})
  }
}
