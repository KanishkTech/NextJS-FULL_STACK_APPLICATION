'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';


import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/Schemas/signinSchema';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier:'',
      password: '',
    },
  });

 

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   //why we do this because we use NextAuth
    const result = await signIn('credentials',{
    redirect:false,
    identifier:data.identifier,
    password:data.password
   })
   if(result?.error){
  if(result.error=='CredentialsSIgnin'){
    toast({
      title: 'Error',
      description:"Incorrect Credentials",
      variant:"destructive"
    })
  }else{
    toast({
      title: 'Error',
description:  "Credentials Signin failed",
variant:"destructive"
    })
  }
   }
   if(result?.url){
    router.replace("/dashboard")
   }
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={( { field }) => (
                <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <Input {...field} name="email/username" placeholder='Email/Username' className='border'/>
                  <p className='text-muted text-gray-800 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder='Password' name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' >
              Sign-in
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
           Dont have an Account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
