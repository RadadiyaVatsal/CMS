import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import fileReducer from './reducers/fileReducer';

const store = createStore(
    fileReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
