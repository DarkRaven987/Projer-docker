import { put, call, all, take, takeLatest, apply } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

import { SERVER_CONNECTION, EMIT_SOCKET_ACTION } from "../../constant/socket";
import { startSocketConnection } from "./socketConnection";
import subscribe from "./subscriptions";

function createSocketChannel(socket: any) {
  return eventChannel((emit) => {
    const subscriptions = subscribe(emit);
    subscriptions.forEach((listener) => socket.on(...listener));

    const unsubscribe = () => {
      subscriptions.forEach((listener) => socket.off(...listener));
    };

    return unsubscribe;
  });
}

function* watchSocketChanel(socketChanel: any) {
  while (true) {
    try {
      const action = yield take(socketChanel);
      yield put(action);
    } catch (err) {
      console.log(err);
    }
  }
}

function* watchSocketAction(socket: any) {
  while (true) {
    try {
      const { data } = yield take(EMIT_SOCKET_ACTION);
      yield apply(socket, socket.emit, [data.type, data.data]);
    } catch (error) {
      console.error("SocketAction: ", error);
    }
  }
}

function* socketWrapper() {
  const socket = yield call(startSocketConnection);
  const socketChannel = yield all([createSocketChannel(socket)]);

  yield all([
    ...socketChannel.map((socketCh: any) => watchSocketChanel(socketCh)),
    watchSocketAction(socket),
  ]);
}

function* socketSagas() {
  yield takeLatest(SERVER_CONNECTION, socketWrapper);
}

export default socketSagas;
