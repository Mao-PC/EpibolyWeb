import React, { Component } from 'react';
import {
	Form,
	DatePicker,
	Modal,
	Select,
	Button,
	Table,
	Divider,
	Row,
	Col,
	Input,
	notification,
	TreeSelect
} from 'antd';
import Axios from 'axios';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, formatDate, initsbyfTreeNodes } from '../../comUtil';

import ReportCard from './ReportCard';

/**
 * 合作项目协议
 */
class ReportListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ylybcxtj: [],
			shzt: [],
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
			},
			sbyf: []
		};
	}

	componentDidMount() {
		initAllDic.call(this, [ 'shzt', 'ylybcxtj' ]);
		initsbyfTreeNodes.call(this);
		setTimeout(() => {
			this.queryData.call(this, { preventDefault: () => {} });
		}, 0);
	}

	queryData = (e) => {
		e.preventDefault();
		let data = this.state.data;
		if (this.props.params) {
			data = { agreeMentId: this.props.params };
			// this.setState({ data: { agreeMentId: this.props.params } });
		}
		setTimeout(() => {
			Axios.post('/ylws/morthtable/selectMortTableByDto', data).then((res) => {
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
		}, 0);
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { ylybcxtj, shzt, data, sbyf } = this.state;
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
							{/* <MonthPicker
                                placeholder="选择月份"
                                onChange={(v, str) => this.setState({ data: { ...data, morth: str } })}
                            /> */}
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
									{ylybcxtj}
								</Select>
								<Input
									style={{ width: 250 }}
									onChange={(e) => this.setState({ data: { ...data, value: e.target.value } })}
								/>
							</div>
						</Input.Group>
					</Col>
					<Col span={6} style={{ textAlign: 'right', paddingRight: 50 }}>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
						<Button
							type="primary"
							style={{ margin: '0 8px' }}
							onClick={() => {
								this.props.setStateData('cRecordId', null);
								this.props.openAdd();
							}}
						>
							提交月报
						</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}

// const WrappedReportListPage = Form.create({ name: 'ReportListPage' })(ReportListPage);

export default class IDList extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: '序号',
				dataIndex: 'no',
				key: 'no',
				width: 80,
				fixed: 'left',
				render: (text, record, index) => index + 1
			},
			{
				title: '协议ID',
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
				dataIndex: 'morthName',
				key: 'morthName',
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
			// {
			//     title: '审核状态',
			//     dataIndex: 'statusName',
			//     key: 'statusName'
			// },
			{
				title: '审核状态',
				key: 'statusName',
				width: 200,
				dataIndex: 'statusName'
			},
			{
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 300,
				render: (record) => {
					let opts = [
						<a onClick={() => this.setState({ pageType: 'card', cRecordId: record.id })}>详情</a>,
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
						</a>,
						<a
							onClick={() => {
								let data = new FormData();
								data.append('id', record.id);
								data.append('type', 1);
								Axios.post('/ylws/agreement/backDetailView', data).then((res) => {
									if (res.data) {
										if (res.data.header.code === '1003') {
											notification.error({ message: '登录过期, 请重新登录' });
											setTimeout(() => {
												this.props.history.push({ pathname: '/' });
											}, 1000);
											return;
										}
										if (res.data.header.code === '1000') {
											this.setState({ backDetail: res.data.body.data, backDetailModal: true });
										} else {
											notification.error({ message: res.data.header.msg });
										}
									} else {
										notification.error({ message: res.data.header.msg });
									}
								});
							}}
						>
							查看退回理由
						</a>
					];

					// opts 0 详情, 1 修改, 2 删除, 3查看退回理由
					let cOptIndex = [];

					//审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
					const { status } = record;
					const level = this.props.curUser.level;
					if (level === 1) {
						if (status !== 5) {
							cOptIndex = [ 0, 1, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
					} else if (level === 2) {
						if (status === 7) {
							cOptIndex = [ 0, 1 ];
						} else if (status === 1) {
							cOptIndex = [ 0, 1, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
					} else {
						if (status === 6) {
							cOptIndex = [ 0, 1 ];
						} else if (status === 1) {
							cOptIndex = [ 0, 1, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
					}
					// if (status === 5) {
					//     cOptIndex = cOptIndex.concat([3, 4]);
					// }
					if ([ 6, 7, 8 ].includes(record.status)) {
						cOptIndex = cOptIndex.concat(3);
					}
					let cOpts = [];
					for (let index = 0; index < cOptIndex.length; index++) {
						const item = cOptIndex[index];
						cOpts.push(opts[item]);
						if (index !== cOptIndex.length - 1) cOpts.push(<Divider type="vertical" />);
					}
					return <span>{cOpts} </span>;
				}
			}
		];
		this.state = {
			pageType: null,
			tableData: [],
			cRecordId: null
		};
	}

	componentDidMount() {
		if (this.props.params && this.props.params.pageType) {
			this.setState({ pageType: 'add' });
		} else {
			this.setState({ pageType: 'list' });
		}
	}

	setStateData = (k, v) => {
		this.setState({ [k]: v });
	};

	backList = () => this.setState({ pageType: 'list' });

	render() {
		const { pageType, cRecordId } = this.state;
		if (pageType === 'list') {
			const { tableData, backDetail, backDetailModal } = this.state;
			let backDetailDOM = [];
			if (backDetail) {
				const { level } = this.props.curUser;

				let preReason = backDetail.filter((item) => item.backlevel === level - 1);
				let curReason = backDetail.filter((item) => item.backlevel === level);
				// if (preReason) {
				// 	preReason.forEach((item) => {
				// 		backDetailDOM.push(
				// 			<div style={{ marginBottom: 20 }}>
				// 				<div>{'上级退回理由 :' + item.content}</div>
				// 				<div>{'退回人 : ' + item.uname}</div>
				// 				<div>{'退回时间 : ' + formatDate(item.backtime)}</div>
				// 			</div>
				// 		);
				// 	});
				// }
				// if (backDetailDOM.length > 0) {
				// 	backDetailDOM.push(<hr style={{ height: 1, border: 'none', borderTop: '1px solid #555555' }} />);
				// }
				if (curReason) {
					curReason.forEach((item) => {
						backDetailDOM.push(
							<div style={{ marginBottom: 20 }}>
								<div>{'上级退回理由 :' + item.content}</div>
								<div>{'退回人 : ' + item.uname}</div>
								<div>{'退回时间 : ' + formatDate(item.backtime)}</div>
							</div>
						);
					});
				}
			}
			return (
				<div>
					<ReportListPage
						setStateData={this.setStateData}
						openAdd={() => {
							this.setState({ pageType: 'add' });
						}}
						params={this.props.params && this.props.params.agreementid}
					/>
					<div className="list-table">
						<Table
							pagination={{ showSizeChanger: true }}
							columns={this.columns}
							dataSource={tableData}
							scroll={{ x: 10 }}
						/>
					</div>
					<Modal
						title="退回理由查询"
						closable={false}
						footer={
							<Button key="back" type="primary" onClick={() => this.setState({ backDetailModal: false })}>
								关闭
							</Button>
						}
						visible={backDetailModal}
						okText={'关闭'}
					>
						{backDetailDOM}
					</Modal>
				</div>
			);
		} else {
			return (
				<ReportCard
					pageType={pageType}
					backList={this.backList}
					curUser={this.props.curUser}
					recordId={cRecordId}
					params={this.props.params && this.props.params.agreementid}
				/>
			);
		}
	}
}
