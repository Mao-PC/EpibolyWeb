import React, { Component } from 'react';
import { Layout, notification } from 'antd';

import { ImmList, ModifyPage } from './imm';
import { GPGList, MRList, SAList } from './pam';
import { OrgList, Rp, Um, DataDic, OptLog } from './sm';
import Login from './Login';
const { Header, Content, Sider } = Layout;

import './Layout.css';
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
        if (!this.props.location.state || !this.props.location.state.curUser) return;

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
                            let cindex = parseInt(sto.getItem('hccIndex'), 10);
                            this.onItemSelected(isNaN(cindex) || cindex < firstView ? firstView : cindex);
                        }
                    } else {
                        notification.error({ message: res.data.header.msg });
                    }
                } else {
                    notification.error({ message: res.data.header.msg });
                }
            })
            .catch(e => console.log(e));
    }

    onItemSelected = i => {
        if (window.sessionStorage) {
            window.sessionStorage.setItem('hccIndex', i);
        }
        this.setState({ cIndex: i });
    };

    render() {
        if (!this.props.location.state || !this.props.location.state.curUser) {
            this.props.history.push('/');
            return <Login />;
        } else {
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
                            onClick={() => {
                                if (cData[i].level === 1 && cData[i].code !== 'yljggl') {
                                    return;
                                }
                                this.onItemSelected(i);
                            }}
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
                                        <ImmList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[0]}
                                            history={this.props.history}
                                        />,
                                        <GPGList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[1]}
                                            history={this.props.history}
                                        />,
                                        <GPGList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[2]}
                                            history={this.props.history}
                                        />,
                                        <MRList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[3]}
                                            history={this.props.history}
                                        />,
                                        <SAList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[4]}
                                            history={this.props.history}
                                        />,
                                        <OrgList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[5]}
                                            history={this.props.history}
                                        />,
                                        <OrgList
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[6]}
                                            history={this.props.history}
                                        />,
                                        <Rp
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[7]}
                                            history={this.props.history}
                                        />,
                                        <Um
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[8]}
                                            history={this.props.history}
                                        />,
                                        <DataDic
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[9]}
                                            history={this.props.history}
                                        />,
                                        <OptLog
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[10]}
                                            history={this.props.history}
                                        />,
                                        <ModifyPage
                                            curUser={this.props.location.state.curUser}
                                            cRight={lis[11]}
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
}
