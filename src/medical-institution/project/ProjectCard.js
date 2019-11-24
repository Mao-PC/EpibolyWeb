import React, { Component } from 'react';
import {
    Form,
    Input,
    Modal,
    Select,
    Button,
    DatePicker,
    Table,
    Divider,
    Checkbox,
    notification,
    TreeSelect,
    Row,
    Col
} from 'antd';

import './index.css';
import Axios from 'axios';
import { initAllDic, initOrgSelectTree } from '../../comUtil';

const { RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

class ProjectCardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            institutionModal: false,
            buttons: [],
            tableData: [],
            // 所属行政部门
            areaTreeSelect: [],
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
            // 合作方式
            yyhzfs: [],
            giz: {},
            // 返回给后台的数据
            data: {
                // 上报机构所属行政部门
                orgName: null,
                //上报医疗机构名称
                medicalname: null,
                //上报医疗机构社会统一信用代码
                medicalcode: null,
                // 姓名
                name: null,
                // 电话
                telephone: null,
                // 手机
                phone: null,
                //合作机构所属地区
                agreeareas: null,
                //京津合作机构名称
                agreeOrgName: null,
                //合作方式
                agreetypeNames: null,
                // 合作协议名称
                agreementname: null,
                //合作开始时间
                agreestart: null,
                //合作结束时间
                agreeend: null,
                //合作类型：以，号隔开
                agreetype: null
            }
        };
    }

    componentDidMount() {
        initOrgSelectTree.call(this);
        initAllDic.call(this, null, ['jglb1', 'jglb2', 'jjlx', 'jgdj1', 'jgdj2', 'yyhzfs']);
        let data = new FormData();
        data.append('userId', this.props.curUser.id);
        if (!this.props.recordId) {
            Axios.post('/ylws/agreement/addAgreeMentPre', data)
                .then(res => {
                    if (res.data && res.data.header.code === '1000') {
                        this.setState({ data: { ...this.state.data, ...res.data.body.data[0] } });
                    } else {
                        notification.error({ message: res.data.header.msg });
                    }
                })
                .catch(e => console.log(e));
        }

        this.getButtons();

        setTimeout(() => {
            if (this.props.recordId) {
                let data = new FormData();
                data.append('id', this.props.recordId);
                Axios.post('/ylws/agreement/selectAgreeMentById', data)
                    .then(res => {
                        if (res.data && res.data.header.code === '1000') {
                            this.setState({
                                data: { ...this.state.data, ...res.data.body.data[0] },
                                tableData: res.data.body.data[0].gizs
                            });
                        } else {
                            notification.error({ message: res.data.header.msg });
                        }
                    })
                    .catch(e => console.log(e));
                this.getButtons();
            }
        }, 0);
    }

    saveAgreement = type => {
        let data = this.state.data;
        data.gizs = this.state.tableData;
        data.userId = this.props.curUser.id;
        data.type = type;
        Axios.post('/ylws/agreement/addAgreeMent', data)
            .then(res => {
                if (res.data && res.data.header.code === '1000') {
                    this.setState({ data: { ...this.state.data, ...res.data.body.data[0] } });
                    notification.success({ message: type === 0 ? '保存协议成功' : '保存并提交协议成功' });
                    setTimeout(() => location.reload(), 1000);
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    };

    getButtons = () => {
        const { pageType } = this.props;
        let buttons = [];
        if (pageType === 'add') {
            buttons.push(
                <Button
                    type="primary"
                    style={{ margin: '20px 20px', left: '20%' }}
                    onClick={() => this.saveAgreement(0)}
                >
                    保存草稿
                </Button>
            );
        }

        if (pageType === 'add' || pageType === 'edit') {
            buttons.push(
                <Button
                    type="primary"
                    style={{ margin: '20px 20px', left: pageType === 'add' ? '40%' : '20%' }}
                    onClick={() => this.saveAgreement(1)}
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

    setData = (k, v) => {
        this.setState({ data: { ...this.state.data, [k]: v } });
    };

    render() {
        const { pageType } = this.props;
        const {
            institutionModal,
            buttons,
            tableData,
            data,
            jglb1,
            jglb2,
            jjlx,
            jgdj1,
            jgdj2,
            yyhzfs,
            areaTreeSelect,
            giz
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
        const col = [
            { dataIndex: 'areaname', key: 'areaname', title: '合作机构所属地区', width: 200 },
            { dataIndex: 'orgname', key: 'orgname', title: '京津合作机构名称', width: 200 },
            {
                key: 'orgtype',
                title: '京津合作机构类别',
                width: 200,
                render: (record, index) => {
                    if (record && record.orgtype1) {
                        const str1 = jglb1.find(item => item.props.value === record.orgtype1);
                        const str2 = jglb2.find(item => item.props.value === record.orgtype2);
                        return str1.props.children + ' | ' + str2.props.children;
                    } else {
                        return '';
                    }
                }
            },
            {
                key: 'economictype',
                title: '京津合作机构类别',
                width: 200,
                render: (record, index) => {
                    if (record && record.economictype) {
                        return jjlx.find(item => item.props.value === record.economictype).props.children;
                    } else {
                        return '';
                    }
                }
            },
            {
                key: 'level',
                title: '京津合作机构等级',
                width: 200,
                render: (record, index) => {
                    if (record && record.orglevel1) {
                        const str1 = jgdj1.find(item => item.props.value === record.orglevel1);
                        const str2 = jgdj2.find(item => item.props.value === record.orglevel2);
                        return str1.props.children + ' | ' + str2.props.children;
                    } else {
                        return '';
                    }
                }
            },
            {
                dataIndex: 'opt',
                key: 'opt',
                title: '操作',
                width: 200,
                render: (record, index) => {
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
                                        onOk: () => {
                                            delete giz[index];
                                            this.setState({ giz });
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
                            <a onClick={() => this.setState({ institutionModal: true })}>添加</a>
                        </span>
                    );
                }
            }
        ];
        return (
            <div style={{ margin: '40px 20px' }}>
                <Form {...formItemLayout}>
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
                            {data.orgName}
                        </Item>
                        <Item label="上报医疗机构社会统一信用代码" className="add-form-item">
                            {data.medicalcode}
                        </Item>
                        <Item label="上报医疗机构名称" className="add-form-item">
                            {data.medicalname}
                        </Item>
                        <Item label="填报人姓名" className="add-form-item">
                            <Input value={data.name} onChange={e => this.setData('name', e.target.value)} />
                        </Item>
                        <Item label="填报人办公电话" className="add-form-item">
                            <Input value={data.telephone} onChange={e => this.setData('telephone', e.target.value)} />
                        </Item>
                        <Item label="填报人手机号" className="add-form-item">
                            <Input value={data.phone} onChange={e => this.setData('phone', e.target.value)} />
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>二、京津合作机构信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        {Boolean(!tableData || tableData.length === 0) && (
                            <Button
                                style={{ marginBottom: 20 }}
                                type="primary"
                                onClick={() => {
                                    this.setState({ institutionModal: true });
                                }}
                            >
                                新增合作机构信息
                            </Button>
                        )}
                        <Table
                            pagination={false}
                            columns={pageType === 'card' ? col.slice(0, -1) : col}
                            dataSource={tableData}
                        />
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>三、合作协议信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        <Item label="合作项目/协议名称" className="add-form-item">
                            <Input onChange={e => this.setData('agreementname', e.target.value)} />
                        </Item>
                        <Item label="合作时间" className="add-form-item">
                            <RangePicker
                                placeholder={['起始时间', '终止时间']}
                                onChange={(e, str) => {
                                    this.setState({ data: { ...data, agreestart: str[0], agreeend: str[1] } });
                                }}
                            />
                        </Item>
                        <Item label="合作方式" className="add-form-item">
                            <Checkbox.Group
                                defaultValue={[]}
                                onChange={values => {
                                    this.setData('agreetype', values.join(','));
                                }}
                            >
                                <Row style={{ marginTop: 10 }}>
                                    {yyhzfs.map(item => {
                                        return (
                                            <Col span={12}>
                                                <Checkbox value={item.props.value}>{item.props.children}</Checkbox>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Item>
                    </div>
                    <Item>{buttons}</Item>
                </Form>
                <Modal
                    title="添加京津合作机构信息"
                    visible={institutionModal}
                    onOk={() => {
                        tableData.push(giz);
                        this.setState({ tableData, giz: {} });
                        this.setState({ institutionModal: false });
                    }}
                    onCancel={() => {
                        this.setState({ giz: {} });
                        this.setState({ institutionModal: false });
                    }}
                >
                    <div>
                        <span className="model-span">合作机构所属地区： </span>
                        <TreeSelect
                            allowClear
                            className="model-input"
                            treeData={areaTreeSelect}
                            value={giz.area}
                            onSelect={(value, node) => {
                                this.setState({ giz: { ...giz, area: value, areaname: node.props.title } });
                            }}
                        />
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构名称： </span>
                        <Input
                            className="model-input"
                            value={giz.orgname}
                            onChange={e => {
                                this.setState({ giz: { ...giz, orgname: e.target.value } });
                            }}
                        />
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构类别： </span>
                        <Select
                            className="model-input"
                            value={giz.orgtype1}
                            onSelect={value => this.setState({ giz: { ...giz, orgtype1: value } })}
                        >
                            {jglb1}
                        </Select>
                        <Select
                            className="model-input"
                            style={{ marginLeft: 170 }}
                            value={giz.orgtype2}
                            onSelect={value => this.setState({ giz: { ...giz, orgtype2: value } })}
                        >
                            {jglb2}
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 合作机构经济类型： </span>
                        <Select
                            className="model-input"
                            value={giz.economictype}
                            onSelect={value => this.setState({ giz: { ...giz, economictype: value } })}
                        >
                            {jjlx}
                        </Select>
                    </div>
                    <div>
                        <span className="model-span"> 京津合作机构等级： </span>
                        <Select
                            className="model-input"
                            value={giz.orglevel1}
                            onSelect={value => this.setState({ giz: { ...giz, orglevel1: value } })}
                        >
                            {jgdj1}
                        </Select>
                        <Select
                            className="model-input"
                            style={{ marginLeft: 170 }}
                            value={giz.orglevel2}
                            onSelect={value => this.setState({ giz: { ...giz, orglevel2: value } })}
                        >
                            {jgdj2}
                        </Select>
                    </div>
                </Modal>
            </div>
        );
    }
}

const ProjectCard = Form.create({ name: 'ProjectCard' })(ProjectCardPage);

export default ProjectCard;
