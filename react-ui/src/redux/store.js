import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'

// Build the middleware for intercepting and dispatching navigation actions
export const store = createStore(reducer, applyMiddleware(thunk));

export const history = createBrowserHistory()