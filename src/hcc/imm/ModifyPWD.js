import React, { Component } from 'react';
import { Form, Input, Button, notification } from 'antd';
import Axios from 'axios';

const { Item } = Form;

class ModifyPage extends Component {
    okEvent = e => {
        e.preventDefault();
        this.props.form.validateFields.call(this, (err, values) => {
            if (!err) {
                let data = new FormData();
                const userData = this.props.curUser;
                // data.append('userId', userData[userData.type === 0 ? 'id' : 'uid']);
                data.append('userId', userData.id);
                data.append('username', userData.username);
                data.append('oldPassword', values.old_pwd);
                data.append('newPassword', values.pwd);
                Axios.post('/ylws/user/modifyPassword', data)
                    .then(res => {
                        if (res.data) {
                            if (res.data.header.code === '1003') {
                                notification.error({ message: '登录过期, 请重新登录' });
                                setTimeout(() => {
                                    this.props.history.push({ pathname: '/' });
                                }, 1000);
                                return;
                            }
                            if (res.data.header.code === '1000') {
                                notification.success({ message: '密码修改成功' });
                                setTimeout(() => {
                                    this.props.history.push({ pathname: '/' });
                                }, 1000);
                            } else {
                                notification.error({ message: res.data.header.msg });
                            }
                        } else {
                            notification.error({ message: res.data.header.msg });
                        }
                    })
                    .catch(e => console.log(e));
            }
        });
    };

    render() {
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

        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <Form {...formItemLayout} onSubmit={this.okEvent} style={{ width: '35%', marginTop: 30 }}>
                <Item label="原密码">
                    {getFieldDecorator('old_pwd', { rules: [{ required: true, message: '请输入原密码' }] })(
                        <Input.Password />
                    )}
                </Item>
                <Item label="新密码">
                    {getFieldDecorator('pwd', { rules: [{ required: true, message: '请输入原密码' }] })(
                        <Input.Password />
                    )}
                </Item>
                <Item label="确认密码">
                    {getFieldDecorator('pwd2', {
                        rules: [
                            { required: true, message: '请输入原密码' },
                            (rule, value, callback, source, options) => {
                                const errors = [];
                                if (value !== getFieldValue('pwd')) {
                                    errors.push('两次输入密码不一致!');
                                }
                                callback(errors);
                            }
                        ]
                    })(<Input.Password />)}
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit" style={{ margin: '20px 20px', left: '20%' }}>
                        保存
                    </Button>
                </Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'ModifyPage' })(ModifyPage);
