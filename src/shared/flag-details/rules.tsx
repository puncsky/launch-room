import * as React from "react";
import Card from "antd/lib/card";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import Row from "antd/lib/row";
import Menu from "antd/lib/menu";
import Col from "antd/lib/col";
import Select from "antd/lib/select";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import MoreOutlined from "@ant-design/icons/MoreOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import MinusOutlined from "@ant-design/icons/MinusOutlined";
import { VarianceSelect } from "@/shared/flag-details/variance-select";

export type RulesProps = {
  variance: boolean[];
};

export function Rules({ variance }: RulesProps): JSX.Element {
  return (
    <>
      <Form.List name="rules">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: "100%" }}>
            {fields.map((field) => (
              <Rule
                variance={variance}
                index={field.key}
                key={field.key}
                remove={() => remove(field.name)}
              />
            ))}

            <Form.Item>
              <Button
                block
                type="dashed"
                onClick={() =>
                  add({
                    variation: 0,
                    trackEvents: false,
                    clauses: [
                      {
                        attribute: "email",
                        op: "endsWith",
                        values: [],
                        negate: false,
                      },
                    ],
                  })
                }
                icon={<PlusOutlined />}
              >
                Add rules
              </Button>
            </Form.Item>
          </Space>
        )}
      </Form.List>

      <Card>
        <VarianceSelect
          itemProps={{
            name: "fallthrough.variation",
            label: "Default Rule",
          }}
          variance={variance}
          disabled={false}
        />
      </Card>
    </>
  );
}

type RuleProps = {
  variance: boolean[];
  index: number;
  remove: () => void;
};

const Rule: React.FC<RuleProps> = ({ variance, index, remove }) => {
  return (
    <Card>
      <Row gutter={[4, 20]}>
        <Col flex="auto">
          <Typography.Title level={5}>Rule {index + 1}</Typography.Title>
        </Col>
        <Col flex="32px">
          <Dropdown
            arrow
            placement="bottomRight"
            overlay={
              <Menu onClick={() => remove()}>
                <Menu.Item>Delete rule</Menu.Item>
              </Menu>
            }
          >
            <Button type="text" shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </Col>
      </Row>

      <Form.Item name={["rules", index, "id"]} hidden>
        <Input />
      </Form.Item>

      <Form.List name={[index, "clauses"]}>
        {(fields, { add, remove: removeClause }) =>
          fields.map((field) => (
            <Row key={field.fieldKey} gutter={[4, 20]} align="middle">
              <Col span={1}>{field.name > 0 ? "AND" : "IF"}</Col>

              <Col span={3}>
                <Form.Item
                  noStyle
                  name={[field.name, "attribute"]}
                  fieldKey={[field.fieldKey, "attribute"]}
                >
                  <Select disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  noStyle
                  name={[field.name, "op"]}
                  fieldKey={[field.fieldKey, "op"]}
                >
                  <Select disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={15}>
                <Form.Item
                  noStyle
                  name={[field.name, "values"]}
                  fieldKey={[field.fieldKey, "values"]}
                >
                  <Select
                    style={{ width: "100%" }}
                    mode="tags"
                    allowClear
                    placeholder="Please select"
                  />
                </Form.Item>

                {/* TODO(tian): what is this for? */}
                <Form.Item
                  noStyle
                  hidden
                  name={[field.name, "negate"]}
                  fieldKey={[field.fieldKey, "negate"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2}>
                {(field.name !== 0 || fields.length !== 1) && (
                  <Button
                    type="text"
                    shape="circle"
                    onClick={() => removeClause(field.name)}
                    icon={<MinusOutlined />}
                  />
                )}

                {field.name + 1 === fields.length && (
                  <Button
                    type="text"
                    shape="circle"
                    onClick={() =>
                      add({
                        attribute: "email",
                        op: "endsWith",
                        values: [],
                        negate: false,
                      })
                    }
                    icon={<PlusOutlined />}
                  />
                )}
              </Col>
            </Row>
          ))
        }
      </Form.List>

      <Row gutter={4} align="middle">
        <Col span={2}>SERVE</Col>
        <Col span={4}>
          <VarianceSelect
            itemProps={{
              name: [index, "variation"],
              noStyle: true,
            }}
            variance={variance}
          />
        </Col>
        {/* TODO(tian): what is this for? */}
        <Form.Item name={[index, "trackEvents"]} hidden>
          <Input />
        </Form.Item>
      </Row>
    </Card>
  );
};
