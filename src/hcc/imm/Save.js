import React, { Component } from 'react';
import { Form, Input, Select, Button, TreeSelect, notification } from 'antd';
import Axios from 'axios';
import { initAllDic, initOrgSelectTree } from '../../comUtil';

const { Item } = Form;

class Save extends Component {
    constructor(props) {
        super(props);
        this.pwd = null;
        this.jglb1Data = [];
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
            jgdj2: [],
            // 所属行政部门
            areaTreeSelect: [],
            buttonsStatus: false
        };
    }

    componentDidMount() {
        initOrgSelectTree.call(this);
        initAllDic.call(this, null, ['jglb1', 'jjlx', 'jgdj1', 'jgdj2'], data => {
            this.jglb1Data = data.jglb1;
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({ buttonsStatus: true });
        this.props.form.validateFields.call(this, (err, values) => {
            if (!err) {
                if (this.props.pageType === 'add') {
                    // 0: 卫健委 1:医疗机构
                    values.type = 1;
                    setTimeout(() => {
                        Axios.post('/ylws/medical/addMedicalOrg', values).then(res => {
                            if (res.data) {
                                if (res.data.header.code === '1003') {
                                    notification.error({ message: '登录过期, 请重新登录' });
                                    setTimeout(() => {
                                        this.props.history.push({ pathname: '/' });
                                    }, 1000);
                                    return;
                                }
                                if (res.data.header.code === '1000') {
                                    notification.success({ message: '新增医疗机构用户成功' });
                                    setTimeout(() => location.reload(), 1000);
                                } else {
                                    notification.error({ message: res.data.header.msg });
                                    setTimeout(() => this.setState({ buttonsStatus: false }), 0);
                                }
                            } else {
                                notification.error({ message: res.data.header.msg });
                                setTimeout(() => this.setState({ buttonsStatus: false }), 0);
                            }
                        });
                    }, 0);
                } else {
                    values = { ...this.props.userData, ...values };
                    values.userId = this.props.curUser.id;
                    setTimeout(() => {
                        Axios.post('/ylws/medical/updateMedicalOrg', values).then(res => {
                            if (res.data) {
                                if (res.data.header.code === '1003') {
                                    notification.error({ message: '登录过期, 请重新登录' });
                                    setTimeout(() => {
                                        this.props.history.push({ pathname: '/' });
                                    }, 1000);
                                    return;
                                }
                                if (res.data.header.code === '1000') {
                                    notification.success({ message: '修改医疗机构用户成功' });
                                    setTimeout(() => location.reload(), 1000);
                                } else {
                                    setTimeout(() => this.setState({ buttonsStatus: false }), 0);
                                    notification.error({ message: res.data.header.msg });
                                }
                            } else {
                                setTimeout(() => this.setState({ buttonsStatus: false }), 0);
                                notification.error({ message: res.data.header.msg });
                            }
                        });
                    }, 0);
                }
            } else {
                setTimeout(() => this.setState({ buttonsStatus: false }), 0);
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { jglb1, jglb2, jjlx, jgdj1, jgdj2, areaTreeSelect, buttonsStatus } = this.state;
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
                        {getFieldDecorator('orgId', { rules: [{ required: true, message: '请选择所属行政部门' }] })(
                            <TreeSelect allowClear treeData={areaTreeSelect} />
                        )}
                    </Item>
                    <Item label="医疗机构名称" className="add-form-item">
                        {getFieldDecorator('medicalname', {
                            rules: [{ required: true, message: '请输入医疗机构名称' }]
                        })(<Input />)}
                    </Item>
                    <Item label="社会统一信用代码" className="add-form-item">
                        {getFieldDecorator('code', { rules: [{ required: true, message: '请输入社会统一信用代码' }] })(
                            <Input />
                        )}
                    </Item>
                    <Item label="机构类别" className="add-form-item">
                        {getFieldDecorator('orgcategory1', { rules: [{ required: true, message: '请选择机构类别' }] })(
                            <Select
                                onSelect={e => {
                                    let cjglb = this.jglb1Data.children.find(item => item.codeNo === e);
                                    console.log(this.jglb1Data);
                                    this.setState({
                                        jglb2: cjglb.children.map(item => (
                                            <Option value={item.codeNo}>{item.codeName}</Option>
                                        ))
                                    });
                                }}
                            >
                                {jglb1}
                            </Select>
                        )}
                    </Item>
                    <Item label=" " colon={false} className="add-form-item">
                        {getFieldDecorator('orgcategory2', { rules: [{ required: true, message: '请选择机构类别' }] })(
                            <Select>{jglb2}</Select>
                        )}
                    </Item>
                    <Item label="经济类型" className="add-form-item">
                        {getFieldDecorator('economictype', { rules: [{ required: true, message: '请选择经济类型' }] })(
                            <Select>{jjlx}</Select>
                        )}
                    </Item>
                    <Item label="机构等级" className="add-form-item">
                        {getFieldDecorator('orglevel1', { rules: [{ required: true, message: '请选择机构等级' }] })(
                            <Select>{jgdj1}</Select>
                        )}
                    </Item>
                    <Item label=" " colon={false} className="add-form-item">
                        {getFieldDecorator('orglevel2', { rules: [{ required: true, message: '请选择机构等级' }] })(
                            <Select>{jgdj2}</Select>
                        )}
                    </Item>
                    <Item label="用户名" className="add-form-item">
                        {getFieldDecorator('username', {
                            rules: [
                                { required: true, message: '请输入用户名' },
                                {
                                    pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5]+$'),
                                    message: '用户名必须为数字、字母、汉字'
                                }
                            ]
                        })(<Input disabled={this.props.pageType !== 'add'} />)}
                    </Item>
                    <Item label="联系人" className="add-form-item">
                        {getFieldDecorator('name')(<Input />)}
                    </Item>
                    <Item label="联系人职务" className="add-form-item">
                        {getFieldDecorator('post')(<Input />)}
                    </Item>
                    <Item label="联系电话" className="add-form-item">
                        {getFieldDecorator('phone')(<Input />)}
                    </Item>
                    <Item label="联系邮箱" className="add-form-item">
                        {getFieldDecorator('email')(<Input />)}
                    </Item>
                    {Boolean(this.props.pageType === 'add') && (
                        <div>
                            <Item label="登录密码" className="add-form-item">
                                {getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '请输入密码' },
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
                                        { required: true, message: '请输入密码' },
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
                        </div>
                    )}
                    <Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ margin: '20px 20px', left: '20%' }}
                            disabled={buttonsStatus}
                        >
                            {this.props.pageType === 'add' ? '添加' : '保存'}
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '20px 20px', left: '30%' }}
                            disabled={buttonsStatus}
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
export default Form.create({
    name: 'Save',
    mapPropsToFields(props) {
        console.log(props.userData);
        const {
            username,
            orgId,
            medicalname,
            code,
            orgcategory1,
            orgcategory2,
            orglevel1,
            orglevel2,
            economictype,
            post,
            email,
            name,
            phone
        } = props.userData;
        return {
            username: Form.createFormField({ value: username }),
            orgId: Form.createFormField({ value: orgId }),
            name: Form.createFormField({ value: name }),
            phone: Form.createFormField({ value: phone }),
            medicalname: Form.createFormField({ value: medicalname }),
            code: Form.createFormField({ value: code }),
            orgcategory1: Form.createFormField({ value: orgcategory1 }),
            orgcategory2: Form.createFormField({ value: orgcategory2 }),
            orglevel1: Form.createFormField({ value: orglevel1 }),
            orglevel2: Form.createFormField({ value: orglevel2 }),
            economictype: Form.createFormField({ value: economictype }),
            // phone: Form.createFormField({ value: phone }),
            post: Form.createFormField({ value: post }),
            email: Form.createFormField({ value: email })
        };
    }
})(Save);
