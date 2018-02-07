import React from 'react';
import PropTypes from 'prop-types';

// 只render畫面可使用函數式組件，但若有需要函數操作建議使用 class 組件
const ToDoList = ({ children, onItemFilter,allCompleteItems}: ToDoListProps) => {
    const allCompeleClick = function (e){
        // console.log("isAllComplete ->", e.target.checked);
        allCompleteItems(e.target.checked);
    }
    return (
        <div>
            <label>
                <input  type="checkbox"
                        onClick={onItemFilter}
                />
                <span>過濾已完成項目</span>
            </label>
            <label>
                <input  type="checkbox"
                        onClick={allCompeleClick}
                       
                />
                <span>全部完成</span>
            </label>
            <ul className="to-do-list">
                { children }
            </ul>
        </div>
    )
};
export default ToDoList;