import { useGet } from './use-get';
import { usePost } from './use-post';
import { makeDocumentListItem } from '../data-types/document';

export const useQueueDocuments = (name, { limit = 10 } = {}) => {
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/documents`, {
    params: {
      limit,
    },
  });

  // Used with custom URL in "onDocPlay()"
  // should we just use axios here?
  const [_, playApi] = usePost();

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
    playApi
      .send({}, undefined, `/api/v1/queues/${name}/play/${doc.subject}`)
      .then(() =>
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
