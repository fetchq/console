export const makeDocumentListItem = (rawData) => {
  const createdAt = new Date(rawData.created_at);
  const nextIteration = new Date(rawData.next_iteration);
  const lastIteration = rawData.last_iteration
    ? new Date(rawData.last_iteration)
    : null;

  return {
    subject: String(rawData.subject),
    createdAt,
    nextIteration,
    lastIteration,
  };
};
