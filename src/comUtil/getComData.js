import React from 'react';
import axios from 'axios';
import { Select, Tree, Icon, Modal } from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;
const { confirm } = Modal

const getDept = function getDept(data) {
    axios({
        url: 'data/dept.json',
        data,
        responseType: 'json'
    })
        .then(res =>
            this.setState({
                depts: res.data.map(dept => {
                    return (
                        <Option key={dept.id} value={dept.id}>
                            {dept.name}
                        </Option>
                    );
                })
            })
        )
        .catch(e => console.log(e));
};

/**
 *  初始化树
 */
const getTreeNodes = function (data, addable = false) {
    axios({
        url: 'data/treeData.json',
        data,
        responseType: 'json'
    })
        .then(res => {
            this.setState({
                areaTree: getSubNode.call(this, res.data, addable)
            });
        })
        .catch(e => console.log(e));
};

function getSubNode(data, addable = false) {
    if (data) {
        return data.map(element => {
            let flag = element.children && element.children.length;
            return (
                <TreeNode title={
                    <span>
                        {element.name}
                        {addable && <Icon
                            style={{ paddingLeft: 10 }}
                            type={flag ? 'plus-square' : 'minus-square'}
                            onClick={iconClick.bind(this, flag)}
                        />}
                    </span>
                }
                    key={element.id}>
                    {getSubNode(element.children, addable)}
                </TreeNode>
            );
        });
    }
}

function iconClick(flag) {
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

/**
 *  获取表格数据
 */
const getTableData = function (url, data) {
    axios({
        url: url ? url : 'data/tableData.json',
        data,
        responseType: 'json'
    })
        .then(res => {
            this.setState({
                tableData: res.data
            });
        })
        .catch(e => console.log(e));
};

export { getDept, getTreeNodes, getTableData };
