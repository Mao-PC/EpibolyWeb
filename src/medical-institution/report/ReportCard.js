import React, { Component } from 'react';
import moment from 'moment';
import {
	Form,
	Input,
	Modal,
	Select,
	Button,
	DatePicker,
	Table,
	Divider,
	notification,
	Row,
	Col,
	InputNumber,
	Icon
} from 'antd';
import Axios from 'axios';
import './index.css';

import { initAllDic, formatDate } from '../../comUtil';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { Item } = Form;
const { confirm } = Modal;

const dateFormat = 'YYYY-MM-DD';
const dateFormat1 = 'YYYY-MM';

class AgreementCardPage extends Component {
	constructor(props) {
		super(props);
		this.type = null;
		this.commit = false;
		this.state = {
			buttons: [],
			newTecModal: false,
			newDepModal: false,
			expertModal: false,
			trainModal: false,
			medModal: false,
			agreements: [],
			telData: [],
			trainData: [],
			expertData: [],
			newDepData: [],
			medData: [],
			cTelData: {},
			cTrainData: {},
			cExpertData: {},
			cNewDepData: {},
			cMedData: {},
			pzxs: [],
			ycyldmd: [],
			buttonsStatus: false,
			data: {
				// 上报医疗机构名称
				medicalname: null,
				// 协议id
				agreementid: null,
				//月份yyyy-MM 例如2019-11
				morth: formatDate(moment().month(moment().month() - 1).startOf('month'), 2),
				//填报人姓名
				preparername: null,
				//填报人办公电话
				preparertelephone: null,
				//填报人手机号
				preparerphone: null,
				//本月总门诊人次
				outpatientnum: null,
				//本月总住院人次
				hospitalizationnum: null,
				//本月总手术例数
				operationnum: null,
				//本月对上转诊人次
				referralnum: null
			}
		};
	}

	componentDidMount() {
		console.log(moment().month(moment().month()).endOf('month'));
		initAllDic.call(this, null, [ 'pzxs', 'ycyldmd' ]);
		let data = new FormData();
		if (!this.props.recordId) {
			data.append('userId', this.props.curUser.id);
			Axios.post('/ylws/morthtable/addMorthtablePre', data)
				.then((res) => {
					if (res.data) {
						if (res.data.header.code === '1003') {
							notification.error({ message: '登录过期, 请重新登录' });
							setTimeout(() => {
								this.props.history.push({ pathname: '/' });
							}, 1000);
							return;
						}
						if (res.data.header.code === '1000') {
							let cData = res.data.body.data[0];

							this.setState({
								data: { ...this.state.data, ...cData, agreementid: this.props.params },
								agreements:
									cData.agreeMents &&
									cData.agreeMents.map((item) => {
										return (
											<Option key={item.id} value={item.id}>
												{item.agreementname}
											</Option>
										);
									})
							});
						} else {
							notification.error({ message: res.data.header.msg });
						}
					} else {
						notification.error({ message: res.data.header.msg });
					}
				})
				.catch((e) => console.log(e));
		} else {
			Axios.post('/ylws/agreement/selectAgreeMentOption')
				.then((res) => {
					if (res.data) {
						if (res.data.header.code === '1003') {
							notification.error({ message: '登录过期, 请重新登录' });
							setTimeout(() => {
								this.props.history.push({ pathname: '/' });
							}, 1000);
							return;
						}
						if (res.data.header.code === '1000') {
							let agreeMents = res.data.body.data;

							this.setState({
								agreements:
									agreeMents &&
									agreeMents.map((item) => {
										return (
											<Option key={item.id} value={item.id}>
												{item.agreementname}
											</Option>
										);
									})
							});
						} else {
							notification.error({ message: res.data.header.msg });
						}
					} else {
						notification.error({ message: res.data.header.msg });
					}
				})
				.catch((e) => console.log(e));
		}

		setTimeout(() => {
			if (this.props.recordId) {
				let data = new FormData();
				data.append('id', this.props.recordId);
				Axios.post('/ylws/morthtable/selectMorthtableById', data)
					.then((res) => {
						if (res.data) {
							if (res.data.header.code === '1003') {
								notification.error({ message: '登录过期, 请重新登录' });

								setTimeout(() => {
									this.props.history.push({ pathname: '/' });
								}, 1000);
								return;
							}

							if (res.data.header.code === '1000') {
								let resData = res.data.body.data[0];
								this.setState({
									data: { ...this.state.data, ...resData },
									telData: resData.technologies,
									trainData: resData.trains,
									expertData: resData.diagnoses,
									newDepData: resData.departmentnews,
									medData: resData.remotemedicals
								});
								this.props.form.setFieldsValue({ preparername: resData.preparername });
								this.props.form.setFieldsValue({ agreementid: resData.agreementid });
								this.props.form.setFieldsValue({ preparertelephone: resData.preparertelephone });
								this.props.form.setFieldsValue({ preparerphone: resData.preparerphone });
							} else {
								notification.error({ message: res.data.header.msg });
							}
						} else {
							notification.error({ message: res.data.header.msg });
						}
					})
					.catch((e) => console.log(e));
			} else {
				this.props.params && this.props.form.setFieldsValue({ agreementid: this.props.params });
			}
		}, 0);
	}

