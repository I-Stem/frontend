import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ServiceType } from "@Definitions/Constants/ServiceType";
import { downloadFile } from "@Services/download";
import { GreenButton } from "@Components/HOC/Dashboard";
import { Col, Row } from "react-bootstrap";
import { AfcService, CaptioningService } from "@Services";
import Moment from "moment";
import PrivateRoute from "../../_privateRoute";
import { DASHBOARD_ROUTE } from "@Definitions/Constants";

const FileDownloadComponent: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [details, setDetails] = useState<any>({});
  const [time, updateTime] = useState(5);

  const download = () => {
    switch (router.query.serviceType) {
      case ServiceType.AFC:
        downloadFile(`/file/afc/${router.query.fileId}`)
          .then(response => {
            if (response.error) {
              setError(true);
            }
          })
          .catch(error => {
            setError(true);
          });
        break;
      case ServiceType.VC:
        downloadFile(`/file/vc/${router.query.fileId}`)
          .then(response => {
            if (response.error) {
              setError(true);
            }
          })
          .catch(error => {
            setError(true);
          });
        break;
      case ServiceType.RAW:
        downloadFile(`/file/raw/${router.query.fileId}`)
          .then(response => {
            if (response.error) {
              setError(true);
            }
          })
          .catch(error => {
            setError(true);
          });
        break;
      default:
        setError(true);
    }
  };

  useEffect(() => {
    console.log("query params: " + JSON.stringify(router.query));

    switch (router.query.serviceType) {
      case ServiceType.AFC:
        AfcService.getDetails({ id: router.query.fileId as string })
          .then(res => {
            const { afcRequest } = res.data;
            setDetails({
              name: afcRequest.documentName,
              completedOn:
                afcRequest.statusLog[afcRequest.statusLog.length - 1].actionAt,
              credits: afcRequest.pageCount,
            });
          })
          .catch(error => setError(true));
        download();
        break;

      case ServiceType.VC:
        CaptioningService.getDetails({
          id: router.query.fileId as string,
        })
          .then(res => {
            const { vcRequest } = res.data;
            setDetails({
              name: vcRequest.documentName,
              completedOn:
                vcRequest.statusLog[vcRequest.statusLog.length - 1].actionAt,
              credits: vcRequest.videoLength / 10,
            });
          })
          .catch(error => setError(true));
        download();
        break;
      case ServiceType.RAW:
        download();
        break;
      default:
        setError(true);
    }
  }, []);

  const Backbutton = () => (
    <Row>
      <Col md={2} className="mt-3 " sm={4}>
        <GreenButton onClick={() => router.back()}>Go Back</GreenButton>
      </Col>
      <Col md={2} className="mt-3 " sm={4}>
        <GreenButton href={DASHBOARD_ROUTE}>Go to Dashboard</GreenButton>
      </Col>
    </Row>
  );

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        updateTime(time - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  if (error) {
    return (
      <div className="lipbg text-white">
        <Head>
          <title>Invalid URL | I-Stem</title>
        </Head>

        <h1>Sorry, we couldn't find that</h1>

        <p className="text-lg p-5">Please verify that:</p>
        <ul>
        <li className="text-lg p-5">
          The URL you have entered is correct, please check the URL again. </li>
          <li className="text-lg p-5">the resource you are looking for exists.</li>
          <li className="text-lg p-5">You have correct permission to view this file.</li>
        </ul>
        <div className="pl-5">{Backbutton()}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Downloading file... | I-Stem</title>
      </Head>
      <div className="lipbg text-white p-5 text-lg">
        <p className="text-lg">
          Please wait, File download should start automatically.{" "}
          {time !== 0 ? (
            <span>
              Wait <span style={{ color: "yellow" }}>{time}</span> seconds
            </span>
          ) : (
            <>
            <span>If download hasn't started yet, please </span>
              <span
                onClick={() => download()}
                role="link"
                style={{
                  color: "lightgreen",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                tabIndex={0}
              >
                 Click here
              </span>{" "}
              <span>to try again.</span>
            </>
          )}
        </p>
        {router.query.serviceType !== ServiceType.RAW && (
          <div
            style={{
              background: "white",
              color: "black",
              padding: "2rem",
              borderRadius: "5px",
            }}
          >
            <div className="text-xl">FILE DETAILS:</div>
            <div>
              <span className="font-semibold"> File Name: </span>
              <span>{details?.name}</span>
            </div>
            <div>
              <span className="font-semibold">Request Completed on: </span>
              <span>
                {Moment(details?.completedOn).format("DD MMM, hh:mm a")}
              </span>
            </div>
            <div>
              <span className="font-semibold">Credits Deducted: </span>
              <span>{details?.credits}</span>
            </div>
            {Backbutton()}
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
export default PrivateRoute(FileDownloadComponent);
