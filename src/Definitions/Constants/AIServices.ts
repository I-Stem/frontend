import imageConstants from "@Definitions/Constants/image";
import {
  AFC_HOME_ROUTE,
  VIDEO_CAPTIONING_HOME_ROUTE,
  HIRING,
} from "@Definitions/Constants";
import { ServiceInstance } from "@Components/StemServices/ServiceInstance";

const AIservicesList: ServiceInstance[] = [
  new ServiceInstance(
    "Document Accessibility",
    "Easily convert documents to common accessible formats.",
    imageConstants.ALTERNATE_FORMAT_CONVERSION,
    AFC_HOME_ROUTE
  ),
  new ServiceInstance(
    "Video & Audio Accessibility",
    "Image to text & automated captioning services for audio and video files.",
    imageConstants.VIDEO_AND_AUDIO_CAPTIONING,
    VIDEO_CAPTIONING_HOME_ROUTE
  ),
];

export default AIservicesList;
