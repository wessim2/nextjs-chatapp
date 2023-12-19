'use client';
import { chatHrefConstructor, toPusherKey } from '@/lib/utils';
import { ChevronRight } from '../../node_modules/lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { pusherClient } from '@/lib/pusher';

interface RecentChatsProps {
  friend: FriendsWithLastMessage;
  sessionId: string;
}

const RecentChats: FC<RecentChatsProps> = ({ friend, sessionId }) => {
  const [lastMessage, setLastMessage] = useState<Message>(friend.lastMessage);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatHrefConstructor(sessionId, friend.id)}`),
    );

    const messageHandler = (message: Message) => {
      setLastMessage(message);
    };
    pusherClient.bind(toPusherKey(`incoming_messages`), messageHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatHrefConstructor(sessionId, friend.id)}`),
      );

      pusherClient.unbind(toPusherKey(`incoming_messages`));
    };
  }, []);
  return (
    <>
      <div className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
        <div className='absolute right-4 inset-y-0 flex items-center'>
          <ChevronRight className='h-7 wè7 text-zinc-400' />
        </div>

        <Link
          href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
          className='relative sm:flex'
        >
          <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
            <div className='relative h-6 w-6'>
              <Image
                referrerPolicy='no-referrer'
                className='rounded-full'
                alt={`${friend.name} Profile picture`}
                src={friend.image}
                fill
              />
            </div>
          </div>
          <div>
            <h4 className='text-lg font-semibold'>{friend.name}</h4>
            <p className='mt-1 max-w-md'>
              <span className='text-zinc-400'>
                {lastMessage.senderId === sessionId ? 'You : ' : ''}
              </span>
              {lastMessage.text}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default RecentChats;
