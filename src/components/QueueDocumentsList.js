import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DisplayDate from '../components/DisplayDate';

const QueueDocumentsList = ({ items, pagination, loadNextPage, ...rest }) => {
  const onDisclose = (doc) => console.log(doc);
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last Run At</TableCell>
              <TableCell>Next Run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((doc) => {
              return (
                <TableRow key={doc.subject} onClick={() => onDisclose(doc)}>
                  <TableCell>{doc.subject}</TableCell>
                  <TableCell>
                    <DisplayDate date={doc.createdAt} />
                  </TableCell>
                  <TableCell>
                    <DisplayDate date={doc.lastIteration} />
                  </TableCell>
                  <TableCell>
                    <DisplayDate date={doc.nextIteration} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination.hasNext && <button onClick={loadNextPage}>load more</button>}
    </>
  );
};

export default QueueDocumentsList;
