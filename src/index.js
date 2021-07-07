import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import moment from 'moment';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

import './index.css';

ReactDOM.render(
	<ConfigProvider locale={zhCN}>
		<App />
	</ConfigProvider>,
	document.getElementById('root')
);
