import React from 'react';
import axios from 'axios';
import { Select, Tree, Icon, Modal } from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;
const { confirm } = Modal;

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
const getTreeNodes = function (params, url, addable = false, iconEvents) {
    axios
        .get(url ? url : 'data/treeData.json', {
            params,
            responseType: 'json'
        })
        .then(res => {
            console.log(res.data);
            if (res.data) {
                this.setState({
                    areaTree: getSubNode.call(this, res.data, addable, iconEvents)
                });
            } else {
                this.setState({ areaTree: [] });
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({ areaTree: [] });
        });
};

function getSubNode(data, addable = false, iconEvents) {
    if (data) {
        return data.map(element => {
            let flag = element.children && element.children.length;
            return (
                <TreeNode
                    title={
                        <span>
                            {`${element.codeName} - ${element.codeNo}`}
                            {addable && (
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    type={'plus-square'}
                                    onClick={iconClick.bind(this, true, element, iconEvents)}
                                />
                            )}
                            {addable && !Boolean(flag) && (
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    type={'minus-square'}
                                    onClick={iconClick.bind(this, false, element, iconEvents)}
                                />
                            )}
                        </span>
                    }
                    key={element.id}
                >
                    {getSubNode(element.children, addable, iconEvents)}
                </TreeNode>
            );
        });
    }
}

function iconClick(flag, data, iconEvents) {
    this.setState({ cNode: data });
    if (flag) {
        // 增加
        this.setState({ addTreeModalFlag: true });
    } else {
        // 删除
        confirm.call(this, {
            title: '确定要删除该数据吗 ?',
            // content: 'Some descriptions',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => iconEvents.okEvent.call(this),
            onCancel: () => iconEvents.cancelEvent.call(this)
        });
    }
}

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

/**
 * 初始化所有的字典
 * @param {*} allkeys 需要全部的字典
 * @param {*} notAllkeys 不需要全部的字典
 */
const initAllDic = function (allkeys = [], notAllkeys = []) {
    allkeys = allkeys ? allkeys : []
    axios.post('/dic/getDicsByRoot', allkeys.concat(notAllkeys)).then(req => {
        if (req.data) {
            for (const key in req.data) {
                this.setState({
                    [key]: getAllOptions(req, key, notAllkeys)
                })
            }
        }
    })
}

function getAllOptions(req, key, notAllkeys) {
    if (req.data[key].children) {
        let opts = req.data[key].children.map(item => <Option value={item.codeNo}>{item.codeName}</Option>)
        if (!notAllkeys.includes(key)) {
            opts.unshift(<Option value={null}>全部</Option>)
        }
        return opts
    } else {
        return []
    }
}

export { getDept, getTreeNodes, getTableData, initAllDic };
