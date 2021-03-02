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
  const hasNextPage = items.length === pagination.limit;
  const hasPrevPage = pagination.offset > 0;

  const loadNextPage = () =>
    reload({
      keepData: true,
      params: {
        limit,
        offset: pagination.offset + 1,
      },
    });

  const loadPrevPage = () =>
    reload({
      keepData: true,
      params: {
        limit,
        offset: pagination.offset - 1,
      },
    });

  return {
    isLoading: info.isLoading,
    hasData,
    items,
    pagination,
    reload,
    hasNextPage,
    hasPrevPage,
    loadNextPage,
    loadPrevPage,
  };
};
