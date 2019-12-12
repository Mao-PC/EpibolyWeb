import React from 'react';
import { notification, Modal, Input } from 'antd';
import { getTreeNodes } from './getComData';
import Axios from 'axios';

/**
 * 初始化组织树
 */
function initOrgTreeNodes() {
	getTreeNodes.call(this, null, '/ylws/org/selectOrgListTree', {
		childKey: 'children',
		nameKey: 'name',
		itemKey: 'id'
	});
}

function initOrgSelectTree(params) {
	// 所属行政部门
	Axios.post('/ylws/org/selectOrgListTree')
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
					this.setState({ areaTreeSelect: getAreaSelect.call(this, res.data.body.data) });
				} else {
					notification.error({ message: res.data.header.msg });
				}
			} else {
				notification.error({ message: res.data.header.msg });
			}
		})
		.catch((e) => console.log(e));
}

/**
 * 拼接 `所属行政部门` 数据
 * @param {*} data
 */
function getAreaSelect(data) {
	if (data && data.length > 0) {
		return data.map((item) => {
			return {
				title: item.name,
				value: item.id,
				key: item.id,
				children: getAreaSelect.call(this, item.children)
			};
		});
	}
}

function initRoleSelect(params) {
	// 所属角色
	Axios.post('/ylws/role/selectRoleAll')
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
					let roleData = res.data.body.data.map((item) => {
						return (
							<Option key={item.id} value={item.id}>
								{item.rolename}
							</Option>
						);
					});
					this.setState({ roleData: roleData });
				} else {
					notification.error({ message: res.data.header.msg });
				}
			} else {
				notification.error({ message: res.data.header.msg });
			}
		})
		.catch((e) => console.log(e));
}

/**
 * 重置密码
 */
function reSetOk() {
	const { pwd, pwd2 } = this.state;
	if (!pwd || !pwd2 || pwd !== pwd2 || pwd.length < 6 || pwd2.length < 6) {
		if (!pwd) {
			this.setState({ reseterror: '请输入新密码' });
		} else if (!pwd2) {
			this.setState({ reseterror: '请输入确认密码' });
		} else if (pwd.length < 6 || pwd2.length < 6) {
			this.setState({ reseterror: '请确认输入密码的长度大于6位' });
		} else {
			this.setState({ reseterror: '' });
		}
		return;
	}

	setTimeout(() => {
		const { pwd2error, pwderror } = this.state;

		if (pwd2error || pwderror) return;
		this.setState({ pwderror: '', pwd2error: '' });
		const userData = this.selectedRowKeys;
		let data = new FormData();
		data.append('userId', userData[userData.type === 0 ? 'id' : 'uid']);
		data.append('username', userData.username);
		data.append('password', pwd);
		Axios.post('/ylws/user/resetPassword ', data)
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
						notification.success({ message: '密码修改成功' });
						this.setState({ visible: false });
						// setTimeout(() => {
						//     this.props.history.push({ pathname: '/' });
						// }, 1000);
					} else {
						notification.error({ message: res.data.header.msg });
					}
				} else {
					notification.error({ message: res.data.header.msg });
				}
			})
			.catch((e) => console.log(e));
	}, 0);
}

const resetModal = function(okFunction) {
	const { pwd2error, pwderror, visible, pwd, pwd2, reseterror } = this.state;

	return (
		<Modal
			maskClosable={false}
			title="重置密码"
			visible={visible}
			okText="确定"
			cancelText="取消"
			onOk={okFunction ? okFunction.bind(this) : reSetOk.bind(this)}
			onCancel={() => {
				this.setState({ visible: false, pwd: null, old_pwd: null, pwd2: null });
			}}
		>
			<div>
				<span className="model-span"> 新密码： </span>
				<Input.Password
					className="model-input"
					value={pwd}
					onChange={(e) => {
						this.setState({ pwd: e.target.value });

						if (e.target.value) {
							this.setState({ reseterror: '' });
						}

						if (
							/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,}$/.test(
								e.target.value
							)
						) {
							this.setState({ pwderror: null });
						} else {
							this.setState({ pwderror: '大小写字母、数字，至少两种任意组合' });
						}
					}}
				/>
				<div className="model-error">{pwderror}</div>
			</div>
			<div>
				<span className="model-span"> 确认密码： </span>
				<Input.Password
					className="model-input"
					value={pwd2}
					onChange={(e) => {
						if (e.target.value) {
							this.setState({ reseterror: '' });
						}
						this.setState({
							pwd2error: pwd !== e.target.value ? '两次输入密码不一致!' : null,
							pwd2: e.target.value
						});
					}}
				/>
				<div className="model-error">{pwd2error}</div>
			</div>

			<div className="model-error">{reseterror}</div>
		</Modal>
	);
};

export { initOrgSelectTree, initRoleSelect, reSetOk, resetModal, initOrgTreeNodes };
