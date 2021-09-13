import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Switch, Route } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useQueueDetails } from '../state/use-queue-details';
import { useQueueDrop } from '../state/use-queue-drop';

import AppLayout from '../layouts/AppLayout';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocsView from './QueueDocsView';
import QueueLogsView from './QueueLogsView';
import DocumentCreateView from './DocumentCreateView';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  panels: {
    paddingLeft: 30,
  },
}));

const QueueDetailsView = ({
  match: {
    params: { queueName, section },
  },
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { queue, metrics, hasData, reload, ...info } =
    useQueueDetails(queueName);
  const { drop } = useQueueDrop({
    onSuccess: () => history.push('/'),
    onError: (err) => alert(err.message),
  });

  const sectionId = section || 'dashboard';
  const sectionName =
    section === 'dashboard'
      ? 'Dashboard'
      : section === 'docs'
      ? 'Documents'
      : 'Logs';

  const linkTo = (panel) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/queues/${queueName}/${panel}`);
  };

  return (
    <AppLayout
      titleProps={{
        title: queueName,
        subtitle: sectionName,
      }}
      breadCrumb={[
        {
          label: 'queues',
          href: '/',
        },
        {
          label: queueName,
          href: `/queues/${queueName}`,
        },
      ]}
    >
      <div className={classes.root}>
        <Tabs
          value={sectionId}
          textColor="primary"
          indicatorColor="primary"
          orientation="vertical"
          className={classes.tabs}
        >
          <Tab
            value={'dashboard'}
            component="a"
            label="Dashboard"
            onClick={linkTo('')}
          />
          <Tab
            value={'docs'}
            component="a"
            label="Documents"
            onClick={linkTo('docs')}
          />
          <Tab
            value={'logs'}
            component="a"
            label="Logs"
            onClick={linkTo('logs')}
          />
          <Tab
            value={'create'}
            component="a"
            label="Add Document"
            onClick={linkTo('create')}
          />
        </Tabs>
        <div className={classes.panels}>
          <Switch>
            <Route
              exact
              path="/queues/:queueName"
              component={() => (
                <div>
                  {hasData && (
                    <QueueDetailsInfo
                      queue={queue}
                      metrics={metrics}
                      onReload={reload}
                      onDelete={drop}
                    />
                  )}
                  <pre>{JSON.stringify(info, null, 2)}</pre>
                </div>
              )}
            />
            <Route
              exact
              path="/queues/:queueName/docs"
              component={QueueDocsView}
            />
            <Route
              exact
              path="/queues/:queueName/logs"
              component={QueueLogsView}
            />
            <Route
              exact
              path="/queues/:queueName/create"
              component={DocumentCreateView}
            />
          </Switch>
        </div>
      </div>
    </AppLayout>
  );
};

export default QueueDetailsView;
