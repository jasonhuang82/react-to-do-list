import React from 'react';
import PropTypes from 'prop-types';

export default class ToDoCheckbox extends React.Component {
    // 預設props
    static defaultProps = {
        inputText: '項目'
    }
    // 加入props的資料類型驗証
    static propTypes = {
        inputText: React.PropTypes.string.isRequired
    }
    constructor(props) {
        // super是呼叫上層父類別的建構式
        super(props);

    }

    render() {
        return (
            <label>
                <input type="checkbox"
                       onClick={this.props.checkClick}
                />
                <span>{this.props.inputText}</span>
            </label>
        );
    }
}
