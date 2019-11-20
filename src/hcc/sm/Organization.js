import React, { Component } from 'react';
import { Tree, Modal, Input, Button, notification } from 'antd';

const { confirm } = Modal;

import { getTreeNodes } from '../../comUtil';


import './sm-index.css';
import Axios from 'axios';

/**
 * 组织
 */
export default class OrgList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areaTree: [],
            addOrgModalFlag: false,
            showNewButton: false,
            // 选中的node
            cNode: {},
        };
    }

    componentDidMount() {
        getTreeNodes.call(this, null, '/org/selectOrgList', true, {
            okEvent: this.okEvent,
            cancelEvent: this.cancelEvent
        });
        setTimeout(() => {
            if (!this.state.areaTree || !this.state.areaTree.length === 0) {
                this.setState({ showNewButton: true })
            }
        }, 0);
    }

    okEvent = () => { }
    cancelEvent = () => { }

    iconClick = flag => {
        if (flag) {
            // 增加
            this.setState({ addOrgModalFlag: true });
        } else {
            // 删除
            confirm({
                title: '确定要删除该结构吗 ?',
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
            });
        }
    };

    render() {
        const { areaTree, addOrgModalFlag, showNewButton } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className="areaTree">
                    <Tree selectable={false}>{areaTree}</Tree>
                    {showNewButton && <Button style={{ margin: 20 }} type="primary" onClick={() => this.setState({ addOrgModalFlag: true })}>新增组织机构</Button>}
                </div>
                <Modal
                    title="新增机构"
                    visible={addOrgModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        Axios.post('/org/addOrg', {}).then(() => {
                            notification.success({ message: '新增成功' });
                            setTimeout(() => location.reload(), 1000)
                        }).catch(() => this.setState({ addOrgModalFlag: false }))
                    }}
                    onCancel={() => this.setState({ addOrgModalFlag: false })}
                >
                    <Input />
                    <Input />
                </Modal>
            </div>
        );
    }
}
