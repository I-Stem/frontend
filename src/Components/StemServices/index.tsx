import React from "react";
import Link from "next/link";
import { IStemServices } from "./StemServices";

import "./style.scss";

export const StemService: React.FunctionComponent<IStemServices.IProps> = props => {
  const { serviceInstance, disabled } = props;
  return (
    <div className="service-component rounded-lg h-full pt-8 pl-6 pr-12 pb-2">
      <Link href={disabled ? "/dashboard" : serviceInstance.route}>
        <a className="cursor-pointer">
          <div className="pb-2">
            <img
              src={serviceInstance.fileName}
              alt={serviceInstance.ServiceName}
            />
          </div>
          <div>
            <h4 className="font-semibold text-lg leading-7">
              {serviceInstance.ServiceName}
            </h4>
          </div>
        </a>
      </Link>
      <p className="font-semibold text-sm leading-5">
        {serviceInstance.ServiceDescription}
      </p>
    </div>
  );
};
