import { useGet } from './use-get';
import { useAxios } from './use-axios';
import { makeDocumentListItem } from '../data-types/document';

export const useQueueDocs = (name, { limit = 10 } = {}) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/docs`, {
    params: {
      limit,
    },
  });

  // Used with custom URL in "onDocPlay()"
  // should we just use axios here?
  const axios = useAxios();

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

  const onDocPlay = (doc) =>
    axios.post(`/api/v1/queues/${name}/play/${doc.subject}`).then(() =>
      reload({
        keepData: true,
        params: {
          ...pagination,
        },
      }),
    );

  return {
    isLoading: info.isLoading,
    hasData,
    items,
    pagination,
    reload,
    loadPage,
    onDocPlay,
  };
};
