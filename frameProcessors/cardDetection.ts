import { Frame, VisionCameraProxy } from "react-native-vision-camera";

const plugin = VisionCameraProxy.initFrameProcessorPlugin("detectCard", {});

export function detectCard(frame: Frame): object {
  "worklet";
  if (plugin == null)
    throw new Error('Failed to load Frame Processor Plugin "detectCard"!');
  return plugin.call(frame);
}
