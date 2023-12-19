import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { Message, messageValidator } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { z } from 'zod';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) return new Response('Unauthorized', { status: 401 });

    const [userId1, userId2] = chatId.split('--');

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response('Unauthorized', { status: 401 });

    const receiverId = session.user.id === userId1 ? userId2 : userId1;

    const isFriend = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      receiverId,
    );

    if (!isFriend) return new Response('unauthorized', { status: 401 });

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`,
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    // Everything is OK
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      timestamp,
      text,
      senderId: sender.id,
    };

    const message = messageValidator.parse(messageData);

    // notify user directly
    pusherServer.trigger(
      toPusherKey(`user:${receiverId}:chats`),
      'new_message',
      { ...message, senderImg: sender.image, senderName: sender.name },
    );

    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming_messages',
      message,
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) return new Response(error.message);

    return new Response('Something went wrong in the server');
  }
}
