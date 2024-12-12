export type BackendResponse = BackendSuccessResponse | BackendErrorResponse;

export type BackendErrorResponse = {
  STATE: "ERROR";
  message: string;
};

export type BackendSuccessResponse = {
  STATE: "SUCCESS";
} & (BackendTrainingResponse | BackendDetectingResponse);

export type BackendTrainingResponse = {
  STAGE: "TRAINING";
};

export type BackendDetectingResponse = {
  STAGE: "DETECTING";
  result: BackendDetectingResponseResult[];
};

export type BackendDetectingResponseResult = {
  id: string;
  confidence: number;
  set: string;
  number: string;
  name: string;
};
