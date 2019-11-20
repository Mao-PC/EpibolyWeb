import React, { Component } from 'react';
import { Tree, Modal, Input } from 'antd';

const { confirm } = Modal;

import { getTreeNodes } from '../../comUtil';


import './sm-index.css';

export default class OrgList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areaTree: [],
            addOrgModalFlag: false,
            // 选中的node
            cNode: {},
        };
    }

    componentDidMount() {
        getTreeNodes.call(this, null, '/org/selectOrg', true, {
            okEvent: this.okEvent,
            cancelEvent: this.cancelEvent
        });
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

    handleOk = e => {
        console.log(e);
        this.setState({
            addOrgModalFlag: false
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            addOrgModalFlag: false
        });
    };

    render() {
        const { areaTree, addOrgModalFlag } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className="areaTree">
                    <Tree selectable={false}>{areaTree}</Tree>
                </div>
                <Modal
                    title="请输入新增的机构名"
                    visible={addOrgModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input />
                </Modal>
            </div>
        );
    }
}
