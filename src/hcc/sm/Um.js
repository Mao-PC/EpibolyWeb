import React, { Component } from 'react';
import { Tree, Modal, Button, Table, Divider, Input, notification } from 'antd';

import Save from './UmSave';

import './sm-index.css';

import { getTreeNodes, formatDate } from '../../comUtil';
import Axios from 'axios';

const { confirm } = Modal

/**
 * 用户管理
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
                title: '登录名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '所属行政部门',
                dataIndex: 'orgName',
                key: 'orgName'
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
                render: (value) => { return formatDate(value) }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (value) => { return <span>{value === 0 ? '正常' : '冻结'}</span> }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: (value, record, index) => (
                    <span>
                        <a onClick={() => { this.setState({ pageType: 'edit' }) }}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            this.selectedRowKeys = [index]
                            this.setState({ visible: true })
                        }}>重置密码</a>
                    </span>
                )
            }
        ];
        this.cNode = {};
        // 选中的行
        this.selectedRowKeys = []
        // 用户数据
        this.userData = {};
        this.state = {
            pageType: 'list',
            areaTree: [],
            tableData: [],
            visible: false,
            pwderror: null,
            pwd2error: null,
            pwd: null,
            pwd2: null,
            old_pwd: null,
        };
    }

    componentDidMount() {
        this.initTreeNodes();
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

    /**
     * 点击树节点获取table数据
     */
    onSelect = (selectedKeys, info) => {
        let data = new FormData();
        data.append('orgId', selectedKeys[0]);
        Axios.post('/ylws/user/selectUserListByOrg', data)
            .then(req => {
                if (req.data && req.data.header.code === '1000') {
                    this.setState({ tableData: req.data.body.data });
                } else {
                    notification.error({ message: req.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    };

    /**
     * 重置密码
     */
    handleOk = () => {
        const { pwd, old_pwd, tableData } = this.state
        const userData = tableData[this.selectedRowKeys[0]]
        let data = new FormData()
        data.append('userId', userData.id)
        data.append('username', userData.username)
        data.append('oldPassword', old_pwd)
        data.append('newPassword', pwd)
        Axios.post('/ylws/user/modifyPassword', data)
            .then(req => {
                if (req.data && req.data.header.code === '1000') {
                    notification.success({ message: '密码修改成功' });
                    setTimeout(() => location.reload(), 1000);
                } else {
                    notification.error({ message: req.data.header.msg });
                }
            })
            .catch(e => console.log(e));

    };


    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        }
    };

    render() {
        const { pageType, pwd2error, pwderror } = this.state;
        if (pageType === 'list') {
            const { areaTree, tableData, visible, old_pwd, pwd, pwd2 } = this.state;
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
                                onClick={() => {
                                    this.userData = {}
                                    this.setState({ pageType: 'add' })
                                }}
                            >
                                添加
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => {
                                    if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
                                        this.userData = tableData[this.selectedRowKeys[0]]
                                        this.setState({ pageType: 'edit' })
                                    } else {
                                        this.userData = {}
                                        notification.info({ message: '请选择要修改的数据' })
                                    }
                                }}
                            >
                                修改
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => {
                                    if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
                                        confirm.call(this, {
                                            title: '确定要删除所选吗 ?',
                                            // content: 'Some descriptions',
                                            okText: '确认',
                                            okType: 'danger',
                                            cancelText: '取消',
                                            onOk: () => {
                                                console.log(this.selectedRowKeys)
                                                let data = new FormData()
                                                data.append('ids', this.selectedRowKeys.map(i => tableData[i].id))

                                                Axios.post('/ylws/user/delUserBatch', data)
                                                    .then(req => {
                                                        if (req.data && req.data.header.code === '1000') {
                                                            notification.success({ message: '删除数据成功' });
                                                            setTimeout(() => location.reload(), 1000);
                                                        } else {
                                                            notification.error({ message: req.data.header.msg });
                                                        }
                                                    })
                                                    .catch(e => console.log(e));
                                            },
                                            onCancel() {
                                                console.log('Cancel');
                                            }
                                        })
                                    } else {
                                        notification.info({ message: '请选择要删除的数据' })
                                    }
                                }
                                }
                            >
                                删除
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => {
                                    if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
                                        this.setState({ visible: true })
                                    } else {
                                        notification.info({ message: '请选择重置密码的数据' })
                                    }
                                }}
                            >
                                重置密码
                            </Button>
                        </div>
                        <div className="list-table">
                            <Table
                                style={{ paddingTop: 50 }}
                                columns={this.columns}
                                dataSource={tableData}
                                rowSelection={{ onChange: (selectedRowKeys, selectedRows) => { this.selectedRowKeys = selectedRowKeys } }}
                            />
                        </div>
                    </div>
                    <Modal
                        title="重置密码"
                        visible={visible}
                        okText="确定"
                        cancelText="取消"
                        onOk={this.handleOk.bind(this)}
                        onCancel={() => {
                            this.selectedRowKeys = []
                            this.setState({ visible: false, pwd: null, old_pwd: null, pwd2: null })
                        }}
                    >
                        <div>
                            <span className="model-span">原密码： </span>
                            <Input.Password className="model-input" value={old_pwd} onChange={e => this.setState({ old_pwd: e.target.value })} />
                        </div>
                        <div>
                            <span className="model-span"> 新密码： </span>
                            <Input.Password
                                className="model-input"
                                value={pwd}
                                onChange={e => {
                                    this.setState({ pwd: e.target.value });

                                    if (
                                        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/.test(
                                            e.target.value
                                        )
                                    ) {
                                        this.setState({ pwderror: null });
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
                                value={pwd2}
                                onChange={e => {
                                    this.setState({
                                        pwd2error: pwd !== e.target.value ? '两次输入密码不一致!' : null,
                                        pwd2: e.target.value
                                    });
                                }}
                            />
                            <span className="model-error">{pwd2error}</span>
                        </div>
                    </Modal>
                </div>
            );
        } else {
            return <Save pageType={pageType} backList={this.backList.bind(this)} userData={this.userData} />;
        }
    }
}
