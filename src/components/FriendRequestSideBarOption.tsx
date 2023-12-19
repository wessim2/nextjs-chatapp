'use client';

import { FC, useEffect, useState } from 'react';
import { Icons } from './Icons';
import Link from 'next/link';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

interface FriendRequestSideBarOptionProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

const FriendRequestSideBarOption = ({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestSideBarOptionProps) => {
  const [unseenFriendRequests, setUnseenFriendRequests] = useState<number>(
    initialUnseenRequestCount,
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`),
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequests) => {
      setUnseenFriendRequests((prev) => prev + 1);
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
    <Link
      href='/dashboard/requests'
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <Icons.User className='h-6 w-6' />
      </span>
      <span>Friend Requests</span>
      {unseenFriendRequests > 0 ? (
        <span className='rounded-full w-6 h-6 bg-indigo-500 flex items-center justify-center text-white'>
          {unseenFriendRequests}
        </span>
      ) : null}
    </Link>
  );
};

export default FriendRequestSideBarOption;
