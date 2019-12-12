import React, { Component } from 'react';
import {
	Form,
	DatePicker,
	TreeSelect,
	Modal,
	Select,
	Input,
	Button,
	Table,
	Divider,
	Row,
	Col,
	notification
} from 'antd';
import Axios from 'axios';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, formatDate, initRight, initsbyfTreeNodes } from '../../comUtil';

import ReportCard from '../../medical-institution/report/ReportCard';

import './pam-index.css';

/**
 * 月报
 */
class MRListPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			shzt: [],
			ybcxtj: [],
			sbyf: [],
			data: {
				//上报时间开始
				ereportstart: null,
				//上报时间结束
				ereportend: null,
				//上报月份
				morth: null,
				//审核状态
				status: null,
				//搜索类型
				type: null,
				//搜索关键词
				value: null
			}
		};
	}

	componentDidMount() {
		initsbyfTreeNodes.call(this);
		initAllDic.call(this, [ 'shzt', 'ybcxtj' ]);
		setTimeout(() => {
			this.queryData.call(this, { preventDefault: () => {} });
		}, 0);
	}

	queryData = (e) => {
		e.preventDefault();
		Axios.post('/ylws/morthtable/selectMortTableByDto', this.state.data).then((res) => {
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
		const { ybcxtj, shzt, data, sbyf } = this.state;
		return (
			<Form className="ant-advanced-search-form" onSubmit={this.queryData}>
				<Row gutter={24}>
					<Col span={12}>
						<Item label="上报时间段">
							<RangePicker
								placeholder={[ '开始时间', '结束时间' ]}
								onChange={(e, str) => {
									this.setState({ data: { ...data, ereportstart: str[0], ereportend: str[1] } });
								}}
							/>
						</Item>
					</Col>
					<Col span={12}>
						<Item label="上报月份">
							<TreeSelect
								allowClear
								treeData={sbyf}
								onChange={(v) => this.setState({ data: { ...data, morth: v } })}
							/>
						</Item>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<Item label="审核状态">
							<Select
								className="seletItem"
								onSelect={(value) => this.setState({ data: { ...data, status: value } })}
							>
								{shzt}
							</Select>
						</Item>
					</Col>
					<Col span={12}>
						<Item label="">
							<div className="seletItem">
								<span>{'　'}</span>
							</div>
						</Item>
					</Col>

					<Col span={16}>
						<Input.Group compact>
							<div style={{ width: '100%' }}>
								<div style={{ float: 'left', width: '16%', textAlign: 'right', marginRight: 10 }}>
									<label className="query-div">查询条件: </label>
								</div>
								<Select
									style={{ float: 'left', width: '20%', marginLeft: 45 }}
									onSelect={(value) => this.setState({ data: { ...data, type: value } })}
								>
									{ybcxtj}
								</Select>
								<div style={{ float: 'left', width: '25%', marginLeft: 15 }}>
									<Input
										onChange={(e) => this.setState({ data: { ...data, value: e.target.value } })}
									/>
								</div>
							</div>
						</Input.Group>
					</Col>
					<Button type="primary" htmlType="submit">
						查询
					</Button>
				</Row>
			</Form>
		);
	}
}

// const WrappedMRListPage = Form.create({ name: 'MRListPage' })(MRListPage);

export default class MRList extends Component {
	constructor(props) {
		super(props);
		this.allStatus = [ '未提交 ', '待县级审核 ', '待市级复核 ', '待省级终审 ', '终审通过 ', '县级审核不通过 ', '市级复核不通过 ', '省级终审不通过' ];
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
				title: '上报医疗机构名称',
				dataIndex: ' medicalname',
				key: 'medicalname',
				width: 200,
				render: (code, record) => <span>{record.medicalname}</span>
			},
			{
				title: '协议 ID',
				dataIndex: 'agreementid',
				key: 'agreementid',
				width: 200
			},
			{
				title: '协议名称',
				dataIndex: 'agreementName',
				key: 'agreementName',
				width: 200
			},
			{
				title: '上报月份',
				dataIndex: 'morth',
				key: 'morth',
				width: 200
			},
			{
				title: '填报人姓名',
				dataIndex: 'preparername',
				key: 'preparername',
				width: 200
			},
			{
				title: '填报人联系方式',
				dataIndex: 'preparertelephone',
				key: 'preparertelephone',
				width: 200
			},
			{
				title: '上报时间',
				dataIndex: 'ylwscreate',
				key: 'ylwscreate',
				render: (ylwscreate, record, index) => formatDate(ylwscreate),
				width: 200
			},
			{
				title: '审核状态',
				dataIndex: 'statusName',
				key: 'statusName',
				width: 200
			},
			{
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 300,
				render: (record) => {
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
										this.postIDData(record.id, '/ylws/morthtable/checkMorthTable', '审核成功');
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
								confirm.call(this, {
									title: '是否确认退回 ?',
									okText: '确认',
									cancelText: '取消',
									onOk: () => {
										this.postIDData(record.id, '/ylws/morthtable/backMorthTable', '退回成功');
									},
									onCancel() {
										console.log('Cancel');
									}
								});
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
										Axios.post('/ylws/morthtable/delMortTable', data).then((res) => {
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
								})}
						>
							删除
						</a>
					];

					// opts 0 详情, 1 审核,2, 退回 3 修改, 4 删除
					let cOptIndex = [ 0 ];

					//审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
					const { level } = this.props.curUser;
					if (level === 1) {
						if (record.status === 4) {
							cOptIndex = [ 0, 1, 2, 3, 4 ];
						} else {
							cOptIndex = [ 0, 3, 4 ];
						}
					} else if (level === 2) {
						if (record.status === 3) {
							cOptIndex = [ 0, 1, 2 ];
						} else if (record.status === 8) {
							cOptIndex = [ 0, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
					} else {
						if (record.status === 2) {
							cOptIndex = [ 0, 1, 2 ];
						} else if (record.status === 7) {
							cOptIndex = [ 0, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
					}

					let cOpts = [];
					for (let index = 0; index < cOptIndex.length; index++) {
						const item = cOptIndex[index];
						cOpts.push(opts[item]);
						if (index !== cOptIndex.length) cOpts.push(<Divider type="vertical" />);
					}
					return <span>{cOpts} </span>;
				}
			}
		];
		this.state = {
			tableData: [],
			cRecordId: null,
			pageType: 'list',
			// 权限
			cRight: {}
		};
	}
	postIDData = (id, url, msg) => {
		let data = new FormData();
		data.append('id', id);
		Axios.post(url, data).then((res) => {
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
		});
	};
	setStateData = (k, v) => {
		this.setState({ [k]: v });
	};
	backList = () => this.setState({ pageType: 'list' });

	componentDidMount() {
		setTimeout(() => initRight.call(this, this.props), 30);
	}

	componentWillReceiveProps(props) {
		setTimeout(() => initRight.call(this, props), 30);
	}

	render() {
		const { tableData, pageType, cRecordId } = this.state;

		return (
			<div>
				{pageType === 'list' && (
					<div>
						<MRListPage setStateData={this.setStateData} />
						<div className="list-table">
							<Table
								pagination={{ showSizeChanger: true }}
								columns={this.columns}
								dataSource={tableData}
								scroll={{ x: 10 }}
							/>
						</div>
					</div>
				)}
				{pageType !== 'list' && (
					<ReportCard
						pageType={pageType}
						backList={this.backList}
						curUser={this.props.curUser}
						recordId={cRecordId}
					/>
				)}
			</div>
		);
	}
}
