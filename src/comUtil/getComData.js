import React from 'react';
import axios from 'axios';
import { Select, Tree, Icon, Modal, notification } from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;
const { confirm } = Modal;

/**
 * 初始化树
 * @param {object} params 传到后端的参数
 * @param {string} url 请求URL
 * @param {object} targetKey { childKey: 子节点的key, nameKey: 名称key,codeKey: 编码key, itemKey: 唯一编码key }
 * @param {boolean} addable 是否可以新增删除节点
 * @param {object} nodeEvents addable = true时生效, {okEvent: 确认删除的事件, cancelEvent: 取消删除的事件}
 */
const getTreeNodes = function(params, url, targetKey = {}, addable = false, nodeEvents) {
    axios({
        method: 'post',
        url: url,
        data: params
    })
        .then(res => {
            if (res.data) {
                this.setState({
                    areaTree: getSubNode.call(
                        this,
                        res.data.body ? res.data.body.data : [],
                        targetKey,
                        addable,
                        nodeEvents
                    ),
                    expandKeys: res.data.body ? res.data.body.data.map(item => item.id + '') : []
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

function getSubNode(data, targetKey, addable = false, nodeEvents) {
    const { childKey, nameKey, codeKey, itemKey } = targetKey;
    if (data && data instanceof Array && data.length > 0) {
        return data.map(element => {
            let title = '';
            let titleName = element[nameKey];
            let titleCode = element[codeKey];
            if (titleName && titleCode) {
                title = titleName + ' - ' + titleCode;
            } else if (titleName) {
                title = titleName;
            } else if (titleCode) {
                title = titleCode;
            }
            let flag = element[childKey] && element[childKey].length;
            return (
                <TreeNode
                    title={
                        <span>
                            {title}
                            {Boolean(addable) && element.level < 3 && (
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    type={'plus-square'}
                                    onClick={iconClick.bind(this, true, element, nodeEvents)}
                                />
                            )}
                            {addable && !Boolean(flag) && (
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    type={'minus-square'}
                                    onClick={iconClick.bind(this, false, element, nodeEvents)}
                                />
                            )}
                        </span>
                    }
                    key={element[itemKey]}
                >
                    {getSubNode.call(this, element[childKey], targetKey, addable, nodeEvents)}
                </TreeNode>
            );
        });
    }
}

function iconClick(flag, data, nodeEvents) {
    this.setState({ cNode: data });
    if (flag) {
        // 增加
        if (this.state.cRight.add) {
            this.setState({ addTreeModalFlag: true });
        } else {
            notification.error({ message: '当前用户没有新增权限' });
        }
    } else {
        // 删除
        if (this.state.cRight.delete) {
            confirm.call(this, {
                title: '确定要删除该数据吗 ?',
                // content: 'Some descriptions',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => nodeEvents.okEvent.call(this),
                onCancel: () => nodeEvents.cancelEvent.call(this)
            });
        } else {
            notification.error({ message: '当前用户没有删除权限' });
        }
    }
}

/**
 *  获取表格数据
 */
const getTableData = function(url, data) {
    axios({
        url: url,
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
const initAllDic = function(allkeys = [], notAllkeys = [], callback) {
    allkeys = allkeys ? allkeys : [];
    axios.post('/ylws/dic/getDicsByRoot', allkeys.concat(notAllkeys)).then(req => {
        if (req.data) {
            for (const key in req.data) {
                this.setState({
                    [key]: getAllOptions(req, key, notAllkeys)
                });
            }
            callback && callback(req.data);
        }
    });
};

function getAllOptions(req, key, notAllkeys) {
    if (req.data[key].children) {
        let opts = req.data[key].children.map(item => <Option value={item.codeNo}>{item.codeName}</Option>);
        if (!notAllkeys.includes(key)) {
            opts.unshift(<Option value={null}>全部</Option>);
        }
        return opts;
    } else {
        return [];
    }
}

export { getTreeNodes, getTableData, initAllDic, getAllOptions };
