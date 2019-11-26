import React, { Component } from 'react';
import { Form, DatePicker, Select, Button, Table, Row, Col, TreeSelect, notification } from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;

import { initAllDic, initOrgSelectTree, formatDate } from '../../comUtil';

import './pam-index.css';
import Axios from 'axios';

/**
 * 统计分析
 */
class ASListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hzjgssdq: [],
            yyhzfs: [],
            areaTreeSelect: []
        };
    }

    componentDidMount() {
        initOrgSelectTree.call(this);
        initAllDic.call(this, ['hzjgssdq', 'yyhzfs']);
        setTimeout(() => {
            this.props.setStateData('areaTreeSelect', this.state.areaTreeSelect);
        }, 0);
    }

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { querydate, area, orgId, agreetype } = values;
            let data = {
                startDate: querydate && querydate[0] && formatDate(querydate[0], 1),
                endDate: querydate && querydate[1] && formatDate(querydate[1], 1),
                area,
                orgId,
                agreetype
            };
            Axios.post('/ylws/agreement/statisticalAnalysis', data).then(res => {
                if (res.data) {
                    if (res.data.header.code === '1003') {
                        notification.error({ message: res.data.header.msg });
                        setTimeout(() => {
                            this.props.history.push({ pathname: '/' });
                        }, 1000);
                    }
                    this.props.setTableDate(res.data.body.data);
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            });
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { hzjgssdq, yyhzfs, areaTreeSelect } = this.state;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Item label="上报时间段">
                            {getFieldDecorator('querydate')(<RangePicker placeholder={['开始时间', '结束时间']} />)}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item label="合作机构所属地区">
                            {getFieldDecorator('area')(<Select className="seletItem">{hzjgssdq}</Select>)}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item label="所属行政部门">
                            {getFieldDecorator('orgId')(<TreeSelect className="seletItem" treeData={areaTreeSelect} />)}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item label="协议合作方式">
                            {getFieldDecorator('agreetype')(<Select className="seletItem">{yyhzfs}</Select>)}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right', paddingRight: 50 }}>
                        <Button type="primary" htmlType="submit">
                            统计
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedASListPage = Form.create({ name: 'ASListPage' })(ASListPage);

export default class ASList extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '序号',
                width: 80,
                dataIndex: 'no',
                key: 'no',
                fixed: 'left',
                render: (text, record, index) => index + 1
            },
            {
                title: '市级卫生健康委',
                width: 200,
                dataIndex: 'cityHealth',
                key: 'cityHealth'
            },
            {
                title: '合计',
                width: 200,
                dataIndex: ' countyHealthCount',
                key: 'countyHealthCount'
            },
            {
                title: '合作机构名称 （河北）',
                width: 200,
                dataIndex: 'togetherName',
                key: 'togetherName'
            },
            {
                title: '协议数量',
                width: 200,
                dataIndex: 'agreeCount',
                key: 'agreeCount'
            },
            {
                title: '合作机构总数 （河北）',
                width: 200,
                dataIndex: 'togetherOrgCount',
                key: 'togetherOrgCount'
            },
            {
                title: '与北京合作的河北机构数',
                width: 200,
                dataIndex: 'bjAndHbOrgCount',
                key: 'bjAndHbOrgCount'
            },
            {
                title: '合作机构数 （北京）',
                width: 200,
                dataIndex: 'togetherBJOrgCount',
                key: 'togetherBJOrgCount'
            },
            {
                title: '与天津合作的河北机构数',
                width: 200,
                dataIndex: 'tjAndHbOrgCount',
                key: 'tjAndHbOrgCount'
            },
            {
                title: '合作机构数 （天津）',
                width: 200,
                dataIndex: 'togetherTJOrgCount',
                key: 'togetherTJOrgCount'
            },
            {
                title: '引进新技术项',
                width: 200,
                dataIndex: 'newTechnology',
                key: 'newTechnology'
            },
            {
                title: '新建科室数',
                width: 200,
                dataIndex: 'newDepartment',
                key: 'newDepartment'
            },
            {
                title: '京津专家坐诊次数',
                width: 200,
                dataIndex: 'jjDiagnosisCount',
                key: 'jjDiagnosisCount'
            },
            {
                title: '京津专家诊疗患者总人数',
                width: 200,
                dataIndex: 'jjDiagnosisPatientCount',
                key: 'jjDiagnosisPatientCount'
            },
            {
                title: '培训进修次数',
                width: 200,
                dataIndex: 'trainTimesCount',
                key: 'trainTimesCount'
            },
            {
                title: '培训进修人数',
                width: 200,
                dataIndex: 'trainEduCount',
                key: 'trainEduCount'
            },
            {
                title: '合作手术例数',
                width: 200,
                dataIndex: 'agreeOperationCount',
                key: 'agreeOperationCount'
            },
            {
                title: '远程医疗人次',
                width: 200,
                dataIndex: 'remoteTimesCount',
                key: 'remoteTimesCount'
            },
            {
                title: '总门诊人次',
                width: 200,
                dataIndex: 'totalDiagnosisCount',
                key: 'totalDiagnosisCount'
            },
            {
                title: '总住院人次',
                width: 200,
                dataIndex: 'totalHospitalCount',
                key: 'totalHospitalCount'
            },
            {
                title: '总手术例数',
                width: 200,
                dataIndex: 'totalOperationCount',
                key: 'totalOperationCount'
            },
            {
                title: '对上转诊人次',
                width: 200,
                dataIndex: 'totalReferralCount',
                key: 'totalReferralCount'
            }
        ];
        this.state = {
            tableData: []
        };
    }

    async getData(url, id) {
        return await Axios.post(url, id);
    }

    getCountyHealth(record) {
        let subCols = this.columns.slice(3);
        subCols.unshift(
            {
                title: '序号',
                width: 80,
                dataIndex: 'no',
                key: 'no',
                fixed: 'left',
                render: (text, record, index) => index + 1
            },
            {
                title: '区县级卫生健康局',
                width: 200,
                dataIndex: 'countyHealth',
                key: 'countyHealth'
            },
            {
                title: '合计',
                width: 200,
                dataIndex: ' togetherName',
                key: 'togetherName'
            }
        );

        let subData = this.getData('/ylws/agreement/statisticalAnalysisCounty', record.orgId).then(res => {
            if (res.data) {
                if (res.data.header.code === '1003') {
                    notification.error({ message: res.data.header.msg });
                    setTimeout(() => {
                        this.props.history.push({ pathname: '/' });
                    }, 1000);
                }
                subData = res.data.body.data;
            } else {
                notification.error({ message: res.data.header.msg });
            }
        });

        return (
            <Table
                columns={subCols}
                dataSource={subData}
                pagination={false}
                expandedRowRender={record => this.getTogether(record)}
            />
        );
    }

    getTogether = record => {
        let subCols = this.columns.slice(3);
        subCols.unshift(
            {
                title: '序号',
                width: 80,
                dataIndex: 'no',
                key: 'no',
                fixed: 'left',
                render: (text, record, index) => index + 1
            },

            {
                title: '合作机构名称（河北）',
                width: 200,
                dataIndex: ' togetherName',
                key: 'togetherName'
            }
        );

        let subData = this.getData('/ylws/agreement/statisticalAnalysisMedicalorg', record.orgId).then(res => {
            if (res.data) {
                if (res.data.header.code === '1003') {
                    notification.error({ message: res.data.header.msg });
                    setTimeout(() => {
                        this.props.history.push({ pathname: '/' });
                    }, 1000);
                }
                subData = res.data.body.data;
            } else {
                notification.error({ message: res.data.header.msg });
            }
        });

        return <Table columns={subCols} dataSource={subData} pagination={false} />;
    };

    render() {
        const { tableData } = this.state;
        return (
            <div>
                <WrappedASListPage setTableDate={tableData => this.setState({ tableData })} />
                <div className="list-table">
                    <Table
                        pagination={{ showSizeChanger: true }}
                        columns={this.columns}
                        dataSource={tableData}
                        scroll={{ x: 10, y: 300 }}
                        expandedRowRender={record => this.getCountyHealth(record)}
                    />
                </div>
            </div>
        );
    }
}
