import React, { Component } from 'react';
import { Tree, Modal, Button, Table, Divider, Checkbox, Input, notification } from 'antd';

import Save from './UmSave';

import './sm-index.css';

import { getTreeNodes } from '../../comUtil';
import Axios from 'axios';

/**
 * 用户管理
 */
export default class List extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '选择',
                dataIndex: 'check',
                key: 'check',
                render: () => {
                    return <Checkbox />;
                }
            },
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '医疗机构名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '所属行政部门',
                dataIndex: 'dept',
                key: 'dept'
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                key: 'contact'
            },
            {
                title: '电话',
                dataIndex: 'tel',
                key: 'tel'
            },
            {
                title: '创建时间',
                dataIndex: 'createtime',
                key: 'createtime'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: () => (
                    <span>
                        <a onClick={() => this.setState({ pageType: 'edit' })}>编辑</a>
                        <Divider type="vertical" />
                        <a>重置密码</a>
                    </span>
                )
            }
        ];
        this.pwd = null;
        this.cNode = {};
        this.state = {
            pageType: 'list',
            areaTree: [],
            tableData: [],
            visible: false,
            pwderror: null,
            pwd2error: null
        };
    }

    componentDidMount() {
        this.initTreeNodes();
    }
    /**
     * 初始化组织树
     */
    initTreeNodes = () => {
        getTreeNodes.call(this, null, '/org/selectOrgListTree', {
            childKey: 'children',
            nameKey: 'name',
            itemKey: 'id'
        });
    };

    backList() {
        this.setState({ pageType: 'list' });
    }

    /**
     * 点击树节点获取table数据
     */
    onSelect = (selectedKeys, info) => {
        let data = new FormData();
        data.append('orgId', selectedKeys[0]);
        Axios.post('user/selectUserListByOrg', data)
            .then(req => {
                if (req.data && req.data.header.code === '1000') {
                    this.setState({ tableData: req.data.body.data });
                } else {
                    notification.error({ message: req.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };
    render() {
        const { pageType, pwd2error, pwderror } = this.state;
        if (pageType === 'list') {
            const { areaTree, tableData, visible } = this.state;
            return (
                <div style={{ height: '100%' }}>
                    <div className="imm-areaTree">
                        <Tree onSelect={this.onSelect}>{areaTree}</Tree>
                    </div>
                    <div className="listArea">
                        <div style={{ float: 'right', margin: 30 }}>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => this.setState({ pageType: 'add' })}
                            >
                                添加
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => this.setState({ pageType: 'edit' })}
                            >
                                修改
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() =>
                                    confirm({
                                        title: '确定要删除该用户吗 ?',
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
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => this.setState({ visible: true })}
                            >
                                重置密码
                            </Button>
                        </div>
                        <div className="list-table">
                            <Table
                                // bordered
                                style={{ paddingTop: 50 }}
                                columns={this.columns}
                                dataSource={tableData}
                            />
                        </div>
                    </div>
                    <Modal
                        title="重置密码"
                        visible={visible}
                        okText="确定"
                        cancelText="取消"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <div>
                            <span className="model-span">原密码： </span>
                            <Input className="model-input" />
                        </div>
                        <div>
                            <span className="model-span"> 新密码： </span>
                            <Input.Password
                                className="model-input"
                                onChange={e => {
                                    if (
                                        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/.test(
                                            e.target.value
                                        )
                                    ) {
                                        this.setState({ pwderror: null });
                                        this.pwd = e.target.value;
                                    } else {
                                        this.setState({ pwderror: '大小写字母、数字，至少两种任意组合' });
                                    }
                                }}
                            />
                            <span className="model-error">{pwderror}</span>
                        </div>
                        <div>
                            <span className="model-span"> 确认密码： </span>
                            <Input.Password
                                className="model-input"
                                onChange={e => {
                                    this.setState({
                                        pwd2error: this.pwd !== e.target.value ? '两次输入密码不一致!' : null
                                    });
                                }}
                            />
                            <span className="model-error">{pwd2error}</span>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return <Save pageType={pageType} backList={this.backList.bind(this)} />;
        }
    }
}
