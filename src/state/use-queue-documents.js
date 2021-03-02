import { useGet } from './use-get';
import { makeDocumentListItem } from '../data-types/document';

export const useQueueDocuments = (name, { limit = 10 } = {}) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/documents`, {
    params: {
      limit,
    },
  });

  const hasData = Boolean(info.data);
  const items = hasData ? info.data.items.map(makeDocumentListItem) : [];
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
