import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

class CreateList extends Component {

    //CONSTRUCTOR PART
    constructor(props) {
        super(props);
        this.state = {
            currentItems: [],
            currentItemsCounter: 0,
            isListActive: false,
            inputFieldState: "",
            listName: false
        }


    }

    //COMPONENT LIFECYCLE METHODS
    componentDidMount() {
        console.log("Mounted!");

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.listName !== this.state.listName || prevState.isListActive !== this.state.isListActive) {
            console.log("component did update works!");
        }
    }


    //ACTIVATE LIST MODE METHODS
    createListOnClick = () => {
        return this.state.isListActive ? this.state.isListActive :
            this.setState({
                isListActive: true
            })
    };
    //NAME YOUR LIST MODE METHODS
    proceedOnEnterPressNameMode(event) {
        let input = event.target.value;
        let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
        if (event.key === "Enter") {
            this.setState({
                listName: input
            });

            btn.click(event);

            console.log(this.state.listName);
        }
    }

    proceedOnBtnClickNameMode(event) {
        let input = event.target.value;
        let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
        this.setState({
            listName: input
        });
    }

    //FIRST ITEM MODE

    proceedOnEnterPressFirstItemMode(event) {
        let inputField = event.target.value;
        // let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
        console.log(inputField)
        // console.log(btn)
        let set = new Set(this.state.currentItems);
        if (event.key === "Enter") {
            if (inputField !== null && inputField !== "" && inputField !== undefined && !set.has(inputField))
                this.setState({
                    currentItems: this.state.currentItems.concat(inputField),
                    currentItemsCounter: this.state.currentItemsCounter + 1,
                    inputFieldState: ""
                });


            event.target.value = this.state.inputFieldState;
        }
    }

    proceedOnBtnClickFirstItemMode(event) {
        console.log(event.previousSiblingElement);
    }

    // clickOnEnterPressAndSaveName(event) {
    //     let input = event.target.value;
    //     console.log(input);
    //     let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
    //     console.log(btn)
    //     // Number 13 is the "Enter" key on the keyboard
    //     if (event.key === "Enter" || event.type === "click") {
    //         console.log(event.key);
    //         console.log(event.type);
    //         console.log(input)
    //         this.setState({
    //             listName: input
    //         });
    //         btn.click(event);
    //         // (event)=> {this.onClickSetNameState(event)};
    //     }
    //     console.log(this.state.listName);
    // }

    addItemOnClick(e) {
        let inputField = e.target.previousSibling.value;
        let set = new Set(this.state.currentItems);


        if (inputField !== null && inputField !== "" && inputField !== undefined && !set.has(inputField))
            this.setState({
                currentItems: this.state.currentItems.concat(inputField),
                currentItemsCounter: this.state.currentItemsCounter + 1,
                inputFieldState: ""
            });

        e.target.previousSibling.value = this.state.inputFieldState;
    }

    deleteItemOnClick(e) {
        let itemToDeleteValue = e.target.parentElement.children[0].innerText;
        this.setState({
            currentItemsCounter: this.state.currentItemsCounter - 1,
            //below: search for the element to delete and update the state
            currentItems: this.state.currentItems.filter(item => item !== itemToDeleteValue)
        });
    };

    clearListDraft(e) {
        let test = document.getElementById('listDraft');
        test = Array.from(test);
        test.map(e => {
            e.remove();
        });

        this.setState({
            currentItems: [],
            currentItemsCounter: 0
        });
    };

    saveAndSendListToDb(e) {
        let listElements = document.getElementById("listDraft").getElementsByClassName('itemName');
        let itemObject = [];
        Array.from(listElements).map(e => {
            itemObject.push(e.innerText);
        })

        const formData = new FormData();
        for (let i = 0; i < itemObject.length; i++) {
            formData.append(`shoppingItem${i}`, itemObject[i])
        }
        ;

        formData.append('name', this.state.listName);


        let port = location.port;
        let targetUrl = `https://localhost:${port}/save`;

        let request = new Request(targetUrl, {
            body: formData,
            method: "POST",
            headers: {
                "Access-Control-Request-Method": "POST",
                "Origin": targetUrl,
            }
        })
        fetch(request)
            .then((response) => response.json())

            .then((response) => {

                this.setState({
                    isListActive: false,
                    currentItems: [],
                    currentItemsCounter: 0
                })
                document.getElementById("defNavEl").classList.add("default")
            })
            .catch((error) => {
                console.error('SAVE TO DB FETCH ERROR:', error);
            });
    }


