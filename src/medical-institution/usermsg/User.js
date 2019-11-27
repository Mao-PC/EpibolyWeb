import React, { Component } from 'react';
import { Form, Input, Modal, notification } from 'antd';
import Axios from 'axios';

const { Item } = Form;

class Save extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userData: {},
			visible: false
		};
	}

	componentDidMount() {
		let data = new FormData();
		data.append('id', this.props.curUser.id);
		Axios.post('/ylws/medical/selectMedicalOrgById', data)
			.then((res) => {
				if (res.data) {
					if (res.data.header.code === '1003') {
						notification.error({ message: res.data.header.msg });
						setTimeout(() => {
							this.props.history.push({ pathname: '/' });
						}, 1000);
					}
					if (res.data.header.code === '1000') this.setState({ userData: res.data.body.data[0] });
				} else {
					notification.error({ message: res.data.header.msg });
				}
			})
			.catch((e) => console.log(e));
	}

	handleOk = (e) => {
		console.log(e);
		this.setState({
			visible: false
		});
	};

	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false
		});
	};
	render() {
		const { userData, visible } = this.state;
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
		return (
			<div style={{ margin: '40px 20px' }}>
				<h1>
					<strong>我的账户信息</strong>
				</h1>
				<Form {...formItemLayout} onSubmit={this.handleSubmit}>
					<Item label="所属行政部门" className="add-form-item">
						{userData.orgName}
					</Item>
					<Item label="医疗机构名称" className="add-form-item">
						{userData.medicalname}
					</Item>
					<Item label="社会统一信用代码" className="add-form-item">
						{userData.code}
					</Item>
					<Item label="机构类别" className="add-form-item">
						{userData.orgcategory1 + ' - ' + userData.orgcategory1}
					</Item>
					<Item label="经济类型" className="add-form-item">
						{userData.economictype}
					</Item>
					<Item label="机构等级" className="add-form-item">
						{userData.orglevel1 + ' - ' + userData.orglevel2}
					</Item>
					<Item label="用户名" className="add-form-item">
						{userData.suername}
					</Item>
					<Item label="联系人" className="add-form-item">
						{userData.name}
					</Item>
					<Item label="联系人职务" className="add-form-item">
						{userData.post}
					</Item>
					<Item label="联系电话" className="add-form-item">
						{userData.phone}
					</Item>
					<Item label="联系邮箱" className="add-form-item">
						{userData.email}
					</Item>
					<Item label="" className="add-form-item">
						<a onClick={() => this.setState({ visible: true })}>修改密码 ？</a>
					</Item>
				</Form>
				<Modal
					title="重置密码"
					visible={visible}
					okText="确定"
					cancelText="取消"
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					<div>
						<span className="model-span">原密码： </span>
						<Input className="model-input" />
					</div>
					<div>
						<span className="model-span"> 新密码： </span>
						<Input className="model-input" />
					</div>
					<div>
						<span className="model-span"> 确认密码： </span>
						<Input className="model-input" />
					</div>
				</Modal>
			</div>
		);
	}
}

export default Form.create({ name: 'Save' })(Save);
