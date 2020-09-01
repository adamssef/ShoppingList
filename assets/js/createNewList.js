import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {withRouter} from 'react-router-dom';//thanks to withRouter I can access match

require('../css/app.css');
const $ = require('jquery');
import Swal from 'sweetalert2'

require('bootstrap');
var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');


class CreateList extends Component {

    //CONSTRUCTOR PART
    constructor(props) {
        super(props);
        this.state = {
            shown:true,
            currentItems: [],
            currentItemsCounter: 0,
            isListActive: false,
            inputFieldState: "",
            listName: false
        }
    }

    //COMPONENT LIFECYCLE METHODS
    componentDidUpdate(prevProps, prevState) {
        if (prevState.listName !== this.state.listName) {
            console.log("componentDidUpdateMessage: listName state has been updated to: " + this.state.listName);
        }

        if (this.props.createListStateReset && this.props.isListActive) {
            this.setState({
                isListActive: false,
            })
        }

        if(this.props.shown && !this.state.shown) {
            this.setState({
                shown:true
            })
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
        console.log(input)
        let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
        if (event.key === "Enter") {
            event.target.parentElement.getElementsByTagName('BUTTON')[0].click(event);
        }
    }

    proceedOnBtnClickNameMode(event) {
        let input = event.currentTarget.previousSibling.value;

        if (input.length >= 5) {
            let btn = event.target.parentElement.getElementsByTagName('BUTTON')[0];
            this.setState({
                listName: input
            });
        } else {
            Swal.fire({
                title: 'halo halo!',
                text: 'Coś tu nie gra:-( Nazwa musi być ciut dluższa!',
                icon: 'info',
                confirmButtonText: 'Ok, postaram się'
            })
        }


    }

    //FIRST ITEM MODE

    proceedOnEnterPressFirstItemMode(event) {
        let inputField = event.target.value;
        let set = new Set(this.state.currentItems);
        if (event.key === "Enter") {
            if (inputField !== null && inputField !== "" && inputField !== undefined && !set.has(inputField) && inputField.length > 0) {
                this.setState({
                    currentItems: this.state.currentItems.concat(inputField),
                    currentItemsCounter: this.state.currentItemsCounter + 1,
                    inputFieldState: ""
                });


                event.target.value = this.state.inputFieldState;
            } else {
                Swal.fire({
                    title: 'halo halo!',
                    text: 'Coś tu nie gra:-( Nazwa musi być ciut dłuższa!',
                    icon: 'info',
                    confirmButtonText: 'Ok, postaram się'
                })
            }
        }
    }

    addItemOnClick(e) {
        let inputField = e.target.previousSibling.value;
        let set = new Set(this.state.currentItems);


        if (inputField !== null && inputField !== "" && inputField !== undefined && !set.has(inputField) && inputField.length > 0) {
            this.setState({
                currentItems: this.state.currentItems.concat(inputField),
                currentItemsCounter: this.state.currentItemsCounter + 1,
                inputFieldState: ""
            });

            e.target.previousSibling.value = this.state.inputFieldState;
        } else {
            Swal.fire({
                title: 'halo halo!',
                text: 'Coś tu nie gra:-( Nazwa musi być ciut dłuższa!',
                icon: 'info',
                confirmButtonText: 'Ok, postaram się'
            })
        }
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


        //OLD CODE TO UNCOMMENT EASILY
        const formData = new FormData();
        for (let i = 0; i < itemObject.length; i++) {
            formData.append(i, itemObject[i])
        }

        formData.append('name', this.state.listName);
        formData.append('id', this.props.userId)



        let targetUrl = `${location.origin}/save`;

        let request = new Request(targetUrl, {
            body: formData,
            method: "POST",
            headers: {
                "Access-Control-Request-Method": "POST, GET, OPTIONS",
                "Origin": location.origin,
            }
        });
        //OLD CODE TO UNCOMMENT EASILY END

        fetch(request)
            .then((response) => response.json())

            .then((response) => {

                this.setState({
                    isListActive: false,
                    currentItems: [],
                    currentItemsCounter: 0
                })
            })
            .catch((error) => {
                console.error('SAVE TO DB FETCH ERROR:', error);
            });
    }


//CONDITIONAL RENDER PART

    render() {

        if (!this.props.shown) {
            return null;
        }
        //case 1: list is not active yet
        else if (!this.state.isListActive) {
            return <div id={'root2'}>
                <ActivateListMode onClickCreateList={(e) => {
                    this.createListOnClick(e)
                }}/>
            </div>
        }

        //case 2: list is active but no list name has been added
        else if (this.state.currentItemsCounter === 0 && this.state.isListActive === true && this.state.listName === false) {
            return <>
                <NameYourListMode
                    proceedOnEnterPressNameMode={(e) => {
                        this.proceedOnEnterPressNameMode(e)
                    }}
                    proceedOnBtnClick={(e) => {
                        this.proceedOnBtnClickNameMode(e)
                    }
                    }
                />
            </>
        }

        //case 3: list is active but no list name or product has been added
        else if (this.state.currentItemsCounter === 0 && this.state.isListActive === true && this.state.listName !== false) {
            return <>
                <FirstItemMode
                    onClickPropsAdd={(e) => {
                        this.addItemOnClick(e)
                    }}
                    proceedOnEnterPress={(e) => {
                        this.proceedOnEnterPressFirstItemMode(e)
                    }
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
                        this.proceedOnEnterPressFirstItemMode(e)
                    }}
                />
            </>
        }
    }
}


