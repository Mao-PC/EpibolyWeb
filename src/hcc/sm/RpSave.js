import React, { Component } from "react";
import { Table, Checkbox, Button, Input } from "antd";

import Axios from 'axios'

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
                dataIndex: "operation",
                key: "operation",
                render: (row, record, index) => {
                    return (
                        row && row.map((item) => {
                            return <Checkbox key={item.key} checked={item.value}
                                onChange={e => {
                                    let userData = this.state.userData
                                    userData[index].operation[item.key - 1].value = e.target.checked
                                    this.setState({ userData })
                                }}
                            >{allRight[item.key - 1]}</Checkbox>
                        })
                    )
                }
            },
            {
                title: "全选",
                dataIndex: "checkAll",
                key: "checkAll",
                render: (text, record, index) => <Checkbox key={index} defaultChecked onChange={e => {
                    let userData = this.state.userData
                    userData[index].operation.forEach(data => data.value = e.target.checked)
                    this.setState({ userData })
                }} />
            },
        ]
        this.state = {
            pageType: 'list',
            userData: []
        }
    }

    componentDidMount() {
        let data = new FormData()
        data.append('id', this.props.curUser.id)
        Axios.post('menu/listMenu', data).then(req => {
            if (req.data && req.data.header.code === '1000') {
                this.setState({
                    userData: req.data.body.data.map(item => {
                        item.operation = item.operation.split(',').map(opr => {
                            return { key: opr, value: true }
                        })
                        return item
                    })
                })
            }
        }).catch(e => console.log(e))
    }


    render() {
        const { userData } = this.state
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
                        <Table pagination={false} columns={this.columns} dataSource={userData} />
                    </div>
                </div>
                <div style={{ clear: "both" }}></div>
                <div style={{ width: "100%", margin: 40 }}>
                    <Button type="primary" style={{ left: "40%" }}>保存</Button>
                    <Button type="primary" style={{ left: "50%" }} onClick={this.props.backList} >取消</Button>
                </div>
            </div>
        )

    }
}