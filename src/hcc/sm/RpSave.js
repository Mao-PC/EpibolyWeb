import React, { Component } from 'react';
import { Table, Checkbox, Button, Input, notification } from 'antd';

import Axios from 'axios';

const allRight = ['显示', '查询', '添加', '修改', '删除'];

export default class OrgList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '功能模块',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '权限分配',
                dataIndex: 'operation',
                key: 'operation',
                render: (row, record, index) => {
                    return row && row.length > 0
                        ? row.map(item => {
                              return (
                                  <Checkbox
                                      key={item.key + index + record.name}
                                      checked={item.value}
                                      onChange={e => {
                                          let userData = this.state.userData;
                                          let cItem = userData[index].operation.find(
                                              opt => parseInt(opt.key, 10) === parseInt(item.key, 10)
                                          );
                                          cItem.value = e.target.checked;
                                          // userData[index].operation[item.key - 1].value = e.target.checked;
                                          this.setState({ userData });
                                      }}
                                  >
                                      {allRight[item.key - 1]}
                                  </Checkbox>
                              );
                          })
                        : '';
                }
            },
            {
                title: '全选',
                dataIndex: 'checkAll',
                key: 'checkAll',
                render: (row, record, index) => (
                    <Checkbox
                        key={index + '@'}
                        checked={!record.operation.some(opt => opt.value === false)}
                        onChange={e => {
                            let userData = this.state.userData;
                            userData[index].operation.forEach(data => (data.value = e.target.checked));
                            this.setState({ userData });
                        }}
                    />
                )
            }
        ];
        this.state = {
            pageType: 'list',
            userData: [],
            rolename: ''
        };
    }

    componentDidMount() {
        const { pageType, cRole } = this.props;
        let data = new FormData();
        data.append('id', pageType === 'edit' ? cRole.id : this.props.curUser.id);
        Axios.post(pageType === 'edit' ? '/ylws/menu/listMenuByRoleId' : '/ylws/menu/listMenu', data)
            .then(res => {
                if (res.data) {
                    if (res.data.header.code === '1003') {
                        notification.error({ message: res.data.header.msg });
                        setTimeout(() => {
                            this.props.history.push({ pathname: '/' });
                        }, 1000);
                    }
                    if (res.data.header.code === '1000') {
                        this.setState({
                            userData: res.data.body.data.map(item => {
                                const opts = item.operation.split('|');
                                item.operation = opts[0].split(',').map(opr => {
                                    return { key: opr, value: opts[1].includes(opr) };
                                });

                                return item;
                            }),
                            rolename: cRole.rolename
                        });
                    }
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    }

    render() {
        const { userData, rolename } = this.state;
        const { pageType, cRole } = this.props;
        return (
            <div>
                <h1 style={{ marginTop: 10, marginBottom: 20 }}>
                    <strong>{pageType === 'edit' ? '编辑' : '添加'}角色</strong>
                </h1>
                <div>
                    <div style={{ display: 'inline', padding: '4px 11px' }}>
                        <span> 角色名称 ： </span>
                    </div>
                    <div style={{ display: 'inline' }}>
                        <Input
                            style={{ width: 200 }}
                            disabled={pageType === 'edit'}
                            value={rolename}
                            onChange={e => this.setState({ rolename: e.target.value })}
                        />
                    </div>
                </div>
                <div style={{ paddingTop: 20 }}>
                    <div style={{ padding: '4px 11px', float: 'left' }}>权限设置 ：</div>
                    <div style={{ padding: '4px 11px', float: 'left', width: '80%' }}>
                        <Table rowKey={'id'} pagination={false} columns={this.columns} dataSource={userData} />
                    </div>
                </div>
                <div style={{ clear: 'both' }} />
                <div style={{ width: '100%', margin: 40 }}>
                    <Button
                        type="primary"
                        style={{ left: '40%' }}
                        onClick={() => {
                            let param = userData.map(item => {
                                let data = {};
                                data.menuId = item.id;
                                data.menuName = item.name;
                                let oper = [];
                                item.operation.forEach(opt => {
                                    if (opt.value) {
                                        oper.push(opt.key);
                                    }
                                });
                                data.oper = oper && oper.length > 0 ? oper.join(',') : null;
                                return data;
                            });
                            let req =
                                pageType === 'edit'
                                    ? {
                                          roleId: cRole.id,
                                          roleName: cRole.rolename,
                                          roleMenuMaps: param
                                      }
                                    : {
                                          rolename: rolename,
                                          param: param,
                                          user: this.props.curUser.id
                                      };

                            if ((pageType === 'edit' && req.roleName) || (pageType === 'add' && req.rolename)) {
                                Axios.post(pageType === 'edit' ? '/ylws/role/modifyRole' : '/ylws/role/addRole', req)
                                    .then(res => {
                                        if (res.data) {
                                            if (res.data.header.code === '1003') {
                                                notification.error({ message: res.data.header.msg });
                                                setTimeout(() => {
                                                    this.props.history.push({ pathname: '/' });
                                                }, 1000);
                                            }
                                            if (res.data.header.code === '1000') {
                                                notification.success({
                                                    message: pageType === 'edit' ? '修改角色成功' : '添加角色成功'
                                                });
                                                setTimeout(() => location.reload(), 1000);
                                            }
                                        } else {
                                            notification.error({ message: res.data.header.msg });
                                        }
                                    })
                                    .catch(e => console.log(e));
                            } else {
                                notification.error({ message: '请检查角色名称' });
                            }
                        }}
                    >
                        保存
                    </Button>
                    <Button type="primary" style={{ left: '50%' }} onClick={this.props.backList}>
                        取消
                    </Button>
                </div>
            </div>
        );
    }
}
