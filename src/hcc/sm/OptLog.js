import React, { Component } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Input, DatePicker, Button, Table, notification } from 'antd';

import { formatDate } from '../../comUtil';
import moment from 'moment';

const { Item } = Form;
const dateFormat = 'YYYY-MM-DD';
/**
 * 操作日志
 */
export default class OptLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                //功能
                function: null,
                //操作人
                oper: null,
                //操作人ID
                operId: null,
                //操作时间
                opertime: null
            },
            tabelData: []
        };
    }

    setDateState = (k, v) => {
        this.setState({ data: { ...this.state.data, [k]: v } });
    };

    queryData = e => {
        e.preventDefault();
        Axios.post('/ylws/user/selectOperationLog', this.state.data).then(res => {
            if (res.data) {
                if (res.data.header.code === '1003') {
                    notification.error({ message: '登录过期, 请重新登录' });
                    setTimeout(() => {
                        this.props.history.push({ pathname: '/' });
                    }, 1000);
                    return;
                }
                if (res.data.header.code === '1000') {
                    const resData = res.data.body.data;
                    this.setState({ tabelData: resData });
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            } else {
                notification.error({ message: res.data.header.msg });
            }
        });
    };

    render() {
        let { data, tabelData } = this.state;
        return (
            <div>
                <Form className="ant-advanced-search-form" onSubmit={this.queryData}>
                    <Row>
                        <Col span={6}>
                            <Item label="功能">
                                <Input
                                    value={data.function}
                                    onChange={e => this.setDateState('function', e.target.value)}
                                />
                            </Item>
                        </Col>
                        <Col span={6}>
                            <Item label="操作人">
                                <Input value={data.oper} onChange={e => this.setDateState('oper', e.target.value)} />
                            </Item>
                        </Col>
                        {/* <Col span={6}>
                            <Item label="操作人 ID">
                                <Input
                                    value={data.operId}
                                    onChange={e => this.setDateState('operId', e.target.value)}
                                />
                            </Item>
                        </Col> */}
                        <Col span={6}>
                            <Item label="操作时间">
                                <DatePicker
                                    placeholder={'选择操作日期'}
                                    value={data.opertime && moment(formatDate(data.opertime, 1), dateFormat)}
                                    onChange={(e, str) => this.setDateState('opertime', str)}
                                />
                            </Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'right', paddingRight: 50 }}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div className="list-table">
                    <Table
                        dataSource={tabelData}
                        rowKey={'id'}
                        pagination={{ showSizeChanger: true }}
                        columns={[
                            {
                                title: '序号',
                                dataIndex: 'no',
                                key: 'no',
                                width: 50,

                                render: (text, record, index) => index + 1
                            },
                            {
                                title: '功能',
                                dataIndex: 'function',
                                key: 'function',
                                width: 200
                            },
                            {
                                title: '操作人',
                                dataIndex: 'oper',
                                key: 'oper',
                                width: 200
                            },
                            // {
                            //     title: '操作人 ID',
                            //     dataIndex: 'operId',
                            //     key: 'operId',
                            //     width: 200
                            // },
                            {
                                title: '操作时间',
                                dataIndex: 'opertime',
                                key: 'opertime',
                                width: 200,
                                render: time => formatDate(time)
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}
