/* eslint-disable */
import React, { Component } from 'react';
import { Layout, Menu, notification } from 'antd';

import { ReportList } from './report';
import { ProjectList } from './project';
import { User } from './usermsg';
import { ModifyPage } from '../hcc/imm';

const { Header, Content, Sider } = Layout;

import Axios from 'axios';

export default class Hello extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cIndex: 0,
            // li
            lis: [],
            // 权限
            cData: []
        };
    }

    componentDidMount() {
        let data = new FormData();
        data.append('id', this.props.location.state.curUser.id);
        Axios.post('ylws/menu/listMenu', data)
            .then(res => {
                if (res.data) {
                    if (res.data.header.code === '1003') {
                        notification.error({ message: res.data.header.msg });
                        setTimeout(() => {
                            this.props.history.push({ pathname: '/' });
                        }, 1000);
                    }
                    if (res.data.header.code === '1000') {
                        let cData = res.data.body.data;
                        let firstView = null;
                        let lis = cData.map((item, index) => {
                            const opts = item.operation.split('|');
                            // '显示', '查询', '添加', '修改', '删除'
                            return opts[0].split(',').map((opr, i) => {
                                const value = opts[1].includes(opr);
                                if (value && i === 0 && firstView === null) firstView = index;
                                return { key: opr, value };
                            });
                        });

                        this.setState({ cData, lis });
                        let sto = window.sessionStorage;
                        if (sto) {
                            let cindex = parseInt(sto.getItem('miIndex'), 10);
                            this.onItemSelected(isNaN(cindex) || cindex < firstView ? firstView : cindex);
                        }
                    }
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    }

    onItemSelected = i => {
        if (window.sessionStorage) {
            window.sessionStorage.setItem('miIndex', i);
        }
        this.setState({ cIndex: i });
    };

    render() {
        const { lis, cData } = this.state;
        let nodes = [];
        lis.forEach((content, i) => {
            if (Boolean(content[0].value)) {
                let classNames = 'menu-item';
                if (cData[i].level !== 1) {
                    classNames = 'menu-item menu-item-sub';
                }
                nodes.push(
                    <li
                        className={this.state.cIndex !== i ? classNames : classNames + ' active'}
                        key={i}
                        onClick={() => this.onItemSelected(i)}
                    >
                        {cData[i].name}
                    </li>
                );
            }
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
                            <ul className="menu">{nodes}</ul>
                        </Sider>
                        <Content
                            style={{
                                padding: '0 24px',
                                minHeight: 280,
                                backgroundColor: '#fff'
                            }}
                        >
                            {
                                [
                                    <ProjectList
                                        curUser={this.props.location.state.curUser}
                                        cRight={lis[0]}
                                        history={this.props.history}
                                    />,
                                    <ProjectList
                                        curUser={this.props.location.state.curUser}
                                        cRight={lis[1]}
                                        history={this.props.history}
                                    />,
                                    <ReportList
                                        curUser={this.props.location.state.curUser}
                                        cRight={lis[2]}
                                        history={this.props.history}
                                    />,
                                    <User
                                        curUser={this.props.location.state.curUser}
                                        cRight={lis[3]}
                                        history={this.props.history}
                                    />,
                                    <ModifyPage
                                        curUser={this.props.location.state.curUser}
                                        cRight={lis[4]}
                                        history={this.props.history}
                                    />
                                ][this.state.cIndex]
                            }
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}
