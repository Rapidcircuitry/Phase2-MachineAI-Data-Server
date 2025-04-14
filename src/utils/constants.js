export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
};

const ORGANIZATION = "onivart";

export const BATCH_SIZE = 1;

export const APPLICATION_ENV_TYPES = Object.freeze({
  DEV: "development",
  TEST: "testing",
  PROD: "production",
});

// Constants for topic prefixes and types
export const TOPICS = {
  REGISTER: {
    topic: `/${ORGANIZATION}/device-register`,
    type: "subscribe",
    matchingKey: "device-register",
    expectedFormat: {
      macId: "string",
      chipId: "string",
    },
  },
  CONFIGURE: {
    topic: `/${ORGANIZATION}/device-configure/+`,
    type: "publish",
    matchingKey: "device-configure",
  },
  CONTROL: {
    topic: `/${ORGANIZATION}/device-control-command/+`,
    type: "publish",
    matchingKey: "device-control-command",
  },
  PING: {
    topic: `/${ORGANIZATION}/device-ping/+`,
    type: "publish",
    matchingKey: "device-ping",
  },
  PONG: {
    topic: `/${ORGANIZATION}/device-pong/+`,
    type: "subscribe",
    matchingKey: "device-pong",
  },
  STATUS: {
    topic: `/${ORGANIZATION}/device-active-status/+`,
    type: "publish",
    matchingKey: "device-active-status",
    expectedFormat: {
      active: "boolean",
    },
  },
  DATA: {
    topic: `/${ORGANIZATION}/device-data/+/+`,
    type: "subscribe",
    matchingKey: "device-data",
  },
  TOGGLE_DATA_SENDING: {
    topic: `/${ORGANIZATION}/device-toggle-data-sending/+`,
    type: "publish",
    matchingKey: "device-toggle-data-sending",
    expectedFormat: {
      sendingActive: "boolean",
    },
  },
  INPUT_STATES: {
    topic: `/${ORGANIZATION}/device-input-states/+`,
    type: "subscribe",
    matchingKey: "device-input-states",
    expectedFormat: {
      states: "array",
    },
  },
  OUTPUT_STATES: {
    topic: `/${ORGANIZATION}/device-output-states/+`,
    type: "publish",
    matchingKey: "device-output-states",
    expectedFormat: {
      states: "array",
    },
  },
  ACK: {
    topic: `/${ORGANIZATION}/device-ack/+`,
    type: "subscribe",
    matchingKey: "device-ack",
    expectedFormat: {
      ack: "boolean",
      ackId: "string",
    },
  },
  WIPE_DATA: {
    topic: `/${ORGANIZATION}/device-wipe-data/+`,
    type: "publish",
    matchingKey: "device-wipe-data",
    expectedFormat: {
      wipe: "boolean",
      ackId: "string",
    },
  },
};

export const DEVICE_TYPES = {
  EM: "1", // Energy Meter
  BMS: "2", // Battery Monitoring System
  TS: "3", // Temperature Sensor
};

// Testing Config Data
export const IS_TESTING_ALLOWED = false;

// Socket.IO events
export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  DEVICE_REGISTER: "device-register",
  DEVICE_CONFIGURE: "device-configure",
  DEVICE_CONTROL: "device-control",
  DEVICE_PING: "device-ping",
  DEVICE_PONG: "device-pong",
  DEVICE_ACTIVE_STATUS: "device-active-status",
  DEVICE_DATA: "device-data",
  DEVICE_TOGGLE_DATA_SENDING: "device-toggle-data-sending",
  DEVICE_INPUT_STATES: "device-input-states",
  DEVICE_OUTPUT_STATES: "device-output-states",
  DEVICE_ACK: "device-ack",
  DEVICE_DATA_ERROR: (macId, typeId) => `device-data-error-${macId}-${typeId}`,
  DEVICE_DATA: (macId, typeId) => `device-data-${macId}-${typeId}`,
  DEVICE_STATUS: (macId) => `device:${macId}:status`,
};

export const VALIDATION_TYPES = Object.freeze({
  EMAIL: "email",
  PASSWORD: "passsword",
  PURE_NAME: "pure_name",
  ALPHA_NAME: "alpha_name",
  PHONE: "phone",
  DATE: "date",
  JSON: "json",
  INTEGER: "integer",
  STRING: "string",
  ARRAY: "array",
  DATETIME: "datetime",
  CUSTOM: "custom",
});

export const TOTAL_IO_CHANNELS = 4;

export const ANALOG_INPUT_TYPES = Object.freeze({
  TYPES: ["FOUR_TO_TWENTY", "ZERO_TO_TEN"],
  FOUR_TO_TWENTY: {
    key: "FOUR_TO_TWENTY",
    label: "4-20mA",
    min: 4,
    max: 20,
  },
  ZERO_TO_TEN: {
    key: "ZERO_TO_TEN",
    label: "0-10V",
    min: 0,
    max: 10,
  },
});
