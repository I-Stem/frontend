import imageConstants from "@Definitions/Constants/image";
import {
  AFC_HOME_ROUTE,
  VIDEO_CAPTIONING_HOME_ROUTE,
} from "@Definitions/Constants";
import { ServiceInstance } from "@Components/StemServices/ServiceInstance";

const servicesList: ServiceInstance[] = [
  new ServiceInstance(
    "Document Accessibility",
    "Easily convert documents to common accessible formats.",
    imageConstants.ALTERNATE_FORMAT_CONVERSION,
    AFC_HOME_ROUTE
  ),
  new ServiceInstance(
    "Audio/Video Accessibility",
    "Automated captioning of audio/video and text extraction from video using standard or custom trained models.",
    imageConstants.VIDEO_AND_AUDIO_CAPTIONING,
    VIDEO_CAPTIONING_HOME_ROUTE
  ),
  new ServiceInstance(
    "Resources",
    "Explore resources and opportunities to learn, network and get hired.",
    imageConstants.WEBINARS,
    "/dashboard"
  ),
  // new ServiceInstance(
  //   "Volunteer connect",
  //   "Request a volunteer and get the perfect match for you based on your preferences.",
  //   imageConstants.VOLUNTEER_CONNECT
  // ),
  // new ServiceInstance(
  //   "Mentor connect",
  //   "Request a mentor and get the perfect match for you based on your preferences.",
  //   imageConstants.MENTOR_CONNECT
  // ),
  // new ServiceInstance(
  //   "Training",
  //   "Training programs by I-Stem to take your skills to the next level in the industry.",
  //   imageConstants.TRAINING
  // ),
];

export default servicesList;
