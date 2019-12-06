import React, { Component } from 'react';
import { Tag, Input, Icon, Modal, Tree, notification } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

import { getTreeNodes, initRight } from '../../comUtil';
import axios from 'axios';

export default class EditableTagGroup extends Component {
    newName = '';
    newCode = '';

    state = {
        inputVisible: false,
        dicModalFlag: false,
        addTreeModalFlag: false,
        dicTitle: '',
        areaTree: [],
        tagChild: [],
        // 选中的字典
        cNode: {},
        // 选中字典的根
        cRootNode: {},
        // 权限
        cRight: {}
    };

    componentDidMount() {
        // 请求所有的字典
        axios.get('/ylws/dic/listDics').then(req => {
            console.log(req.data);
            this.setState({
                tagChild: req.data.map(tag => {
                    const tagElem = (
                        <Tag
                            onClick={() => {
                                if (this.state.cRight.query) {
                                    let data = new FormData();
                                    data.append('code', tag.codeNo);
                                    getTreeNodes.call(
                                        this,
                                        data,
                                        '/ylws/dic/listDicTree',
                                        { childKey: 'children', nameKey: 'codeName', codeKey: 'codeNo', itemKey: 'id' },
                                        true,
                                        {
                                            okEvent: this.okEvent,
                                            cancelEvent: this.cancelEvent
                                        }
                                    );
                                    this.setState({ dicModalFlag: true, cRootNode: tag });
                                } else {
                                    notification.error({ message: '当前用户没有查询字典权限' });
                                }
                            }}
                        >
                            {tag.codeName}
                        </Tag>
                    );
                    return (
                        <span key={tag.id} style={{ display: 'inline-block' }}>
                            {tagElem}
                        </span>
                    );
                })
            });
        });

        setTimeout(() => {
            initRight.call(this, this.props);
        }, 30);
    }

    okEvent = () => {
        axios
            .delete('/ylws/dic/delete', { params: { id: this.state.cNode.id } })
            .then(() => {
                notification.success.call(this, { message: '删除成功' });
                getTreeNodes.call(this, { code: this.state.cRootNode.codeNo }, '/ylws/dic/listDicTree', true, {
                    okEvent: this.okEvent.bind(this),
                    cancelEvent: this.cancelEvent.bind(this)
                });
            })
            .catch(() => {
                notification.error({ message: '删除失败' });
            });
    };
    cancelEvent = () => console.log(1111);

    render() {
        const { dicModalFlag, areaTree, tagChild, addTreeModalFlag, cNode } = this.state;
        return (
            <div>
                <div className="data-tag">
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: 'from',
                            duration: 100,
                            onComplete: e => {
                                e.target.style = '';
                            }
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                    >
                        {tagChild}
                    </TweenOneGroup>
                </div>

                <Tag
                    onClick={() => this.setState({ addTreeModalFlag: true, cNode: {} })}
                    style={{ background: '#fff', borderStyle: 'dashed', marginLeft: 20 }}
                >
                    <Icon type="plus" /> New Tag
                </Tag>
                <Modal
                    maskClosable={false}
                    style={{ maxHeight: '90%' }}
                    title={'字典数据'}
                    visible={dicModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => this.setState({ dicModalFlag: false })}
                    onCancel={() => this.setState({ dicModalFlag: false })}
                >
                    <Tree selectable={false}>{areaTree}</Tree>
                </Modal>
                <Modal
                    maskClosable={false}
                    title="新增字典"
                    visible={addTreeModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        axios
                            .post('/ylws/dic/save', {
                                codeName: this.newName,
                                codeNo: this.newCode,
                                codeTitle: cNode.codeName,
                                codeTitleDesc: cNode.codeNo
                            })
                            .then(() => {
                                this.setState({ addTreeModalFlag: false });
                                notification.success({ message: '新增成功' });
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                            })
                            .catch(() => {
                                this.setState({ addTreeModalFlag: false });
                                this.newCode = '';
                                this.newName = '';
                                notification.error({ message: '新增失败' });
                            });
                    }}
                    onCancel={() => {
                        this.newCode = '';
                        this.newName = '';
                        this.setState({ addTreeModalFlag: false });
                    }}
                >
                    <div>
                        <span className="model-span">名称： </span>
                        <Input className="model-input" onChange={e => (this.newName = e.target.value)} />
                    </div>
                    <div>
                        <span className="model-span">编码： </span>
                        <Input className="model-input" onChange={e => (this.newCode = e.target.value)} />
                    </div>
                </Modal>
            </div>
        );
    }
}
