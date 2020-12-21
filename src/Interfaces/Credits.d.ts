// #region Global Imports
import { ICreditsResponse } from "@Interfaces";
// #endregion Global Imports

export declare module ICredits {
  export interface InitialProps {}

  export interface IStateProps {
    [key: string]: string | number;
    totalCredits: number;
  }

  module Actions {
    export interface IMapPayload {
      totalCredits: number;
      cost: number;
    }
    export interface IMapResponse extends ICreditsResponse {}
  }
}
