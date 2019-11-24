import React, { Component } from 'react';
import { Form, DatePicker, Modal, Select, Button, Table, Divider, Row, Col, Input, notification } from 'antd';
import Axios from 'axios';

const { Item } = Form;
const { RangePicker, MonthPicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, formatDate } from '../../comUtil';

import ReportCard from './ReportCard';

/**
 * 合作项目协议
 */
class ReportListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ylybcxtj: [],
            shzt: []
        };
    }

    componentDidMount() {
        initAllDic.call(this, ['shzt'], ['ylybcxtj']);
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
        const { ylybcxtj, shzt } = this.state;
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
                            <Select className="seletItem">{shzt}</Select>
                        </Item>
                    </Col>
                    <Col span={16}>
                        <Input.Group compact>
                            <Item label="查询条件">
                                <Select style={{ width: 120 }}>{ylybcxtj}</Select>
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
                key: 'opt',
                width: 150,
                fixed: 'right',
                render: record => {
                    let opts = [
                        <a onClick={() => this.setState({ pageType: 'card', cRecordId: record.id })}>详情</a>,
                        <a onClick={() => this.setState({ pageType: 'edit', cRecordId: record.id })}>修改</a>,
                        <a
                            onClick={() =>
                                confirm({
                                    title: '确定要删除该数据吗 ?',
                                    okText: '确认',
                                    okType: 'danger',
                                    cancelText: '取消',
                                    onOk() {
                                        let data = new FormData();
                                        data.append('id', record.id);
                                        Axios.post('/ylws/agreement/delMorthtable', data).then(res => {
                                            if (res.data && res.data.header.code === '1000') {
                                                notification.success({ message: '删除成功' });
                                                setTimeout(() => location.reload(), 1000);
                                            } else {
                                                notification.error({ message: res.data.header.msg });
                                            }
                                        });
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    }
                                })
                            }
                        >
                            删除
                        </a>
                    ];

                    // opts 0 详情, 1 修改, 2 删除,
                    let cOptIndex = [];

                    //审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
                    switch (record.status) {
                        case 1:
                            cOptIndex = [0, 1, 2];
                            break;
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            cOptIndex = [0];
                            break;
                        case 6:
                        case 7:
                        case 8:
                            cOptIndex = [0, 1];
                            break;

                        default:
                            break;
                    }
                    if (this.props.curUser.level === 1) {
                        cOptIndex = [0, 1, 2];
                        if (record.status === 5) cOptIndex = cOptIndex.concat([4, 5]);
                    }

                    let cOpts = [];
                    for (let index = 0; index < cOptIndex.length; index++) {
                        const item = cOptIndex[index];
                        cOpts.push(opts[item]);
                        if (index !== cOptIndex.length) cOpts.push(<Divider type="vertical" />);
                    }
                    return <span>{cOpts} </span>;
                }
            }
        ];
        this.state = {
            pageType: 'list',
            tableData: [],
            cRecordId: null
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
        const { pageType, cRecordId } = this.state;
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
            return (
                <ReportCard
                    pageType={pageType}
                    backList={this.backList}
                    curUser={this.props.curUser}
                    recordId={cRecordId}
                />
            );
        }
    }
}
