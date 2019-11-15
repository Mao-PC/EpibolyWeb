import React, { Component } from 'react';
import { Tree, Icon, Modal, Input } from 'antd';

const { TreeNode } = Tree;
const { confirm } = Modal;

import { treeData } from './data';

import './sm-index.css';

export default class OrgList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areaTree: [],
            visible: false
        };
    }

    componentDidMount() {
        this.setState({
            areaTree: this.getTreeNodes(treeData)
        });
    }

    getTreeNodes = treeData => {
        return this.getOrgs(treeData);
    };

    /**
     *  初始化树
     * @param {array} treeData 数据
     */
    getOrgs = treeData => {
        if (treeData) {
            let nodes = [];
            treeData.forEach(element => {
                let flag = element.children && element.children.length;
                nodes.push(
                    <TreeNode
                        title={
                            <span>
                                {element.name}
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    type={flag ? 'plus-square' : 'minus-square'}
                                    onClick={() => this.iconClick(flag)}
                                />
                            </span>
                        }
                        key={element.id}
                    >
                        {this.getOrgs(element.children)}
                    </TreeNode>
                );
            });
            return nodes;
        }
    };

    iconClick = flag => {
        if (flag) {
            // 增加
            this.setState({ visible: true });
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
        const { areaTree, visible } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className="areaTree">
                    <Tree selectable={false}>{areaTree}</Tree>
                </div>
                <Modal
                    title="请输入新增的机构名"
                    visible={visible}
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
