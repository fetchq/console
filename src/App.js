import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import LoadingView from './views/LoadingView';
import LoginView from './views/LoginView';
import Dashboard from './views/Dashboard';
import QueueDetailsView from './views/QueueDetailsView';
import DocumentDetailsView from './views/DocumentDetailsView';
import LogDetailsView from './views/LogDetailsView';
import SecretAlert from './containers/SecretAlert';
import { useAuth } from './state/use-auth';
import AppBar from './containers/AppBar';

export default function App() {
  const { hasChecked, hasAuth, errorMsg } = useAuth();

  // Show a hard error in case the network is not available
  // -- this is likely a CORS error --
  if (errorMsg === 'network') {
    return (
      <div style={{ padding: 20 }}>
        <h4>
          <span role="img" aria-label="error">
            ⛔️
          </span>{' '}
          Fetchq CONSOLE
        </h4>
        <p>
          There seems to be a network problem.
          <br />
          <small>
            (open your <em>DevTools</em> to get more details)
          </small>
        </p>
      </div>
    );
  }

  if (!hasChecked) {
    return <LoadingView />;
  }

  if (!hasAuth) {
    return <LoginView />;
  }

  return (
    <Router>
      <SecretAlert />
      <AppBar />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route
          path="/queues/:queueName/docs/:docSubject"
          component={DocumentDetailsView}
        />
        <Route
          path="/queues/:queueName/logs/:logId"
          component={LogDetailsView}
        />
        <Route
          path="/queues/:queueName/:section?"
          component={QueueDetailsView}
        />
      </Switch>
    </Router>
  );
}
