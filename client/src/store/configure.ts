import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import projectsReducer from './reducers/projects';
import loginReducer from './reducers/login';
import tasksReducer from './reducers/tasks';
import usersReducer from './reducers/users';

import rootSaga from './saga/rootSaga';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

const reducers = combineReducers({
    auth: loginReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    users: usersReducer
})

const sagaMidleware = createSagaMiddleware();

const composeEnchanters = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnchanters(applyMiddleware(sagaMidleware))
);

sagaMidleware.run(rootSaga);

export default store;