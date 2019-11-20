/* eslint-disable */
import React, { Component } from 'react';
import { Form, DatePicker, Select, Input, Button, Table, Divider, Row, Col, Icon } from 'antd';

const { Option } = Select;
const { Item } = Form;
const { RangePicker, MonthPicker } = DatePicker;

import { initAllDic } from '../../comUtil'

import './pam-index.css';

/**
 * 月报
 */
class MRListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shzt: [], ybcxtj: []
        };
    }

    componentDidMount() {
        initAllDic.call(this, ['shzt'], ['ybcxtj'])
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


    render() {
        const { ybcxtj, shzt } = this.state
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Item label="上报时间段">
                            <RangePicker placeholder={['开始时间', '结束时间']} />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item label="上报月份">
                            <MonthPicker placeholder="选择月份" />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item label="审核状态">
                            <Select className="seletItem">{shzt}
                            </Select>
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <Input.Group compact>
                            <Item label="查询条件">
                                <Select style={{ width: 120 }}>{ybcxtj}
                                </Select>
                                <Input style={{ width: 250 }} />
                            </Item>
                        </Input.Group>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right', paddingRight: 50 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button style={{ marginLeft: 12 }} onClick={this.handleReset}>
                            清除
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedMRListPage = Form.create({ name: 'MRListPage' })(MRListPage);

export default class MRList extends Component {
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
                // fixed: "left",
                render: (text, record, index) => index
            },
            {
                title: '上报医疗机构名称',
                dataIndex: ' institutionName',
                key: 'institutionName'
            },
            {
                title: '协议 ID',
                dataIndex: 'agreementId',
                key: 'agreementId'
            },
            {
                title: '协议名称',
                dataIndex: 'agreement',
                key: 'agreement'
            },
            {
                title: '上报月份',
                dataIndex: 'ReportMonth',
                key: 'ReportMonth'
            },
            {
                title: '填报人姓名',
                dataIndex: 'applicantName',
                key: 'applicantName'
            },
            {
                title: '填报人联系方式',
                dataIndex: 'applicantTel',
                key: 'applicantTel'
            },
            {
                title: '上报时间',
                dataIndex: 'ReportTime',
                key: 'ReportTime'
            },
            {
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => this.allStatus[record.status ? record.status : 0]
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt'
                // fixed: "right"
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
        return [
            { dept: 'xxxx', status: 0 },
            { dept: 'xxxx2', status: 3 }
        ];
    };

    render() {
        const { tableData } = this.state;
        return (
            <div>
                <WrappedMRListPage />
                <div className="list-table">
                    <Table columns={this.columns} dataSource={tableData} scroll={{ y: 300 }} />
                </div>
            </div>
        );
    }
}
