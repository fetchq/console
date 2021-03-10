import React from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';

import DisplayDate from '../components/DisplayDate';
import ShortUUID from '../components/ShortUUID';

const QueueLogsList = ({ items, pagination, loadPage, onLogDisclose }) => {
  const onPageChange = (evt, offset) => loadPage(offset - 1);

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          marginBottom: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant="h6" component="h2">
          Logs
        </Typography>
        <Pagination
          count={Math.ceil(pagination.count / pagination.limit)}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          page={pagination.offset + 1}
          onChange={onPageChange}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((log) => {
              return (
                <TableRow key={log.id} onClick={() => onLogDisclose(log)}>
                  <TableCell>
                    <DisplayDate date={log.createdAt} />
                  </TableCell>
                  <TableCell>
                    <ShortUUID uuid={log.subject} />
                    {log.refId && (
                      <>
                        <br />
                        <small>
                          <b>refId:</b> {log.refId}
                        </small>
                      </>
                    )}
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ marginTop: 15, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Pagination
          count={Math.ceil(pagination.count / pagination.limit)}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          page={pagination.offset + 1}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default QueueLogsList;
