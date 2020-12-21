import SuccessScreen from "@Components/auth/SuccessScreen";

declare namespace ISuccessScreen {
  export interface IProps {
    image: string;
    title: string;
    message: string;
    children?: React.ReactNode;
  }
}
export { ISuccessScreen };
