import React from 'react';
import axios from 'axios';
import { Select, Tree } from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;

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
const getTreeNodes = function(data) {
    axios({
        url: 'data/treeData.json',
        data,
        responseType: 'json'
    })
        .then(res => {
            this.setState({
                areaTree: getSubNode(res.data)
            });
        })
        .catch(e => console.log(e));
};

function getSubNode(data) {
    if (data) {
        return data.map(element => {
            return (
                <TreeNode title={element.name} key={element.id}>
                    {getSubNode(element.children)}
                </TreeNode>
            );
        });
    }
}

/**
 *  获取表格数据
 */
const getTableData = function(url, data) {
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
