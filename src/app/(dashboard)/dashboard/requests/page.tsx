import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';

interface pageProps {}

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incomingFriendsRequestId = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`,
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingFriendsRequestId.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;

      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    }),
  );

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Friend Requests</h1>
      <FriendRequests
        sessionId={session.user.id}
        incomingFriendRequests={incomingFriendRequests}
      />
    </main>
  );
};

export default page;