//MODES

class ActivateListMode extends Component {
    render() {
        return <div className={'nameYourListMode'}>
            <div className={'nameYourListModeBox1'}></div>
            <div className={'nameYourListModeBox2'}>
                <h2>Stwórz nową listę!</h2>
                <button
                    onClick={this.props.onClickCreateList}
                    className={"activateBtn"} autoFocus> Start
                </button>
            </div>
            <div className={'nameYourListModeBox3'}></div>
        </div>
    }
}

class NameYourListMode extends Component {
    render() {
        return <div className={'nameYourListMode'}>
            <div className={'nameYourListModeBox1'}></div>
            <div className={'nameYourListModeBox2'}>
                <h2>Nazwij swoją listę</h2>
                <NameYourListInput proceedOnEnterPressNameMode={this.props.proceedOnEnterPressNameMode}
                                   proceedOnBtnClick={this.props.proceedOnBtnClick}/>
            </div>
            <div className={'nameYourListModeBox3'}></div>
        </div>
    }
}


class FirstItemMode extends Component {
    render() {
        return <div className={'nameYourListMode'}>
            <div className={'nameYourListModeBox1'}></div>
            <div className={'nameYourListModeBox2'}>
                <h2>Dodaj zakupy do listy</h2>
                <ShoppingListInput proceedOnEnterPress={this.props.proceedOnEnterPress}
                                   onClickPropsAdd={this.props.onClickPropsAdd}/>
            </div>
            <div className={'nameYourListModeBox3'}></div>

        </div>
    }
}

class EditionMode extends Component {
    render() {
        return <div className={'editYourListMode'}>
            <div className={'editYourListModeBox1'}></div>
            <div className={'editYourListModeBox2'}>
                <h2>Dodaj zakupy do listy</h2>
                <ShoppingListInput onClickPropsAdd={this.props.onClickPropsAdd}
                                   proceedOnEnterPress={this.props.proceedOnEnterPress}/>
                <ShoppingListDraft
                    currentItems={this.props.currentItems}
                    onClickPropsDelete={this.props.onClickPropsDelete}
                />
                <div className={'editionModeBtnContainer'}>
                    <button
                        className={"btn-sm btn-success editionModeBtn"}
                        onClick={(e) => {
                            this.props.onClickPropsSave(e);
                        }}>Zachowaj
                    </button>
                    <button className={"btn-sm btn-danger editionModeBtn"}
                            onClick={this.props.onClickClearList}>Wyczyść
                    </button>
                </div>
            </div>
            <div className={'nameYourListModeBox3'}></div>
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
            <li style={{marginTop: "5px"}} className={"liItem"}>
                <span className={"itemName"}>{this.props.itemContent}</span>
                <button
                    className={"btn-sm btn-warning itemBtn"}
                    onClick={(e) => {
                        this.props.onClickPropsDelete(e);
                    }}
                >&#10007;
                </button>
            </li>
        </>
    }
}

//HELPER COMPONENTS - INPUTS

class NameYourListInput extends Component {
    render() {
        return <div className={"inputContainer"}>
            <input type="text" placeholder={"nazwij swoją listę"}
                   onKeyPress={this.props.proceedOnEnterPressNameMode} className={"create-list"} autoFocus/>
            <button className={"addBtn app"} onClick={this.props.proceedOnBtnClick}>&#x2795;
            </button>
        </div>
    }
}gi

class ShoppingListInput extends Component {

    render() {
        return <div className={"inputContainer"}>
            <input className={"create-list"} type="text" placeholder={"dodaj nowy zakup"} onKeyPress={this.props.proceedOnEnterPress} autoFocus/>
            <button className={"addBtn"} onClick={this.props.onClickPropsAdd}>&#x2795;</button>
        </div>
    }
}

export default withRouter(CreateList);