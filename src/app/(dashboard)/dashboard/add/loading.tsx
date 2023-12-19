import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className='pt-8'>
      <Skeleton className='mb-6' height={60} width={500} />
      <Skeleton height={20} width={150} />
      <Skeleton height={50} width={400} />
    </div>
  );
};

export default loading;
