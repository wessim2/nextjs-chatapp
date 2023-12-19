'use client';
import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';

interface SideChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SideChatList: FC<SideChatListProps> = ({ friends, sessionId }) => {
  const [unSeenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderName={message.senderName}
          senderMessage={message.text}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };
    const friendHandler = (newFriend: User) => {
      console.log(`client id ${sessionId}`);

      setActiveChats((prev) => [...prev, newFriend]);
    };
    pusherClient.bind(toPusherKey(`new_message`), chatHandler);
    pusherClient.bind('new_friend', friendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));

      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('new_friend', friendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes('chat'))
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathname?.includes(msg.senderId)),
      );
  }, [pathname]);

  return (
    <ul role='list' className='gap-y-7 '>
      {activeChats.sort().map((friend) => {
        const unseenMessageCount = unSeenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li className='text-black' key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                friend.id,
                sessionId,
              )}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              <div className='relative w-8 h-8'>
                <Image
                  fill
                  alt='Profile picture'
                  className='rounded-full'
                  src={friend.image || ''}
                />
              </div>
              <div className='flex justify-center items-center gap-2 truncate leading-6'>
                {friend.name}
                {unseenMessageCount > 0 ? (
                  <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                    {unseenMessageCount}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideChatList;
