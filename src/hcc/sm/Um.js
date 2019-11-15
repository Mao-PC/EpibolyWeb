/* eslint-disable */
import React, { Component } from "react";
import { Tree, DatePicker, Select, Input, Button, Table, Divider, Checkbox } from "antd";

const { TreeNode } = Tree;
const { Option } = Select;

import { treeData, deptData, tableData } from "./data";

import Save from "./UmSave";

import "./sm-index.css";

export default class List extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "选择",
                dataIndex: "check",
                key: "check",
                render: () => {
                    return <Checkbox />
                }
            },
            {
                title: "ID",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "医疗机构名称",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "所属行政部门",
                dataIndex: "dept",
                key: "dept"
            },
            {
                title: "联系人",
                dataIndex: "contact",
                key: "contact"
            },
            {
                title: "电话",
                dataIndex: "tel",
                key: "tel"
            },
            {
                title: "创建时间",
                dataIndex: "createtime",
                key: "createtime"
            },
            {
                title: "状态",
                dataIndex: "status",
                key: "status"
            },
            {
                title: "操作",
                dataIndex: "opt",
                key: "opt",
                render: tags => (
                    <span>
                        <a onClick={() => this.setState({ pageType: "edit" })}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a>重置密码</a>
                    </span>
                )
            }
        ];
        this.state = {
            pageType: "list",
            areaTree: [],
            depts: [],
            tableData: []
        };
    }

    componentDidMount() {
        this.setState({
            areaTree: this.getTreeNodes(treeData),
            depts: this.getDept(),
            tableData: this.getTableData()
        });
    }
    /**
     *  初始化树
     */
    getTreeNodes = treeData => {
        if (treeData) {
            let nodes = [];
            treeData.forEach(element => {
                nodes.push(
                    <TreeNode title={element.name} key={element.id}>
                        {this.getTreeNodes(element.children)}
                    </TreeNode>
                );
            });
            return nodes;
        }
    };

    /**
     * 初始化行政部门
     */
    getDept = () => {
        return deptData.map(dept => {
            return (
                <Option key={dept.id} value={dept.id}>
                    {dept.name}
                </Option>
            );
        });
    };

    getTableData = () => {
        return tableData;
    };

    backList() {
        this.setState({ pageType: "list" });
    }

    onSelect = (selectedKeys, info) => {
        console.log("selected", selectedKeys, info);
    };
    render() {
        const { pageType } = this.state;
        if (pageType === "list") {
            const { areaTree, depts, tableData } = this.state;
            return (
                <div style={{ height: "100%" }}>
                    <div className="imm-areaTree">
                        <Tree onSelect={this.onSelect}>{areaTree}</Tree>
                    </div>
                    <div className="listArea">
                        <div style={{ float: "right", margin: 30 }}>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => this.setState({ pageType: "edit" })}>
                                添加
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => this.setState({ pageType: "add" })}
                            >
                                修改
                            </Button>
                            <Button type="primary" className="buttonClass">
                                删除
                            </Button>
                            <Button type="primary" className="buttonClass">
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
                </div>
            );
        } else {
            return (
                <Save pageType={pageType} backList={this.backList.bind(this)} />
            );
        }
    }
}
