import { SERVER_CONNECTION, EMIT_SOCKET_ACTION } from "../constant/socket";

export const serverConnectionAction = () => ({
    type: SERVER_CONNECTION
})

export const emitSocketAction = (data: any) => ({
    type: EMIT_SOCKET_ACTION,
    data
})