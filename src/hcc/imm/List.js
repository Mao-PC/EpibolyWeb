import React, { Component } from 'react';
import { Tree, DatePicker, Select, Input, Button, Table, Divider } from 'antd';
import { getDept, getTableData, getTreeNodes } from '../../comUtil';

import Save from './Save';

import './imm-index.css';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '医疗机构名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '所属行政部门',
                dataIndex: 'dept',
                key: 'dept'
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                key: 'contact'
            },
            {
                title: '电话',
                dataIndex: 'tel',
                key: 'tel'
            },
            {
                title: '创建时间',
                dataIndex: 'createtime',
                key: 'createtime'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: record => <span>{record === 1 ? '开通' : '禁用'}</span>
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: tags => (
                    <span>
                        <a onClick={() => this.setState({ pageType: 'edit' })}>编辑</a>
                        <Divider type="vertical" />
                        <a>重置密码</a>
                    </span>
                )
            }
        ];
        this.state = {
            pageType: 'list',
            areaTree: [],
            depts: [],
            tableData: []
        };
    }

    componentDidMount() {
        getDept.call(this);
        getTreeNodes.call(this);
        getTableData.call(this);
    }

    backList() {
        this.setState({ pageType: 'list' });
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    render() {
        const { pageType } = this.state;
        if (pageType === 'list') {
            const { areaTree, depts, tableData } = this.state;
            return (
                <div style={{ height: '100%' }}>
                    <div className="imm-areaTree">
                        <Tree onSelect={this.onSelect}>{areaTree}</Tree>
                    </div>
                    <div className="listArea">
                        <div className="formItem">
                            <span className="spanInput">创建时间：</span>
                            <DatePicker
                                style={{ width: 210 }}
                                key="createTime"
                                placeholder="选择时间"
                                onChange={(date, dateString) => {
                                    console.log(date, dateString);
                                }}
                            />
                        </div>
                        <div className="formItem">
                            <span className="spanInput">所属行政部门：</span>
                            <Select allowClear={true} style={{ width: 180 }} onChange={text => console.log(text)}>
                                {depts}
                            </Select>
                        </div>
                        <div className="formItem">
                            <span className="spanInput">医疗机构名称：</span>
                            <Input
                                style={{ width: 180 }}
                                allowClear={true}
                                onChange={e => console.log(e.target.value)}
                            />
                        </div>
                        <div className="formItem">
                            <Button type="primary" className="buttonClass">
                                查询
                            </Button>
                            <Button
                                type="primary"
                                className="buttonClass"
                                onClick={() => {
                                    this.setState({ pageType: 'add' });
                                }}
                            >
                                添加新机构
                            </Button>
                        </div>
                        <div className="list-table">
                            <Table style={{ paddingTop: 200 }} columns={this.columns} dataSource={tableData} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Save pageType={pageType} backList={this.backList.bind(this)} />;
        }
    }
}
