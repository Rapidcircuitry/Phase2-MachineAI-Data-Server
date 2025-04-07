import { getIo } from "../config/socket.config.js";
import { SOCKET_EVENTS } from "../utils/constants.js";

export const deviceLiveStatusMap = new Map();

// Time in milliseconds after which a device is considered offline
export const DEVICE_OFFLINE_THRESHOLD = 30000; // 30 seconds

export const updateDeviceLiveStatus = (macId) => {
  const key = macId;
  deviceLiveStatusMap.set(key, {
    macId: key,
    lastSeen: Date.now(),
    isOnline: true,
  });
};

export const checkDeviceStatus = () => {
  const now = Date.now();
  const io = getIo();

  deviceLiveStatusMap.forEach((status, key) => {
    const timeSinceLastSeen = now - status.lastSeen;

    const event = SOCKET_EVENTS.DEVICE_STATUS(key);

    if (timeSinceLastSeen > DEVICE_OFFLINE_THRESHOLD && status.isOnline) {
      // Device just went offline
      status.isOnline = false;
      io.emit(event, {
        macId: key,
        isOnline: false,
        lastSeen: status.lastSeen,
      });
    } else {
      // Device is online and has been updated
      io.emit(event, deviceLiveStatusMap.get(key));
    }
  });
};
