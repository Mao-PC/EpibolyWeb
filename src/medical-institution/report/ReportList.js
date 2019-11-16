import React, { Component } from 'react';
import { Form, DatePicker, Modal, Select, Button, Table, Divider, Row, Col } from 'antd';

const { Option } = Select;
const { Item } = Form;
const { RangePicker, MonthPicker } = DatePicker;
const { confirm } = Modal;

import ReportCard from './ReportCard';

/**
 * 合作项目协议
 */
class ReportListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expand: false
        };
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
                            <Select className="seletItem">
                                <Option value={0}>北京</Option>
                                <Option value={1}>天津</Option>
                            </Select>
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item label="查询条件">
                            <Select
                                showSearch
                                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                // onChange={() =>
                                //     console.log(`selected ${value}`)
                                // }
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
                        <Button style={{ marginLeft: 12 }} onClick={this.handleReset}>
                            清除
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                                this.props.openAdd();
                            }}
                        >
                            提交月报
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedReportListPage = Form.create({ name: 'ReportListPage' })(ReportListPage);

export default class IDList extends Component {
    constructor(props) {
        super(props);
        this.allStatus = [
            '未提交 ',
            '待县(区)级审核 ',
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
                width: 80,
                render: (text, record, index) => index + 1
            },
            {
                title: '合作项目/协议名称',
                dataIndex: 'Report',
                key: 'Report'
            },
            {
                title: '填报人姓名',
                dataIndex: 'applicantName',
                key: 'applicantName'
            },
            {
                title: '填报人办公电话',
                dataIndex: 'applicantTel',
                key: 'applicantTel'
            },
            {
                title: '京津合作机构名称',
                dataIndex: 'PartnerName',
                key: 'PartnerName'
            },

            {
                title: '合作时间',
                dataIndex: 'cooperationTime',
                key: 'cooperationTime'
            },
            {
                title: '合作方式',
                dataIndex: 'cooperationType',
                key: 'cooperationType'
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
                render: (text, record) => this.allStatus[record.status ? record.status : 0]
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                width: 150,
                render: () => {
                    return (
                        <span>
                            <a onClick={() => this.setState({ pageType: 'card' })}>详情</a>
                            <Divider type="vertical" />
                            <a onClick={() => this.setState({ pageType: 'edit' })}>修改</a>
                            <Divider type="vertical" />
                            <a
                                onClick={() =>
                                    confirm({
                                        title: '确定要删除该结构吗 ?',
                                        // content: 'Some descriptions',
                                        okText: '确认',
                                        okType: 'danger',
                                        cancelText: '取消',
                                        onOk() {
                                            console.log('OK');
                                        },
                                        onCancel() {
                                            console.log('Cancel');
                                        }
                                    })
                                }
                            >
                                删除
                            </a>
                        </span>
                    );
                }
            }
        ];
        this.state = {
            pageType: 'list',
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

    backList = () => this.setState({ pageType: 'list' });

    render() {
        const { pageType } = this.state;
        if (pageType === 'list') {
            const { tableData } = this.state;
            return (
                <div>
                    <WrappedReportListPage
                        openAdd={() => {
                            this.setState({ pageType: 'add' });
                        }}
                    />
                    <div className="list-table">
                        <Table columns={this.columns} dataSource={tableData} scroll={{ y: 300 }} />
                    </div>
                </div>
            );
        } else {
            return <ReportCard pageType={pageType} backList={this.backList} />;
        }
    }
}
