'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { userAuthSchema } from '@/lib/validations/auth';

type FormData = z.infer<typeof userAuthSchema>;

const UserAuthFormContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn('email', {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get('from') || '/dashboard',
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your sign in request failed. Please try again.',
        variant: 'destructive',
      });
    }

    return toast({
      title: 'Check your email',
      description: 'We sent you a login link. Be sure to check your spam too.',
    });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading || isGoogleLoading}
              {...register('email')}
            />

            <Input
              id='password'
              placeholder='********'
              type='password'
              autoCapitalize='none'
              disabled={isLoading || isGoogleLoading}
              {...register('email')}
            />

            {errors?.email && (
              <p className='px-1 text-xs text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
          <Button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <button
        type='button'
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn('google');
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.google className='mr-2 h-4 w-4' />
        )}{' '}
        Google
      </button>

      <button
        type='button'
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsMicrosoftLoading(true);
          signIn('microsoft');
        }}
        disabled={isLoading || isMicrosoftLoading}
      >
        {isMicrosoftLoading ? (
          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.microsoft className='mr-2 h-4 w-4' />
        )}{' '}
        Microsoft
      </button>
    </div>
  );
};

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthFormContent className={className} {...props} />
    </Suspense>
  );
}
