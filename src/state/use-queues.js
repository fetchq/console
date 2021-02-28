import { useGet } from './use-get';
import { makeQueue } from '../data-types/queue';

const endpoint = '/api/v1/queue';

export const useQueues = () => {
  const [info] = useGet(endpoint);

  const hasData = Boolean(info.data);
  const items = hasData ? info.data.items.map(makeQueue) : [];

  return {
    isLoading: info.isLoading,
    hasData,
    items,
  };
};
