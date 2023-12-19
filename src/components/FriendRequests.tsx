'use client';
import axios from 'axios';
import { Check, X } from '../../node_modules/lucide-react';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequests[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<
    IncomingFriendRequests[]
  >(incomingFriendRequests);

  const router = useRouter();

  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId),
    );
    toast.success('Added Successfully');
    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post('/api/friends/deny', { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId),
    );
    router.refresh();
  };

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`),
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequests) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };
    pusherClient.bind(
      toPusherKey(`incoming_friend_requests`),
      friendRequestHandler,
    );

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`),
      );

      pusherClient.unbind(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`),
      );
    };
  }, []);

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-zinc-500'>No friend Request !</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex items-center gap-x-4'>
            <span className='text-zinc-600 font-semibold leading-6 items-center justify-center'>
              {request.senderEmail}
            </span>
            <button
              onClick={() => acceptFriend(request.senderId)}
              aria-label='accept friend'
              className='bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center transition hover:shadow-md'
            >
              <Check className='text-white' />
            </button>
            <button
              onClick={() => denyFriend(request.senderId)}
              aria-label='deny friend'
              className='bg-red-500 rounded-full w-8 h-8 flex items-center justify-center transition hover:shadow-md'
            >
              <X className='text-white' />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
