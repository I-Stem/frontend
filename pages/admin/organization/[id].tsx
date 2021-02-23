import {
  AdminRequestsProps,
  organizationRequestFields,
} from "@Components/Admin";
import ReviewButtons from "@Components/Admin/ReviewButtons";
import { FormLayout } from "@Components/HOC/Dashboard";
import Heading from "@Components/HOC/Heading";
import PrivateRoute from "@Pages/_privateRoute";
import { AdminPanelServices, UniversityPortal } from "@Services";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { connect } from "react-redux";
import { IStore } from "@Interfaces";
import "../../dashboard/style.scss";

const OrgId: NextPage<{}> = (props: any) => {
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
  const acceptHandler = () => {
    UniversityPortal.handleUniversity(details?.orgCode || "", "APPROVED", {
      id: (id as unknown) as string,
    }).then(res => {
      router.back();
    });
  };

  const rejectHandler = () => {
    UniversityPortal.handleUniversity(details?.orgCode || "", "REJECTED", {
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
          organizationRequestFields.map(fields => (
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

export default PrivateRoute(OrgId);
