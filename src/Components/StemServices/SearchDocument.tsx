import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ISearchDocument } from "./StemServices";

const SearchDocument: React.FunctionComponent<ISearchDocument | undefined> = ({
  searchAction,
  onClickAction,
  searchExists,
}) => {
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  form.setFieldsValue({
    searchQuery: searchValue,
  });
  const handleClear = () => {
    setSearchValue("");
    if (onClickAction) onClickAction();
  };
  return (
    <div>
      <Form
        name="search"
        onFinish={searchAction}
        onValuesChange={changedValues => {
          setSearchValue(changedValues.searchQuery);
        }}
        form={form}
      >
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
              <Button
                className="lip-button"
                type="primary"
                size="large"
                block
                htmlType="submit"
              >
                <span className="px-6">Search</span>
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {searchExists ? (
        <Row className="mt-2">
          <Col span={20}>
            <h4 className="lip-subtext font-semibold">Search results</h4>
          </Col>
          <Col>
            <span className="lip-subtext" role="button" onClick={handleClear}>
              Clear
            </span>
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchDocument;
