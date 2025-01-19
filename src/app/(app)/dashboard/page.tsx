import MessageCard from '@/components/messageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message, User } from '@/models/User'
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { apiBaseUrl } from 'next-auth/client/_utils'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { finished } from 'stream'

const page = () => {
  const [message, setMassages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitching,setIsSwitching] = useState(false)

  const toast = useToast()
  const handleDeleteMessage =(messageId:string){
    setMassages(message.filter((message)=> message._id!==messageId))
  }
  
  const {data:session} = useSession()
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue} = form

  const acceptMessages=watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitching(true)
  try {
   const response= await axios.get<ApiResponse>('/api/accept-messages')
   setValue('acceptMessages', response.data.isAcceptingMessage)
  } catch (error) {
  const axiosError = error as AxiosError<ApiResponse>
  toast.toast({
    title:"ERROR",
    description: axiosError.response?.data.message || "FAILED TO FETCH MESSAGES SETTING",
    variant:"destructive"
  })
 
  }finally{
    setIsSwitching(false)
  }
  
  }, [setValue])

  const fetchMesssages=useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true)
    setIsSwitching(false)
    try {
      const response=await axios.get<ApiResponse>('/api/get-messages')
      setMassages(response?.data.messages || [])
      if(refresh){
        toast.toast({
          title:"refreshed messages",
          description:"showing refreshed messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.toast({
        title:"ERROR",
        description: axiosError.response?.data.message || "FAILED TO FETCH MESSAGES SETTING",
        variant:"destructive"
      })
    }finally{
      setIsLoading(false)
      setIsSwitching(false)
    }
  }, [setIsLoading, setMassages])

  useEffect(()=>{
    if(!session || !session.user) return 
    fetchAcceptMessage()
    fetchMesssages()
  },[session,setValue,fetchMesssages,fetchAcceptMessage])

  //handle switch change

  const handleSwitchChange = async()=>{
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`,
        {
          acceptingMessage:!acceptMessages
        }
      )
    }  catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.toast({
        title:"ERROR",
        description: axiosError.response?.data.message || "FAILED TO FETCH MESSAGES SETTING",
        variant:"destructive"
      })
    }
  }
  const {username} = session?.user as User
  const baseURL= `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseURL}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast.toast({
      title:"Copied to clipboard",
      description:"Profile Url Copied to clipboard",
    })
  }

  if(!session || session.user){
    return <div>Please Login</div>
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMesssages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page