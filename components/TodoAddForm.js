import React from 'react';
import PropTypes from 'prop-types';

export default class TodoAddForm extends React.Component {
    constructor(props) {
        // super是呼叫上層父類別的建構式
        super(props);
        this.titleField = null;
    }

    addListItem(e){
        if (this.titleField.value.trim() && e.target instanceof HTMLInputElement && e.key === 'Enter'){
            //加入到items陣列中(state)   
            this.props.addListItem(e, {
                id: +new Date(),
                title: this.titleField.value,
                isCompleted: false,
                isEditing: false
            })
            //清空文字輸入框
            this.titleField.value = '';
        }
        
    }
    render() {
        return (
            <input type="text"
                ref={el => { this.titleField = el}}
                placeholder={this.props.placeholderText}
                onKeyDown={this.addListItem.bind(this)}
                className="form-control"
            />
        );
    }
}

TodoAddForm.defaultProps = {
    placeholder: '輸入文字按Enter加入清單'
};
//加入props的資料類型驗証
TodoAddForm.propTypes = {
    placeholder: React.PropTypes.string.isRequired
}