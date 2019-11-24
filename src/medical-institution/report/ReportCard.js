import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Select, Button, DatePicker, Table, Divider, notification } from 'antd';
import Axios from 'axios';
import './index.css';

import { initAllDic, formatDate } from '../../comUtil';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

const dateFormat = 'YYYY-MM-DD';

class AgreementCardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            newTecModal: false,
            newDepModal: false,
            expertModal: false,
            trainModal: false,
            medModal: false,
            telData: [],
            agreements: [],
            trainData: [],
            expertData: [],
            newDepData: [],
            medData: [],
            cTelData: {},
            cTrainData: {},
            cExpertData: {},
            cNewDepData: {},
            cMedData: {},
            pzxs: [],
            ycyldmd: [],
            data: {
                // 上报医疗机构名称
                medicalname: null
            }
        };
    }

    componentDidMount() {
        initAllDic.call(this, null, ['pzxs', 'ycyldmd']);

        let data = new FormData();
        data.append('userId', this.props.curUser.id);
        if (!this.props.recordId) {
            Axios.post('/ylws/morthtable/addMorthtablePre', data)
                .then(res => {
                    if (res.data && res.data.header.code === '1000') {
                        let cData = res.data.body.data[0];
                        this.setState({
                            data: { ...this.state.data, ...cData },
                            agreements:
                                cData.agreeMents &&
                                cData.agreeMents.map(item => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.agreementname}
                                        </Option>
                                    );
                                })
                        });
                    } else {
                        notification.error({ message: res.data.header.msg });
                    }
                })
                .catch(e => console.log(e));
        }
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
        this.setState({ buttons });
    };

    render() {
        const { pageType } = this.props;

        const {
            data,
            newTecModal,
            newDepModal,
            expertModal,
            trainModal,
            medModal,
            buttons,
            agreements,
            telData,
            trainData,
            expertData,
            newDepData,
            medData,
            cTelData,
            cTrainData,
            cExpertData,
            cNewDepData,
            cMedData,
            pzxs,
            ycyldmd
        } = this.state;
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
        const newTelCol = [
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
        ];
        const newDepCol = [
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
        ];
        const expertCol = [
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
        ];
        const trainCol = [
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
        ];
        const medCol = [
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
        ];
        return (
            <div style={{ margin: '40px 20px' }}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <h1 style={{ marginBottom: 20 }}>
                        <strong>合作业务开展情况月报</strong>
                    </h1>
                    <div style={{ paddingLeft: 50 }}>
                        <Item label="上报医疗机构名称" className="add-form-item">
                            {data.medicalname}
                        </Item>
                        <Item label="选择已签署的项目/协议" className="add-form-item">
                            <Select>{agreements}</Select>
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
                            {Boolean(!telData || telData.length === 0) && (
                                <Button
                                    style={{ marginBottom: 20 }}
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ newTecModal: true });
                                    }}
                                >
                                    新增引进技术
                                </Button>
                            )}
                            <Table
                                columns={pageType === 'card' ? newTelCol.slice(0, -1) : newTelCol}
                                dataSource={telData}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>二、新建科室</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月新建科室" className="add-form-item">
                            {Boolean(!newDepData || newDepData.length === 0) && (
                                <Button
                                    style={{ marginBottom: 20 }}
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ newDepModal: true });
                                    }}
                                >
                                    新增科室
                                </Button>
                            )}
                            <Table
                                columns={pageType === 'card' ? newDepCol.slice(0, -1) : newDepCol}
                                dataSource={newDepData}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>三、京津专家坐诊</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月专家坐诊" className="add-form-item">
                            {Boolean(!expertData || expertData.length === 0) && (
                                <Button
                                    style={{ marginBottom: 20 }}
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ expertModal: true });
                                    }}
                                >
                                    新增科室
                                </Button>
                            )}
                            <Table
                                columns={pageType === 'card' ? expertCol.slice(0, -1) : expertCol}
                                dataSource={expertData}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>四、培训进修</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月培训进修" className="add-form-item">
                            {Boolean(!trainData || trainData.length === 0) && (
                                <Button
                                    style={{ marginBottom: 20 }}
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ trainModal: true });
                                    }}
                                >
                                    新增培训进修
                                </Button>
                            )}
                            <Table
                                columns={pageType === 'card' ? trainCol.slice(0, -1) : trainCol}
                                dataSource={trainData}
                            />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>五、远程医疗</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="本月远程医疗" className="add-form-item">
                            {Boolean(!medData || medData.length === 0) && (
                                <Button
                                    style={{ marginBottom: 20 }}
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ medModal: true });
                                    }}
                                >
                                    新增远程医疗
                                </Button>
                            )}
                            <Table columns={pageType === 'card' ? medCol.slice(0, -1) : medCol} dataSource={medData} />
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
                    okText={'确定'}
                    cancelText={'取消'}
                    onOk={() => this.setState({ newTecModal: false })}
                    onCancel={() => this.setState({ newTecModal: false })}
                >
                    <div>
                        <span className="model-span">专业科室： </span>
                        <Input
                            className="model-input"
                            value={cTelData.department}
                            onChange={e => this.setState({ cTelData: { ...cTelData, department: e.target.value } })}
                        />
                    </div>
                    <div>
                        <span className="model-span"> 技术名称： </span>
                        <Input
                            className="model-input"
                            value={cTelData.technique}
                            onChange={e => this.setState({ cTelData: { ...cTelData, technique: e.target.value } })}
                        />
                    </div>
                </Modal>
                <Modal
                    title="添加新科室"
                    okText={'确定'}
                    cancelText={'取消'}
                    visible={newDepModal}
                    onOk={() => this.setState({ newDepModal: false })}
                    onCancel={() => this.setState({ newDepModal: false })}
                >
                    <div>
                        <span className="model-span"> 科室名称： </span>
                        <Input
                            className="model-input"
                            value={cTrainData.departmentnew}
                            onChange={e => this.setState({ cTrainData: { departmentnew: e.target.value } })}
                        />
                    </div>
                </Modal>
                <Modal
                    title="添加专家坐诊"
                    okText={'确定'}
                    cancelText={'取消'}
                    visible={expertModal}
                    onOk={() => this.setState({ expertModal: false })}
                    onCancel={() => this.setState({ expertModal: false })}
                >
                    <div>
                        <span className="model-span"> 专家姓名： </span>
                        <Input
                            className="model-input"
                            value={cExpertData.expertname}
                            onChange={e =>
                                this.setState({ cExpertData: { ...cExpertData, expertname: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 派驻形式： </span>
                        <Select
                            className="model-input"
                            value={cExpertData.accredit}
                            onChange={e => this.setState({ cExpertData: { ...cExpertData, accredit: e } })}
                        >
                            {pzxs}
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 坐诊时间： </span>
                        <RangePicker
                            style={{ width: 200 }}
                            placeholder={['起始时间', '终止时间']}
                            value={
                                Boolean(cExpertData.diagnosistart && cExpertData.diagnosisend)
                                    ? [
                                          moment(formatDate(cExpertData.diagnosistart, 1), dateFormat),
                                          moment(formatDate(cExpertData.diagnosisend, 1), dateFormat)
                                      ]
                                    : []
                            }
                            onChange={(e, str) => {
                                console.log(e, str);
                                this.setState({
                                    cExpertData: { ...cExpertData, diagnosistart: str[0], diagnosisend: str[1] }
                                });
                            }}
                        />
                    </div>

                    <div>
                        <span className="model-span"> 门诊： </span>
                        <Input
                            className="model-input"
                            value={cExpertData.outpatient}
                            onChange={e =>
                                this.setState({ cExpertData: { ...cExpertData, outpatient: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 住院： </span>
                        <Input
                            className="model-input"
                            value={cExpertData.hospitalization}
                            onChange={e =>
                                this.setState({ cExpertData: { ...cExpertData, hospitalization: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 手术： </span>
                        <Input
                            className="model-input"
                            value={cExpertData.operation}
                            onChange={e =>
                                this.setState({ cExpertData: { ...cExpertData, operation: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 其他： </span>
                        <Input
                            className="model-input"
                            value={cExpertData.other}
                            onChange={e => this.setState({ cExpertData: { ...cExpertData, other: e.target.value } })}
                        />
                    </div>
                </Modal>
                <Modal
                    title="培训进修"
                    okText={'确定'}
                    cancelText={'取消'}
                    visible={trainModal}
                    onOk={() => this.setState({ trainModal: false })}
                    onCancel={() => this.setState({ trainModal: false })}
                >
                    <div>
                        <span className="model-span"> 培训进修名称： </span>
                        <Input
                            className="model-input"
                            value={cNewDepData.trainname}
                            onChange={e =>
                                this.setState({ cNewDepData: { ...cNewDepData, trainname: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 培训进修时间： </span>
                        <RangePicker
                            style={{ width: 200 }}
                            placeholder={['起始时间', '终止时间']}
                            defaultValue={
                                Boolean(cNewDepData.trainstart && cNewDepData.trainend) && [
                                    moment(formatDate(cNewDepData.trainstart, 1), dateFormat),
                                    moment(formatDate(cNewDepData.trainend, 1), dateFormat)
                                ]
                            }
                            onChange={(e, str) => {
                                this.setState({
                                    cNewDepData: { ...cNewDepData, trainstart: str[0], trainend: str[1] }
                                });
                            }}
                        />
                    </div>
                    <div>
                        <span className="model-span"> 培训进修人数： </span>
                        <Input
                            className="model-input"
                            value={cNewDepData.traincount}
                            onChange={e =>
                                this.setState({ cNewDepData: { ...cNewDepData, traincount: e.target.value } })
                            }
                        />
                    </div>
                </Modal>
                <Modal
                    title="远程医疗"
                    okText={'确定'}
                    cancelText={'取消'}
                    visible={medModal}
                    onOk={() => this.setState({ medModal: false })}
                    onCancel={() => this.setState({ medModal: false })}
                >
                    <div>
                        <span className="model-span"> 远程医疗的目的： </span>
                        <Select
                            className="model-input"
                            value={cMedData.remotemedical}
                            onChange={e => this.setState({ cMedData: { ...cMedData, remotemedical: e } })}
                        >
                            {ycyldmd}
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 受邀方名称： </span>
                        <Input
                            className="model-input"
                            value={cMedData.beinvitedname}
                            onChange={e => this.setState({ cMedData: { ...cMedData, beinvitedname: e.target.value } })}
                        />
                    </div>
                    <div>
                        <span className="model-span"> 受邀医师姓名及专业： </span>
                        <Input
                            className="model-input"
                            value={cMedData.beinvitecontent}
                            onChange={e =>
                                this.setState({ cMedData: { ...cMedData, beinvitecontent: e.target.value } })
                            }
                        />
                    </div>
                    <div>
                        <span className="model-span"> 远程医疗日期： </span>
                        <DatePicker
                            placeholder="选择日期"
                            style={{ width: 200 }}
                            value={cMedData.remotedate && moment(formatDate(cMedData.remotedate, 1), dateFormat)}
                            onChange={(e, str) => this.setState({ cMedData: { ...cMedData, remotedate: str } })}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

const AgreementCard = Form.create({ name: 'AgreementCard' })(AgreementCardPage);

export default AgreementCard;
