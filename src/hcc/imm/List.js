import React, { Component } from 'react';
import {
    DatePicker,
    TreeSelect,
    Input,
    Button,
    Table,
    Divider,
    notification,
    Form,
    Row,
    Col,
    Select,
    Modal
} from 'antd';
import { initOrgSelectTree, getTreeNodes, initOrgTreeNodes, resetModal, initRight, formatDate } from '../../comUtil';
import Axios from 'axios';
import Save from './Save';
const { RangePicker } = DatePicker;
const { Option } = Select;
import './imm-index.css';
const { Item } = Form;
const { confirm } = Modal;

/**
 * 医疗机构管理
 */
export default class List extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '医疗机构名称',
                dataIndex: 'medicalname',
                key: 'medicalname'
            },
            {
                title: '所属行政部门',
                dataIndex: 'orgName',
                key: 'orgName'
            },
            {
                title: '联系人',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: '创建时间',
                dataIndex: 'ylwscreate',
                key: 'ylwscreate',
                render: time => formatDate(time)
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: record => <span>{record === 0 ? '开通' : '禁用'}</span>
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                width: 300,
                render: (value, record, index) => (
                    <span>
                        {Boolean(record.creater === this.props.curUser.id) && (
                            <span>
                                <a
                                    onClick={() => {
                                        if (this.state.cRight.edit) {
                                            this.userData = record;
                                            this.setState({ pageType: 'edit' });
                                        } else {
                                            notification.success({ message: '当前用户没有编辑医疗机构权限' });
                                        }
                                    }}
                                >
                                    编辑
                                </a>
                                <Divider type="vertical" />
                            </span>
                        )}
                        <a
                            onClick={() => {
                                if (this.state.cRight.edit) {
                                    this.selectedRowKeys = record;
                                    this.setState({ visible: true, pwd:'', pwd2:'', reseterror: '', pwd2error: '', pwderror: '' });
                                } else {
                                    notification.success({ message: '当前用户没有编辑医疗机构权限' });
                                }
                            }}
                        >
                            重置密码
                        </a>
                        <Divider type="vertical" />
                        <a
                            onClick={() => {
                                if (this.state.cRight.delete) {
                                    confirm.call(this, {
                                        title: '是否确认删除 ?',
                                        okText: '确认',
                                        cancelText: '取消',
                                        onOk: () => {
                                            let data = new FormData();
                                            data.append('id', record.id);
                                            Axios.post('/ylws/medical/delMedicalOrg', data)
                                                .then(res => {
                                                    if (res.data) {
                                                        if (res.data.header.code === '1003') {
                                                            notification.error({ message: '登录过期, 请重新登录' });
                                                            setTimeout(() => {
                                                                this.props.history.push({ pathname: '/' });
                                                            }, 1000);
                                                            return;
                                                        }
                                                        if (res.data.header.code === '1000') {
                                                            notification.success({ message: '删除医疗机构成功' });
                                                            setTimeout(() => location.reload(), 1000);
                                                        } else {
                                                            notification.error({ message: res.data.header.msg });
                                                        }
                                                    } else {
                                                        notification.error({ message: res.data.header.msg });
                                                    }
                                                })
                                                .catch(e => console.log(e));
                                        },
                                        onCancel() {
                                            console.log('Cancel');
                                        }
                                    });
                                } else {
                                    notification.success({ message: '当前用户没有编辑医疗机构权限' });
                                }
                            }}
                        >
                            删除
                        </a>
                    </span>
                )
            }
        ];
        this.cNode = {};
        // 选中的行
        this.selectedRowKeys = [];
        // 用户数据
        this.userData = {};
        this.state = {
            pageType: 'list',
            areaTree: [],
            areaTreeSelect: [],
            tableData: [],
            visible: false,
            pwderror: null,
            pwd2error: null,
            pwd: null,
            pwd2: null,
            old_pwd: null,
            // 查询条件
            queryData: {},
            // 权限
            cRight: {},
            reseterror: ''
        };
    }

    componentDidMount() {
        initOrgTreeNodes.call(this);
        initOrgSelectTree.call(this);
        setTimeout(() => initRight.call(this, this.props), 30);
    }

    componentWillReceiveProps(props) {
        setTimeout(() => initRight.call(this, props), 30);
    }

    /**
     * 初始化组织树
     */
    initTreeNodes = () => {
        getTreeNodes.call(this, null, '/ylws/org/selectOrgListTree', {
            childKey: 'children',
            nameKey: 'name',
            itemKey: 'id'
        });
    };

    backList() {
        this.setState({ pageType: 'list' });
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        }
    };

    queryClick = () => {
        Axios.post('/ylws/medical/selectMedicalOrgByDto', this.state.queryData)
            .then(res => {
                if (res.data) {
                    if (res.data.header.code === '1003') {
                        notification.error({ message: '登录过期, 请重新登录' });
                        setTimeout(() => {
                            this.props.history.push({ pathname: '/' });
                        }, 1000);
                        return;
                    }
                    if (res.data.header.code === '1000') {
                        this.setState({ tableData: res.data.body.data });
                    } else {
                        notification.error({ message: res.data.header.msg });
                    }
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    };

    render() {
        const { pageType, cRight } = this.state;
        if (pageType === 'list') {
            const { tableData, areaTreeSelect, queryData } = this.state;
            return (
                <div>
                    <Form className="ant-advanced-search-form" style={{ height: '100%' }}>
                        {/* <div className="imm-areaTree">
                        <Tree onSelect={this.onSelect}>{areaTree}</Tree>
                    </div> */}
                        <Row>
                            <Col span={8}>
                                <Item label={'创建时间'}>
                                    <RangePicker
                                        style={{ width: 210 }}
                                        key="createTime"
                                        onChange={(date, dateString) => {
                                            this.setState({
                                                queryData: {
                                                    ...queryData,
                                                    queryDateStart: dateString[0],
                                                    queryDateEnd: dateString[1]
                                                }
                                            });
                                        }}
                                    />
                                </Item>
                            </Col>

                            <Col span={8}>
                                <Item label="所属行政部门">
                                    <TreeSelect
                                        allowClear={true}
                                        style={{ width: 180 }}
                                        treeData={areaTreeSelect}
                                        onChange={text => {
                                            this.setState({ queryData: { ...queryData, orgId: text } });
                                        }}
                                    />
                                </Item>
                            </Col>
                            <Col span={8}>
                                <Item label={'医疗机构用户名'}>
                                    <Input
                                        style={{ width: 180 }}
                                        allowClear={true}
                                        onChange={e => {
                                            this.setState({ queryData: { ...queryData, username: e.target.value } });
                                        }}
                                    />
                                </Item>
                            </Col>
                            <Col span={8}>
                                <Item label="医疗机构名称">
                                    <Input
                                        style={{ width: 180 }}
                                        allowClear={true}
                                        onChange={e => {
                                            this.setState({ queryData: { ...queryData, medicalname: e.target.value } });
                                        }}
                                    />
                                </Item>
                            </Col>
                            <Col span={8}>
                                <Item label="状态">
                                    <Select
                                        style={{ width: 180 }}
                                        onSelect={e => this.setState({ queryData: { ...queryData, querystatus: e } })}
                                    >
                                        <Option key={null} value={null}>
                                            全部
                                        </Option>
                                        <Option key={0} value={0}>
                                            开通
                                        </Option>
                                        <Option key={1} value={1}>
                                            禁用
                                        </Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={8}>
                                <div style={{ float: 'right' }}>
                                    <Button
                                        type="primary"
                                        className="buttonClass"
                                        disabled={!cRight.query}
                                        onClick={this.queryClick}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="buttonClass"
                                        disabled={!cRight.add}
                                        onClick={() => {
                                            this.userData = {};
                                            this.setState({ pageType: 'add' });
                                        }}
                                    >
                                        添加新机构
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        style={{ paddingTop: 50, overflowX: 'hidden' }}
                        pagination={{ showSizeChanger: true }}
                        columns={this.columns}
                        dataSource={tableData}
                    />
                    {resetModal.call(this)}
                </div>
            );
        } else {
            return (
                <Save
                    pageType={pageType}
                    backList={this.backList.bind(this)}
                    userData={this.userData}
                    curUser={this.props.curUser}
                />
            );
        }
    }
}
