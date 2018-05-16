import './css/__styles.less';
//import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { HashRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { ApplicationState }  from './store';
import * as RoutesModule from './routes';

let routes = <RoutesModule.rotes />;

// Create browser history to use in the Redux store
// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
// const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    ReactDOM.render(
        <Provider store={ store }>
            <HashRouter children={ routes } />
            {/* <ConnectedRouter history={ history } children={ routes } /> */}
        </Provider>,
        document.getElementById('react-app')
    );
}

renderApp();

console.log("Scarfinity start...");

// // Allow Hot Module Replacement
// if (module.hot) {
//     module.hot.accept('./routes', () => {
//         routes = require('./routes').routes;
//         renderApp();
//     });
// }
// hello git
