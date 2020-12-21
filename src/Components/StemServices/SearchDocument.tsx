import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ISearchDocument } from "./StemServices";

const SearchDocument: React.FunctionComponent<ISearchDocument | undefined> = ({
  searchAction,
}) => {
  return (
    <div>
      <Form name="search" onFinish={searchAction}>
        <Row gutter={24}>
          <Col span={18}>
            <Form.Item name="searchQuery">
              <Input
                className="lip-button"
                size="large"
                placeholder="Search document name or tags"
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              <Button className="lip-button" type="primary" size="large" block htmlType="submit">
                <span className="px-6">Search</span>
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchDocument;
