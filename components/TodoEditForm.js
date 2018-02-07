import React from 'react';
import PropTypes from 'prop-types';

export default class TodoEditForm extends React.Component {
    constructor(props) {
        // super是呼叫上層父類別的建構式
        super(props);
        this.titleField = null;
    }

    editKeyDown(e){
        if (this.titleField.value.trim() && e.target instanceof HTMLInputElement && e.key === "Enter") {
          //更新某個索引值的標題
          this.props.updateListItem(this.props.itemId, this.titleField.value);
        }
    }

    editBlur(e){
        if (this.titleField.value.trim() && e.target instanceof HTMLInputElement) {
          //更新某個索引值的標題
          this.props.updateListItem(this.props.itemId, this.titleField.value);
        }
    }
    render() {
        return (
            <li>
                <input type="text"
                    className="form-control"
                    ref={el => { this.titleField = el }}
                    autoFocus
                    defaultValue={this.props.itemText}
                    onKeyDown={this.editKeyDown.bind(this)}
                    onBlur={this.editBlur.bind(this)}
                />
            </li>
        );
    }
}

TodoEditForm.defaultProps = {
};
//加入props的資料類型驗証
TodoEditForm.propTypes = {
}