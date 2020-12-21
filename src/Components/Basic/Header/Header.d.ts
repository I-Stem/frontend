import { Func0 } from "redux";

declare namespace IHeader {
  export interface IProps {
    children?: JSX.Element;
    toggleDrawer?: Func0;
  }
  export interface ICreditStateProps {
    totalCredits: number;
  }
  export interface InitialProps {
    namespacesRequired: string[];
    totalCredits?: number;
  }
}
export { IHeader };
