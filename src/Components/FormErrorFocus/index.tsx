import { Component } from "react";
import { connect } from "formik";
import scrollToElement from "scroll-to-element";
import { FormErrorFocusProps } from "./FormErrorFocus";

class FormErrorFocus extends Component<FormErrorFocusProps> {
  timeout: number;

  defaultProps = {
    offset: 0,
    align: "top",
    focusDelay: 200,
    ease: "linear",
    duration: 1000,
  };

  constructor(props: FormErrorFocusProps) {
    super(props);
    this.timeout = 0;
  }

  componentDidUpdate(prevProps: any) {
    const { isSubmitting, isValidating, errors } = prevProps.formik;
    const keys = Object.keys(errors);

    if (keys.length > 0 && isSubmitting && !isValidating) {
      const selector = `[data-error-key="${keys[0]}"]`;
      const fallbackSelector = `[name="${keys[0]}"]`;
      const errorElement: any =
        document.querySelector(selector) ||
        document.querySelector(fallbackSelector);

      if (errorElement) {
        const { offset, ease, duration, focusDelay, align } = this.props;
        scrollToElement(errorElement, {
          offset,
          ease,
          duration,
          align,
        });

        this.timeout = setTimeout(
          () => errorElement.focus(),
          duration + focusDelay
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return null;
  }
}

export default connect(FormErrorFocus);
