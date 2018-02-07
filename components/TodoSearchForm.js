import React from 'react';
import PropTypes from 'prop-types';



export default class TodoSearchForm extends React.Component {
    // 預設props
    static defaultProps = {
        placeholder: '搜尋文字...'
    }
    // 加入props的資料類型驗証
    static propTypes = {
        placeholder: React.PropTypes.string.isRequired
    }
    constructor(props) {
        // super是呼叫上層父類別的建構式
        super(props);

        this.titleField = null;
        //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
        this.titleField = null;

        //一個用於記錄composition狀態用的
        this.isOnComposition = false;

        //檢查是否為chrome瀏覽器
        //http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        this.isChrome = !!window.chrome && !!window.chrome.webstore;
    }

     handleComposition (e){   
        if(e.type === 'compositionend'){
            //composition結束，代表中文輸入完成
            this.isOnComposition = false
            //修正Chrome v53之後的事件觸發順序問題
     
            if (e.target instanceof HTMLInputElement && !this.isOnComposition && this.isChrome) {  
                //進行搜尋         
                 this.props.searchFilterText(e);
            }
            else {
                //composition進行中，代表正在輸入中文
                this.isOnComposition = true;
            }
        } 

    }
    render() {
        return (
            <input type="text"
                ref={el => { this.titleField = el }}
                disabled={this.props.isDisbleSearch}
                placeholder={this.props.placeholder}
                className="form-control"
                onCompositionStart={this.handleComposition.bind(this)}
                onCompositionUpdate={this.handleComposition.bind(this)}
                onCompositionEnd={this.handleComposition.bind(this)}
                onChange={(e) => {
                    //只有onComposition===false，才作onChange
                    if (e.target instanceof HTMLInputElement && !this.isOnComposition ) {
                      //進行搜尋
                      this.props.searchFilterText(e);
                    }
                } }
            />
        );
    }
}

// TodoSearchForm.defaultProps = {
//     placeholder: '搜尋文字...'
// };
//加入props的資料類型驗証
// TodoSearchForm.propTypes = {
//     placeholder: React.PropTypes.string.isRequired
// }