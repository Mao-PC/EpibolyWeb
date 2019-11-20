import React, { Component } from 'react';
import { Form, Input, Select, Modal } from 'antd';
import { deptData } from './data';

import { initAllDic } from '../../comUtil'

const { Option } = Select;

const { Item } = Form;

class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // 机构类别1
            jglb1: [],
            // 机构类别2
            jglb2: [],
            // 经济类型
            jjlx: [],
            // 机构等级1
            jgdj1: [],
            // 机构等级2
            jgdj2: []
        };
    }

    componentDidMount() {
        initAllDic.call(this, null, ['jglb1', 'jglb2', 'jjlx', 'jgdj1', 'jgdj2'])
    }

    getDepts = () => {
        return deptData.map(dept => {
            return <Option value={dept.id}>{dept.name}</Option>;
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false
        });
    };
    render() {
        const { visible, jglb1, jglb2, jjlx, jgdj1, jgdj2 } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        return (
            <div style={{ margin: '40px 20px' }}>
                <h1>
                    <strong>我的账户信息</strong>
                </h1>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Item label="所属行政部门" className="add-form-item">
                        <Select>{}</Select>
                    </Item>
                    <Item label="医疗机构名称" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="社会统一信用代码" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="机构类别" className="add-form-item">
                        <Select style={{ float: 'left', width: '50%' }}>{jglb1}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{jglb2}</Select>
                    </Item>
                    <Item label="经济类型" className="add-form-item">
                        <Select>{jjlx}</Select>
                    </Item>
                    <Item label="机构等级" className="add-form-item">
                        <Select style={{ float: 'left', width: '50%' }}>{jgdj1}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{jgdj2}</Select>
                    </Item>
                    <Item label="用户名" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="联系人" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="联系人职务" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="联系电话" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="联系邮箱" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="" className="add-form-item">
                        <a onClick={() => this.setState({ visible: true })}>修改密码 ？</a>
                    </Item>
                </Form>
                <Modal
                    title="重置密码"
                    visible={visible}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <span className="model-span">原密码： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 新密码： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 确认密码： </span>
                        <Input className="model-input" />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'Save' })(Save);
