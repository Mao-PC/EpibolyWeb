import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Select, Button, DatePicker, Table, Divider, Checkbox } from 'antd';

import { deptData } from './data';

import './index.css';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

class ProjectCardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depts: [],
            institutionModal: false,
            buttons: []
        };
    }

    componentDidMount() {
        this.setState({
            depts: this.getDepts(),
            buttons: this.getButtons()
        });
    }

    getButtons = () => {
        const { pageType } = this.props;
        let buttons = [];
        if (pageType === 'add') {
            buttons.push(
                <Button type="primary" htmlType="submit" style={{ margin: '20px 20px', left: '20%' }}>
                    保存草稿
                </Button>
            );
        }

        if (pageType === 'add' || pageType === 'edit') {
            buttons.push(
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ margin: '20px 20px', left: pageType === 'add' ? '40%' : '20%' }}
                >
                    保存并提交审核
                </Button>
            );
        }

        buttons.push(
            <Button
                type="primary"
                style={{ margin: '20px 20px', left: pageType === 'add' ? '60%' : '40%' }}
                onClick={() => this.props.backList()}
            >
                返回
            </Button>
        );
        return buttons;
    };

    getDepts = () => {
        return deptData.map(dept => {
            return (
                <Option key={dept.id} value={dept.id}>
                    {dept.name}
                </Option>
            );
        });
    };

    render() {
        const { pageType } = this.props;
        const { depts, institutionModal, buttons } = this.state;
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
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <h1 style={{ marginBottom: 20 }}>
                        <strong>
                            {pageType === 'add'
                                ? '合作项目/协议信息详情'
                                : pageType === 'edit'
                                ? '修改合作项目/协议信息'
                                : '京津冀医疗卫生协同发展工作动态'}
                        </strong>
                    </h1>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>一、填报人信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="上报医疗机构名称" className="add-form-item">
                            xxxxxx
                        </Item>
                        <Item label="选择已签署的项目/协议" className="add-form-item">
                            <Select>{depts}</Select>
                        </Item>
                        <Item label="上报月份" className="add-form-item">
                            <MonthPicker
                                defaultValue={moment()
                                    .month(moment().month() - 1)
                                    .startOf('month')}
                            />
                        </Item>
                        <Item label="填报人姓名" className="add-form-item">
                            <Input />
                        </Item>
                        <Item label="填报人办公电话" className="add-form-item">
                            <Input />
                        </Item>
                        <Item label="填报人手机号" className="add-form-item">
                            <Input />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>二、京津合作机构信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="" className="add-form-item">
                            <Table
                                pagination={false}
                                columns={[
                                    { dataIndex: 'region', key: 'region', title: '合作机构所属地区', width: 200 },
                                    { dataIndex: 'name', key: 'name', title: '京津合作机构名称', width: 200 },
                                    { dataIndex: 'type', key: 'type', title: '京津合作机构类别', width: 200 },
                                    { dataIndex: 'elvel', key: 'level', title: '京津合作机构等级', width: 200 },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
                                        width: 120,
                                        render: () => {
                                            return (
                                                <span>
                                                    <a
                                                        onClick={() =>
                                                            confirm({
                                                                title: '确定要删除该行数据吗 ?',
                                                                // content: 'Some descriptions',
                                                                okText: '确认',
                                                                okType: 'danger',
                                                                cancelText: '取消',
                                                                onOk() {
                                                                    console.log('OK');
                                                                },
                                                                onCancel() {
                                                                    console.log('Cancel');
                                                                }
                                                            })
                                                        }
                                                    >
                                                        删除
                                                    </a>
                                                    <Divider type="vertical" />
                                                    <a onClick={() => this.setState({ institutionModal: true })}>
                                                        添加
                                                    </a>
                                                </span>
                                            );
                                        }
                                    }
                                ]}
                                dataSource={[{ name: 'xx1' }, { name: 'xx2' }]}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>三、合作协议信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="合作项目/协议名称" className="add-form-item">
                            <Input />
                        </Item>
                        <Item label="合作时间" className="add-form-item">
                            <RangePicker placeholder={['起始时间', '终止时间']} />
                        </Item>
                        <Item label="合作方式" className="add-form-item">
                            <Checkbox>远程诊疗</Checkbox>
                        </Item>
                    </div>
                    <Item>{buttons}</Item>
                </Form>
                <Modal
                    title="添加京津合作机构信息"
                    visible={institutionModal}
                    onOk={() => this.setState({ institutionModal: false })}
                    onCancel={() => this.setState({ institutionModal: false })}
                >
                    <div>
                        <span className="model-span">合作机构所属地区： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构名称： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构名称： </span>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 合作机构经济类型： </span>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构等级： </span>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                    </div>
                </Modal>
            </div>
        );
    }
}

const ProjectCard = Form.create({ name: 'ProjectCard' })(ProjectCardPage);

export default ProjectCard;
