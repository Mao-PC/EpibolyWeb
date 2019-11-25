import React, { Component } from 'react';
import { Form, DatePicker, Select, Input, Button, Table, Divider, Row, Col, TreeSelect, notification } from 'antd';

import { initAllDic, initOrgSelectTree, formatDate } from '../../comUtil';

import Axios from 'axios';
import GPGCard from './GPGCard';

const { Item } = Form;
const { RangePicker } = DatePicker;

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
		initAllDic.call(this, [ 'hzjgssdq', 'yyhzfs', 'shzt' ], [ 'hzxmxycx' ]);
		setTimeout(() => {
			this.props.setStateData('areaTreeSelect', this.state.areaTreeSelect);
		}, 0);
	}

	handleSearch = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
		});
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	queryData = (e) => {
		e.preventDefault();
		Axios.post('/ylws/agreement/selectAgreeMentAll', this.state.data).then((res) => {
			if (res.data && res.data.header.code === '1000') {
				this.props.setStateData('tableData', res.data.body.data);
			} else {
				notification.error({ message: res.data.header.msg });
			}
		});
	};

	render() {
		let { hzjgssdq, yyhzfs, shzt, hzxmxycx, areaTreeSelect, data } = this.state;
		shzt = shzt.filter((item) => item.props.value !== 'wtj');
		return (
			<Form className="ant-advanced-search-form" onSubmit={this.queryData}>
				<Row gutter={24}>
					<Col span={8}>
						<Item label="上报时间段">
							<RangePicker
								placeholder={[ '开始时间', '结束时间' ]}
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
								onSelect={(value) => this.setState({ data: { ...data, area: value } })}
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
								onSelect={(value) => this.setState({ data: { ...data, orgId: value } })}
							/>{' '}
						</Item>
					</Col>
				</Row>
				<Row>
					<Col span={8}>
						<Item label="协议合作方式">
							<Select
								className="seletItem"
								onSelect={(value) => this.setState({ data: { ...data, collaborationtype: value } })}
							>
								{yyhzfs}
							</Select>{' '}
						</Item>
					</Col>
					<Col span={8}>
						<Item label="审核状态">
							<Select
								className="seletItem"
								onSelect={(value) => this.setState({ data: { ...data, checkstatus: value } })}
							>
								{shzt}
							</Select>{' '}
						</Item>
					</Col>
				</Row>
				<Row>
					<Col span={16}>
						<Input.Group compact>
							<Item label="查询条件">
								<Select
									style={{ width: 120 }}
									onSelect={(value) => this.setState({ data: { ...data, type: value } })}
								>
									{hzxmxycx}
								</Select>
								<Input
									onChange={(e) => this.setState({ data: { ...data, value: e.target.value } })}
									style={{ width: 250 }}
								/>
							</Item>
						</Input.Group>
					</Col>
				</Row>
				<Row>
					<Col span={24} style={{ textAlign: 'right', paddingRight: 50 }}>
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

		this.columns = [
			{
				title: '序号',
				dataIndex: 'no',
				key: 'no',
				fixed: 'left',
				width: 80,
				render: (text, record, index) => index
			},
			{
				title: '所属行政部门',
				dataIndex: 'orgId',
				key: 'orgId',
				width: 150
				// render: data => {}
			},
			{
				title: '上报医疗机构统一社会信用代码证',
				dataIndex: ' medicalcode',
				key: 'medicalcode',
				width: 150
			},
			{
				title: '上报医疗机构名称',
				dataIndex: ' medicalname',
				key: 'medicalname',
				width: 150
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
				width: 150,
				render: (record) => {
					return formatDate(record.agreestart, 1) + ' ~ ' + formatDate(record.agreeend, 1);
				}
			},
			{
				title: '合作方式',
				dataIndex: 'agreeOrgName',
				key: 'agreeOrgName',
				width: 150
			},
			{
				title: '上报时间',
				dataIndex: 'ylwscreate',
				key: 'ylwscreate',
				width: 150,
				render: (ylwscreate) => formatDate(ylwscreate)
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
				width: 150,
				render: (text, record) => {
					let opts = [
						<a onClick={() => this.setState({ pageType: 'card', cRecordId: record.id })}>详情</a>,
						<a onClick={() => this.postIDData(record.id, '/ylws/agreement/checkAgreeMent', '审批成功')}>审批</a>,
						<a onClick={() => this.postIDData(record.id, '/ylws/agreement/backAgreeMent', '退回成功')}>退回</a>
					];
					// opts 0 详情, 1 审批, 2 退回,
					let cOptIndex = [];

					//审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
					switch (record.status) {
						case 2:
						case 3:
						case 4:
							cOptIndex = [ 0, 1, 2 ];
							break;
						case 5:
							cOptIndex = [ 0 ];
							break;
						case 6:
						case 7:
						case 8:
							cOptIndex = [ 0, 1, 2 ];
							break;

						default:
							break;
					}
					if (this.props.curUser.level === 1) {
						cOptIndex = [ 0, 1, 2 ];
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
			cRecordId: null
		};
	}
	backList = () => this.setState({ pageType: 'list' });

	setStateData = (k, v) => {
		this.setState({ [k]: v });
	};

	postIDData = (id, url, msg) => {
		let data = new FormData();
		data.append('id', id);
		Axios.post(url, data).then((res) => {
			if (res.data && res.data.header.code === '1000') {
				notification.success({ message: msg });
				setTimeout(() => location.reload(), 1000);
			} else {
				notification.error({ message: res.data.header.msg });
			}
		});
	};

	render() {
		const { tableData, pageType, cRecordId } = this.state;
		if (pageType === 'list') {
			return (
				<div>
					<CPGListPage setStateData={this.setStateData} />
					<div className="list-table">
						<Table columns={this.columns} dataSource={tableData} scroll={{ x: 10, y: 300 }} />
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
