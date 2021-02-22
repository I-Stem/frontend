import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FormLayout } from "@Components/HOC/Dashboard";
import { AdminPanelServices, UniversityPortal } from "@Services";
import PrivateRoute from "@Pages/_privateRoute";
import { AdminRequestsProps, serviceRequestFields } from "@Components/Admin";
import ReviewButtons from "@Components/Admin/ReviewButtons";
import Heading from "@Components/HOC/Heading";
import { connect } from "react-redux";
import { IStore } from "@Interfaces";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { AccessService } from "@Services/API/AccessService";
import "../../dashboard/style.scss";

const ServiceId: NextPage<{}> = (props: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState<AdminRequestsProps | undefined>(
    undefined
  );
  const { can } = useAppAbility();
  const access = can("VIEW", "ADMIN_PANEL");
  const initialFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initialFocus.current?.focus();
    AdminPanelServices.requestDetails({
      id: (id as unknown) as string,
    }).then(response => setDetails(response.data.details));
  }, []);
  const { user } = props;
  const acceptHandler = () => {
    AccessService.updateRole(String(details?.email), {
      id: (id as unknown) as string,
      action: "APPROVED",
    }).then(res => {
      router.back();
    });
  };

  const rejectHandler = () => {};
  return access ? (
    <FormLayout hideFooter>
      <>
        <Heading ref={initialFocus}>REQUEST DETAILS</Heading>
        {details &&
          serviceRequestFields.map(fields => (
            <tr className="text-base font-medium mt-2 font-black">
              <td>
                {fields.field}:{" "}
                {details[fields.attribute as keyof AdminRequestsProps]}
              </td>
            </tr>
          ))}
        <ReviewButtons
          acceptHandler={acceptHandler}
          rejectHandler={rejectHandler}
        />
      </>
    </FormLayout>
  ) : (
    <Error title="Page Not Found" statusCode={404} />
  );
};

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const Extended = connect(mapStateToProps, null)(ServiceId);
export default PrivateRoute(Extended);
