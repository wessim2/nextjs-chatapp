import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <main className='pt-8'>
      <Skeleton className='mb-6' height={60} width={500} />
      <Skeleton className='mb-4' height={40} width={350} count={6} />
    </main>
  );
};

export default loading;
