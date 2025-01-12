'use client';
import { useSession,signIn,signOut} from "next-auth/react";
export default  function Component(){
  const { data : session } =  useSession()
  if(session){
   return( <>
    <h1>sign in as {session.user.email}</h1>
    <button onClick={()=>{signOut()}}>Sign out</button>
    </>
    )
  }
  return(
    <>
    <h1>Not signed in </h1>
    <button className="bg-green-600 px-3 py-2 m-4 rounded" onClick={()=>{signIn()}}>Sign-in</button>
    </>
  )
}