import React, { Component } from 'react';
import { Form, Input, Modal, Select, Button, DatePicker, Table, Divider, Checkbox, notification, Row, Col } from 'antd';
import moment from 'moment';
import './index.css';
import Axios from 'axios';
import { initAllDic, formatDate } from '../../comUtil';
import { isNull } from 'util';

const { RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD';
class ProjectCardPage extends Component {
    constructor(props) {
        super(props);
        this.type = null;
        this.commit = false;
        this.modealTitles = {
            area: '合作机构所属地区',
            orgname: '京津合作机构名称',
            orgtype1: '京津合作机构类别',
            orgtype2: '京津合作机构类别',
            economictype: '合作机构经济类型',
            orglevel1: '京津合作机构等级',
            orglevel2: '京津合作机构等级'
        };

        this.jglb1Data = [];
        this.state = {
            buttonsStatus: false,
            modelerr: null,
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
            hzjgssdq: [],
            giz: {},
            agreetypeError: false,
            agreestartError: false,
            telError: false,
            phoneError: false,
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
                agreestart: formatDate(moment(new Date(), dateFormat).valueOf(), 1),
                //合作结束时间
                agreeend: formatDate(moment(new Date(), dateFormat).valueOf(), 1),
                //合作类型：以，号隔开
                agreetype: null
            }
        };
    }

    componentDidMount() {
        console.log(formatDate(moment(new Date(), dateFormat).valueOf(), 1));

        this.setState({
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
            hzjgssdq: [],
            giz: {},
            agreetypeError: false,
            phoneError: false,
            telError: false,
            // 返回给后台的数据
            data: {
                //合作开始时间
                agreestart: formatDate(moment(new Date(), dateFormat).valueOf(), 1),
                //合作结束时间
                agreeend: formatDate(moment(new Date(), dateFormat).valueOf(), 1)
            }
        });
        setTimeout(() => {
            initAllDic.call(this, null, ['jglb1', 'jglb2', 'jjlx', 'jgdj1', 'jgdj2', 'yyhzfs', 'hzjgssdq'], data => {
                this.jglb1Data = data.jglb1;
            });
            let data = new FormData();
            data.append('userId', this.props.curUser.id);

            // if (!this.props.recordId) {
            if (this.props.pageType === 'add') {
                Axios.post('/ylws/agreement/addAgreeMentPre', data)
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
                                const resData = res.data.body.data[0];
                                this.setState({
                                    data: {
                                        ...this.state.data,
                                        ...resData, //合作开始时间
                                        agreestart: formatDate(moment(new Date(), dateFormat).valueOf(), 1),
                                        //合作结束时间
                                        agreeend: formatDate(moment(new Date(), dateFormat).valueOf(), 1)
                                    }
                                });
                            } else {
                                notification.error({ message: res.data.header.msg });
                            }
                        } else {
                            notification.error({ message: res.data.header.msg });
                        }
                    })
                    .catch(e => console.log(e));
            }

            // if (this.props.recordId) {
            if (this.props.pageType !== 'add') {
                let data = new FormData();
                data.append('id', this.props.recordId);
                setTimeout(() => {
                    Axios.post('/ylws/agreement/selectAgreeMentById', data)
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
                                    let resData = res.data.body.data[0];
                                    this.setState({
                                        data: { ...this.state.data, ...resData },
                                        tableData: resData.gizs
                                    });
                                    this.props.form.setFieldsValue({ name: resData.name });
                                    this.props.form.setFieldsValue({ agreementname: resData.agreementname });
                                } else {
                                    this.setState({ buttonsStatus: true });

                                    notification.error({ message: res.data.header.msg });
                                }
                            } else {
                                notification.error({ message: res.data.header.msg });
                            }
                        })
                        .catch(e => console.log(e));
                }, 0);
            }
        }, 0);
    }

    saveAgreement = e => {
        e.preventDefault();
        if (!this.state.data.agreestart) {
            this.setState({ agreestartError: true });
            setTimeout(() => {
                this.setState({ buttonsStatus: false });
            }, 0);
            return;
        }
        if (!this.state.data.agreetype) {
            this.setState({ agreetypeError: true });
            setTimeout(() => {
                this.setState({ buttonsStatus: false });
            }, 0);
            return;
        }

        if (this.state.telError || this.state.phoneError) {
            setTimeout(() => {
                this.setState({ buttonsStatus: false });
            }, 0);
            return;
        }

        this.props.form.validateFields.call(this, (err, values) => {
            if (!err) {
                setTimeout(() => {
                    let data = this.state.data;
                    data.gizs = this.state.tableData;
                    data.userId = this.props.curUser.id;
                    data.type = this.type;
                    Axios.post(
                        this.props.pageType === 'add'
                            ? '/ylws/agreement/addAgreeMent'
                            : '/ylws/agreement/modifyAgreeMent',
                        data
                    )
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
                                    this.setState({ data: { ...this.state.data, ...res.data.body.data[0] } });
                                    notification.success({
                                        message: this.type === 0 ? '保存协议成功' : '保存并提交协议成功'
                                    });
                                    setTimeout(() => location.reload(), 1000);
                                } else {
                                    notification.error({ message: res.data.header.msg });
                                    setTimeout(() => {
                                        this.setState({ buttonsStatus: false });
                                    }, 20);
                                }
                            } else {
                                notification.error({ message: res.data.header.msg });
                                setTimeout(() => {
                                    this.setState({ buttonsStatus: false });
                                }, 20);
                            }
                        })
                        .catch(e => console.log(e));
                }, 0);
            } else {
                setTimeout(() => {
                    this.setState({ buttonsStatus: false });
                }, 20);
            }
        });
    };

    setData = (k, v) => {
        this.setState({ data: { ...this.state.data, [k]: v } });
    };

    render() {
        const { pageType } = this.props;
        const { getFieldDecorator } = this.props.form;
        let {
            institutionModal,
            tableData,
            data,
            jglb1,
            jglb2,
            jjlx,
            jgdj1,
            jgdj2,
            yyhzfs,
            hzjgssdq,
            giz,
            modelerr,
            agreetypeError,
            buttonsStatus,
            agreestartError,
            phoneError,
            telError
        } = this.state;
        let buttons = [];
        if (pageType === 'add' || pageType === 'edit') {
            // 脑残改原型
            buttons.push(
                <Button
                    type="primary"
                    disabled={buttonsStatus}
                    htmlType="submit"
                    style={{ margin: '20px 20px', left: '20%' }}
                    onClick={() => {
                        this.type = 0;
                        this.commit = false;
                        setTimeout(() => {
                            this.setState({ buttonsStatus: true });
                        }, 0);
                    }}
                >
                    {Boolean(this.props.curUser.level === 1 && !this.props.curUser.medicalorgId) ? '保存' : '保存草稿'}
                </Button>
            );
        }

        if (
            !Boolean(this.props.curUser.level === 1 && !this.props.curUser.medicalorgId) &&
            (pageType === 'add' || pageType === 'edit')
        ) {
            buttons.push(
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={buttonsStatus}
                    style={{ margin: '20px 20px', left: pageType === 'add' ? '40%' : '20%' }}
                    onClick={() => {
                        this.type = 1;
                        this.commit = true;
                        setTimeout(() => {
                            this.setState({ buttonsStatus: true });
                        }, 0);
                    }}
                >
                    保存并提交审核
                </Button>
            );
        }

        buttons.push(
            <Button
                type="primary"
                style={{ margin: '20px 20px', left: pageType === 'add' ? '60%' : '40%' }}
                disabled={buttonsStatus}
                onClick={() => this.props.backList()}
            >
                返回
            </Button>
        );

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
            {
                dataIndex: 'areaname',
                key: 'areaname',
                title: '合作机构所属地区'
                // width: 200
            },
            {
                dataIndex: 'orgname',
                key: 'orgname',
                title: '京津合作机构名称'
                // width: 200
            },
            {
                key: 'orgtype',
                title: '京津合作机构类别',
                // width: 200,
                render: (record, index) => {
                    if (record && (record.orgtype1 || record.orgtype2)) {
                        const str1 = jglb1.find(item => item.props.value === record.orgtype1);
                        const str2 = jglb2.find(item => item.props.value === record.orgtype2);
                        if (str1 && str2) {
                            return str1.props.children + ' | ' + str2.props.children;
                        } else if (str1) {
                            return str1.props.children;
                        } else if (str2) {
                            return str2.props.children;
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                }
            },
            {
                key: 'economictype',
                title: '合作机构经济类型',
                // width: 200,
                render: (record, index) => {
                    if (record && record.economictype) {
                        const data = jjlx.find(item => item.props.value === record.economictype);
                        return data ? data.props.children : '';
                    } else {
                        return '';
                    }
                }
            },
            {
                key: 'level',
                title: '京津合作机构等级',
                // width: 200,
                render: (record, index) => {
                    if (record && (record.orglevel1 || record.orglevel2)) {
                        const str1 = jgdj1.find(item => item.props.value === record.orglevel1);
                        const str2 = jgdj2.find(item => item.props.value === record.orglevel2);
                        if (str1 && str2) {
                            return str1.props.children + ' | ' + str2.props.children;
                        } else if (str1) {
                            return str1.props.children;
                        } else if (str2) {
                            return str2.props.children;
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                }
            },
            {
                key: 'opt',
                title: '操作',
                // width: 300,
                render: (opt, record, index) => {
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
                                            delete tableData[index];

                                            tableData = tableData.filter(data => data);

                                            this.setState({ tableData });
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
                            <a onClick={() => this.setState({ institutionModal: true, jglb2: [] })}>添加</a>
                        </span>
                    );
                }
            }
        ];
        return (
            <div style={{ margin: '40px 20px' }}>
                <Form {...formItemLayout} onSubmit={this.saveAgreement}>
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
                        <Item label="上报机构所属行政部门" className="add-form-item">
                            {data.orgName}
                        </Item>
                        <Item label="上报医疗机构社会统一信用代码" className="add-form-item">
                            {data.medicalcode}
                        </Item>
                        <Item label="上报医疗机构名称" className="add-form-item">
                            {data.medicalname}
                        </Item>
                        <Item label="填报人姓名" className="add-form-item">
                            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入填报人姓名' }] })(
                                <Input onChange={e => this.setData('name', e.target.value)} />
                            )}
                        </Item>
                        <Item label="填报人办公电话" className="add-form-item">
                            <Input
                                value={data.telephone}
                                onChange={e => {
                                    let phone = e.target.value;
                                    if (!/[\u4e00-\u9fa5]+/.test(phone) || phone === '' || isNull(phone)) {
                                        this.setState({ telError: false });
                                    } else {
                                        this.setState({ telError: true });
                                    }
                                    this.setData('telephone', phone);
                                }}
                            />
                            {telError && <div className="model-error">请输入正确的办公电话</div>}
                        </Item>
                        <Item label="填报人手机号" className="add-form-item">
                            <Input
                                value={data.phone}
                                onChange={e => {
                                    let phone = e.target.value;
                                    if (/^[1][3,4,5,7,8][0-9]{9}$/.test(phone) || phone === '' || isNull(phone)) {
                                        this.setState({ phoneError: false });
                                    } else {
                                        this.setState({ phoneError: true });
                                    }
                                    this.setData('phone', phone);
                                }}
                            />
                            {phoneError && <div className="model-error">请输入正确的手机号码</div>}
                        </Item>
                    </div>
                    <h1 style={{ margin: '30px 50px' }}>
                        <strong>二、京津合作机构信息</strong>
                    </h1>
                    <div style={{ paddingLeft: 80 }}>
                        {Boolean((!tableData || tableData.length === 0) && pageType !== 'card') && (
                            <Button
                                style={{ marginBottom: 20 }}
                                type="primary"
                                onClick={() => {
                                    this.setState({ institutionModal: true, jglb2: [] });
                                }}
                            >
                                新增合作机构信息
                            </Button>
                        )}
                        <Table
                            style={{ overflowX: 'hidden' }}
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
                            {getFieldDecorator('agreementname', {
                                rules: [{ required: true, message: '请输入合作项目/协议名称' }]
                            })(
                                <Input
                                    // value={data.agreementname}
                                    onChange={e => this.setData('agreementname', e.target.value)}
                                />
                            )}
                        </Item>
                        <Item label="合作时间" className="add-form-item">
                            <RangePicker
                                placeholder={['起始时间', '终止时间']}
                                value={
                                    data.agreestart
                                        ? [
                                              moment(formatDate(data.agreestart, 1), dateFormat),
                                              moment(formatDate(data.agreeend, 1), dateFormat)
                                          ]
                                        : []
                                    // [moment(new Date(), dateFormat), moment(new Date(), dateFormat)]
                                }
                                onChange={(e, str) => {
                                    console.log(e, str);
                                    this.setState({
                                        data: { ...data, agreestart: str[0], agreeend: str[1] },
                                        agreestartError: str[0] === ''
                                    });
                                }}
                            />
                            {agreestartError && <div className="model-error">请选择合作时间</div>}
                        </Item>
                        <Item label="合作方式" className="add-form-item">
                            <Checkbox.Group
                                value={data && data.agreetype && data.agreetype.split(',')}
                                onChange={values => {
                                    if (values) this.setState({ agreetypeError: false });
                                    this.setData('agreetype', values.join(','));
                                }}
                            >
                                <Row style={{ marginTop: 10 }}>
                                    {yyhzfs.map((item, i) => {
                                        return (
                                            <Col span={i % 2 === 0 ? 17 : 6}>
                                                <Checkbox value={item.props.value}>{item.props.children}</Checkbox>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Checkbox.Group>
                            {agreetypeError && <div className="model-error">请选择合作方式</div>}
                        </Item>
                    </div>
                    <Item>{buttons}</Item>
                </Form>
                <Modal
                    maskClosable={false}
                    title="添加京津合作机构信息"
                    visible={institutionModal}
                    onOk={() => {
                        for (const key in this.modealTitles) {
                            if (!giz[key]) {
                                this.setState({ modelerr: '请输入' + this.modealTitles[key] });

                                return;
                            }
                        }

                        tableData.push(giz);
                        this.setState({ tableData, giz: {}, institutionModal: false });
                    }}
                    onCancel={() => {
                        this.setState({ giz: {}, institutionModal: false });
                    }}
                >
                    <div>
                        <span className="model-span">合作机构所属地区： </span>
                        <Select
                            allowClear
                            className="model-input"
                            value={giz.area}
                            onSelect={(value, node) => {
                                this.setState({ giz: { ...giz, area: value, areaname: node.props.children } });
                            }}
                        >
                            {hzjgssdq}
                        </Select>
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
                            onSelect={value => {
                                let cjglb = this.jglb1Data.children.find(item => item.codeNo === value);

                                this.setState({
                                    giz: { ...giz, orgtype1: value, orgtype2: null },
                                    jglb2: cjglb.children.map(item => (
                                        <Option value={item.codeNo}>{item.codeName}</Option>
                                    ))
                                });
                            }}
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
                        <div className="model-error">{modelerr}</div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const ProjectCard = Form.create({ name: 'ProjectCard' })(ProjectCardPage);

export default ProjectCard;
