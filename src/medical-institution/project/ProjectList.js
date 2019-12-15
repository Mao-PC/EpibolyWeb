import React, { Component } from 'react';
import { Form, DatePicker, Modal, Select, Button, Table, Divider, Row, Col, Input, notification } from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, initOrgSelectTree, formatDate } from '../../comUtil';

import ProjectCard from './ProjectCard';
import Axios from 'axios';
import moment from 'moment';

/**
 * 合作项目协议
 */
class ProjectListPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hzjgssdq: [],
			yyhzfs: [],
			shzt: [],
			ylhzxmxycx: [],
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
		initAllDic.call(this, [ 'hzjgssdq', 'yyhzfs', 'shzt', 'ylhzxmxycx' ]);
		initOrgSelectTree.call(this);
		setTimeout(() => {
			this.queryData.call(this, { preventDefault: () => {} });
		}, 0);
	}

	queryData = (e) => {
		e.preventDefault();
		Axios.post('/ylws/agreement/selectAgreeMentAll', this.state.data).then((res) => {
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

	handleReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { hzjgssdq, yyhzfs, shzt, ylhzxmxycx, data } = this.state;
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
							</Select>
						</Item>
					</Col>
					{/* <Col span={8}>
						<Item label="所属行政部门">
							<TreeSelect
								allowClear
								treeData={areaTreeSelect}
								onChange={(value) => this.setState({ data: { ...data, orgId: value } })}
							/>
						</Item>
					</Col> */}

					<Col span={8}>
						<Item label="协议合作方式">
							<Select
								className="seletItem"
								onSelect={(value) => this.setState({ data: { ...data, collaborationtype: value } })}
							>
								{yyhzfs}
							</Select>
						</Item>
					</Col>
					<Col span={8}>
						<Item label="审核状态">
							<Select
								className="seletItem"
								onSelect={(value) => this.setState({ data: { ...data, checkstatus: value } })}
							>
								{shzt}
							</Select>
						</Item>
					</Col>
					<Col span={16}>
						<Input.Group compact>
							<div style={{ width: '100%' }}>
								<div style={{ float: 'left', width: '10%', textAlign: 'right', marginRight: 10 }}>
									<label className="query-div">查询条件: </label>
								</div>
								<Select
									style={{ float: 'left', width: '29%', marginLeft: 37 }}
									onSelect={(value) => this.setState({ data: { ...data, type: value } })}
								>
									{ylhzxmxycx}
								</Select>
								<Input
									onChange={(e) => this.setState({ data: { ...data, value: e.target.value } })}
									style={{ width: 250 }}
								/>
							</div>
						</Input.Group>
					</Col>
					<div style={{ textAlign: 'right', paddingRight: 50 }}>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
						<Button
							type="primary"
							style={{ margin: '0 8px' }}
							onClick={() => {
								this.props.openAdd();
								this.props.setStateData('recordId', null);
							}}
						>
							新增合作协议上报
						</Button>
					</div>
				</Row>
			</Form>
		);
	}
}

// const WrappedProjectListPage = Form.create({ name: 'ProjectListPage' })(ProjectListPage);

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
				title: '合作项目/协议名称',
				dataIndex: 'agreementname',
				key: 'agreementname',
				width: 200
			},
			{
				title: '填报人姓名',
				dataIndex: 'name',
				key: 'name',
				width: 200
			},
			{
				title: '填报人办公电话',
				dataIndex: 'telephone',
				key: 'telephone',
				width: 200
			},
			{
				title: '京津合作机构名称',
				dataIndex: 'agreeOrgName',
				width: 200,
				key: 'agreeOrgName'
			},

			{
				title: '合作时间',
				key: 'agreementname',
				width: 250,
				render: (record, index) => {
					return formatDate(record.agreestart, 1) + ' ~ ' + formatDate(record.agreeend, 1);
				}
			},
			{
				title: '合作方式',
				dataIndex: 'agreetypeNames',
				key: 'agreetypeNames',
				width: 200
			},
			{
				title: '上报时间',
				dataIndex: 'ylwscreate',
				key: 'ylwscreate',
				width: 200,
				render: (ylwscreate) => formatDate(ylwscreate)
			},
			{
				title: '审核状态',
				key: 'statusName',
				width: 200,
				dataIndex: 'statusName'
			},
			{
				title: '操作',
				key: 'opt',
				width: 300,
				fixed: 'right',
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
										Axios.post('/ylws/agreement/delAgreeMent', data).then((res) => {
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
						<a onClick={() => this.props.changePage(2, { pageType: 'add', agreementid: record.id })}>月报</a>,
						<a onClick={() => this.props.changePage(2, { agreementid: record.id })}>查月报</a>,
						<a
							onClick={() => {
								let data = new FormData();
								data.append('id', record.id);
								data.append('type', 0);
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

					// opts 0 详情, 1 修改, 2 删除, 3 月报, 4 查月报, 5查看退回理由
					let cOptIndex = [];

					//审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
					const { status, agreestart, agreeend } = record;
					const {level,medicalorgId} = this.props.curUser;
					if (level === 1) {
						if (status !== 5) {
							if (medicalorgId) {
								if (record.status === 8) {
									cOptIndex = [ 0,1];
								} else {
									cOptIndex = [ 0 ];
								}
							} else {
								cOptIndex = [ 0, 1, 2 ];
							}
						} else {
							cOptIndex = [ 0 ];
						}
                        if (record.status === 8) cOptIndex.push(5)
					} else if (level === 2) {
						if (status === 7) {
							cOptIndex = [ 0, 1 ];
						} else if (status === 1) {
							cOptIndex = [ 0, 1, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
                        if ([7,8].includes(record.status)) cOptIndex.push(5)
					} else {
						if (status === 6) {
							cOptIndex = [ 0, 1 ];
						} else if (status === 1) {
							cOptIndex = [ 0, 1, 2 ];
						} else {
							cOptIndex = [ 0 ];
						}
                        if ([6,7].includes(record.status)) cOptIndex.push(5)
					}

					if (status === 5) {
						console.log(moment().valueOf());
						let cTime = parseInt(moment().valueOf() / (1000 * 60 * 60 * 24), 10);
						cOptIndex = cOptIndex.concat(
							cTime >= parseInt(agreestart / (1000 * 60 * 60 * 24), 10) &&
							cTime <= parseInt(agreeend / (1000 * 60 * 60 * 24), 10)
								? [ 3, 4 ]
								: [ 4 ]
						);
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
			pageType: 'list',
			tableData: [],
			cRecordId: null
		};
	}

	setStateData = (k, v) => {
		this.setState({ [k]: v });
	};

	backList = () => this.setState({ pageType: 'list' });

	render() {
		const { pageType, cRecordId, backDetail, backDetailModal } = this.state;
		if (pageType === 'list') {
			const { tableData } = this.state;
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
					<ProjectListPage
						setStateData={this.setStateData}
						openAdd={() => {
							this.setState({ pageType: 'add' });
						}}
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
						// closable={false}
						footer={
							<Button key="back" type="primary" onClick={() => this.setState({ backDetailModal: false })}>
								关闭
							</Button>
						}
						visible={backDetailModal}
						okText={'关闭'}
						onCancel={() => this.setState({ backDetailModal: false })}
					>
						{backDetailDOM}
					</Modal>
				</div>
			);
		} else {
			return (
				<ProjectCard
					pageType={pageType}
					backList={this.backList}
					curUser={this.props.curUser}
					recordId={cRecordId}
				/>
			);
		}
	}
}