	saveRport = (e) => {
		e.preventDefault();

		this.props.form.validateFields.call(this, (err, values) => {
			if (!err) {
				setTimeout(() => {
					let data = this.state.data;
					data.technologies = this.state.telData;
					data.departmentnews = this.state.newDepData;
					data.diagnoses = this.state.expertData;
					data.trains = this.state.trainData;
					data.remotemedicals = this.state.medData;
					data.userId = this.props.curUser.id;
					data.type = this.type;
					console.log(data);
					// return;
					Axios.post(
						this.props.pageType === 'edit'
							? '/ylws/morthtable/modifyMorthtable'
							: '/ylws/morthtable/addMorthtable',
						data
					)
						.then((res) => {
							if (res.data) {
								if (res.data.header.code === '1003') {
									notification.error({ message: '登录过期, 请重新登录' });
									setTimeout(() => {
										this.props.history.push({ pathname: '/' });
									}, 1000);
									return;
								}
								if (res.data.header.code === '1000') {
									this.setState({ data: { ...this.state.data, ...res.data.body.data[0] } });
									notification.success({ message: this.type === 0 ? '保存月报成功' : '保存并提交月报成功' });
									setTimeout(() => location.reload(), 1000);
								} else {
									notification.error({ message: res.data.header.msg });
									setTimeout(() => {
										this.setState({ buttonsStatus: false });
									}, 20);
								}
							} else {
								setTimeout(() => {
									this.setState({ buttonsStatus: false });
								}, 20);

								notification.error({ message: res.data.header.msg });
							}
						})
						.catch((e) => console.log(e));
				}, 0);
			} else {
				setTimeout(() => {
					this.setState({ buttonsStatus: false });
				}, 20);
			}
		});
	};

