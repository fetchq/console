import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';

import DisplayDate from '../components/DisplayDate';
import ShortUUID from '../components/ShortUUID';

const QueueDocumentsList = ({
  items,
  pagination,
  loadPage,
  onPlayDocument,
  onDropDocument,
  onDiscloseDocument,
}) => {
  const onPageChange = (evt, offset) => loadPage(offset - 1);

  const cancelEvt = (handler) => (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    handler();
  };

  const dropHandler = (doc) => () => {
    if (confirm(`Do you really want to PERMANENTLY DELETE this document?`)) {
      onDropDocument(doc);
    }
  };

  const playHandler = (doc) => () => {
    onPlayDocument(doc);
  };

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
          Documents
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
              <TableCell>Subject</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last Run At</TableCell>
              <TableCell>Next Run</TableCell>
              <TableCell align="right">actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((doc) => {
              return (
                <TableRow
                  key={doc.subject}
                  onClick={() => onDiscloseDocument(doc)}
                >
                  <TableCell>
                    <ShortUUID uuid={doc.subject} />
                  </TableCell>
                  <TableCell align="center">{doc.status}</TableCell>
                  <TableCell>
                    <DisplayDate date={doc.createdAt} />
                  </TableCell>
                  <TableCell>
                    <DisplayDate date={doc.lastIteration} />
                  </TableCell>
                  <TableCell>
                    <DisplayDate date={doc.nextIteration} />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="drop"
                      onClick={cancelEvt(dropHandler(doc))}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="play"
                      onClick={cancelEvt(playHandler(doc))}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </TableCell>
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

QueueDocumentsList.propTypes = {
  onDiscloseDocument: PropTypes.func.isRequired,
  onDropDocument: PropTypes.func.isRequired,
  onPlayDocument: PropTypes.func.isRequired,
};

export default QueueDocumentsList;
