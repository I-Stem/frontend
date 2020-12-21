import {
  IAfcServiceDocument,
  ICaptioningServiceDocument,
  ICreditsData,
} from "@Interfaces";
import { ServiceInstance } from "./ServiceInstance";

declare namespace IStemServices {
  interface IProps {
    serviceInstance: ServiceInstance;
    disabled?: boolean;
  }
}

export interface TableProps {
  tableData: [IAfcServiceDocument] | [ICaptioningServiceDocument] | [];
  updateFunction: Function;
  serviceType: string;
}

export interface ModalProps {
  children?: JSX.Element[] | JSX.Element;
  showModal: boolean;
  primaryAction?: Function;
  secondaryAction(e): Function;
  service?: IAfcServiceDocument | ICaptioningServiceDocument;
  serviceType: string;
  updateFunction: Function;
  afcEscalate: Function;
  vcEscalate: Function;
  credits: ICreditsData;
  updateCredits: Function;
}

export interface FeedbackModalProps {
  showModal: boolean;
  closeAction: Function;
  service?: IAfcServiceDocument | ICaptioningServiceDocument;
  updateFunction: Function;
  serviceType: string;
  afcReview: Function;
  vcReview: Function;
}

export interface ISearchDocument {
  searchAction?: (values: Store) => void;
}

export interface TagProps {
  status: number;
}

export { IStemServices };
