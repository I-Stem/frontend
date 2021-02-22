import { AdminRequestsProps, autoDomainRequestFields } from "@Components/Admin";
import ReviewButtons from "@Components/Admin/ReviewButtons";
import { FormLayout } from "@Components/HOC/Dashboard";
import Heading from "@Components/HOC/Heading";
import { IStore } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { AdminPanelServices, UniversityPortal } from "@Services";
import { NextPage } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useAppAbility } from "src/Hooks/useAppAbility";
import "../../dashboard/style.scss";

const DomainId: NextPage<{}> = (props: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState<AdminRequestsProps | undefined>(
    undefined
  );
  const { can } = useAppAbility();
  const { user } = props;
  const access = can("VIEW", "ADMIN_PANEL");
  const initialFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initialFocus.current?.focus();
    AdminPanelServices.requestDetails({
      id: (id as unknown) as string,
    }).then(response => setDetails(response.data.details));
  }, []);
  const acceptHandler = () => {
    UniversityPortal.handleDomainAccess("APPROVED", {
      code: user.organizationCode,
      id: (id as unknown) as string,
    }).then(res => {
      router.back();
    });
  };
  const rejectHandler = () => {
    UniversityPortal.handleDomainAccess("REJECTED", {
      code: user.organizationCode,
      id: (id as unknown) as string,
    }).then(res => {
      router.back();
    });
  };
  return access ? (
    <FormLayout hideFooter>
      <>
        <Heading ref={initialFocus}>REQUEST DETAILS</Heading>
        {details &&
          autoDomainRequestFields.map(fields => (
            <tr className="text-base font-medium mt-2 font-black">
              <td>
                {fields.field}:{" "}
                {details[fields.attribute as keyof AdminRequestsProps]}
              </td>
            </tr>
          ))}
      </>
      <ReviewButtons
        acceptHandler={acceptHandler}
        rejectHandler={rejectHandler}
      />
    </FormLayout>
  ) : (
    <Error statusCode={404} title="Page Not Found" />
  );
};
const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};
export default PrivateRoute(connect(mapStateToProps, null)(DomainId));
