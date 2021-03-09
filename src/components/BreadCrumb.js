import React from 'react';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const BreadCrumb = ({ items }) => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {items.map(({ label, href }) => (
        <Link
          key={label + href}
          color="inherit"
          href={href}
          to={href}
          component={RouterLink}
        >
          {label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
