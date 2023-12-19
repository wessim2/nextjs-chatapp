import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { chatHrefConstructor } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import RecentChats from '@/components/RecentChats';

interface pageProps {}

const page: FC<pageProps> = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [rawLastMessage] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1,
      )) as string[];
      const lastMessage = JSON.parse(rawLastMessage) as Message;
      return { ...friend, lastMessage };
    }),
  );
  return (
    <div className='max-h-screen container py-16 md:py-12 w-full'>
      <h1 className='text-5xl font-bold mb-8'>Recent Chats</h1>
      {friendsWithLastMessage.length > 0 ? (
        friendsWithLastMessage.map((friend) => (
          <RecentChats
            key={friend.id}
            friend={friend}
            sessionId={session.user.id}
          />
        ))
      ) : (
        <p className='text-sm text-zinc-500'>There is no recent chats</p>
      )}
    </div>
  );
};

export default page;
