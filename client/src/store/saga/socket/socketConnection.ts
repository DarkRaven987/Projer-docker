import io from 'socket.io-client';
import { BASE_URL } from '../../../utils/api';

export const startSocketConnection = async () => {
    const socket = io(BASE_URL, {transports: ['websocket']});
    return socket;
}