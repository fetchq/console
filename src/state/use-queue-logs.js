import { useGet } from './use-get';
import { makeLogListItem } from '../data-types/log';

export const useQueueLogs = (name, { limit = 10 } = {}) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/logs`, {
    params: {
      limit,
    },
  });

  const hasData = Boolean(info.data);
  const items = hasData ? info.data.items.map(makeLogListItem) : [];
  const pagination = hasData ? info.data.pagination : {};

  const loadPage = (offset) =>
    reload({
      keepData: true,
      params: {
        limit,
        offset,
      },
    });

  return {
    isLoading: info.isLoading,
    hasData,
    items,
    pagination,
    reload,
    loadPage,
  };
};
