import React from 'react';
import PropTypes from 'prop-types';

// 只render畫面可使用函數式組件，但若有需要函數操作建議使用 class 組件
const TodoItem = ({ itemText, updateListItemEditState, removeListItem, updateCompleteState, isCompleted}:TodoItemProps) => {
    // defaultChecked情況與上面說的defaultValue類似，這也是React中的人造元素才有的屬性
    // 相當於 html 中的value
    // 若設定表單輸入元件 不能直接設定value 屬性除非配合 onChange事件不然react會視為只能讀不能寫的元件
    return (
        <li onDoubleClick={updateListItemEditState} 
            className={isCompleted? 'to-do-list-group isComplete' : 'to-do-list-group'}
        >
            <div>
                <label>
                    <input type="checkbox"
                        checked={isCompleted}
                        onChange={updateCompleteState}
                    />
                    <span>{itemText}</span>
                </label>
            </div>
            <span className="btn del-btn" onClick={removeListItem}>&times;</span>
        </li>
    )
};
export default TodoItem;

