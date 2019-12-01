import React, { Component } from 'react';
import { Tree, DatePicker, TreeSelect, Input, Button, Table, Divider, notification } from 'antd';
import { initOrgSelectTree, getTreeNodes, initOrgTreeNodes, resetModal, initRight, formatDate } from '../../comUtil';
import Axios from 'axios';
import Save from './Save';

import './imm-index.css';

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
                render: (value, record, index) => (
                    <span>
                        {Boolean(record.orgLevel === 3) && (
                            <span>
                                <a
                                    onClick={() => {
                                        if (this.state.cRight.edit) {
                                            this.userData = this.state.tableData[index];
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
                                    this.selectedRowKeys = [index];
                                    this.setState({ visible: true });
                                } else {
                                    notification.success({ message: '当前用户没有编辑医疗机构权限' });
                                }
                            }}
                        >
                            重置密码
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
            cRight: {}
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
                        notification.error({ message: res.data.header.msg });
                        setTimeout(() => {
                            this.props.history.push({ pathname: '/' });
                        }, 1000);
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
            const { areaTree, tableData, areaTreeSelect, queryData } = this.state;
            return (
                <div style={{ height: '100%' }}>
                    <div className="imm-areaTree">
                        <Tree onSelect={this.onSelect}>{areaTree}</Tree>
                    </div>
                    <div className="listArea">
                        <div className="formItem">
                            <span className="spanInput">创建时间：</span>
                            <DatePicker
                                style={{ width: 210 }}
                                key="createTime"
                                placeholder="选择时间"
                                onChange={(date, dateString) => {
                                    this.setState({ queryData: { ...queryData, queryDate: dateString } });
                                }}
                            />
                        </div>
                        <div className="formItem">
                            <span className="spanInput">所属行政部门：</span>
                            <TreeSelect
                                allowClear={true}
                                style={{ width: 180 }}
                                treeData={areaTreeSelect}
                                onChange={text => {
                                    this.setState({ queryData: { ...queryData, orgId: text } });
                                }}
                            />
                        </div>
                        <div className="formItem">
                            <span className="spanInput">医疗机构名称：</span>
                            <Input
                                style={{ width: 180 }}
                                allowClear={true}
                                onChange={e => {
                                    this.setState({ queryData: { ...queryData, medicalname: e.target.value } });
                                }}
                            />
                        </div>
                        <div className="formItem">
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
                        <div className="list-table">
                            <Table
                                style={{ paddingTop: 200 }}
                                pagination={{ showSizeChanger: true }}
                                columns={this.columns}
                                dataSource={tableData}
                            />
                        </div>
                    </div>
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
