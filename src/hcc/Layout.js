/* eslint-disable */
import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

import { ImmList } from './imm';
import { GPGList, MRList, SAList } from './pam';
import { OrgList, Rp, Um, DataDic } from './sm';

const { Header, Content, Sider } = Layout;

import './Layout.css';
import Axios from 'axios';

export default class Hello extends Component {
    constructor(props) {
        super(props);
        this.uls = [
            '医疗机构管理',
            '项目协议管理',
            '合作项目协议',
            '月报',
            '统计分析',
            '系统管理',
            '组织机构',
            '角色权限',
            '用户管理',
            '数据字典',
            '操作日志'
        ];
        this.indexs = [
            'medical_institution_management',
            'project_agreement_management',
            'cooperation_project_agreement',
            'monthly_report',
            'statistical_analysis',
            'system_management',
            'role_permissions',
            'organization',
            'user_management',
            'data_dictionary',
            'operation_log',
            'change_Password'
        ];
        this.components = [
            <ImmList curUser={this.props.location.state.curUser} />,
            <GPGList curUser={this.props.location.state.curUser} />,
            <GPGList curUser={this.props.location.state.curUser} />,
            <MRList curUser={this.props.location.state.curUser} />,
            <SAList curUser={this.props.location.state.curUser} />,
            <OrgList curUser={this.props.location.state.curUser} />,
            <OrgList curUser={this.props.location.state.curUser} />,
            <Rp curUser={this.props.location.state.curUser} />,
            <Um curUser={this.props.location.state.curUser} />,
            <DataDic curUser={this.props.location.state.curUser} />
        ];
        this.rootSubmenuKeys = ['0', '1', '5'];
        this.nodes = [];
        this.state = {
            openKeys: ['0'],
            cIndex: 0,
            liStyle: {},
            content: this.components[0]
        };
    }

    componentWillMount() {
        let sto = window.sessionStorage;
        if (sto) {
            let cindex = parseInt(sto.getItem('hccIndex'));
            this.onItemSelected(isNaN(cindex) ? 0 : cindex);
        }
    }

    onItemSelected = i => {
        if (window.sessionStorage) {
            window.sessionStorage.setItem('hccIndex', i);
        }
        this.setState({ cIndex: i, content: this.components[i] });
    };

    render() {
        this.nodes = this.uls.map((content, i) => {
            let classNames = 'menu-item';
            if (![0, 1, 5].includes(i)) {
                classNames = 'menu-item menu-item-sub';
            }
            return (
                <li
                    className={this.state.cIndex != i ? classNames : classNames + ' active'}
                    key={i}
                    onClick={() => this.onItemSelected(i)}
                >
                    {content}
                </li>
            );
        });
        return (
            <Layout style={{ height: '100%' }}>
                <Header style={{ backgroundColor: '#0099db', height: 80 }}>
                    <div className="title">京津冀医疗卫生协同发展信息动态分析系统</div>
                    <div className="user">
                        你好，{this.props.location.state.curUser.username} {'　'}
                        <a style={{ color: '#000' }} onClick={() => this.props.history.push('/')}>
                            退出
                        </a>
                    </div>
                </Header>
                <Content style={{ height: '100%' }}>
                    <Layout style={{ height: '100%' }}>
                        <Sider width={200}>
                            <ul className="menu">{this.nodes}</ul>
                        </Sider>
                        <Content
                            style={{
                                padding: '0 24px',
                                minHeight: 280,
                                backgroundColor: '#fff'
                            }}
                        >
                            {this.state.content}
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}
