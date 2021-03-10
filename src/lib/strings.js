export const shortUUID = (uuid) => {
  const tokens = uuid.split('-');
  return `${tokens.shift()}...${tokens.pop()}`;
};
