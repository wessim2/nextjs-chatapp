import { fetchRedis } from './redis';

export const getFriendsByUserId = async (userId: string) => {
  const friendsIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`,
  )) as string[];

  const friends = Promise.all(
    friendsIds.map(async (id: string) => {
      const friend = (await fetchRedis('get', `user:${id}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    }),
  );
  return friends;
};
