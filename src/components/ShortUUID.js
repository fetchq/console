import React from 'react';
import { shortUUID } from '../lib/strings';

const ShortUUID = ({ uuid }) => {
  return <>{shortUUID(uuid)}</>;
};

export default ShortUUID;
