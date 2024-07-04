import socketIOClient from 'socket.io-client';
import config from '../../config/index';
// const ENDPOINT = process.env.REACT_APP_SOCKET_PORT ;
const socket = socketIOClient(config.serverUrl,
{ transports: ["websocket"] });

export default socket;
