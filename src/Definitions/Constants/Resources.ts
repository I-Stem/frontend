import imageConstants from "@Definitions/Constants/image";
import { ServiceInstance } from "@Components/StemServices/ServiceInstance";

const ResourcesList: ServiceInstance[] = [
  // new ServiceInstance(
  //   "Hackathon",
  //   "Work together, ideate and develop solutions to some of the most pressing accessibility problems.",
  //   imageConstants.HACKER,
  //   "/dashboard/hackathon"
  // ),
  new ServiceInstance(
    "Mentorship",
    "Sign up as a mentee or mentor to learn and grow.",
    imageConstants.MENTORSHIP,
    "/dashboard/mentorship"
  ),
  new ServiceInstance(
    "Job Opportunities",
    "Explore opportunities with our corporate partners.",
    imageConstants.JOB_OPPORTUNITIES,
    "/dashboard/job-opportunities/jobpreferences"
  ),
  new ServiceInstance(
    "Learning Hub",
    "Develop your skills with I-Stem resources and content.",
    imageConstants.LEARNING_HUB,
    "/dashboard/learning-hub"
  ),
  new ServiceInstance(
    "Webinars",
    "Learn about the latest in the world of accessibility and inclusion with I-Stem webinars",
    imageConstants.WEBINARS,
    "/dashboard/webinars"
  ),
];

export default ResourcesList;
