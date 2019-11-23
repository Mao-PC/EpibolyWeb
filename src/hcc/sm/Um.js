import React, { Component } from 'react';
import { Tree, Modal, Button, Table, Divider, notification } from 'antd';

import Save from './UmSave';

import './sm-index.css';

import { initOrgTreeNodes, formatDate, resetModal } from '../../comUtil';
import Axios from 'axios';

const { confirm } = Modal;

/**
 * 用户管理
 */
export default class List extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id'
			},
			{
				title: '登录名',
				dataIndex: 'username',
				key: 'username'
			},
			{
				title: '所属行政部门',
				dataIndex: 'orgName',
				key: 'orgName'
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone'
			},
			{
				title: '创建时间',
				dataIndex: 'ylwscreate',
				key: 'ylwscreate',
				render: (value) => {
					return formatDate(value);
				}
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render: (value) => {
					return <span>{value === 0 ? '正常' : '冻结'}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'opt',
				key: 'opt',
				render: (value, record, index) => (
					<span>
						<a
							onClick={() => {
								this.userData = this.state.tableData[index];

								this.setState({ pageType: 'edit' });
							}}
						>
							编辑
						</a>
						<Divider type="vertical" />
						<a
							onClick={() => {
								this.selectedRowKeys = [ index ];
								this.setState({ visible: true });
							}}
						>
							重置密码
						</a>
					</span>
				)
			}
		];
		this.cNode = {};
		// 选中的行
		this.selectedRowKeys = [];
		// 用户数据
		this.userData = {};
		this.state = {
			pageType: 'list',
			areaTree: [],
			tableData: [],
			visible: false,
			pwderror: null,
			pwd2error: null,
			pwd: null,
			pwd2: null,
			old_pwd: null
		};
	}

	componentDidMount() {
		initOrgTreeNodes.call(this);
	}

	backList() {
		this.setState({ pageType: 'list' });
	}

	/**
     * 点击树节点获取table数据
     */
	onSelect = (selectedKeys, info) => {
		let data = new FormData();
		data.append('orgId', selectedKeys[0]);
		Axios.post('/ylws/user/selectUserListByOrg', data)
			.then((req) => {
				if (req.data && req.data.header.code === '1000') {
					this.setState({ tableData: req.data.body.data });
				} else {
					notification.error({ message: req.data.header.msg });
				}
			})
			.catch((e) => console.log(e));
	};

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		}
	};

	render() {
		const { pageType } = this.state;
		if (pageType === 'list') {
			const { areaTree, tableData } = this.state;
			return (
				<div style={{ height: '100%' }}>
					<div className="imm-areaTree">
						<Tree onSelect={this.onSelect}>{areaTree}</Tree>
					</div>
					<div className="listArea">
						<div style={{ float: 'right', margin: 30 }}>
							<Button
								type="primary"
								className="buttonClass"
								onClick={() => {
									this.userData = {};
									this.setState({ pageType: 'add' });
								}}
							>
								添加
							</Button>
							<Button
								type="primary"
								className="buttonClass"
								onClick={() => {
									if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
										this.userData = tableData[this.selectedRowKeys[0]];
										this.setState({ pageType: 'edit' });
									} else {
										this.userData = {};
										notification.info({ message: '请选择要修改的数据' });
									}
								}}
							>
								修改
							</Button>
							<Button
								type="primary"
								className="buttonClass"
								onClick={() => {
									if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
										confirm.call(this, {
											title: '确定要删除所选吗 ?',
											// content: 'Some descriptions',
											okText: '确认',
											okType: 'danger',
											cancelText: '取消',
											onOk: () => {
												console.log(this.selectedRowKeys);
												let data = new FormData();
												data.append('ids', this.selectedRowKeys.map((i) => tableData[i].id));

												Axios.post('/ylws/user/delUserBatch', data)
													.then((req) => {
														if (req.data && req.data.header.code === '1000') {
															notification.success({ message: '删除数据成功' });
															setTimeout(() => location.reload(), 1000);
														} else {
															notification.error({ message: req.data.header.msg });
														}
													})
													.catch((e) => console.log(e));
											},
											onCancel() {
												console.log('Cancel');
											}
										});
									} else {
										notification.info({ message: '请选择要删除的数据' });
									}
								}}
							>
								删除
							</Button>
							<Button
								type="primary"
								className="buttonClass"
								onClick={() => {
									if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
										this.setState({ visible: true });
									} else {
										notification.info({ message: '请选择重置密码的数据' });
									}
								}}
							>
								重置密码
							</Button>
						</div>
						<div className="list-table">
							<Table
								style={{ paddingTop: 50 }}
								columns={this.columns}
								dataSource={tableData}
								rowSelection={{
									onChange: (selectedRowKeys, selectedRows) => {
										this.selectedRowKeys = selectedRowKeys;
									}
								}}
							/>
						</div>
					</div>
					{resetModal.call(this)}
				</div>
			);
		} else {
			return <Save pageType={pageType} backList={this.backList.bind(this)} userData={this.userData} />;
		}
	}
}
