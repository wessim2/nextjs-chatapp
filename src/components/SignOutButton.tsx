'use client';
import { FC, useState } from 'react';
import Button from './ui/Button';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Icons } from './Icons';
import { Loader2 } from '../../node_modules/lucide-react';
import toast from 'react-hot-toast';

interface SignOutButtonProps {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      toast.error('There was a problem signing out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button {...props} onClick={handleLogOut} variant='ghost'>
      {isLoggingOut ? <Loader2 className='animate-spin' /> : <Icons.LogOut />}
    </Button>
  );
};

export default SignOutButton;
