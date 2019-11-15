/* eslint-disable */
import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

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
                    <strong>{this.props.pageType === 'add' ? '添加' : '编辑'}医疗机构</strong>
                </h1>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Item label="所属行政部门" className="add-form-item">
                        <Select>{depts}</Select>
                    </Item>
                    <Item label="医疗机构名称" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="社会统一信用代码" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="机构类别" className="add-form-item">
                        <Select style={{ float: 'left', width: '50%' }}>{depts}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{depts}</Select>
                    </Item>
                    <Item label="机构类别" className="add-form-item">
                        <Select>{depts}</Select>
                    </Item>
                    <Item label="经济类型" className="add-form-item">
                        <Select style={{ float: 'left', width: '50%' }}>{depts}</Select>
                        <Select style={{ float: 'left', width: '50%' }}>{depts}</Select>
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
                    <Item label="登录密码" className="add-form-item">
                        <Input />
                    </Item>
                    <Item label="确认密码" className="add-form-item">
                        <Input />
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
