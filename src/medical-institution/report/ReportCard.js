import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Select, Button, DatePicker, Table, Divider } from 'antd';

import { deptData } from './data';

import './index.css';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

class AgreementCardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depts: [],
            buttons: [],
            newTecModal: false,
            newDepModal: false,
            expertModal: false,
            trainModal: false,
            medModal: false
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
        const { depts, newTecModal, newDepModal, expertModal, trainModal, medModal, buttons } = this.state;
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
                        <strong>合作业务开展情况月报</strong>
                    </h1>
                    <div style={{ paddingLeft: 50 }}>
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
                        <strong>一、引进新技术</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月引进新技术" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'department', key: 'department', title: '专业科室' },
                                    { dataIndex: 'name', key: 'name', title: '技术名称' },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
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
                                                    <a onClick={() => this.setState({ newTecModal: true })}>添加</a>
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
                        <strong>二、新建科室</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月新建科室" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'name', key: 'name', title: '科室名称' },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
                                        render: () => {
                                            return (
                                                <span>
                                                    <a
                                                        onClick={() =>
                                                            confirm({
                                                                title: '确定要删除该科室吗 ?',
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
                                                    <a onClick={() => this.setState({ newDepModal: true })}>添加</a>
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
                        <strong>三、京津专家坐诊</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月专家坐诊" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'name', key: 'name', title: '专家姓名', width: 100 },
                                    { dataIndex: 'type', key: 'type', title: '派驻形式', width: 150 },
                                    { dataIndex: 'time', key: 'time', title: '坐镇时间', width: 250 },
                                    { dataIndex: 'num', key: 'num', title: '诊疗患者人次', width: 250 },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
                                        width: 150,
                                        render: () => {
                                            return (
                                                <span>
                                                    <a
                                                        onClick={() =>
                                                            confirm({
                                                                title: '确定要删除该科室吗 ?',
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
                                                    <a onClick={() => this.setState({ expertModal: true })}>添加</a>
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
                        <strong>四、培训进修</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月培训进修" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'name', key: 'name', title: '培训进修名称', width: 150 },
                                    { dataIndex: 'time', key: 'time', title: '培训进修时间', width: 250 },
                                    { dataIndex: 'num', key: 'num', title: '培训进修人数', width: 150 },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
                                        width: 150,
                                        render: () => {
                                            return (
                                                <span>
                                                    <a
                                                        onClick={() =>
                                                            confirm({
                                                                title: '确定要删除该科室吗 ?',
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
                                                    <a onClick={() => this.setState({ trainModal: true })}>添加</a>
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
                        <strong>五、远程医疗</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月远程医疗" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'purpose', key: 'purpose', title: '远程医疗目的', width: 150 },
                                    { dataIndex: 'invitedName', key: 'invitedName', title: '受邀方名称', width: 150 },
                                    { dataIndex: 'drName', key: 'drName', title: '受邀医师姓名及专业', width: 250 },
                                    { dataIndex: 'optDate', key: 'optDate', title: '远程医疗日期', width: 150 },
                                    {
                                        dataIndex: 'opt',
                                        key: 'opt',
                                        title: '操作',
                                        width: 150,
                                        render: () => {
                                            return (
                                                <span>
                                                    <a
                                                        onClick={() =>
                                                            confirm({
                                                                title: '确定要删除该科室吗 ?',
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
                                                    <a onClick={() => this.setState({ medModal: true })}>添加</a>
                                                </span>
                                            );
                                        }
                                    }
                                ]}
                                dataSource={[{ invitedName: 'xx1' }, { invitedName: 'xx2' }]}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>六、服务群众</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="" className="add-form-item">
                            <Table
                                columns={[
                                    { dataIndex: 'outNum', key: 'outNum', title: '本月总门诊人次', width: 200 },
                                    { dataIndex: 'inNum', key: 'inNum', title: '本月总住院人次', width: 200 },
                                    {
                                        dataIndex: 'operationNum',
                                        key: 'operationNum',
                                        title: '本月总手术例数',
                                        width: 200
                                    },
                                    {
                                        dataIndex: 'preMonthNum',
                                        key: 'preMonthNum',
                                        title: '本月对上转诊人次',
                                        width: 200
                                    }
                                ]}
                                dataSource={[{ outNum: 1 }]}
                            />
                        </Item>
                    </div>

                    <Item>{buttons}</Item>
                </Form>
                <Modal
                    title="添加新技术"
                    visible={newTecModal}
                    onOk={() => this.setState({ newTecModal: false })}
                    onCancel={() => this.setState({ newTecModal: false })}
                >
                    <div>
                        <span className="model-span">专业科室： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 技术名称： </span>
                        <Input className="model-input" />
                    </div>
                </Modal>
                <Modal
                    title="添加新科室"
                    visible={newDepModal}
                    onOk={() => this.setState({ newDepModal: false })}
                    onCancel={() => this.setState({ newDepModal: false })}
                >
                    <div>
                        <span className="model-span"> 科室名称： </span>
                        <Input className="model-input" />
                    </div>
                </Modal>
                <Modal
                    title="添加专家坐诊"
                    visible={expertModal}
                    onOk={() => this.setState({ expertModal: false })}
                    onCancel={() => this.setState({ expertModal: false })}
                >
                    <div>
                        <span className="model-span"> 专家姓名： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 派驻形式： </span>
                        <Select className="model-input">
                            <Option value={0}>长期派驻( 6 个月以上 )</Option>
                            <Option value={1}>不定期选派</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 坐诊时间： </span>
                        <RangePicker style={{ width: 200 }} />
                    </div>
                    <div style={{ margin: '10px 5px' }}>诊疗患者人次</div>
                    <div>
                        <span className="model-span"> 门诊： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 住院： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 手术： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 其他： </span>
                        <Input className="model-input" />
                    </div>
                </Modal>
                <Modal
                    title="培训进修"
                    visible={trainModal}
                    onOk={() => this.setState({ trainModal: false })}
                    onCancel={() => this.setState({ trainModal: false })}
                >
                    <div>
                        <span className="model-span"> 培训进修名称： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 培训进修时间： </span>
                        <RangePicker style={{ width: 200 }} />
                    </div>
                    <div>
                        <span className="model-span"> 诊疗患者人次： </span>
                        <Input className="model-input" />
                    </div>
                </Modal>
                <Modal
                    title="远程医疗"
                    visible={medModal}
                    onOk={() => this.setState({ medModal: false })}
                    onCancel={() => this.setState({ medModal: false })}
                >
                    <div>
                        <span className="model-span"> 远程医疗的目的： </span>
                        <Select className="model-input">
                            <Option value={0}>会诊</Option>
                            <Option value={1}>手术指导</Option>
                            <Option value={2}>病理远程诊断</Option>
                            <Option value={3}>影像远程诊断</Option>
                            <Option value={4}>其他</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 受邀方名称： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 受邀医师姓名及专业： </span>
                        <Input className="model-input" />
                    </div>
                    <div>
                        <span className="model-span"> 远程医疗日期： </span>
                        <DatePicker placeholder="选择日期" style={{ width: 200 }} />
                    </div>
                </Modal>
            </div>
        );
    }
}

const AgreementCard = Form.create({ name: 'AgreementCard' })(AgreementCardPage);

export default AgreementCard;
