import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Switch, Route } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useQueueDetails } from '../state/use-queue-details';

import AppLayout from '../layouts/AppLayout';
import QueueDetailsInfo from '../components/QueueDetailsInfo';
import QueueDocsView from './QueueDocsView';
import QueueLogsView from './QueueLogsView';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    // '& span.MuiTab-wrapper': {
    //   alignItems: 'left',
    // },
  },
  panels: {
    paddingLeft: 30,
  },
}));

const QueueDetailsView = ({
  match: {
    params: { queueName },
  },
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { queue, metrics, hasData, reload, ...info } = useQueueDetails(
    queueName,
  );

  const linkTo = (panel) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/queues/${queueName}/${panel}`);
  };

  return (
    <AppLayout
      titleProps={{
        title: `Queue: ${queueName}`,
        backTo: '/',
      }}
    >
      <div className={classes.root}>
        <Route
          path="/queues/:queueName/:panelName?"
          render={({
            match: {
              params: { panelName = 'dashboard' },
            },
          }) => (
            <Tabs
              value={panelName}
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
            </Tabs>
          )}
        />
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
                      reload={reload}
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
          </Switch>
        </div>
      </div>
    </AppLayout>
  );
};

export default QueueDetailsView;
