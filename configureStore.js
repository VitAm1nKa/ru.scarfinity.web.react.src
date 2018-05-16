require("babel-core/register");
require("babel-polyfill");

import { createStore, applyMiddleware, compose }    from 'redux';
import { composeWithDevTools }                      from 'redux-devtools-extension';
import thunk                                        from 'redux-thunk';
import { History }                                  from 'history';
import _                                            from 'lodash';

import reducers                                     from './store';

export default function configureStore(history, initialState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        devToolsExtension ? devToolsExtension() : (next) => next
    )(createStore);

    const store = createStoreWithMiddleware(reducers, initialState) ;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}
