import React, { Component } from 'react';
import { Form, Input, Select, Button } from 'antd';

import { initAllDic } from '../../comUtil'

const { Item } = Form;

class Save extends Component {
    constructor(props) {
        super(props);
        this.pwd = null;
        this.state = {
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

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { jglb1, jglb2, jjlx, jgdj1, jgdj2 } = this.state;
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
                    <strong>{this.props.pageType === 'add' ? '添加' : '编辑'}医疗机构</strong>
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
                        <Select style={{ float: 'left', width: '50%' }} >{jglb1}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{jglb2}</Select>
                    </Item>
                    <Item label="经济类型" className="add-form-item">
                        <Select >{jjlx}</Select>
                    </Item>
                    <Item label="机构等级" className="add-form-item">
                        <Select style={{ float: 'left', width: '50%' }}>{jgdj1}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{jgdj2}</Select>
                    </Item>
                    <Item label="用户名" className="add-form-item">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5]+$'),
                                    message: '用户名必须为数字、字母、汉字'
                                }
                            ]
                        })(<Input disabled={this.props.pageType !== 'add'} />)}
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
                    <Item label="登录密码" className="add-form-item">
                        {getFieldDecorator('password', {
                            rules: [
                                { min: 6, message: '密码长度必须在6位以上' },
                                {
                                    pattern: new RegExp(
                                        '^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$'
                                    ),
                                    message: '大小写字母、数字，至少两种任意组合'
                                }
                            ]
                        })(<Input.Password />)}
                    </Item>
                    <Item label="确认密码" className="add-form-item">
                        {getFieldDecorator('password2', {
                            rules: [
                                (rule, value, callback) => {
                                    const errors = [];
                                    console.log(getFieldValue('password'));
                                    if (value !== getFieldValue('password')) {
                                        errors.push('两次输入密码不一致!');
                                    }
                                    callback(errors);
                                }
                            ]
                        })(<Input.Password />)}
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit" style={{ margin: '20px 20px', left: '20%' }}>
                            {this.props.pageType === 'add' ? '添加' : '保存'}
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '20px 20px', left: '30%' }}
                            onClick={() => this.props.backList()}
                        >
                            返回
                        </Button>
                    </Item>
                </Form>
            </div>
        );
    }
}

export default Form.create({ name: 'Save' })(Save);
