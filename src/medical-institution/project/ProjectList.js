import React, { Component } from 'react';
import { Form, DatePicker, Modal, Select, Button, Table, Divider, Row, Col, Input } from 'antd';

const { Option } = Select;
const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic } from '../../comUtil'

import ProjectCard from './ProjectCard';

/**
 * 合作项目协议
 */
class ProjectListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hzjgssdq: [], yyhzfs: [], shzt: [], ylhzxmxycx: []
        };
    }

    componentDidMount() {
        initAllDic.call(this, ['hzjgssdq', 'yyhzfs', 'shzt'], ['ylhzxmxycx'])
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
        const { hzjgssdq, yyhzfs, shzt, ylhzxmxycx } = this.state
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
                            <Select className="seletItem">{hzjgssdq}
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
                            <Select className="seletItem">{yyhzfs}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="审核状态">
                            <Select className="seletItem">{shzt}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={16}>
                        <Input.Group compact>
                            <Item label="查询条件">
                                <Select style={{ width: 120 }}>{ylhzxmxycx}
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
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            清除
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                                this.props.openAdd();
                            }}
                        >
                            新增合作协议上报
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedProjectListPage = Form.create({ name: 'ProjectListPage' })(ProjectListPage);

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
                dataIndex: 'Project',
                key: 'Project'
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
                width: 200,
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
                                        title: '确定要删除该数据吗 ?',
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
                    <WrappedProjectListPage
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
            return <ProjectCard pageType={pageType} backList={this.backList} />;
        }
    }
}
