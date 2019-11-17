/* eslint-disable */
import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

import { ReportList } from './report';
import { ProjectList } from './project';
import { User } from './usermsg';

const { Header, Content, Sider } = Layout;

export default class Hello extends Component {
    constructor(props) {
        super(props);
        this.uls = ['信息动态', '合作项目协议', '业务情况月报', '账户信息', '账户信息'];
        this.components = [<ProjectList />, <ProjectList />, <ReportList />, <User />, <User />];
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
            let cindex = parseInt(sto.getItem('miIndex'));
            this.onItemSelected(isNaN(cindex) ? 0 : cindex);
        }
    }

    onItemSelected = i => {
        if (window.sessionStorage) {
            window.sessionStorage.setItem('miIndex', i);
        }
        this.setState({ cIndex: i, content: this.components[i] });
    };

    render() {
        this.nodes = this.uls.map((content, i) => {
            let classNames = 'menu-item';
            if (![0, 3].includes(i)) {
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
                        你好，{this.props.location.state.name} {'　'}
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
