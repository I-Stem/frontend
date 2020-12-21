import React, { useEffect } from "react";
import { connect } from "react-redux";
import { CreditsActions } from "@Actions";
import UploadProgress from "@Components/Upload/progress";
import { IStore, IWrapperProps } from "@Interfaces";

const WrapperComponent: React.FunctionComponent<IWrapperProps> = ({
  children,
  credits,
  getCredits,
  onChangeFocus,
}) => {
  return (
    <>
      {children}
      <UploadProgress onChangeFocus={onChangeFocus && onChangeFocus} />
    </>
  );
};

function mapStateToProps(store: IStore) {
  const { credits } = store;
  return {
    credits,
  };
}

const mapDispatchToProps = {
  getCredits: CreditsActions.GetCredits,
};
const Wrapper = connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
export { Wrapper };