//CONDITIONAL RENDER PART

    render() {
        //case 1: list is not active yet
        if (!this.state.isListActive) {
            return <>
                <ActivateListMode onClickCreateList={(e) => {
                    this.createListOnClick(e)
                }}/>
            </>
        }

        //case 2: list is active but no list name has been added
        else if (this.state.currentItemsCounter === 0 && this.state.isListActive === true && this.state.listName === false) {
            return <>
                <NameYourListMode
                    proceedOnEnterPressNameMode={(e) => {
                        this.proceedOnEnterPressNameMode(e)
                    }}
                    proceedOnBtnClickNameMode={(e)=>{
                        this.proceedOnBtnClickNameMode(e)
                    }
                    }
                />
            </>
        }

        //case 3: list is active but no list name or product has been added
        else if(this.state.currentItemsCounter === 0 && this.state.isListActive === true && this.state.listName !== false){
            return <>
                <FirstItemMode
                    onClickPropsAdd={(e) => {
                        this.addItemOnClick(e)
                    }}
                    proceedOnEnterPress={(e)=>{
                        this.proceedOnEnterPressFirstItemMode(e)}
                    }
                />
            </>
        }

        //case 4: list is active, named, and first product is already on the list
        else if (this.state.currentItemsCounter > 0) {
            return <>
                <EditionMode
                    onClickPropsAdd={e => {
                        this.addItemOnClick(e)
                    }}
                    onClickPropsDelete={e => {
                        this.deleteItemOnClick(e)
                    }}
                    onClickPropsSave={e => {
                        this.saveAndSendListToDb(e)
                    }}
                    currentItems={this.state.currentItems}
                    onClickClearList={e => {
                        this.clearListDraft(e)
                    }}
                   proceedOnEnterPress={(e) => {
                        this.proceedOnEnterPressFirstItemAndEditionMode(e)
                    }}
                />

            </>
        }
    }
}


//MODES

class ActivateListMode extends Component {
    render() {
        return <div>
            <button
                onClick={this.props.onClickCreateList}
                className={"btn-sm btn-success"}> Stwórz nową listę
            </button>
        </div>
    }
}

class NameYourListMode extends Component {
    render() {
        return <div>
            {/*<h2>Nazwij swoją listę</h2>*/}
            <NameYourListInput proceedOnEnterPressNameMode={this.props.proceedOnEnterPressNameMode} proceedOnBtnClickNameMode={this.props.proceedOnBtnClickNameMode}/>
        </div>
    }
}


class FirstItemMode extends Component {
    render() {
        return <div>
            <h2>Dodaj zakup do listy</h2>
            <ShoppingListInput proceedOnEnterPress={this.props.proceedOnEnterPress}/>
        </div>
    }
}

class EditionMode extends Component {
    render() {
        return <div>
            <h2>Skomponuj swoją listę!</h2>
            <ShoppingListInput onClickPropsAdd={this.props.onClickPropsAdd} proceedOnEnterPress={this.props.proceedOnEnterPress}/>
            <ShoppingListDraft
                currentItems={this.props.currentItems}
                onClickPropsDelete={this.props.onClickPropsDelete}
            />
            <button
                className={"btn-sm btn-success"}
                style={{marginRight: "5px"}}
                onClick={(e) => {
                    this.props.onClickPropsSave(e);
                }}>Zapisz listę
            </button>
            <button className={"btn-sm btn-danger"} onClick={this.props.onClickClearList}>Wyczyść listę</button>
        </div>
    }
}

//HELPER COMPONENTS

class ShoppingListDraft extends Component {
    render() {
        let callback = this.props.onClickPropsDelete;
        return <ul id={"listDraft"}>{this.props.currentItems.map((e, index) => {
            return <ShoppingListItem
                itemContent={e}
                key={index}
                onClickPropsDelete={callback}/>
        })}
        </ul>
    }
}

class ShoppingListItem extends Component {
    render() {
        return <>
            <li style={{marginTop: "5px"}}>
                <span className={"itemName"}>{this.props.itemContent}</span>
                <button
                    className={"btn-sm btn-warning"}
                    style={{position: 'relative', left: '10px'}}
                    onClick={(e) => {
                        this.props.onClickPropsDelete(e);
                    }}
                >Usuń
                </button>
            </li>
        </>
    }
}

//HELPER COMPONENTS - INPUTS

class NameYourListInput extends Component {
    render() {
        return <div className={"left25pxMargin"}>
            <input id="listNameInput" type="text" placeholder={"nazwij swoją listę"}
                   onKeyPress={this.props.proceedOnEnterPressNameMode}/>
            <button className={"btn-sm btn-success"} id="addNameBtn" onClick={this.props.proceedOnBtnClickNameMode}>Dodaj
            </button>
        </div>
    }
}

class ShoppingListInput extends Component {

    render() {
        return <div>
            <input type="text" placeholder={"dodaj nowy zakup"} onKeyPress={this.props.proceedOnEnterPress}/>
            <button className={"btn-sm btn-success"} onClick={this.props.onClickPropsAdd} id="addItemBtn">Dodaj</button>
        </div>
    }
}

export default CreateList;