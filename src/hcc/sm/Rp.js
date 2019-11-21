import React, { Component } from 'react';
import { Table, Divider, Modal, Button, notification } from 'antd';
import RpSave from './RpSave';

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
                        <a onClick={() => this.setState({ pageType: 'edit', cRole: row })}>编辑</a>
                        <Divider type="vertical" />
                        <a
                            onClick={() =>
                                confirm({
                                    title: '确定要删除该角色吗 ?',
                                    // content: 'Some descriptions',
                                    okText: '确认',
                                    okType: 'danger',
                                    cancelText: '取消',
                                    onOk() {
                                        let data = new FormData();
                                        data.append('roleId', row.id);
                                        Axios.post('/role/delRole', data)
                                            .then(req => {
                                                if (req.data && req.data.header.code === '1000') {
                                                    notification.success({ message: '删除角色成功' });
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
                            }
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
            cRole: {}
        };
    }

    componentDidMount() {
        this.getAllRole();
    }

    getAllRole = () => {
        Axios.post('/role/selectRoleAll')
            .then(req => {
                if (req.data && req.data.header.code === '1000') {
                    this.setState({ tableData: req.data.body.data });
                } else {
                    notification.error({ message: req.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    };

    backList = () => this.setState({ pageType: 'list' });

    render() {
        const { pageType, cRole } = this.state;
        if (pageType === 'list') {
            const { tableData } = this.state;
            return (
                <div>
                    <h1 style={{ marginTop: 10 }}>
                        <strong>角色权限管理</strong>
                    </h1>

                    <Button type="primary" onClick={() => this.setState({ pageType: 'add' })}>
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
