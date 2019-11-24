import React, { Component } from 'react';
import {
    Form,
    DatePicker,
    Modal,
    Select,
    Button,
    Table,
    Divider,
    Row,
    Col,
    Input,
    TreeSelect,
    notification
} from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, initOrgSelectTree } from '../../comUtil';

import ProjectCard from './ProjectCard';
import Axios from 'axios';

/**
 * 合作项目协议
 */
class ProjectListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hzjgssdq: [],
            yyhzfs: [],
            shzt: [],
            ylhzxmxycx: [],
            areaTreeSelect: [],
            // 查询
            data: {
                //上报时间开始
                ereportstart: null,
                //上报时间结束
                ereportend: null,
                //合作机构所属地区
                area: null,
                //所属行政部门
                orgId: null,
                //协议合作方式
                collaborationtype: null,
                //审核状态
                checkstatus: null,
                //查询条件
                type: null,
                //搜索关键词
                value: null
            }
        };
    }

    componentDidMount() {
        initAllDic.call(this, ['hzjgssdq', 'yyhzfs', 'shzt'], ['ylhzxmxycx']);
        initOrgSelectTree.call(this);
    }

    queryData = e => {
        e.preventDefault();
        Axios.post('/ylws/agreement/selectAgreeMentAll', this.state.data).then(res => {
            if (res.data && res.data.header.code === '1000') {
                this.props.setTableData(res.data.body.data);
            } else {
                notification.error({ message: res.data.header.msg });
            }
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { hzjgssdq, yyhzfs, shzt, ylhzxmxycx, areaTreeSelect, data } = this.state;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.queryData}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Item label="上报时间段">
                            <RangePicker
                                placeholder={['开始时间', '结束时间']}
                                onChange={(e, str) => {
                                    this.setState({ data: { ...data, ereportstart: str[0], ereportend: str[1] } });
                                }}
                            />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="合作机构所属地区">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, area: value } })}
                            >
                                {hzjgssdq}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="所属行政部门">
                            <TreeSelect
                                allowClear
                                treeData={areaTreeSelect}
                                onSelect={value => this.setState({ data: { ...data, orgId: value } })}
                            />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Item label="协议合作方式">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, collaborationtype: value } })}
                            >
                                {yyhzfs}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="审核状态">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, checkstatus: value } })}
                            >
                                {shzt}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={16}>
                        <Input.Group compact>
                            <Item label="查询条件">
                                <Select
                                    style={{ width: 120 }}
                                    onSelect={value => this.setState({ data: { ...data, type: value } })}
                                >
                                    {ylhzxmxycx}
                                </Select>
                                <Input
                                    onChange={e => this.setState({ data: { ...data, value: e.target.value } })}
                                    style={{ width: 250 }}
                                />
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
                dataIndex: 'agreementname',
                key: 'agreementname'
            },
            {
                title: '填报人姓名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '填报人办公电话',
                dataIndex: 'telephone',
                key: 'telephone'
            },
            {
                title: '京津合作机构名称',
                dataIndex: 'agreementname',
                key: 'agreementname'
            },

            {
                title: '合作时间',
                key: 'agreementname',
                render: (record, index) => {
                    return record.agreestart + ' - ' + record.agreeend;
                }
            },
            {
                title: '合作方式',
                dataIndex: 'agreetype',
                key: 'agreetype',
                render: (agreetype, record, index) => {
                    if (agreetype) {
                        let types = [];
                        agreetype.split(',').forEach(type => {
                            let fs = this.state.yyhzfs.find(fs => fs.value === type);
                            if (fs) types.push(fs.children);
                        });
                        return types.join(' | ');
                    } else {
                        return '';
                    }
                }
            },
            {
                title: '上报时间',
                dataIndex: 'ylwscreate',
                key: 'ylwscreate'
            },
            {
                title: '审核状态',
                key: 'status',
                dataIndex: 'ylwscreate',
                render: (status, record, index) => {
                    let state = this.state.shzt.find(zt => zt.value === status);
                    if (state) {
                        return state.children;
                    } else {
                        return '';
                    }
                }
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
            tableData: [],
            yyhzfs: [],
            shzt: []
        };
    }

    componentDidMount() {
        initAllDic.call(this, null, ['yyhzfs', 'shzt']);
    }

    setTableData = tableData => {
        this.setState({ tableData });
    };

    backList = () => this.setState({ pageType: 'list' });

    render() {
        const { pageType } = this.state;
        if (pageType === 'list') {
            const { tableData } = this.state;
            return (
                <div>
                    <WrappedProjectListPage
                        setTableData={this.setTableData}
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
            return <ProjectCard pageType={pageType} backList={this.backList} curUser={this.props.curUser} />;
        }
    }
}
