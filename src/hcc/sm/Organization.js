import React, { Component } from 'react';
import { Tree, Modal, Input, Button, notification } from 'antd';

import { getTreeNodes, initRight } from '../../comUtil';

import './sm-index.css';
import Axios from 'axios';

/**
 * 组织
 */
export default class OrgList extends Component {
    constructor(props) {
        super(props);

        // 新增机构名
        this.newName = null;
        this.state = {
            areaTree: [],
            addOrgModalFlag: false,
            addTreeModalFlag: false,
            // 选中的node
            cNode: {},
            // 权限
            cRight: {}
        };
    }

    componentDidMount() {
        getTreeNodes.call(
            this,
            null,
            '/ylws/org/selectOrgListTree',
            { childKey: 'children', nameKey: 'name', itemKey: 'id' },
            true,
            {
                okEvent: () => {
                    let data = new FormData();
                    data.append('id', this.state.cNode.id);
                    Axios.post('/ylws/org/delOrg', data)
                        .then(res => {
                            if (res.data) {
                                if (res.data.header.code === '1003') {
                                    notification.error({ message: res.data.header.msg });
                                    setTimeout(() => {
                                        this.props.history.push({ pathname: '/' });
                                    }, 1000);
                                }
                                if (res.data.header.code === '1000') {
                                    notification.success({ message: '删除数据成功' });
                                    setTimeout(() => location.reload(), 1000);
                                }
                            } else {
                                notification.error({ message: res.data.header.msg });
                            }
                        })
                        .catch(e => console.log(e));
                },
                cancelEvent: () => {}
            }
        );

        setTimeout(() => {
            initRight.call(this, this.props);
        }, 30);
    }

    initData = () => {};

    render() {
        const { areaTree, addOrgModalFlag, addTreeModalFlag, cNode, cRight } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className="areaTree">
                    <Tree selectable={false}>{areaTree}</Tree>

                    <Button
                        style={{ margin: 20 }}
                        type="primary"
                        disabled={!cRight.add}
                        onClick={() => this.setState({ addOrgModalFlag: true })}
                    >
                        新增组织机构
                    </Button>
                </div>
                <Modal
                    title="请输入新增的机构名称"
                    visible={addOrgModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        if (this.newName) {
                            Axios.post('/ylws/org/addOrg', { name: this.newName, parentId: 0 })
                                .then(() => {
                                    notification.success({ message: '新增成功' });
                                    setTimeout(() => location.reload(), 1000);
                                })
                                .catch(() => this.setState({ addOrgModalFlag: false }));
                        }
                    }}
                    onCancel={() => this.setState({ addOrgModalFlag: false })}
                >
                    <Input onChange={e => (this.newName = e.target.value)} />
                </Modal>
                <Modal
                    title="请输入新增的机构名称"
                    visible={addTreeModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        if (this.newName) {
                            Axios.post('/ylws/org/addOrg', {
                                name: this.newName,
                                parentId: cNode.id,
                                level: cNode.level + 1
                            })
                                .then(() => {
                                    notification.success({ message: '新增成功' });
                                    setTimeout(() => location.reload(), 1000);
                                })
                                .catch(() => this.setState({ addTreeModalFlag: false }));
                        }
                    }}
                    onCancel={() => this.setState({ addTreeModalFlag: false })}
                >
                    <Input onChange={e => (this.newName = e.target.value)} />
                </Modal>
            </div>
        );
    }
}
