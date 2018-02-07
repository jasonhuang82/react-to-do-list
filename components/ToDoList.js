import React from 'react';
import PropTypes from 'prop-types';
import ToDoCheckbox from './ToDoCheckbox';

export default class ToDoList extends React.Component {
    constructor(props) {
        // super是呼叫上層父類別的建構式
        super(props);
        this.state = {
            isCheck: false
        }
    }

    allCompeleClick(e){
        this.props.allCompleteItems(e.target.checked);
        this.setState({ isCheck: e.target.checked})
    }
    render() {
        return (
            <div>
                <ToDoCheckbox inputText="過濾已完成項目"
                    checkClick={this.props.onItemFilter}
                />
                <ToDoCheckbox inputText={this.state.isCheck?'全部取消':'全部完成'}
                    checkClick={this.allCompeleClick.bind(this)}
                />
                <ul className="to-do-list">
                    {this.props.children}
                </ul>
            </div>
        );
    }
}