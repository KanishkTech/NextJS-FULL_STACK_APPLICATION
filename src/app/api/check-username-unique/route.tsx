import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
import UserModel  from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnect();
  try {
    // extracticing username from URL parameters 
    const {searchParams} = new URL(request.url)
    const queryParam ={
        username:searchParams.get('username')
    }
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)
    // console.log("Result of search",result) //see what u get 
    if (!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message:usernameErrors?.length>0?usernameErrors.join(","):"Invalid query parameters "
        },{
            status:400
        })
    }
    const {username} = result.data 
    const Existing_Verified_user =  await  UserModel.findOne({username,isVerified:true})
    // console.log("Existing user:", Existing_Verified_user)
    if (Existing_Verified_user) {
      return Response.json({
        success:false,
        message: "Username already exists",
      },{
        status:400
      })
    }
    return Response.json({
      success:true,
      message: "Username is available",
    },{
      status:200
    })
    
  } catch (error:any) {
    
    console.error("error while username validation", error);
    return Response.json({
        error: "error while username validation",
        status: 500

    })
  }
}
