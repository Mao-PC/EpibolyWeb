/* eslint-disable */
import React, { Component } from 'react';
import { Form, DatePicker, Select, Input, Button, Table, Divider, Row, Col, Icon } from 'antd';

const { Option } = Select;
const { Item } = Form;
const { RangePicker } = DatePicker;

import './pam-index.css';

/**
 * 合作项目协议
 */
class CPGListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expand: false
        };
    }

    getFields() {
        const count = this.state.expand ? 10 : 6;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < 10; i++) {
            children.push(
                <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
                    <Form.Item label={`Field ${i}`}>
                        {getFieldDecorator(`field-${i}`, {
                            rules: [
                                {
                                    required: true,
                                    message: 'Input something!'
                                }
                            ]
                        })(<Input placeholder="placeholder" />)}
                    </Form.Item>
                </Col>
            );
        }
        return children;
    }
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    render() {
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Item label="上报时间段">
                            <RangePicker placeholder={['开始时间', '结束时间']} />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="合作机构所属地区">
                            <Select className="seletItem">
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="所属行政部门">
                            <Select className="seletItem">
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Item label="协议合作方式">
                            <Select className="seletItem">
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="审核状态">
                            <Select className="seletItem">
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="查询条件">
                            <Select
                                showSearch
                                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                onChange={() => console.log(`selected ${value}`)}
                                optionFilterProp="children"
                                className="seletItem"
                            >
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right', paddingRight: 50 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            清除
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedCPGListPage = Form.create({ name: 'CPGListPage' })(CPGListPage);

export default class CPGList extends Component {
    constructor(props) {
        super(props);
        this.allStatus = [
            '未提交 ',
            '待县级审核 ',
            '待市级复核 ',
            '待省级终审 ',
            '终审通过 ',
            '县级审核不通过 ',
            '市级复核不通过 ',
            '省级终审不通过'
        ];
        this.columns = [
            {
                title: '序号',
                dataIndex: 'no',
                key: 'no',
                fixed: 'left',
                width: 80,
                render: (text, record, index) => index
            },
            {
                title: '所属行政部门',
                dataIndex: 'dept',
                key: 'dept',
                width: 150
            },
            {
                title: '上报医疗机构统一社会信用代码证',
                dataIndex: ' institutionCode',
                key: 'institutionCode',
                width: 150
            },
            {
                title: '上报医疗机构名称',
                dataIndex: ' institutionName',
                key: 'institutionName',
                width: 150
            },
            {
                title: '填报人姓名',
                dataIndex: 'applicantName',
                key: 'applicantName',
                width: 150
            },
            {
                title: '填报人办公电话',
                dataIndex: 'applicantTel',
                key: 'applicantTel',
                width: 150
            },
            {
                title: '合作机构所属地区',
                dataIndex: 'PartnerRegion',
                key: 'PartnerRegion',
                width: 150
            },
            {
                title: '京津合作机构名称',
                dataIndex: 'PartnerName',
                key: 'PartnerName',
                width: 150
            },
            {
                title: '合作项目/协议名称',
                dataIndex: 'agreement',
                key: 'agreement',
                width: 150
            },
            {
                title: '合作时间',
                dataIndex: 'cooperationTime',
                key: 'cooperationTime',
                width: 150
            },
            {
                title: '合作方式',
                dataIndex: 'cooperationType',
                key: 'cooperationType',
                width: 150
            },
            {
                title: '上报时间',
                dataIndex: 'ReportTime',
                key: 'ReportTime',
                width: 150
            },
            {
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text, record, index) => this.allStatus[record.status ? record.status : 0]
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                fixed: 'right',
                width: 150
                // render: (text, record, index) => index
            }
        ];
        this.state = {
            tableData: []
        };
    }

    componentDidMount() {
        this.setState({ tableData: this.getTableData() });
    }

    getTableData = () => {
        return [{ dept: 'xxxx', status: 0 }, { dept: 'xxxx2', status: 3 }];
    };

    render() {
        const { tableData } = this.state;
        return (
            <div>
                <WrappedCPGListPage />
                <div className="list-table">
                    <Table columns={this.columns} dataSource={tableData} scroll={{ x: 10, y: 300 }} />
                </div>
            </div>
        );
    }
}
