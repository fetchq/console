import { useState, useEffect } from 'react';
import { useGet } from './use-get';
import { makeDocumentListItem } from '../data-types/document';
// import { makeQueueDetails, makeQueueMetrics } from '../data-types/queue';

const dedupeBySubject = (v, i, a) =>
  a.findIndex((t) => t.subject === v.subject) === i;

export const useQueueDocuments = (name, { limit = 10 } = {}) => {
  const [items, setItems] = useState([]);
  const [info, { fetch: reload }] = useGet(`/api/v1/queues/${name}/documents`, {
    params: {
      limit,
    },
  });

  const hasData = Boolean(info.data);
  // const items = hasData ? info.data.items.map(makeDocumentListItem) : [];
  const pagination = hasData ? info.data.pages : {};

  const loadNextPage = () =>
    reload({
      keepData: true,
      params: {
        limit,
        cursor: pagination.cursorEnd,
      },
    });

  // Horrible method to cumulate the items from the
  // response and deduplicate the resulting array.
  //
  // This is HIGHLY INEFFICIENT and need refactoring with
  // some form of lookup with a dictionary on subject or similar.
  useEffect(() => {
    if (info.data) {
      setItems([...items, ...info.data.items].filter(dedupeBySubject));
    }
  }, [info]);

  return {
    isLoading: info.isLoading,
    hasData,
    items: items.map(makeDocumentListItem),
    pagination,
    reload,
    loadNextPage,
  };
};
