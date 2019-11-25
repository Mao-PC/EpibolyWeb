import React, { Component } from 'react';
import { Form, DatePicker, Select, Button, Table, Row, Col, TreeSelect } from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;

import { initAllDic, initOrgSelectTree } from '../../comUtil';

import './pam-index.css';

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
		initAllDic.call(this, [ 'hzjgssdq', 'yyhzfs' ]);
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

	render() {
		const { hzjgssdq, yyhzfs, areaTreeSelect } = this.state;
		return (
			<Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
				<Row gutter={24}>
					<Col span={12}>
						<Item label="上报时间段">
							<RangePicker placeholder={[ '开始时间', '结束时间' ]} />
						</Item>
					</Col>
					<Col span={12}>
						<Item label="合作机构所属地区">
							<Select className="seletItem">{hzjgssdq}</Select>
						</Item>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<Item label="所属行政部门">
							<TreeSelect className="seletItem" treeData={areaTreeSelect} />
						</Item>
					</Col>
					<Col span={12}>
						<Item label="协议合作方式">
							<Select className="seletItem">{yyhzfs}</Select>
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
		this.allStatus = [ '未提交 ', '待县级审核 ', '待市级复核 ', '待省级终审 ', '终审通过 ', '县级审核不通过 ', '市级复核不通过 ', '省级终审不通过' ];
		this.columns = [
			{
				title: '序号',
				dataIndex: 'no',
				key: 'no',
				fixed: 'left',
				width: 120,
				render: (text, record, index) => index
			},
			{
				title: '所属行政部门',
				dataIndex: 'dept',
				key: 'dept',
				width: 150
			},
			{
				title: '上报医疗机构统一社会信用代码证',
				dataIndex: ' institutionCode',
				key: 'institutionCode',
				width: 150
			},
			{
				title: '上报医疗机构名称',
				dataIndex: ' institutionName',
				key: 'institutionName',
				width: 150
			},
			{
				title: '填报人姓名',
				dataIndex: 'applicantName',
				key: 'applicantName',
				width: 150
			},
			{
				title: '填报人办公电话',
				dataIndex: 'applicantTel',
				key: 'applicantTel',
				width: 150
			},
			{
				title: '合作机构所属地区',
				dataIndex: 'PartnerRegion',
				key: 'PartnerRegion',
				width: 150
			},
			{
				title: '京津合作机构名称',
				dataIndex: 'PartnerName',
				key: 'PartnerName',
				width: 150
			},
			{
				title: '合作项目/协议名称',
				dataIndex: 'agreement',
				key: 'agreement',
				width: 150
			},
			{
				title: '合作时间',
				dataIndex: 'cooperationTime',
				key: 'cooperationTime',
				width: 150
			},
			{
				title: '合作方式',
				dataIndex: 'cooperationType',
				key: 'cooperationType',
				width: 150
			},
			{
				title: '上报时间',
				dataIndex: 'ReportTime',
				key: 'ReportTime',
				width: 150
			},
			{
				title: '审核状态',
				dataIndex: 'status',
				key: 'status',
				width: 150,
				render: (text, record) => this.allStatus[record.status ? record.status : 0]
			},
			{
				title: '操作',
				dataIndex: 'opt',
				key: 'opt',
				fixed: 'right',
				width: 150
				// render: (text, record, index) => index
			}
		];
		this.state = {
			tableData: []
		};
	}

	componentDidMount() {
		this.setState({ tableData: this.getTableData() });
	}

	getTableData = () => {
		return [ { dept: 'xxxx', status: 0 }, { dept: 'xxxx2', status: 3 } ];
	};

	render() {
		const { tableData } = this.state;
		return (
			<div>
				<WrappedASListPage />
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
	}
}
