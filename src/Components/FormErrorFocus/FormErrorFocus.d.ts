import { FormikContextType } from "formik";

export interface FormErrorFocusProps {
  offset: number;
  ease?: string;
  duration: number;
  focusDelay: number;
  align?: "top" | "middle" | "bottom";
  formik: FormikContextType;
}
