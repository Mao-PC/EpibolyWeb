import React, { Component } from 'react';
import { Form, Icon, Input, Button, notification } from 'antd';
import axios from 'axios';

import { Slider } from '../comUtil';

import './Login.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheck: false
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        if (!this.state.isCheck) {
            notification.info({ message: '滑动验证后才能登录' });
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { username, password } = values;
                let data = new FormData();
                data.append('username', username);
                data.append('password', password);
                axios
                    .post('/ylws/user/login/in', data)
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
                                if (res.data.body.data[0].type === 0) {
                                    this.props.history.push({
                                        pathname: '/hcc',
                                        state: { curUser: res.data.body.data[0] }
                                    });
                                } else {
                                    this.props.history.push({
                                        pathname: '/medical-institution',
                                        state: { curUser: res.data.body.data[0] }
                                    });
                                }
                            } else {
                                notification.error({ message: res.data.header.msg });
                                return;
                            }
                        } else {
                            notification.error({ message: res.data.header.msg });
                            return;
                        }
                    })
                    .catch(e => console.log(e));
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0099db',
                    overflow: 'hidden'
                }}
            >
                <div className="login-title">
                    <div>
                        <p>
                            <span>京津冀医疗卫生协同发展信息动态分析系统</span>
                        </p>
                    </div>
                </div>
                <div className="form-div">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }]
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Slider
                                isCheck={flag => {
                                    console.log(flag);
                                    this.setState({ isCheck: flag });
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            {/* {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                            <Checkbox>记住密码</Checkbox>
                            )} */}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="copyright">
                    <p>
                        <span>
                            Copyright © 2019&nbsp; 版权所有：河北省卫生健康委员会&nbsp;&nbsp;
                            技术支持：河北慧日信息技术有限公司
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}

const Login = Form.create({ name: 'normal_login' })(LoginPage);

export default Login;
