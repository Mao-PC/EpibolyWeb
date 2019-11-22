import React, { Component } from 'react';
import { Form, Input, Select, Button, TreeSelect, notification } from 'antd';
import Axios from 'axios'

const { Option } = Select;
const { Item } = Form;

class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areaTree: [],
            roleData: []
        };
    }

    componentDidMount() {
        // 所属行政部门
        Axios.post('/ylws/org/selectOrgListTree').then(res => {
            if (res.data && res.data.header.code === '1000') {
                this.setState({ areaTree: this.getAreaSelect(res.data.body.data) })
            } else {
                notification.error({ message: res.data.header.msg });
            }
        }).catch(e => console.log(e));

        // 所属角色
        Axios.post('/ylws/role/selectRoleAll')
            .then(res => {
                if (res.data && res.data.header.code === '1000') {
                    let roleData = res.data.body.data.map(item => {
                        return <Option key={item.id} value={item.id}>{item.rolename}</Option>
                    })
                    this.setState({ roleData: roleData });
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    }


    /**
     * 拼接 `所属行政部门` 数据
     * @param {*} data 
     */
    getAreaSelect(data) {
        if (data && data.length > 0) {
            return data.map(item => {
                return {
                    title: item.name,
                    value: item.id,
                    key: item.id,
                    children: this.getAreaSelect(item.children)
                }
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields.call(this, (err, values) => {
            if (!err) {
                if (this.props.pageType === 'add') {

                    // 0: 卫健委 1:医疗机构
                    values.type = 0
                    Axios.post('/ylws/user/addUser', values).then(res => {
                        if (res.data && res.data.header.code === '1000') {
                            notification.success({ message: '新增用户成功' });
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            notification.error({ message: res.data.header.msg });
                        }
                    })
                } else {
                    values.id = this.props.userData.id

                    Axios.post('/ylws/user/modifyUser', values).then(res => {
                        if (res.data && res.data.header.code === '1000') {
                            notification.success({ message: '修改用户成功' });
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            notification.error({ message: res.data.header.msg });
                        }
                    })
                }
            }
        })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { areaTree, roleData } = this.state;
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
                                { required: true, message: '请输入登录名' },
                                {
                                    pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5]+$'),
                                    message: '用户名必须为数字、字母、汉字'
                                }
                            ]
                        })(<Input />)}
                    </Item>
                    <Item label="所属行政部门" className="add-form-item">
                        {getFieldDecorator('orgId', { rules: [{ required: true, message: '请选择所属行政部门' }] })(<TreeSelect treeDefaultExpandAll allowClear treeData={areaTree}></TreeSelect>)}
                    </Item>
                    <Item label="姓名" className="add-form-item">
                        {getFieldDecorator('name')(<Input />)}
                    </Item>
                    <Item label="联系电话" className="add-form-item">
                        {getFieldDecorator('phone')(<Input />)}
                    </Item>
                    <Item label="所属角色" className="add-form-item">
                        {getFieldDecorator('rollId', { rules: [{ required: true, message: '请选择所属角色' }] })(<Select>{roleData}</Select>)}
                    </Item>
                    {Boolean(this.props.pageType === 'add') && <div> <Item label="密码" className="add-form-item" >
                        {getFieldDecorator('password', {
                            rules: [
                                { min: 6, message: '密码长度必须在6位以上' },
                                { required: true, message: '请输入密码' },
                                {
                                    pattern: new RegExp(
                                        '^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$'
                                    ),
                                    message: '大小写字母、数字，至少两种任意组合'
                                }
                            ]
                        })(<Input.Password />)}
                    </Item>

                        <Item label="确认密码" className="add-form-item" >
                            {getFieldDecorator('password2', {
                                rules: [
                                    (rule, value, callback, source, options) => {
                                        const errors = [];
                                        if (value !== getFieldValue('password')) {
                                            errors.push('两次输入密码不一致!');
                                        }
                                        callback(errors);
                                    }
                                ]
                            })(<Input.Password />)}
                        </Item></div>}

                    <Item label="状态" className="add-form-item">
                        {getFieldDecorator('status', { rules: [{ required: true, message: '请选择状态' }] })(<Select>
                            <Option key={0} value={0}>开通</Option>
                            <Option key={1} value={1}>冻结</Option>
                        </Select>)}
                    </Item>
                    {/* getFieldDecorator('userId')(<Input style={{display: false}} value={this.props.curUser.id} />) */}

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
            </div >
        );
    }
}

export default Form.create({
    name: 'Save', mapPropsToFields(props) {
        console.log(props.userData)
        const { username, orgId, name, phone, rollId, status } = props.userData
        return {
            username: Form.createFormField({ value: username }),
            orgId: Form.createFormField({ value: orgId }),
            name: Form.createFormField({ value: name }),
            phone: Form.createFormField({ value: phone }),
            rollId: Form.createFormField({ value: rollId }),
            // password: Form.createFormField({ value: password }),
            // password2: Form.createFormField({ value: password }),
            status: Form.createFormField({ value: status }),
        }
    }
})(Save);
