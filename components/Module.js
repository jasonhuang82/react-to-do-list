// 最大統整的元件 最大的爺爺
// css import
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../css.scss";

// javascript import
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from "react-css-modules";
import TodoAddForm from './TodoAddForm';
import TodoEditForm from './TodoEditForm';
import TodoSearchForm from './TodoSearchForm';
import TodoSelectSort from "./TodoSelectSort";
import TodoItem from './TodoItem';
import ToDoList from './ToDoList';

// es7 非同步
import "babel-polyfill";


const severUrl = `http://localhost:5555/items`; // server port

class Module extends Component {

    // 預設props es7
    static defaultProps = {
        functionNames: [
        'allCompleteItems',
        'handleServerItemRemove',
        'handleServerItemAdd', 
        'handleServerItemsLoad',
        "sortTypeChange",
        "renderListArr",
        "searchFilterText",
        "onItemFilter",
        "updateCompleteState",
        "updateListItemEditState",
        "updateListItem",
        "removeListItem",
        "addListItem",
        "bindThis"
        ],
        titleName: 'To Do List'
    };
    // 驗證資料類型 es7
    static propTypes = {
        color: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            listArr: [
                {
                id: 1,
                title: "apple",
                isCompleted: false,
                isEditing: false
                },
                {
                id: 2,
                title: "orange",
                isCompleted: false,
                isEditing: false
                },
                {
                id: 3,
                title: "林俊傑",
                isCompleted: false,
                isEditing: false
                },
                {
                id: 4,
                title: "陳奕迅",
                isCompleted: false,
                isEditing: false
                },
                {
                id: 5,
                title: "周杰倫",
                isCompleted: false,
                isEditing: false
                }
            ],
            isSearching: false, // 是否為搜尋狀態
            listState: "", // 狀態文字
            sortType: "" // 排序模式
        };
        this.isFilteringOut = false; // 過濾已完成
        this.cloneListArr = [...this.state.listArr]; // 複製出的陣列用於render 畫面
        this.searchText = ""; // 搜尋文字
        this.stateCopyText = ""; // 狀態文字
    }

  // ===== 將所有function 做bind(this) =====
    bindThis() {
        this.props.functionNames.map(item => (this[item] = this[item].bind(this)));
    }
  //===== 生命週期 ref = https://ithelp.ithome.com.tw/articles/10185194 =====
    componentWillMount() {
        // Component將要被mount在畫面上時，會執行這個方法，會發生在第一次render()之前，
        // 也因為在會在render()之前，所以在這邊設定任何state也就不會觸發re-render
        console.log("componentWillMount");
        this.handleServerItemsLoad();
        this.bindThis();
    }

    componentWillUpdate(nextProps, nextState) {
        // 接收到新的props和state時，re-render之前
        // 會去接收 setState過來的 props or State 存在參數裡，也就是若是需要使用剛剛setState來的資料就需要用參數接過來
        // 只有使用this.state.xx 會只抓到當下未更新的state
        console.log("componentWillUpdate");
        this.renderListArr(nextState);
    }

  // ===== 新增項目 =====
    addListItem(e, listItem) {
        // 如果是按 enter
        // 將陣列複製一份最前面增加元素
        // 更改react 狀態 字串，陣列讓畫面重render
        // 將input 值清空，在input value 上綁定state在setState時，就會將內部值清空不須使用dom物件語法清

        // === 本地陣列 ====
        // // 如果按了enter就add Item
        // let newListArr = [listItem, ...this.state.listArr];
        // // 因為 unshift 會直接改到原陣列但react state只接受用setState去改不然會錯，所以才使用展開式接陣列
        // // let newListArr = [...this.state.listArr]
        // // newListArr.unshift(text);

        // this.setState({
        //   listState: `剛剛新增了 ${listItem.title} 項目`,
        //   listArr: newListArr
        // });

        // === 寫入 sever ===
        // 如果按了enter就add Item
        this.stateCopyText = `剛剛新增了 ${listItem.title} 項目`;
        this.handleServerItemAdd(listItem);
    }

  // ===== 更新項目 =====

  // 處理其中一個陣列中成員變為編輯中的方法 double click
    updateListItemEditState(itemId) {
        //拷貝一個新陣列
        const newListArr = [...this.state.listArr];
        //切換isEditing的布林值
        let index = this.findIndexById(newListArr, itemId);
        newListArr[index].isEditing = !newListArr[index].isEditing;

        // == 寫入本地陣列
        //整個陣列重新更新
        // this.setState({
        //   listArr: newListArr
        // });
        // === 寫入 server
        this.handleServerItemUpdate(newListArr[index]);
        
    }
  // 處理其中一個陣列中成員編輯完後更新的方法
    updateListItem(itemId, itemText) {
        //拷貝一個新陣列
        const newListArr = [...this.state.listArr];
        //指定新的標題文字
        let index = this.findIndexById(newListArr, itemId);
        newListArr[index].title = itemText;
        //切換isEditing的布林值
        newListArr[index].isEditing = !newListArr[index].isEditing;
        // == 寫入本地陣列
        //整個陣列重新更新
        // this.setState({
        //   listState: `剛剛更新了第${index + 1}個 item 為 ${itemText}`,
        //   listArr: newListArr
        // });
        // === 寫入 server
        this.stateCopyText = `剛剛更新了第${index + 1}個 item 為 ${itemText}`,
        this.handleServerItemUpdate(newListArr[index]);

    }

  // 變更完成狀態
    updateCompleteState(itemId) {
        //拷貝一個新陣列
        const newListArr = [...this.state.listArr];
        let index = this.findIndexById(newListArr, itemId);
        newListArr[index].isCompleted = !newListArr[index].isCompleted;
        // == 寫入本地陣列
        //整個陣列重新更新
        // this.setState({
        //   listArr: newListArr
        // });
        // === 寫入 server
        this.handleServerItemUpdate(newListArr[index]);

    }

  // ===== 移除項目 =====
    removeListItem(itemId) {
        let isCheck = confirm("確定刪除?");
        if (isCheck) {
            let newArr = [...this.state.listArr];
            let index = this.findIndexById(newArr, itemId);
            
            // == 寫入本地陣列
            // let newArr = [...this.state.listArr];
            // let index = this.findIndexById(newArr, itemId);
            // let stateText = newArr.splice(index, 1);

            // this.setState({
            //     listState: `剛剛刪除了${stateText[0].title}`,
            //     listArr: newArr
            // });
            // === 寫入 server
            this.stateCopyText = `剛剛刪除了${newArr[index].title}`;
            this.handleServerItemRemove(itemId);
        } else {
        this.setState({
            listState: ""
        });
        }
    }

  // ===== 統整區 =====
  // 用id 找尋index
    findIndexById(newArr, itemId) {
        let index = 0;
        newArr.map((currentValue, currentIndex) => {
        if (Number(currentValue.id) === Number(itemId)) {
            index = currentIndex;
        }
        });
        return index;
    }
  // 過濾功能 //處理切換過濾是否要顯示已完成項目
    onItemFilter() {
        this.isFilteringOut = !this.isFilteringOut;
        const newListArr = [...this.state.listArr];
        this.setState({
        listArr: newListArr
        });
    }

  // 全選功能
    allCompleteItems(isAllComplete){
            
        let newItems = [...this.state.listArr];
        if (isAllComplete) {
            newItems = newItems.map(item => {
                item.isCompleted = true;
                return item;
            })
        }
        else{
            newItems = newItems.map(item => {
                item.isCompleted = false;
                return item;
            });
        }

        let self = this;
        // let currentIndex = 0;
        let updateAllComplete = ()=>{
            let currentIndex = 0;
            newItems.map((item,i) => {
                (async () => {        
                    // await updateAllComplete();
                    (await function(){
                        return new Promise(resolve => {
                            //作POST
                            fetch(`${severUrl}/${item.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(item)
                            })
                            .then(()=>{
                                console.log("fetch time", currentIndex);
                                if (currentIndex === newItems.length - 1) {
                                    console.log('final fetch');
                                    
                                    self.handleServerItemsLoad();
                                }
                                currentIndex++;
                            });
                        });
                    })();
                })();
            });
        }
        
        updateAllComplete();
                
    }

  // 搜尋功能
    searchFilterText(e) {
        // 用一個isSearching狀態去紀錄，是否為搜尋狀態，在組件render完方法中去做看是搜尋過濾的動作
        // 只要使用setState方法就會重新觸發 re-render 並重新跑一次生命週期
        // 如果user 有輸入input ( 更新setState => isSearching狀態讓畫面重 render )，在有搜尋狀態會以搜尋狀態的路下去跑
        // 只要 setState 畫面所有關的 state 都會重render
        // 每次先把原始陣列作複製，注意:千萬不要更改到原始資料，由於filter...或過濾或排序都算是動態更改的畫面處理
        // 第一步先在搜尋狀態把複製完的陣列作搜尋處理，若沒有就呈現原始資料
        // 第二關依照不管事搜尋完結果或原始資料作排序動作，最後將整理完的陣列放在畫面
        let searchword = e.target.value;
        if (searchword !== "" && searchword !== undefined && searchword !== null) {
        console.log("isSearching");
        this.searchText = searchword; // 填入搜尋文字
        this.setState({ isSearching: true });
        } else {
        console.log("not isSearching");
        this.searchText = "";
        this.setState({ isSearching: false });
        }
    }

  // 排序 功能 在 render 之前的事件作統一排序動作預處理
    sortTypeChange(sortTypeString) {
        if (sortTypeString !== "" && sortTypeString && sortTypeString !== null) {
        this.setState({ sortType: sortTypeString });
        }
    }

  // ===== render 畫面總處理 =====
  // 在setState後在組件要重render前，做預處理動作
    renderListArr(nextState) {
        // 大致流程:
        // 目前畫面上陣列資料統一由另一個複製資料控制，原始資料透過state去紀錄
        // 過濾動作統一用 component 要render之前的事件在這裡統一去預處理
        // 想接收到setState完的最新資料不可在setState方法後，直接調用因為他會直接重render且會取到上次的舊資料
        // 真的要取需再 接收到新的props和state時，re-render之前的生命週期，會去紀錄setState過來更新的資料
        // 這時setState後的資料才真正可以正確被拿

        // Action
        // 1.接收 setState 過來的state，去檢查是否為搜尋狀態
        //      1-1. 搜尋狀態
        let isSearching = nextState.isSearching;
        let newItems = [...nextState.listArr];
        if (isSearching) {
        let searchword = this.searchText;
        let reg = new RegExp(searchword, "i");
        // newItems = newItems.filter(item => item.title.indexOf(searchword) !== -1);
        newItems = newItems.filter(item => reg.test(item.title));
        }

        let sortType = nextState.sortType;
        if (sortType === "asc") {
            //按筆劃從少到多排序
            newItems = newItems.sort((a, b) =>
                a.title.localeCompare(b.title, "zh-Hans-TW-u-co-stroke")
            );
        }

        if (sortType === "desc") {
            //按筆劃從多到少排序
            newItems = newItems.sort((a, b) =>
                b.title.localeCompare(a.title, "zh-Hans-TW-u-co-stroke")
            );
        }
        this.cloneListArr = newItems; // 複製出的陣列用於render 畫面
    }

  // Load Data From Server 當每次修改都是去更新 db json ，然後再呼叫這個方法去重render到畫面
    handleServerItemsLoad() {
        console.log("handleServerItemsLoad");
        
        fetch(`${severUrl}`, {
        method: "GET"
        })
        .then(response => {
            //ok 代表狀態碼在範圍 200-299
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .then(itemList => {
            // //載入資料，重新渲染
            this.setState({
                listState: this.stateCopyText,
                listArr: itemList
            });
        })
        .catch(error => {
            //這裡可以顯示一些訊息
            console.error( error);
        });
    }

  // add Item to Server
    handleServerItemAdd(addItem) {
        //作POST
        fetch(`${severUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(addItem)
        })
        .then(response => {
        //ok 代表狀態碼在範圍 200-299
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .then(item => {
        //這裡可以顯示一些訊息，或是結束指示動畫…
        this.handleServerItemsLoad();
        });
    }

  // handleServerItemRemove to server
    handleServerItemRemove(id){
        fetch(`${severUrl}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            //ok 代表狀態碼在範圍 200-299
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .then(item => {
            //這裡可以顯示一些訊息，或是結束指示動畫…
            this.handleServerItemsLoad();
        });
     }
  // update Server Data
    handleServerItemUpdate(updateItem) {
        //作POST
        fetch(`${severUrl}/${updateItem.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateItem)
        })
        .then((response) => {
        //ok 代表狀態碼在範圍 200-299
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
        })
        .then((item) => {
            //這裡可以顯示一些訊息，或是結束指示動畫…
            this.handleServerItemsLoad();
        })
        .catch((error) => {
            //console.error(error)
        })
    }   
  // ===== 畫面 =====
    render() {
        return (
            <div styleName="to-do-list-app">
                <div>
                    <h1>{this.props.titleName}</h1>
                    <h5>{this.state.listArr.filter(item=>item.isCompleted === false).length}項未完成代辦事項</h5>
                    <div className="row">
                        <div className="col-sm-6 form-group row">
                            <label className="col-sm-3 col-form-label">搜尋文字:</label>
                            <div className="col-sm-9">
                                <TodoSearchForm
                                searchFilterText={this.searchFilterText}
                                isDisbleSearch={this.state.listArr.length <= 0}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6 form-group row">
                            <label className="col-sm-3 col-form-label">增加項目:</label>
                            <div className="col-sm-9">
                                <TodoAddForm
                                placeholderText="請輸入文字..."
                                addListItem={this.addListItem}
                                />
                            </div>
                        </div>
                    </div>

                    <h5>狀態 : {this.state.listState}</h5>
                    <div>
                        <label>排序筆畫 : </label>
                        
                        <TodoSelectSort sortReg="none"
                                        sortTypeChange={this.sortTypeChange}
                                        isDisbleSort={this.state.listArr.length <= 0}
                        />
                    </div>
                    <ToDoList   onItemFilter={this.onItemFilter}
                                allCompleteItems={this.allCompleteItems}
                    >
                    {
                        this.cloneListArr.map((item, index) => {
                            // 如果是過濾狀態就把已完成的濾掉
                            if (this.isFilteringOut && item.isCompleted) {
                                return null;
                            } 
                            else {
                                return( 
                                    (item.isEditing) 
                                    ? 
                                    <TodoEditForm   key={item.id}
                                                    itemText={item.title}
                                                    index={index}
                                                    itemId={item.id}
                                                    updateListItem={this.updateListItem}
                                    />
                                    : 
                                    <TodoItem   key={item.id}
                                                index={index}
                                                itemText={item.title}
                                                isCompleted={item.isCompleted}
                                                removeListItem={this.removeListItem.bind(this, item.id)}
                                                updateListItemEditState={this.updateListItemEditState.bind(this,item.id)}
                                                updateCompleteState={this.updateCompleteState.bind(this,item.id)}
                                    />
                                );
                            }
                        })
                    }
                    </ToDoList>
                </div>
            </div>
        );
    }
}
// Props default value write here
// Module.defaultProps = {
//   functionNames: [
//     'allCompleteItems',
//     'handleServerItemRemove',
//     'handleServerItemAdd', 
//     'handleServerItemsLoad',
//     "sortTypeChange",
//     "renderListArr",
//     "searchFilterText",
//     "onItemFilter",
//     "updateCompleteState",
//     "updateListItemEditState",
//     "updateListItem",
//     "removeListItem",
//     "addListItem",
//     "bindThis"
//   ],
//   titleName: 'To Do List'
// };

// // Typechecking with proptypes, is a place to define prop api
// Module.propTypes = {
//     color: React.PropTypes.string
// };

export default CSSModules(Module, styles, {
    allowMultiple: true
});
