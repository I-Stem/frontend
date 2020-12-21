// #region Global Imports
import { WithTranslation } from "next-i18next";
import { IAuthUser } from "@Services/API/Auth/IAuthResponse";
import { ICreditsResponse } from "@Services/API/Credits/ICreditsResponse";
// #endregion Global Imports

export declare module IStemServices {
  export interface IAuthStateProps {
    user: IAuthUser;
    token: string;
  }
  export interface IProps extends WithTranslation {
    search: Function;
    getCredits: () => Promise<ICreditsResponse>;
  }
  export interface InitialProps {
    namespacesRequired: string[];
    user?: IAuthUser;
    token?: string;
  }
}
