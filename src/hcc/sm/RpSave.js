import React, { Component } from "react";
import { Table, Checkbox, Button, Input } from "antd";


import { rights } from './data'

const allRight = ["显示", "查询", "添加", "修改", "删除"]


export default class OrgList extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: "功能模块",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "权限分配",
                dataIndex: "right",
                key: "right",
                render: (record, index) => {
                    return (
                        record && record.map(item => {
                            return <Checkbox key={item} defaultChecked >{allRight[item]}</Checkbox>
                        })
                    )
                }
            },
            {
                title: "全选",
                dataIndex: "checkAll",
                key: "checkAll",
                render: (record, index) => <Checkbox key={index} defaultChecked />
            },
        ]
        this.state = {
            pageType: 'list',
            userData: []
        }
    }

    componentDidMount() {
        this.setState({ tableData: this.getRights() })
    }

    getRights = () => {
        return rights;
    }

    render() {
        const { tableData } = this.state
        return (
            <div >
                <h1 style={{ marginTop: 10, marginBottom: 20 }}>
                    <strong>{this.props.pageType === 'edit' ? '编辑' : '添加'}角色</strong>
                </h1>
                <div >
                    <div style={{ display: "inline", padding: "4px 11px" }}>
                        <span> 角色名称 ： </span>
                    </div>
                    <div style={{ display: "inline", }}>
                        <Input style={{ width: 200 }} />
                    </div>
                </div>
                <div style={{ paddingTop: 20 }}>
                    <div style={{ padding: "4px 11px", float: "left" }}>
                        权限设置 ：
                    </div>
                    <div style={{ padding: "4px 11px", float: "left", width: "80%" }}>
                        <Table columns={this.columns} dataSource={tableData} />
                    </div>
                </div>
                <div style={{ clear: "both" }}></div>
                <div style={{ width: "100%" }}>
                    <Button type="primary" style={{ left: "40%" }}>保存</Button>
                    <Button type="primary" style={{ left: "50%" }} onClick={this.props.backList} >取消</Button>
                </div>
            </div>
        )

    }
}