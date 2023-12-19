import FriendRequestSideBarOption from '@/components/FriendRequestSideBarOption';
import { Icon, Icons } from '@/components/Icons';
import SideChatList from '@/components/SideChatList';
import SignOutButton from '@/components/SignOutButton';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

interface SideBarOptions {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}

const Layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const sideBarList: SideBarOptions[] = [
    {
      id: 1,
      name: 'Add friend',
      href: '/dashboard/add',
      icon: 'UserPlus',
    },
  ];

  const initialUnseenRequestCount = (
    await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`,
    )
  ).length;

  return (
    <div className='w-full h-screen flex'>
      <div className='flex px-6 w-full h-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white'>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <Icons.Logo className='h-8 w-auto text-indigo-500' />
        </Link>
        <nav className='flex flex-col flex-1'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <div className='text-sm text-gt=ray-500'>Your chats</div>
            {friends.length > 0 ? (
              <SideChatList friends={friends} sessionId={session.user.id} />
            ) : (
              <li>No firends</li>
            )}
            <li className='text-sm text-gray-500'>
              <div className='text-sm text-gt=ray-500'>Overview</div>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sideBarList.map((element) => {
                  const Icon = Icons[element.icon];
                  return (
                    <li key={element.id}>
                      <Link
                        href={element.href}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      >
                        <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                          <Icon className='h-6 w-6' />
                        </span>
                        <span className='truncate'>{element.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestSideBarOption
                    initialUnseenRequestCount={initialUnseenRequestCount}
                    sessionId={session.user.id}
                  />
                </li>
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center px-6 py-4 gap-x-7 leading-6'>
                <div className='relative w-8 h-8'>
                  <Image
                    fill
                    alt='Profile picture'
                    className='rounded-full'
                    src={session.user.image || ''}
                  />
                </div>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-zinc-500 truncate'>
                    {session.user.email}
                  </span>
                </div>
                <div className='ml-auto'>
                  <SignOutButton />
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  );
};

export default Layout;
