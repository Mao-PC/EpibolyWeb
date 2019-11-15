/* eslint-disable */
import React, { Component } from "react";
import moment from 'moment'
import {
  Form,
  Input,
  Modal,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  DatePicker,
  AutoComplete,
  Table
} from "antd";

import { deptData } from "./data";

import './index.css'

const { Option } = Select;
const { MonthPicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

class AgreementCardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depts: [],
      newTecModal: false
    };
  }

  componentDidMount() {
    this.setState({
      depts: this.getDepts()
    });
  }

  getDepts = () => {
    return deptData.map(dept => {
      return <Option value={dept.id}>{dept.name}</Option>;
    });
  };

  render() {
    const { pageType } = this.props
    const { depts } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <div style={{ margin: "40px 20px" }}>

        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <h1 style={{ marginBottom: 20 }}>
            <strong>
              {pageType === "add" ? "合作项目/协议信息详情" : pageType === "edit" ? "修改合作项目/协议信息" : "京津冀医疗卫生协同发展工作动态"}
            </strong>
          </h1>
          <div style={{ paddingLeft: 50 }}>
            <Item label="上报医疗机构名称" className="add-form-item">
              xxxxxx
            </Item>
            <Item label="选择已签署的项目/协议" className="add-form-item">
              <Select>{depts}</Select>
            </Item>
            <Item label="上报月份" className="add-form-item">
              <MonthPicker defaultValue={moment().month(moment().month() - 1).startOf('month')} />
            </Item>
            <Item label="填报人姓名" className="add-form-item">
              <Input />
            </Item>
            <Item label="填报人办公电话" className="add-form-item">
              <Input />
            </Item>
            <Item label="填报人手机号" className="add-form-item">
              <Input />
            </Item>

          </div>
          <h1 style={{ margin: "30px 50px" }}>
            <strong>
              一、引进新技术
            </strong>
          </h1>
          <div style={{ paddingLeft: 80 }}>
            <Item label="本月引进新技术" className="add-form-item">
              <Table columns={[
                { dataIndex: "department", key: "department", title: "专业科室" },
                { dataIndex: "name", key: "name", title: "技术名称" },
                {
                  dataIndex: "opt", key: "opt", title: "操作",
                  render: () => {
                    return (<span>
                      <a onClick={() =>
                        confirm({
                          title: '确定要删除该行数据吗 ?',
                          // content: 'Some descriptions',
                          okText: '确认',
                          okType: 'danger',
                          cancelText: '取消',
                          onOk() {
                            console.log('OK');
                          },
                          onCancel() {
                            console.log('Cancel');
                          },
                        })}>
                        删除
                </a>
                      <Divider type="vertical" />
                      <a onClick={() => this.setState({ pageType: "edit" })}>
                        添加
                </a>
                    </span>)
                  }
                }
              ]} />
            </Item>
          </div>

          <Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ margin: "20px 20px", left: "30%" }}
            >
              {this.props.pageType === "add" ? "添加" : "保存"}
            </Button>
            <Button
              type="primary"
              style={{ margin: "20px 20px", left: "60%" }}
              onClick={() => this.props.backList()}
            >
              取消
              </Button>
          </Item>
        </Form>
        <Modal
          title="新技术"
          visible={newTecModal}
          onOk={() => this.setState({ newTecModal: false })}
          onCancel={() => this.setState({ newTecModal: false })}
        >
          <Input />
          <Input />
        </Modal>
      </div>
    );
  }
}

const AgreementCard = Form.create({ name: "AgreementCard" })(AgreementCardPage);

export default AgreementCard
