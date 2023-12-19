'use client';

import Button from '@/components/ui/Button';
import { signIn, signOut } from 'next-auth/react';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);

  async function signInGithub() {
    setIsLoadingGithub(true);
    try {
      await signIn('github');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoadingGithub(true);
    }
  }
  async function signInGoogle() {
    setIsLoadingGoogle(true);
    try {
      await signIn('google');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoadingGoogle(true);
    }
  }

  return (
    <>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex flex-col items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-8'>
            logo
            <h2 className='text-2xl font-bold mt-6 text-center tracking-tight text-gray-800'>
              Sign in to your account
            </h2>
          </div>
          <Button
            className='w-full max-w-sm mx-auto'
            onClick={signInGithub}
            isLoading={isLoadingGithub}
          >
            {isLoadingGithub || (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                id='github'
                width='40'
                height='30'
              >
                <path
                  fill='#5C6BC0'
                  d='M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z'
                ></path>
              </svg>
            )}
            Github
          </Button>
          <Button
            className='w-full max-w-sm mx-auto'
            onClick={signInGoogle}
            isLoading={isLoadingGoogle}
          >
            {isLoadingGoogle || (
              <svg
                className='mr-2 h-4 w-4'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='github'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
                <path d='M1 1h22v22H1z' fill='none' />
              </svg>
            )}
            Google
          </Button>
          <Button
            onClick={() => {
              signOut();
            }}
          ></Button>
        </div>
      </div>
    </>
  );
};

export default page;
