import React, { Component } from 'react';
import { Table, Divider, Modal, Button, notification } from 'antd';
import RpSave from './RpSave';
import { initRight } from '../../comUtil';

import './sm-index.css';

import Axios from 'axios';
const { confirm } = Modal;

export default class OrgList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'rolename',
                key: 'rolename'
            },
            {
                title: '操作',
                key: 'opt',
                render: (row, record, index) => (
                    <span>
                        <a
                            onClick={() => {
                                if (this.state.cRight.edit) {
                                    this.setState({ pageType: 'edit', cRole: row });
                                } else {
                                    notification.error({ message: '当前用户没有编辑角色的权限' });
                                }
                            }}
                        >
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a
                            onClick={() => {
                                if (this.state.cRight.delete) {
                                    confirm({
                                        title: '确定要删除该角色吗 ?',
                                        // content: 'Some descriptions',
                                        okText: '确认',
                                        okType: 'danger',
                                        cancelText: '取消',
                                        onOk() {
                                            let data = new FormData();
                                            data.append('roleId', row.id);
                                            Axios.post('/ylws/role/delRole', data)
                                                .then(res => {
                                                    if (res.data) {
                                                        if (res.data.header.code === '1003') {
                                                            notification.error({ message: res.data.header.msg });
                                                            setTimeout(() => {
                                                                this.props.history.push({ pathname: '/' });
                                                            }, 1000);
                                                        }
                                                        if (res.data.header.code === '1000') {
                                                            notification.success({ message: '删除角色成功' });
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
                                    notification.error({ message: '当前用户没有删除角色的权限' });
                                }
                            }}
                        >
                            删除
                        </a>
                    </span>
                )
            }
        ];
        this.state = {
            pageType: 'list',
            userData: [],
            cRole: {},
            // 权限
            cRight: {}
        };
    }

    componentDidMount() {
        this.getAllRole();
        setTimeout(() => {
            initRight.call(this, this.props);
        }, 30);
    }

    getAllRole = () => {
        Axios.post('/ylws/role/selectRoleAll')
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

    backList = () => this.setState({ pageType: 'list' });

    render() {
        const { pageType, cRole, cRight } = this.state;
        if (pageType === 'list') {
            const { tableData } = this.state;
            return (
                <div>
                    <h1 style={{ marginTop: 10 }}>
                        <strong>角色权限管理</strong>
                    </h1>

                    <Button
                        type="primary"
                        disabled={!cRight.add}
                        onClick={() => this.setState({ pageType: 'add', cRole: {} })}
                    >
                        添加
                    </Button>

                    <Table
                        rowKey="id"
                        pagination={false}
                        style={{ paddingTop: 20, width: 600 }}
                        columns={this.columns}
                        dataSource={tableData}
                    />
                </div>
            );
        } else {
            return (
                <RpSave
                    curUser={this.props.curUser}
                    cRole={cRole}
                    pageType={pageType}
                    backList={this.backList.bind(this)}
                />
            );
        }
    }
}
