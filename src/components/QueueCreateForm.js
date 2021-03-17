import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

const QueueCreateForm = ({ onSubmit }) => {
  const classes = useStyles();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    const data = {
      name: evt.target['queue-name'].value,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form
      noValidate
      autoComplete="off"
      className={classes.root}
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title="New Queue"
          subheader="A queue is a namespace for scheduled and repeatable tasks."
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            margin="normal"
            id="queue-name"
            label="Queue Name"
            variant="outlined"
            size="small"
          />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Card>
    </form>
  );
};

QueueCreateForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default QueueCreateForm;
