import React, { Component } from 'react';

import './index.css';

import moveCode from './util';

export default class Slider extends Component {
    componentDidMount() {
        moveCode.call(this, 'fuckU', this.props.isCheck);
    }

    render() {
        return (
            <div>
                <div className="slider-code-box" id="code-box">
                    <input type="text" name="code" className="slider-code-input" />
                    <p></p>
                    <span>{'>>>'}</span>
                </div>
            </div>
        );
    }
}
