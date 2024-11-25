export type BaseEvent<T = string> = {
  eventName: T;
};

export type BaseEventwithProperties<T = string, S = Record<string, unknown>> = {
  eventName: T;
  properties: S;
};

type MiscEventTypePayload = {
  "email sent": {
    to: string;
    subject: string;
    emailId?: string;
    payload?: Record<string, unknown>;
  };
};

export type EventTypePayload = MiscEventTypePayload;

export type EventTypeName = keyof {
  [K in keyof EventTypePayload as EventTypePayload[K] extends Record<
    string,
    unknown
  >
    ? K
    : never]: unknown;
};
