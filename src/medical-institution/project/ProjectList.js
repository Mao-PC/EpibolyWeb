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
	TreeSelect,
	notification
} from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

import { initAllDic, initOrgSelectTree, formatDate } from '../../comUtil';

import ProjectCard from './ProjectCard';
import Axios from 'axios';

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
		initAllDic.call(this, [ 'hzjgssdq', 'yyhzfs', 'shzt' ], [ 'ylhzxmxycx' ]);
		initOrgSelectTree.call(this);
	}

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

	handleReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { hzjgssdq, yyhzfs, shzt, ylhzxmxycx, areaTreeSelect, data } = this.state;
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
					<Col span={8}>
						<Item label="所属行政部门">
							<TreeSelect
								allowClear
								treeData={areaTreeSelect}
								onSelect={(value) => this.setState({ data: { ...data, orgId: value } })}
							/>
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
							<Item label="查询条件">
								<Select
									style={{ width: 120 }}
									onSelect={(value) => this.setState({ data: { ...data, type: value } })}
								>
									{ylhzxmxycx}
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
					</Col>
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
				dataIndex: 'agreementname',
				width: 200,
				key: 'agreementname'
			},

			{
				title: '合作时间',
				key: 'agreementname',
				width: 200,
				render: (record, index) => {
					return formatDate(record.agreestart, 1) + ' ~ ' + formatDate(record.agreeend, 1);
				}
			},
			{
				title: '合作方式',
				dataIndex: 'agreeOrgName',
				key: 'agreeOrgName',
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
				width: 200,
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
											if (res.data && res.data.header.code === '1000') {
												notification.success({ message: '删除成功' });
												setTimeout(() => location.reload(), 1000);
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
						<a>月报</a>,
						<a>查月报</a>
					];

					// opts 0 详情, 1 修改, 2 删除, 3 月报, 4 查月报
					let cOptIndex = [];

					//审核状态：1、未提交 2、待县级审核 3、待市级复核 4、待省级终审 5、终审通过 6、县级审核不通过 7、市级复核不通过 8、省级终审不通过
					switch (record.status) {
						case 1:
							cOptIndex = [ 0, 1, 2 ];
							break;
						case 2:
						case 3:
						case 4:
							cOptIndex = [ 0 ];
							break;
						case 5:
							cOptIndex = [ 0, 3, 4 ];
							break;
						case 6:
						case 7:
						case 8:
							cOptIndex = [ 0, 1 ];
							break;

						default:
							break;
					}

					if (this.props.curUser.level === 1) {
						cOptIndex = [ 0, 1, 2 ];
						if (record.status === 5) cOptIndex = cOptIndex.concat([ 4, 5 ]);
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
		const { pageType, cRecordId } = this.state;
		if (pageType === 'list') {
			const { tableData } = this.state;
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
							scroll={{ x: 10, y: 300 }}
						/>
					</div>
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
