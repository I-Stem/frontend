export declare module IMessage {
  export interface IProps {}

  export interface IMessageStateProps {
    message: string;
  }

  export interface IMessagePayload {
    [key: string]: any;
    message: string;
  }

  export interface InitialProps {
    namespacesRequired: string[];
  }
}
