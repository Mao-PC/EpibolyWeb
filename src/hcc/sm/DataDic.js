import React, { Component } from "react";
import { Tag, Input, Icon, Modal, Tree, notification } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

import { getTreeNodes } from '../../comUtil'
import axios from "axios";

const { confirm } = Modal;

export default class EditableTagGroup extends Component {

    newName = ''
    newCode = ''

    state = {
        inputVisible: false,
        dicModalFlag: false,
        addOrgModalFlag: false,
        addDicModalFlag: false,
        dicTitle: '',
        areaTree: [],
        tagChild: []
    };

    componentDidMount() {
        // 请求所有的字典
        axios.get('/dic/listDics').then(req => {
            console.log(req.data)
            this.setState({
                tagChild: req.data.map(tag => {
                    const tagElem = <Tag
                        closable
                        onClose={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.handleClose(tag.codeName);
                        }}
                        onClick={() => {
                            getTreeNodes.call(this, null, true)
                            this.setState({ dicModalFlag: true, })
                        }}
                    >
                        {tag.codeName}
                    </Tag>
                    return (
                        <span key={tag.id} style={{ display: 'inline-block' }}>
                            {tagElem}
                        </span>
                    );
                })
            })
        })
    }

    handleClose = removedTag => {
        confirm({
            title: '确定要删除该数据吗 ?',
            // content: 'Some descriptions',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                const tags = this.state.tags.filter(tag => tag !== removedTag);
                console.log(tags);
                this.setState({ tags });
            },
            onCancel() {
                console.log('Cancel');
            }
        })

    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };


    saveInputRef = input => (this.input = input);

    render() {
        const { dicModalFlag, areaTree, addOrgModalFlag, tagChild, addDicModalFlag } = this.state;
        return (
            <div>
                <div className="data-tag" >
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: 'from',
                            duration: 100,
                            onComplete: e => {
                                e.target.style = '';
                            },
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                    >
                        {tagChild}
                    </TweenOneGroup>
                </div>

                <Tag onClick={() => this.setState({ addDicModalFlag: true })} style={{ background: '#fff', borderStyle: 'dashed', marginLeft: 20 }}>
                    <Icon type="plus" /> New Tag
          </Tag>
                <Modal
                    style={{ maxHeight: "90%" }}
                    title={'fwdfd'}
                    visible={dicModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ dicModalFlag: false })}
                >
                    <Tree selectable={false}>{areaTree}</Tree>
                </Modal>
                <Modal
                    title="请输入新增的机构名"
                    visible={addOrgModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={e => {
                        console.log(e)
                        this.setState({ addOrgModalFlag: false })
                    }}
                    onCancel={() => this.setState({ addOrgModalFlag: false })}
                >
                    <Input />
                </Modal>
                <Modal
                    title="新增字典"
                    visible={addDicModalFlag}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        axios.post('/dic/save', { codeName: this.newName, codeNo: this.newCode })
                            .then(() => {
                                this.setState({ addDicModalFlag: false })
                                notification.success({ message: '新增成功' });
                                setTimeout(() => {
                                    location.reload()
                                }, 2000)
                            }).catch(() => {
                                this.setState({ addDicModalFlag: false })
                                this.newCode = ''
                                this.newName = ''
                                notification.error({ message: '新增失败' })
                            })
                    }}
                    onCancel={() => {
                        this.newCode = ''
                        this.newName = ''
                        this.setState({ addDicModalFlag: false })
                    }}
                >
                    <div>
                        <span className="model-span">名称： </span>
                        <Input className="model-input" onChange={(e) => this.newName = e.target.value} />
                    </div>
                    <div>
                        <span className="model-span">编码： </span>
                        <Input className="model-input" onChange={(e) => this.newCode = e.target.value} />
                    </div>
                </Modal>
            </div>
        );
    }
}