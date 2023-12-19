import AddFriendButton from '@/components/AddFriendButton';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add Friend</h1>
      <AddFriendButton />
    </main>
  );
};
export default page;
