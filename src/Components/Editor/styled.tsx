import { Col } from "react-bootstrap";
import styled from "styled-components";
import React from "react";

export const ActionButton = styled.button`
  background: #ffff;
  color: #595959;
  border-color: #e8e8e8;
  border-radius: 4px;
  font-size: 16px;
  border-width: 2px;
  padding-left: 2rem;
  padding-right: 2rem;

  &:disabled {
    cursor: not-allowed;
    background: #8c8c8c;
    color: #ffffff;
  }
`;

export const SwitchButton = styled.button<SwitchButtonProps>`
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  border-width: 2px;
  padding: ${props => props.padding};
  background: ${props => (props.interface === true ? "#002852" : "#FFFF")};
`;

interface SwitchButtonProps {
  interface: boolean;
  padding: React.CSSProperties["padding"];
}

export const Header = styled.header`
  background: rgba(0, 40, 82, 1);
  min-height: 71px;
  padding-top: 15px;
  border-bottom: 1px solid #e8e8e8;
  display: block;
`;

export const SaveButton = styled.button`
  padding: 9px 36px 9px 36px;
  background: #002852;
  color: #ffffff;
  font-weight: 600;
  border-radius: 4px;
  font-size: 16px;
  width: auto;

  &:hover {
    background: #ffffff;
    color: #002852;
    box-shadow: 0 0 0 1px #002852 !important;
  }

  &: disabled {
    background: #8c8c8c;
    cursor: wait;
  }
`;

export const ToggleButton = styled.button`
  border: 1px solid #002852;
  padding: 8px 18px;
  color: #002852;
  background: #ffffff;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    background: #002852;
    color: #ffffff;
  }

  &.image {
    background: white;
    color: #002852;
  }
`;

export const Heading = styled.h3`
  color: #595959 !important;
  font-size: 16px;
  font-weight: 600;
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const SwitchButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const Name = styled.span`
  color: #262626;
  font-size: 16px;
`;

export const DocumentName = (props: { name: string }) => {
  return (
    <Col className="document-name">
      <Name className="font-semibold white-txt">{props.name}</Name>
    </Col>
  );
};
