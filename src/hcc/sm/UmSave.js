import React, { Component } from 'react';
import { Form, Input, Select, Button } from 'antd';

import { deptData } from './data';

const { Option } = Select;

const { Item } = Form;

class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depts: []
        };
    }

    componentDidMount() {
        this.setState({
            depts: this.getDepts()
        });
    }

    getDepts = () => {
        return deptData.map(dept => {
            return <Option value={dept.id}>{dept.name}</Option>;
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { depts } = this.state;
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
                    <strong>{this.props.pageType === 'add' ? '添加' : '编辑'}用户</strong>
                </h1>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Item label="登录名" className="add-form-item">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5]+$'),
                                    message: '用户名必须为数字、字母、汉字'
                                }
                            ]
                        })(<Input />)}
                    </Item>
                    <Item label="所属行政部门" className="add-form-item">
                        <Select>{depts}</Select>
                    </Item>
                    <Item label="姓名" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="联系电话" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="所属角色" className="add-form-item">
                        <Select>{depts}</Select>
                    </Item>
                    <Item label="联系邮箱" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="密码" className="add-form-item">
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
                                (rule, value, callback, source, options) => {
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
                    <Item label="状态" className="add-form-item">
                        <Select defaultValue={1}>
                            <Option value={0}>冻结</Option>
                            <Option value={1}> 开通</Option>
                        </Select>
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
