import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ViewTitle from '../components/ViewTitle';
import BreadCrumb from '../components/BreadCrumb';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(3),
  },
}));

const AppLayout = ({ children, titleProps, breadCrumb }) => {
  const classes = useStyles();
  return (
    <div className={classes.content}>
      {breadCrumb && (
        <div style={{ marginBottom: 10 }}>
          <BreadCrumb items={breadCrumb} />
        </div>
      )}
      {titleProps && <ViewTitle {...titleProps} />}
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  /**
   * Properties to setup a ViewTitle component
   */
  titleProps: PropTypes.object,
  breadCrump: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ),
};

export default AppLayout;
