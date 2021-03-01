import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DisplayDate from '../components/DisplayDate';
import { queueShape } from '../data-types/queue';

const QueueListTable = ({ items, onDisclose }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell align="center">Statuts</TableCell>
          <TableCell align="center">Documents</TableCell>
          <TableCell align="right">Max Attempts</TableCell>
          <TableCell align="right">Logs Retention</TableCell>
          <TableCell align="right">Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((queue) => {
          return (
            <TableRow key={queue.id} onClick={() => onDisclose(queue)}>
              <TableCell>{queue.id}</TableCell>
              <TableCell>{queue.name}</TableCell>
              <TableCell align="center">
                {queue.isActive ? 'active' : 'paused'}
              </TableCell>
              <TableCell align="center">
                {queue.cnt}
                <small>/{queue.cnt}</small>
              </TableCell>
              <TableCell align="right">{queue.maxAttempts}</TableCell>
              <TableCell align="right">{queue.logsRetention}</TableCell>
              <TableCell align="right">
                <DisplayDate date={queue.created_at} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

QueueListTable.propTypes = {
  items: PropTypes.arrayOf(queueShape).isRequired,
  onDisclose: PropTypes.func,
};

QueueListTable.defaultProps = {
  onDisclose: () => {},
};

export default QueueListTable;
