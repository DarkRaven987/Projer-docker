import {
    all
} from 'redux-saga/effects';
import projectsSagas from './projects';
import loginSagas from './login';
import tasksSagas from './tasks';
import usersSagas from './users';
import socketSagas from './socket';

export default function* rootSaga() {
    yield all([
        projectsSagas(),
        loginSagas(),
        tasksSagas(),
        usersSagas(),
        socketSagas()
    ])
}