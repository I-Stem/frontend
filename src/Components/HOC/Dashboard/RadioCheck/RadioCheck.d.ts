declare namespace IRadioCheck {
  export interface IProps {
    htmlType: "radio" | "checkbox";
    label: string;
    id: string;
    name: string;
    value: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | undefined;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | undefined;
    checked?: boolean;
    defaultChecked?: boolean;
  }
}
export { IRadioCheck };
