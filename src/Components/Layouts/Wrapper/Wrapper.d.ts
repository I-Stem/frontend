import { ICreditsData } from "@Interfaces";

export interface IWrapperProps {
  children: JSX.Element | JSX.Element[];
  credits: ICreditsData;
  getCredits: Function;
  onChangeFocus?: Function;
}
