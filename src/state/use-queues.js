import { useGet } from './use-get';
import { makeQueueListItem } from '../data-types/queue';

const endpoint = '/api/v1/queues';

export const useQueues = () => {
  const [info, api] = useGet(endpoint);

  const hasData = Boolean(info.data);
  const items = hasData ? info.data.items.map(makeQueueListItem) : [];

  return {
    isLoading: info.isLoading,
    hasData,
    items,
    reload: () => api.fetch({ keepData: true }),
  };
};
