// Config socket.io client and export socketIoInstance
import { io } from 'socket.io-client';
import { API_ROOT } from './utils/constants';
export const socketIoInstance = io(API_ROOT);