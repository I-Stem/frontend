import { AnyCnameRecord } from "dns";

declare namespace ICTAButton {
  export interface IProps {
    children?: React.ReactNode;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    form?: string;
    htmlType?: "button" | "submit" | "reset";
    queryParams?:any;
    disabled?: boolean;
  }
}
export { ICTAButton };
