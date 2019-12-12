import React, { Component } from 'react';
import {
    Form,
    DatePicker,
    Select,
    Input,
    Button,
    Table,
    Divider,
    Row,
    Col,
    Modal,
    TreeSelect,
    notification
} from 'antd';

import { initAllDic, initOrgSelectTree, formatDate, initRight } from '../../comUtil';

import Axios from 'axios';
import GPGCard from '../../medical-institution/project/ProjectCard';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const {TextArea } = Input

import './pam-index.css';

/**
 * 合作项目协议
 */
class CPGListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hzjgssdq: [],
            yyhzfs: [],
            shzt: [],
            hzxmxycx: [],
            // 所属行政部门
            areaTreeSelect: [],
            // 查询
            data: {
                //上报时间开始
                ereportstart: null,
                //上报时间结束
                ereportend: null,
                //合作机构所属地区
                area: null,
                //所属行政部门
                orgId: null,
                //协议合作方式
                collaborationtype: null,
                //审核状态
                checkstatus: null,
                //查询条件
                type: null,
                //搜索关键词
                value: null
            }
        };
    }

    componentDidMount() {
        initOrgSelectTree.call(this);
        initAllDic.call(this, ['hzjgssdq', 'yyhzfs', 'shzt', 'hzxmxycx']);
        setTimeout(() => {
            this.props.setStateData('areaTreeSelect', this.state.areaTreeSelect);
            this.queryData.call(this, { preventDefault: () => {} });
        }, 0);
    }

    queryData = e => {
        e.preventDefault();
        Axios.post('/ylws/agreement/selectAgreeMentAll', this.state.data).then(res => {
            if (res.data) {
                if (res.data.header.code === '1003') {
                    notification.error({ message: '登录过期, 请重新登录' });
                    setTimeout(() => {
                        this.props.history.push({ pathname: '/' });
                    }, 1000);
                    return;
                }
                if (res.data.header.code === '1000') {
                    this.props.setStateData('tableData', res.data.body.data);
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            } else {
                notification.error({ message: res.data.header.msg });
            }
        });
    };

    render() {
        let { hzjgssdq, yyhzfs, shzt, hzxmxycx, areaTreeSelect, data } = this.state;
        // shzt = shzt.filter(item => item.props.value !== 'wtj');
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.queryData}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Item label="上报时间段">
                            <RangePicker
                                placeholder={['开始时间', '结束时间']}
                                onChange={(e, str) => {
                                    this.setState({ data: { ...data, ereportstart: str[0], ereportend: str[1] } });
                                }}
                            />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="合作机构所属地区">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, area: value } })}
                            >
                                {hzjgssdq}
                            </Select>{' '}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="所属行政部门">
                            <TreeSelect
                                allowClear
                                treeData={areaTreeSelect}
                                onSelect={value => this.setState({ data: { ...data, orgId: value } })}
                            />{' '}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Item label="协议合作方式">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, collaborationtype: value } })}
                            >
                                {yyhzfs}
                            </Select>{' '}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="审核状态">
                            <Select
                                className="seletItem"
                                onSelect={value => this.setState({ data: { ...data, checkstatus: value } })}
                            >
                                {shzt}
                            </Select>{' '}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <Input.Group compact>
                            <div style={{ width: '100%' }}>
                                <div style={{ float: 'left', width: '10%', textAlign: 'right', marginRight: 10 }}>
                                    <label className="query-div">查询条件: </label>
                                </div>
                                <Select
                                    style={{ float: 'left', width: '29%', marginLeft: 37 }}
                                    onSelect={value => this.setState({ data: { ...data, type: value } })}
                                >
                                    {hzxmxycx}
                                </Select>
                                <div style={{ float: 'left', width: '25%', marginLeft: 15 }}>
                                    <Input
                                        onChange={e => this.setState({ data: { ...data, value: e.target.value } })}
                                        style={{ width: 250 }}
                                    />
                                </div>
                            </div>
                        </Input.Group>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right', paddingRight: 50 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default class CPGList extends Component {
    constructor(props) {
        super(props);
        this.id = null;
        this.columns = [
            {
                title: '序号',
                dataIndex: 'no',
                key: 'no',
                fixed: 'left',
                width: 80,
                render: (text, record, index) => index + 1
            },
            {
                title: '所属行政部门',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 150
            },
            {
                title: '上报医疗机构统一社会信用代码',
                dataIndex: ' medicalcode',
                key: 'medicalcode',
                width: 150,
                render: (code, record) => <span>{record.medicalcode}</span>
            },
            {
                title: '上报医疗机构名称',
                dataIndex: ' medicalname',
                key: 'medicalname',
                width: 150,
                render: (code, record) => <span>{record.medicalname}</span>
            },
            {
                title: '填报人姓名',
                dataIndex: 'name',
                key: 'name',
                width: 150
            },
            {
                title: '填报人办公电话',
                dataIndex: 'telephone',
                key: 'telephone',
                width: 150
            },
            {
                title: '合作机构所属地区',
                dataIndex: 'agreeareas',
                key: 'agreeareas',
                width: 150
            },
            {
                title: '京津合作机构名称',
                dataIndex: 'agreeOrgName',
                key: 'agreeOrgName',
                width: 150
            },
            {
                title: '合作项目/协议名称',
                dataIndex: 'agreementname',
                key: 'agreementname',
                width: 150
            },
            {
                title: '合作时间',
                key: 'cooperationTime',
                width: 250,
                render: record => {
                    return formatDate(record.agreestart, 1) + ' ~ ' + formatDate(record.agreeend, 1);
                }
            },
            {
                title: '合作方式',
                dataIndex: 'agreetypeNames',
                key: 'agreetypeNames',
                width: 150
            },
            {
                title: '上报时间',
                dataIndex: 'ylwscreate',
                key: 'ylwscreate',
                width: 200,
                render: ylwscreate => formatDate(ylwscreate)
            },
            {
                title: '审核状态',
                dataIndex: 'statusName',
                key: 'statusName',
                width: 150
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                fixed: 'right',
                width: 300,
                render: (text, record) => {
                    let opts = [
                        <a onClick={() => this.setState({ pageType: 'card', cRecordId: record.id })}>详情</a>,
                        <a
                            onClick={() => {
                                if (!this.state.cRight.check) {
                                    notification.success({ message: '当前用户没有审核权限' });
                                    return;
                                }

                                confirm.call(this, {
                                    title: '是否确认审核 ?',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: () => {
                                        let data = new FormData();
        data.append('id', record.id);
                                        this.postIDData(data, '/ylws/agreement/checkAgreeMent', '审核成功');
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    }
                                });
                            }}
                        >
                            审核
                        </a>,
                        <a
                            onClick={() => {
                                if (!this.state.cRight.check) {
                                    notification.success({ message: '当前用户没有审核权限' });
                                    return;
                                }
this.id = record.id
this.setState({backModal: true})
                            }}
                        >
                            退回
                        </a>,
                        <a onClick={() => this.setState({ pageType: 'edit', cRecordId: record.id })}>修改</a>,
                        <a
                            onClick={() =>
                                confirm({
                                    title: '确定要删除该数据吗 ?',
                                    okText: '确认',
                                    okType: 'danger',
                                    cancelText: '取消',
                                    onOk() {
                                        let data = new FormData();
                                        data.append('id', record.id);
                                        Axios.post('/ylws/agreement/delAgreeMent', data).then(res => {
                                            if (res.data) {
                                                if (res.data.header.code === '1003') {
                                                    notification.error({ message: '登录过期, 请重新登录' });
                                                    setTimeout(() => {
                                                        this.props.history.push({ pathname: '/' });
                                                    }, 1000);
                                                    return;
                                                }
                                                if (res.data.header.code === '1000') {
                                                    notification.success({ message: '删除成功' });
                                                    setTimeout(() => location.reload(), 1000);
                                                } else {
                                                    notification.error({ message: res.data.header.msg });
                                                }
                                            } else {
                                                notification.error({ message: res.data.header.msg });
                                            }
                                        });
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    }
                                })
                            }
                        >
                            删除
                        </a>
                    ,
                            <a onClick={()=> {
                                let data = new FormData()
                                data.append('id', record.id)
                                data.append('type', 0)
                                Axios.post('/ylws/agreement/backDetailView', data)
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
                                            this.setState({backDetail:res.data.body.data, backDetailModal : true})
                                        } else {
                                            notification.error({ message: res.data.header.msg });
                                        }
                                    } else {
                                        notification.error({ message: res.data.header.msg });
                                    }
                                });
                                }}>查看退回理由</a>
                ];
                    // opts 0 详情, 1 审核, 2 退回,3, 修改4 删除, 5查看退回理由
                    let cOptIndex = [];

                    //审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
                    const { level } = this.props.curUser;
                    if (level === 1) {
                        // cOptIndex = record.status !== 5 ? [0, 1, 2, 3, 4] : [0];
                        if (record.status === 4) {
                            cOptIndex = [0, 1, 2, 3, 4];
                        } else {
                            cOptIndex = [0, 3, 4];
                        }
                    } else if (level === 2) {
                        if (record.status === 3) {
                            cOptIndex = [0, 1, 2];
                        } else if (record.status === 8) {
                            cOptIndex = [0, 2];
                        } else {
                            cOptIndex = [0];
                        }
                    } else {
                        if (record.status === 2) {
                            cOptIndex = [0, 1, 2];
                        } else if (record.status === 7) {
                            cOptIndex = [0, 2];
                        } else {
                            cOptIndex = [0];
                        }
                    }

                    if ([6,7,8].includes(record.status)) {
                        cOptIndex = cOptIndex.concat(5)
                    }

                    let cOpts = [];
                    for (let index = 0; index < cOptIndex.length; index++) {
                        const item = cOptIndex[index];
                        cOpts.push(opts[item]);
                        if (index !== cOptIndex.length) cOpts.push(<Divider type="vertical" />);
                    }
                    return <span>{cOpts}</span>;
                }
            }
        ];
        this.state = {
            pageType: 'list',
            tableData: [],
            cRecordId: null,
            // 权限
            cRight: {},
            backModal: false,backReason:''
        };
    }
    backList = () => this.setState({ pageType: 'list' });

    setStateData = (k, v) => {
        this.setState({ [k]: v });
    };

    postIDData = (data, url, msg) => {
        Axios.post(url, data).then(res => {
            if (res.data) {
                if (res.data.header.code === '1003') {
                    notification.error({ message: '登录过期, 请重新登录' });
                    setTimeout(() => {
                        this.props.history.push({ pathname: '/' });
                    }, 1000);
                    return;
                }
                if (res.data.header.code === '1000') {
                    notification.success({ message: msg });
                    setTimeout(() => location.reload(), 1000);
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            } else {
                notification.error({ message: res.data.header.msg });
            }
        })
    };

    componentDidMount() {
        setTimeout(() => initRight.call(this, this.props), 30);
    }

    componentWillReceiveProps(props) {
        setTimeout(() => initRight.call(this, props), 30);
    }
    render() {
        const { tableData, pageType, cRecordId,backModal ,backReason,backDetail,backDetailModal} = this.state;

        let backDetailDOM = []
        if (backDetail){
            const { level } = this.props.curUser;
    
            let preReason = backDetail.filter(item => item.backlevel === level-1)
            let curReason = backDetail.filter(item => item.backlevel === level)
            if (preReason) {
                preReason.forEach(item => {
                    backDetailDOM.push(
                        <div style={{marginBottom:20}}>
                            <div>{'上级退回理由 :' + item.content}</div>
    <div>{'退回人 : '+ item.uname}</div>
    <div>{'退回时间 : '+ formatDate(item.backtime)}</div>
                        </div>
                    )
                })
            }
            if (backDetailDOM.length > 0){
                backDetailDOM.push(<hr style={{height:1, border:"none", borderTop:"1px solid #555555" }} />)
            }
            if (curReason) {
                curReason.forEach(item => {
                    backDetailDOM.push(
                        <div style={{marginBottom:20}}>
                            <div>{'本级退回理由 :' + item.content}</div>
    <div>{'退回人 : '+ item.uname}</div>
    <div>{'退回时间 : '+ formatDate(item.backtime)}</div>
                        </div>
                    )
                })
            }
        }
        if (pageType === 'list') {
            return (
                <div>
                    <CPGListPage setStateData={this.setStateData} />
                    <div className="list-table">
                        <Table
                            rowKey="id"
                            pagination={{ showSizeChanger: true }}
                            columns={this.columns}
                            dataSource={tableData}
                            scroll={{ x: 10 }}
                        />
                        <Modal 
                            title="退回" 
                            visible={backModal}
                            okText={'确认退回'}
                            onOk={() => {
                                let data = new FormData();
        data.append('id', this.id);
        data.append("content", backReason)
                                this.postIDData(data, '/ylws/agreement/backAgreeMent', '退回成功');
                            }}
                            onCancel={() => {
                                this.setState({ backModal: false });
                            }}
                            >
<div style={{height:100}}>
    
<div style={{display:"inline-block", margin: "0 20px", textAlign: 'right', height: "100%"}} >退回理由</div>
                            <TextArea style={{width:300, height:100}}
                            value={backReason}
                            onChange={e => {this.setState({backReason: e.target.value})}}
                            />
</div>
                        </Modal>
                        <Modal 
                            title="退回理由查询" 
                            closable={false}
                            footer={<Button key="back" type="primary" onClick={() => this.setState({ backDetailModal: false })}>
                            关闭
                          </Button>}
                            visible={backDetailModal}
                            okText={'关闭'}
                            >
                                {backDetailDOM}
                                
                        </Modal>
                    </div>
                </div>
            );
        } else {
            return (
                <GPGCard
                    pageType={pageType}
                    backList={this.backList}
                    curUser={this.props.curUser}
                    recordId={cRecordId}
                />
            );
        }
    }
}
