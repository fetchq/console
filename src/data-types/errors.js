import PropTypes from 'prop-types';

export const error = PropTypes.shape({
  message: PropTypes.string.isRequired,
});

export const errors = PropTypes.arrayOf(error);

export const makeErrorListItem = (error) => {
  return {
    message: String(error.message),
  };
};
