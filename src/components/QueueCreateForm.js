import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
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
      <Typography>Add a new queue:</Typography>
      <Grid container>
        <Grid item>
          <TextField
            id="queue-name"
            label="Queue Name"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item className={classes.actions}>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

QueueCreateForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default QueueCreateForm;
