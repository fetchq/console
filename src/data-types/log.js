export const makeLogListItem = (rawData) => {
  const createdAt = new Date(rawData.created_at);

  return {
    id: Number(rawData.id),
    createdAt,
    subject: String(rawData.subject),
    message: String(rawData.message),
    details: Object(rawData.details),
    refId: rawData.ref_id ? String(rawData.ref_id) : '',
  };
};

export const makeLogDetails = (...args) => makeLogListItem(...args);
