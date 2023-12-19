import { fetchRedis } from '@/helpers/redis';

export async function GET(req: Request) {
  try {
    const body = await req.json();

    const userId = body.user.id;

    const res = (
      await fetchRedis('smembers', `user:${userId}:incoming_friends-requests`)
    ).length();

    return new Response(res, { status: 200 });
  } catch (error) {
    return new Response('Something went wrong', { status: 400 });
  }
}
