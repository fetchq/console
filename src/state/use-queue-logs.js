import { useEffect } from 'react';
import { useGet } from './use-get';
import { makeLogListItem } from '../data-types/log';

export const useQueueLogs = (name, { limit = 10, subject = null } = {}) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/logs`, {
    lazy: true,
    params: {
      limit,
      subject,
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
        subject,
      },
    });

  // Force reload when the parameters change but
  useEffect(() => {
    reload({ keepData: true, params: { limit, subject } });
  }, [name, subject]);

  return {
    isLoading: info.isLoading,
    hasData,
    items,
    pagination,
    reload,
    loadPage,
  };
};
