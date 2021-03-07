export const makeDocumentListItem = (rawData) => {
  const createdAt = new Date(rawData.created_at);
  const nextIteration = new Date(rawData.next_iteration);
  const lastIteration = rawData.last_iteration
    ? new Date(rawData.last_iteration)
    : null;

  return {
    subject: String(rawData.subject),
    status: Number(rawData.status),
    createdAt,
    nextIteration,
    lastIteration,
    version: Number(rawData.version),
    attempts: Number(rawData.attempts),
    iterations: Number(rawData.iterations),
    payload: Object(rawData.payload),
  };
};

export const makeDocumentDetails = (rawData) => {
  return {
    ...makeDocumentListItem(rawData),
  };
};
