import React from 'react';
import PropTypes from 'prop-types';

// 只render畫面可使用函數式組件，但若有需要函數操作建議使用 class 組件
const TodoSelectSort = ({sortReg,sortTypeChange,isDisbleSort}:TodoSelectSortProps) => {
    // defaultChecked情況與上面說的defaultValue類似，這也是React中的人造元素才有的屬性
    // 相當於 html 中的value
    // 若設定表單輸入元件 不能直接設定value 屬性除非配合 onChange事件不然react會視為只能讀不能寫的元件
    let textfield ;
    let changeSelectText = function (e) {
        // console.log(e.target.value);
        sortTypeChange(e.target.value);
    }
    return (
        <select defaultValue={sortReg}
                ref={el=>textfield = el}
                onChange={changeSelectText}
                disabled={isDisbleSort}
        >
            <option value="none">無排序</option>
            <option value="desc">多 -> 少</option>
            <option value="asc">少 -> 多</option>
        </select>
    )
};


export default TodoSelectSort;