	render() {
		const { pageType } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { buttonsStatus } = this.state;
		let buttons = [];
		if (pageType === 'add' || pageType === 'edit') {
			// nc
			buttons.push(
				<Button
					disabled={buttonsStatus}
					type="primary"
					htmlType="submit"
					style={{ margin: '20px 20px', left: '20%' }}
					onClick={() => {
						this.type = 0;
						this.commit = false;
						setTimeout(() => {
							this.setState({ buttonsStatus: true });
						}, 0);
					}}
				>
					                    {this.props.curUser.level !== 1 ? '保存草稿' : '保存'}
				</Button>
			);
		}

        if (this.props.curUser.level !== 1 && (pageType === 'add' || pageType === 'edit')) {
			buttons.push(
				<Button
					disabled={buttonsStatus}
					type="primary"
					htmlType="submit"
					style={{ margin: '20px 20px', left: pageType === 'add' ? '40%' : '20%' }}
					onClick={() => {
						this.type = 1;
						this.commit = true;
						setTimeout(() => {
							this.setState({ buttonsStatus: true });
						}, 0);
					}}
				>
					保存并提交审核
				</Button>
			);
		}

		buttons.push(
			<Button
				disabled={buttonsStatus}
				type="primary"
				style={{ margin: '20px 20px', left: pageType === 'add' ? '60%' : '40%' }}
				onClick={() => {
					this.props.backList();
				}}
			>
				返回
			</Button>
		);
		// this.setState({ buttons });
		let {
			data,
			newTecModal,
			newDepModal,
			expertModal,
			trainModal,
			medModal,
			// buttons,
			agreements,
			telData,
			trainData,
			expertData,
			newDepData,
			medData,
			cTelData,
			cTrainData,
			cExpertData,
			cNewDepData,
			cMedData,
			pzxs,
			ycyldmd
		} = this.state;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			}
		};
		const newTelCol = [
			{ dataIndex: 'department', key: 'department', title: '专业科室' },
			{ dataIndex: 'technique', key: 'technique', title: '技术名称' },
			{
				dataIndex: 'opt',
				key: 'opt',
				title: '操作',
				render: (opt, record, index) => {
					return (
						<span>
							<a
								onClick={() =>
									confirm({
										title: '确定要删除该行数据吗 ?',
										// content: 'Some descriptions',
										okText: '确认',
										okType: 'danger',
										cancelText: '取消',
										onOk: () => {
											delete telData[index];
											telData = telData.filter((data) => data);
											this.setState({ telData });
										},
										onCancel() {
											console.log('Cancel');
										}
									})}
							>
								删除
							</a>
							<Divider type="vertical" />
							<a onClick={() => this.setState({ newTecModal: true })}>添加</a>
						</span>
					);
				}
			}
		];
		const newDepCol = [
			{ dataIndex: 'departmentnew', key: 'departmentnew', title: '科室名称' },
			{
				dataIndex: 'opt',
				key: 'opt',
				title: '操作',
				render: (opt, record, index) => {
					return (
						<span>
							<a
								onClick={() =>
									confirm({
										title: '确定要删除该科室吗 ?',
										// content: 'Some descriptions',
										okText: '确认',
										okType: 'danger',
										cancelText: '取消',
										onOk: () => {
											delete newDepData[index];
											newDepData = newDepData.filter((data) => data);
											this.setState({ newDepData });
										},
										onCancel() {
											console.log('Cancel');
										}
									})}
							>
								删除
							</a>
							<Divider type="vertical" />
							<a onClick={() => this.setState({ newDepModal: true })}>添加</a>
						</span>
					);
				}
			}
		];
		const expertCol = [
			{ dataIndex: 'expertname', key: 'expertname', title: '专家姓名', 
			// width: 150
		 },
			{
				dataIndex: 'accreditName',
				key: 'accreditName',
				title: '派驻形式',
				// width: 150
			},
			{
				key: 'time',
				title: '坐诊时间',
				// width: 250,
				render: (time, record, index) => {
					if (record.diagnosistart) {
						return formatDate(record.diagnosistart, 1) + ' ~ ' + formatDate(record.diagnosisend, 1);
					} else {
						return '';
					}
				}
			},
			{
				dataIndex: 'num',
				key: 'num',
				title: '诊疗患者人次',
				// width: 250,
				render: (num, record, index) => {
					const { outpatient, hospitalization, operation, other } = record;
					return (
						<span>
							{' '}
							门诊：{outpatient ? outpatient : 0} 住院：{hospitalization ? hospitalization : 0} 手术：{operation ? operation : 0}{' '}
							其他：{other ? other : 0}
						</span>
					);
				}
			},
			{
				dataIndex: 'opt',
				key: 'opt',
				title: '操作',
				// width: 150,
				render: (opt, record, index) => {
					return (
						<span>
							<a
								onClick={() =>
									confirm({
										title: '确定要删除该科室吗 ?',
										// content: 'Some descriptions',
										okText: '确认',
										okType: 'danger',
										cancelText: '取消',
										onOk: () => {
											delete expertData[index];
											expertData = expertData.filter((data) => data);
											this.setState({ expertData });
										},
										onCancel() {
											console.log('Cancel');
										}
									})}
							>
								删除
							</a>
							<Divider type="vertical" />
							<a
								onClick={() => {
									this.setState({
										expertModal: true,
										cExpertData: {
											...cExpertData,
											diagnosistart: formatDate(
												moment().month(moment().month()).startOf('month').valueOf(),
												1
											),
											diagnosisend: formatDate(
												moment().month(moment().month()).endOf('month').valueOf(),
												1
											)
										}
									});
								}}
							>
								添加
							</a>
						</span>
					);
				}
			}
		];
		const trainCol = [
			{ dataIndex: 'trainname', key: 'trainname', title: '培训进修名称', 
			// width: 150 
		},
			{
				dataIndex: 'time',
				key: 'time',
				title: '培训进修时间',
				// width: 250,
				render: (time, record, index) => {
					if (record.trainstart) {
						return formatDate(record.trainstart, 1) + ' ~ ' + formatDate(record.trainend, 1);
					} else {
						return '';
					}
				}
			},
			{ dataIndex: 'traincount', key: 'traincount', title: '培训进修人数', 
			// width: 150 
		},
			{
				dataIndex: 'opt',
				key: 'opt',
				title: '操作',
				// width: 150,
				render: (opt, record, index) => {
					return (
						<span>
							<a
								onClick={() =>
									confirm({
										title: '确定要删除该数据吗 ?',
										// content: 'Some descriptions',
										okText: '确认',
										okType: 'danger',
										cancelText: '取消',
										onOk: () => {
											delete trainData[index];
											trainData = trainData.filter((data) => data);
											this.setState({ trainData });
										},
										onCancel() {
											console.log('Cancel');
										}
									})}
							>
								删除
							</a>
							<Divider type="vertical" />
							<a onClick={() => this.setState({ trainModal: true })}>添加</a>
						</span>
					);
				}
			}
		];
		const medCol = [
			{ dataIndex: 'remoteobjectiveName', key: 'remoteobjectiveName', title: '远程医疗目的', 
			// width: 150 
		},
			{ dataIndex: 'beinvitedname', key: 'beinvitedname', title: '受邀方名称',
			//  width: 150 
			},
			{ dataIndex: 'beinvitecontent', key: 'beinvitecontent', title: '受邀医师姓名及专业', 
			// width: 250 
		},
			{
				dataIndex: 'remotedate',
				key: 'remotedate',
				title: '远程医疗日期',
				// width: 150,
				render: (time) => formatDate(time, 1)
			},
			{
				dataIndex: 'opt',
				key: 'opt',
				title: '操作',
				// width: 150,
				render: (opt, record, index) => {
					return (
						<span>
							<a
								onClick={() =>
									confirm({
										title: '确定要删除该科室吗 ?',
										// content: 'Some descriptions',
										okText: '确认',
										okType: 'danger',
										cancelText: '取消',
										onOk: () => {
											delete medData[index];
											medData = medData.filter((data) => data);
											this.setState({ medData });
										},
										onCancel() {
											console.log('Cancel');
										}
									})}
							>
								删除
							</a>
							<Divider type="vertical" />
							<a onClick={() => this.setState({ medModal: true })}>添加</a>
						</span>
					);
				}
			}
		];
		return (
			<div style={{ margin: '40px 20px' }}>
				<Form {...formItemLayout} onSubmit={this.saveRport}>
					<h1 style={{ marginBottom: 20 }}>
						<strong>合作业务开展情况月报</strong>
					</h1>
					<div style={{ paddingLeft: 50 }}>
						<Item label="上报医疗机构名称" className="add-form-item">
							{data.medicalname}
						</Item>
						<Item label="选择已签署的项目/协议" className="add-form-item">
							{getFieldDecorator('agreementid', {
								rules: [ { required: true, message: '请选择已签署的项目/协议' } ]
							})(
								<Select
									// value={data.agreementid}
									onChange={(e) => {
										this.setState({
											data: { ...data, agreementid: e }
										});
									}}
								>
									{agreements}
								</Select>
							)}
						</Item>
						<Item label="上报月份" className="add-form-item">
							<MonthPicker
								placeholder="请选择月份"
								// defaultValue={moment().month(moment().month() - 1).startOf('month')}
								value={
									data.morth ? (
										moment(formatDate(data.morth, 2), dateFormat1)
									) : (
										moment().month(moment().month() - 1).startOf('month')
									)
								}
								onChange={(v, str) => this.setState({ data: { ...data, morth: str } })}
							/>
						</Item>
						<Item label="填报人姓名" className="add-form-item">
							{getFieldDecorator('preparername', { rules: [ { required: true, message: '请输入填报人姓名' } ] })(
								<Input
									onChange={(v) => this.setState({ data: { ...data, preparername: v.target.value } })}
								/>
							)}
						</Item>
						<Item label="填报人办公电话" className="add-form-item">
							{getFieldDecorator('preparertelephone', {
								rules: [ { required: true, message: '请输入填报人电话' } ,
								{ pattern: '^[0-9]+$', message: '请输入正确的办公电话' } ]

							})(
								<Input
									onChange={(v) =>
										this.setState({ data: { ...data, preparertelephone: v.target.value } })}
								/>
							)}
						</Item>
						<Item label="填报人手机号" className="add-form-item">
							{getFieldDecorator('preparerphone', {
								rules: [ { required: true, message: '请输入填报人手机号' },
								{ pattern: '^[1][3,4,5,7,8][0-9]{9}$', message: '请输入正确的手机号码' } ]
							})(
								<Input
									onChange={(v) =>
										this.setState({ data: { ...data, preparerphone: v.target.value } })}
								/>
							)}
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>一、引进新技术</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<Item label="本月引进新技术" className="add-form-item">
							{Boolean((!telData || telData.length === 0) && pageType !== 'card') && (
								<Button
									style={{ marginBottom: 20 }}
									type="primary"
									onClick={() => {
										this.setState({ newTecModal: true });
									}}
								>
									新增引进技术
								</Button>
							)}
							<Table
							style={{overflowX:'hidden'}}
							pagination={false}
								columns={pageType === 'card' ? newTelCol.slice(0, -1) : newTelCol}
								dataSource={telData}
							/>
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>二、新建科室</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<Item label="本月新建科室" className="add-form-item">
							{Boolean((!newDepData || newDepData.length === 0) && pageType !== 'card') && (
								<Button
									style={{ marginBottom: 20 }}
									type="primary"
									onClick={() => {
										this.setState({ newDepModal: true });
									}}
								>
									新增科室
								</Button>
							)}
							<Table
							style={{overflowX:'hidden'}}
								pagination={false}
								columns={pageType === 'card' ? newDepCol.slice(0, -1) : newDepCol}
								dataSource={newDepData}
							/>
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>三、京津专家坐诊</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<Item label="本月专家坐诊" className="add-form-item">
							{Boolean((!expertData || expertData.length === 0) && pageType !== 'card') && (
								<Button
									style={{ marginBottom: 20 }}
									type="primary"
									onClick={() => {
										this.setState({
											expertModal: true,
											cExpertData: {
												...cExpertData,
												diagnosistart: formatDate(
													moment().month(moment().month()).startOf('month').valueOf(),
													1
												),
												diagnosisend: formatDate(
													moment().month(moment().month()).endOf('month').valueOf(),
													1
												)
											}
										});
									}}
								>
									新增专家坐诊
								</Button>
							)}
							<Table
							style={{overflowX:'hidden'}}
							pagination={false}
								columns={pageType === 'card' ? expertCol.slice(0, -1) : expertCol}
								dataSource={expertData}
							/>
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>四、培训进修</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<Item label="本月培训进修" className="add-form-item">
							{Boolean((!trainData || trainData.length === 0) && pageType !== 'card') && (
								<Button
									style={{ marginBottom: 20 }}
									type="primary"
									onClick={() => {
										this.setState({ trainModal: true });
									}}
								>
									新增培训进修
								</Button>
							)}
							<Table
							style={{overflowX:'hidden'}}
							pagination={false}
								columns={pageType === 'card' ? trainCol.slice(0, -1) : trainCol}
								dataSource={trainData}
							/>
							<div>
								<Icon type="info-circle" style={{ paddingRight: 20 }} />进修为本月新派出人员
							</div>
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>五、远程医疗</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<Item label="本月远程医疗" className="add-form-item">
							{Boolean((!medData || medData.length === 0) && pageType !== 'card') && (
								<Button
									style={{ marginBottom: 20 }}
									type="primary"
									onClick={() => {
										this.setState({ medModal: true });
									}}
								>
									新增远程医疗
								</Button>
							)}
							<Table
							style={{overflowX:'hidden'}}
							pagination={false}
								columns={pageType === 'card' ? medCol.slice(0, -1) : medCol}
								dataSource={medData}
							/>
						</Item>
					</div>
					<h1 style={{ margin: '30px 50px' }}>
						<strong>六、服务群众</strong>
					</h1>
					<div style={{ paddingLeft: 80 }}>
						<div className="add-form-item">
							<Row>
								<Col span={12}>
									<Item label="本月总门诊人次：">
										<InputNumber
											value={data.outpatientnum ? data.outpatientnum : 0}
											onChange={(e) => {
												e = isNaN(parseInt(e, 10))
													? 0
													: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0;
												this.setState({ data: { ...data, outpatientnum: e } });
											}}
										/>
									</Item>
								</Col>
								<Col span={12}>
									<Item label="本月总住院人次：" value={data.hospitalizationnum}>
										<InputNumber
											value={data.hospitalizationnum ? data.hospitalizationnum : 0}
											onChange={(e) => {
												e = isNaN(parseInt(e, 10))
													? 0
													: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0;
												this.setState({ data: { ...data, hospitalizationnum: e } });
											}}
										/>
									</Item>
								</Col>
								<Col span={12}>
									<Item label="本月总手术例数：" value={data.operationnum}>
										<InputNumber
											value={data.operationnum ? data.operationnum : 0}
											onChange={(e) => {
												e = isNaN(parseInt(e, 10))
													? 0
													: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0;
												this.setState({ data: { ...data, operationnum: e } });
											}}
										/>
									</Item>
								</Col>
								<Col span={12}>
									<Item label="本月对上转诊人次：" value={data.referralnum}>
										<InputNumber
											value={data.referralnum ? data.referralnum : 0}
											onChange={(e) => {
												e = isNaN(parseInt(e, 10))
													? 0
													: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0;
												this.setState({ data: { ...data, referralnum: e } });
											}}
										/>
									</Item>
								</Col>
							</Row>
						</div>
					</div>

					<Item>{buttons}</Item>
				</Form>
				<Modal
                maskClosable={false}

					title="添加新技术"
					visible={newTecModal}
					okText={'确定'}
					cancelText={'取消'}
					onOk={() => {
						if (!cTelData.department || !cTelData.technique) {
							this.setState({ cTelData: { ...cTelData, click: true } });
							return;
						}
						telData.push(cTelData);
						this.setState({ newTecModal: false, telData, cTelData: { click: false } });
					}}
					onCancel={() => this.setState({ newTecModal: false, cTelData: { click: false } })}
				>
					<div>
						<span className="model-span">专业科室： </span>
						<Input
							className="model-input"
							value={cTelData.department}
							onChange={(e) => this.setState({ cTelData: { ...cTelData, department: e.target.value } })}
						/>
						{cTelData.click && !cTelData.department && <div className="model-error">请输入专业科室</div>}
					</div>
					<div>
						<span className="model-span"> 技术名称： </span>
						<Input
							className="model-input"
							value={cTelData.technique}
							onChange={(e) => this.setState({ cTelData: { ...cTelData, technique: e.target.value } })}
						/>
						{cTelData.click && !cTelData.technique && <div className="model-error">请输入技术名称</div>}
					</div>
				</Modal>
				<Modal
                maskClosable={false}

					title="添加新科室"
					okText={'确定'}
					cancelText={'取消'}
					visible={newDepModal}
					onOk={() => {
						if (!cNewDepData.departmentnew) {
							this.setState({ cNewDepData: { ...cNewDepData, click: true } });
							return;
						}
						newDepData.push(cNewDepData);
						this.setState({ newDepModal: false, newDepData, cNewDepData: {} });
					}}
					onCancel={() => this.setState({ newDepModal: false, cNewDepData: {} })}
				>
					<div>
						<span className="model-span"> 科室名称： </span>
						<Input
							className="model-input"
							value={cNewDepData.departmentnew}
							onChange={(e) => this.setState({ cNewDepData: { departmentnew: e.target.value } })}
						/>
						{cNewDepData.click && !cNewDepData.departmentnew && <div className="model-error">请输入科室名称</div>}
					</div>
				</Modal>
				<Modal
                maskClosable={false}

					title="添加专家坐诊"
					okText={'确定'}
					cancelText={'取消'}
					visible={expertModal}
					onOk={() => {
						if (
							!cExpertData.expertname ||
							!cExpertData.accredit ||
							!cExpertData.diagnosistart ||
							(!cExpertData.outpatient && cExpertData.outpatient !== 0) ||
							(!cExpertData.hospitalization && cExpertData.hospitalization !== 0) ||
							(!cExpertData.operation && cExpertData.operation !== 0) ||
							(!cExpertData.other && cExpertData.other !== 0)
						) {
							this.setState({ cExpertData: { ...cExpertData, click: true } });
							return;
						}
						if (
							cExpertData.outpatient === 0 &&
							cExpertData.hospitalization === 0 &&
							cExpertData.operation === 0 &&
							cExpertData.other === 0
						) {
							return;
						}
						expertData.push(cExpertData);
						this.setState({ expertModal: false, expertData, cExpertData: {} });
					}}
					onCancel={() => this.setState({ expertModal: false, cExpertData: {} })}
				>
					<div>
						<span className="model-span"> 专家姓名： </span>
						<Input
							className="model-input"
							value={cExpertData.expertname}
							onChange={(e) =>
								this.setState({ cExpertData: { ...cExpertData, expertname: e.target.value } })}
						/>
						{cExpertData.click && !cExpertData.expertname && <div className="model-error">请输入专家姓名</div>}
					</div>
					<div>
						<span className="model-span"> 派驻形式： </span>
						<Select
							className="model-input"
							value={cExpertData.accredit}
							onChange={(e, node) => {
								this.setState({
									cExpertData: { ...cExpertData, accredit: e, accreditName: node.props.children }
								});
							}}
						>
							{pzxs}
						</Select>
						{cExpertData.click && !cExpertData.accredit && <div className="model-error">请选择派驻形式</div>}
					</div>
					<div>
						<span className="model-span"> 坐诊时间： </span>
						<RangePicker
							style={{ width: 200 }}
							placeholder={[ '起始时间', '终止时间' ]}
							value={
								Boolean(cExpertData.diagnosistart && cExpertData.diagnosisend) ? (
									[
										moment(formatDate(cExpertData.diagnosistart, 1), dateFormat),
										moment(formatDate(cExpertData.diagnosisend, 1), dateFormat)
									]
								) : (
									//  [moment().month(moment().month()).startOf('month'),moment().month(moment().month()).endOf('month')]
									[]
								)
							}
							onChange={(e, str) => {
								console.log(e, str);
								this.setState({
									cExpertData: { ...cExpertData, diagnosistart: str[0], diagnosisend: str[1] }
								});
							}}
						/>
						{cExpertData.click && !cExpertData.diagnosistart && <div className="model-error">请选择坐诊时间</div>}
					</div>

					<div>
						<span className="model-span" style={{ marginTop: 20, width: 100 }}>
							{' '}
							诊疗患者人次：{' '}
						</span>
						<div className="model-input" />
						<span className="model-span"> 门诊： </span>
						<InputNumber
							className="model-input"
							value={cExpertData.outpatient}
							onChange={(e) =>
								this.setState({
									cExpertData: {
										...cExpertData,
										outpatient: isNaN(parseInt(e, 10))
											? 0
											: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0
									}
								})}
						/>
						{cExpertData.click &&
						cExpertData.outpatient !== 0 &&
						!cExpertData.outpatient && <div className="model-error">请输入门诊人次</div>}
					</div>
					<div>
						<span className="model-span"> 住院： </span>
						<InputNumber
							className="model-input"
							value={cExpertData.hospitalization}
							onChange={(e) =>
								this.setState({
									cExpertData: {
										...cExpertData,
										hospitalization: isNaN(parseInt(e, 10))
											? 0
											: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0
									}
								})}
						/>
						{cExpertData.click &&
						cExpertData.hospitalization !== 0 &&
						!cExpertData.hospitalization && <div className="model-error">请输入住院人次</div>}
					</div>
					<div>
						<span className="model-span"> 手术： </span>
						<InputNumber
							className="model-input"
							value={cExpertData.operation}
							onChange={(e) =>
								this.setState({
									cExpertData: {
										...cExpertData,
										operation: isNaN(parseInt(e, 10))
											? 0
											: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0
									}
								})}
						/>
						{cExpertData.click &&
						cExpertData.operation !== 0 &&
						!cExpertData.operation && <div className="model-error">请输入手术人次</div>}
					</div>
					<div>
						<span className="model-span"> 其他： </span>
						<InputNumber
							className="model-input"
							value={cExpertData.other}
							onChange={(e) =>
								this.setState({
									cExpertData: {
										...cExpertData,
										other: isNaN(parseInt(e, 10)) ? 0 : parseInt(e, 10) > 0 ? parseInt(e, 10) : 0
									}
								})}
						/>
						{cExpertData.click &&
						cExpertData.other !== 0 &&
						!cExpertData.other && <div className="model-error">请输入其他人次</div>}
					</div>
					{cExpertData.click &&
					(cExpertData.outpatient === 0 &&
						cExpertData.hospitalization === 0 &&
						cExpertData.operation === 0 &&
						cExpertData.other === 0) && <div className="model-error">门诊、住院、手术、其他人次不能同时为 0 </div>}
				</Modal>
				<Modal
                maskClosable={false}

					title="培训进修"
					okText={'确定'}
					cancelText={'取消'}
					visible={trainModal}
					onOk={() => {
						if (!cTrainData.trainname || !cTrainData.trainstart || !cTrainData.traincount) {
							this.setState({ cTrainData: { ...cTrainData, click: true } });
							return;
						}
						trainData.push(cTrainData);
						this.setState({ trainModal: false, trainData, cTrainData: {} });
					}}
					onCancel={() => this.setState({ trainModal: false, cTrainData: {} })}
				>
					<div>
						<span className="model-span"> 培训进修名称： </span>
						<Input
							className="model-input"
							value={cTrainData.trainname}
							onChange={(e) =>
								this.setState({ cTrainData: { ...cTrainData, trainname: e.target.value } })}
						/>
						{cTrainData.click && !cTrainData.trainname && <div className="model-error">请输入培训进修名称</div>}
					</div>
					<div>
						<span className="model-span"> 培训进修时间： </span>
						<RangePicker
							style={{ width: 200 }}
							placeholder={[ '起始时间', '终止时间' ]}
							value={
								Boolean(cTrainData.trainstart && cTrainData.trainend) && [
									moment(formatDate(cTrainData.trainstart, 1), dateFormat),
									moment(formatDate(cTrainData.trainend, 1), dateFormat)
								]
							}
							onChange={(e, str) => {
								this.setState({
									cTrainData: { ...cTrainData, trainstart: str[0], trainend: str[1] }
								});
							}}
						/>
						{cTrainData.click && !cTrainData.trainstart && <div className="model-error">请输入培训进修时间</div>}
					</div>
					<div>
						<span className="model-span"> 培训进修人数： </span>
						<InputNumber
							className="model-input"
							value={cTrainData.traincount}
							onChange={(e) =>
								this.setState({
									cTrainData: {
										...cTrainData,
										traincount: isNaN(parseInt(e, 10))
											? 0
											: parseInt(e, 10) > 0 ? parseInt(e, 10) : 0
									}
								})}
						/>
						{cTrainData.click &&
						cTrainData.traincount !== 0 &&
						!cTrainData.traincount && <div className="model-error">请输入培训进修人数</div>}
					</div>
					<div style={{marginTop:20, marginLeft:60}}>
					<Icon type="info-circle" style={{ paddingRight: 10 }} />培训进修人数不能为0
					</div>

				</Modal>
				<Modal
                maskClosable={false}

					title="远程医疗"
					okText={'确定'}
					cancelText={'取消'}
					visible={medModal}
					onOk={() => {
						if (
							!cMedData.remotemedical ||
							!cMedData.beinvitedname ||
							!cMedData.beinvitecontent ||
							!cMedData.beinvitecontent
						) {
							this.setState({ cMedData: { ...cMedData, click: true } });
							return;
						}
						medData.push(cMedData);
						this.setState({ medModal: false, medData, cMedData: {} });
					}}
					onCancel={() => this.setState({ medModal: false, cMedData: {} })}
				>
					<div>
						<span className="model-span"> 远程医疗的目的： </span>
						<Select
							className="model-input"
							value={cMedData.remotemedical}
							onChange={(e, node) =>
								this.setState({
									cMedData: {
										...cMedData,
										remotemedical: e,
										remoteobjectiveName: node.props.children
									}
								})}
						>
							{ycyldmd}
						</Select>
						{cMedData.click && !cMedData.remotemedical && <div className="model-error">请输入远程医疗的目的</div>}
					</div>
					<div>
						<span className="model-span"> 受邀方名称： </span>
						<Input
							className="model-input"
							value={cMedData.beinvitedname}
							onChange={(e) =>
								this.setState({ cMedData: { ...cMedData, beinvitedname: e.target.value } })}
						/>
						{cMedData.click && !cMedData.beinvitedname && <div className="model-error">请输入受邀方名称</div>}
					</div>
					<div>
						<span className="model-span"> 受邀医师姓名及专业： </span>
						<Input
							className="model-input"
							value={cMedData.beinvitecontent}
							onChange={(e) =>
								this.setState({ cMedData: { ...cMedData, beinvitecontent: e.target.value } })}
						/>
						{cMedData.click && !cMedData.beinvitecontent && <div className="model-error">请输入受邀医师姓名及专业</div>}
					</div>
					<div>
						<span className="model-span"> 远程医疗日期： </span>
						<DatePicker
							placeholder="选择日期"
							style={{ width: 200 }}
							value={cMedData.remotedate && moment(formatDate(cMedData.remotedate, 1), dateFormat)}
							onChange={(e, str) => this.setState({ cMedData: { ...cMedData, remotedate: str } })}
						/>
						{cMedData.click && !cMedData.remotedate && <div className="model-error">请输入远程医疗日期</div>}
					</div>
				</Modal>
			</div>
		);
	}
}

const AgreementCard = Form.create({ name: 'AgreementCard' })(AgreementCardPage);

export default AgreementCard;
