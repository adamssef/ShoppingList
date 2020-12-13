import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


import '../../css/app.css';

import Homepage, {Logo} from '../homepage/homepage.js'
import SavedLists from './savedLists';
import SingleListDisplayModeCreate from "./singleListDisplayModeCreate.js";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    withRouter,
    Switch,
    Route,
    Link,
    NavLink
} from 'react-router-dom';

import {Router} from 'react-router-dom';

import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

const $ = require('jquery');

import 'bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faFolderOpen, faPlusSquare, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import Swal from "sweetalert2";


class App extends Component {
    constructor(props) {
        super(props);

        this.stateUpdaterSidebarToggle = this.stateUpdaterSidebarToggle.bind(this);
        this.dataStateUpdater = this.dataStateUpdater.bind(this);//to be added in props
        this.getSavedListsToken = this.getSavedListsToken.bind(this);//to be added in props
        this.getUserListCollection = this.getUserListCollection.bind(this);// to be added in props
        this.listItemsParentUpdater = this.listItemsParentUpdater.bind(this);//to be added in props
        this.listItemsParentUpdaterDeleteOnly = this.listItemsParentUpdaterDeleteOnly.bind(this);//to be added in props
        this.listTitleParentUpdater = this.listTitleParentUpdater.bind(this);//to be added in props
        this.getCurrentArrOfItems = this.getCurrentArrOfItems.bind(this);
        this.addNewLine = this.addNewLine.bind(this);
        this.saveAndSendListToDb = this.saveAndSendListToDb.bind(this);
        this.proceedOnBtnClickNameMode = this.proceedOnBtnClickNameMode.bind(this)
        this.newSimpleStateUpdater = this.newSimpleStateUpdater.bind(this);

        this.state = {
            data: null,
            createListStateReset: false,
            isCreateListShown: true,
            createNewList: true,
            savedLists: false,
            savedListsToken: false,
            about: false,
            allListsDisplayMode: '',
            singleListDisplayMode: '',
            currentlyDisplayedListPosition: '',
            sidebar: 'off',
            isListCollectionInitiallyFetched:false,
            createBlankItemLine: false,
            listName: false,

        };


    }

    componentDidMount() {
        history.push('/dashboard')
        if (this.props.view === 'application') {
            this.setState({createNewList: true})
        }

        this.getSavedListsToken();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.allListsDisplayMode && !this.state.singleListDisplayMode && !this.state.createNewList){
            history.push('/dashboard/saved');
        }

        if(this.props.userId !== 'anonymous') {
            if(this.state.savedListsToken !== false && !this.state.isListCollectionInitiallyFetched) {
                this.getUserListCollection();
                this.setState({
                    isListCollectionInitiallyFetched:true
                })
            }
        }
    }


    addNewLine = (e) => {
        if (!this.state.createBlankItemLine) {
            this.setState({
                createBlankItemLine: true
            })
        }
    }

    comboStateUpdater = (userState, loginState) => {
        this.props.userStateUpdater(userState);
        this.props.loginStateUpdater(loginState);
        this.props.logoutAction();
    }

    dataStateUpdater = () => {
        getCurrentArrOfItems = () => {
            let currentArrOfItems = [];
            [...document.getElementsByClassName('single-list-item-content')].map(item => {
                currentArrOfItems.push(this.decodeHTMLEntities(item.innerText))
            })

            return currentArrOfItems;
        }


        let dataMock = this.state.data;
        if (this.state.data !== null) {
            dataMock[this.state.currentlyDisplayedListPosition].listItems = getCurrentArrOfItems();

            if (this.state.data[this.state.currentlyDisplayedListPosition]['listItems'] !== undefined && this.state.data[this.state.currentlyDisplayedListPosition][['listItems']].length !== this.getCurrentArrOfItems().length) {
                this.setState({
                    data: dataMock
                })
            }
        }
    }

    decodeHTMLEntities = (text) => {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    getCurrentArrOfItems = () => {
        let currentArrOfItems = [];
        [...document.getElementsByClassName('single-list-item-content')].map(item => {
            currentArrOfItems.push(this.decodeHTMLEntities(item.innerText))
        })

        return currentArrOfItems;
    }

    getSavedListsToken = () => {
        let targetUrl = `${location.origin}/dashboard/saved/${this.props.userId}`;
        let token;
        let request = new Request(targetUrl, {
            method: 'GET',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Origin': location.origin,
                'Content-Type': 'application/json',
                'X-Custom-Header': 'savedListsTokenRequest',
            }
        })

        fetch(request)
            .then(res => res.json())
            .then(json => {
                this.setState({savedListsToken: json})
            })
            .then(() => {
                if (this.state.savedListsToken === false) {
                    this.getUserListCollection();
                }
            })

    }

    getUserListCollection = () => {
        let targetUrl = `${location.origin}/dashboard/saved/${this.props.userId}`;
        let request = new Request(targetUrl, {
            method: "GET",
            headers: {
                "Access-Control-Request-Methods": "GET",
                "Origin": location.origin,
                "Content-Type": "application/json",
                "SavedListsToken-Header": this.state.savedListsToken
            },
            mode: "cors"
        });
        if (this.state.savedListsToken !== false) {
            fetch(request)
                .then(res => res.json())
                .then(json => {
                    json = Array.reverse(json);
                    this.setState({data: json})
                });
        } else {
            return null;
        }
    }

    listItemsParentUpdater = (source) => {
        console.log('listItemsParentUpdater triggered in app')
        let currentArrOfItems = this.getCurrentArrOfItems();
        console.log(currentArrOfItems);

        let dataMock = this.state.data;
        dataMock[this.state.currentlyDisplayedListPosition].listItems = currentArrOfItems;

        this.setState({
                data: dataMock,
                createBlankItemLine: false
            }
        )
    }

    listItemsParentUpdaterDeleteOnly = (itemId, listId) => {
        let dataMock = this.state.data;
        dataMock[this.state.currentlyDisplayedListPosition].listItems.splice(itemId, 1);
        this.setState({
            data:dataMock
        })
    }

    listTitleParentUpdater = (e, id) => {
        //1)creating the data mock
        let dataMock = this.state.data;


        //2) making change of the selected list title in the mock
        dataMock[Object.keys(this.state.data).length - parseInt(id)].name = this.decodeHTMLEntities(document.querySelector('.list-title').innerText);

        //3)replacing data with data mock
        this.setState({
            data: dataMock
        })
    }

    menuHoverEffect = (e) => {
        if (e.type === 'mouseover') {
            e.currentTarget.style.backgroundColor = '#fafafa';
            e.currentTarget.style.boxShadow = '0 0 0 1px #ededed';
        }

        if (e.type === 'mouseleave') {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.boxShadow = '';
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


    saveAndSendListToDb(e) {
        let listElements = document.getElementById("listDraft").getElementsByClassName('itemName');
        let itemObject = [];
        Array.from(listElements).map(e => {
            itemObject.push(e.innerText);
        })


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

        fetch(request)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    isListActive: false,
                    currentItems: [],
                    currentItemsCounter: 0
                })

                this.getUserListCollection();
            })
            .catch((error) => {
                console.error('SAVE TO DB FETCH ERROR:', error);
            });
    }

    newSimpleStateUpdater = (targetViewType, e) => {
        if (targetViewType === 'single') {
            this.setState({
                allListsDisplayMode: false,
                singleListDisplayMode: true,
                currentlyDisplayedListPosition: e.currentTarget.dataset.index,
            })
        }

        if (targetViewType === 'all') {
            this.setState({
                allListsDisplayMode: true,
                singleListDisplayMode: false,
                currentlyDisplayedListPosition: null,
                createNewList:false,
            })
        }

        if(targetViewType ==='create'){
            this.setState({
                allListsDisplayMode: false,
                singleListDisplayMode: false,
                currentlyDisplayedListPosition: null,
                createNewList:true,
            })
        }
    }

    stateUpdaterSidebarToggle = () => {
        if (this.state.sidebar === 'off') {
            this.setState({
                sidebar: 'on',
            }, () => this.toggleMenu())
        } else if (this.state.sidebar === 'on') {
            this.setState({
                sidebar: 'off',
            }, () => this.toggleMenu())
        }
    }


    toggleMenu = () => {

        /**
         *toggleTimeout is a helper function that supposes to delay text apperance in the sidebar and add more of a "flow" experience to the user
         * */
        let toggleTimeout = () => {
            setTimeout(() => {
                switch (this.state.sidebar) {
                    case "on":
                        document.querySelector("span[name='create-list']").innerHTML = "Stwórz nową listę";
                        document.querySelector("span[name='display-lists']").innerHTML = "Zapisane listy";
                        document.querySelector("span[name='sign-out']").innerHTML = "Wyloguj się";


                        if (window.innerWidth <= 450) {
                            if (document.getElementsByClassName('lists-container')[0] !== undefined) {
                                document.getElementsByClassName('lists-container')[0].style.filter = 'blur(5px)';
                                document.getElementsByClassName('lists-container')[0].style.pointerEvents = 'none';
                            }

                            if (document.getElementsByClassName('single-list-view-general-container')[0] !== undefined) {
                                document.getElementsByClassName('single-list-view-general-container')[0].style.filter = 'blur(5px)'
                                document.getElementsByClassName('single-list-view-general-container')[0].style.pointerEvents = 'none';
                            }
                        }
                        break;
                    case 'off':
                        sidebarStyle.width = '79px';
                        document.querySelector("span[name='create-list']").innerHTML = "";
                        document.querySelector("span[name='display-lists']").innerHTML = "";
                        document.querySelector("span[name='sign-out']").innerHTML = "";
                        if (window.innerWidth <= 450) {
                            if (document.getElementsByClassName('lists-container')[0] !== undefined) {
                                document.getElementsByClassName('lists-container')[0].style.filter = '';
                                document.getElementsByClassName('lists-container')[0].style.pointerEvents = 'auto';
                            }

                            if (document.getElementsByClassName('single-list-view-general-container')[0] !== undefined) {
                                document.getElementsByClassName('single-list-view-general-container')[0].style.filter = '';
                                document.getElementsByClassName('single-list-view-general-container')[0].style.pointerEvents = 'auto';
                            }
                        }
                        break;
                }
            }, 200)

            const sidebarWidth = document.querySelector('.sidebar').offsetWidth;
            const sidebarStyle = document.querySelector('.sidebar').style;
            let ulStyle = document.querySelector('nav ul').style;
            let menuItems = document.querySelectorAll('.menu-icons');


            switch (this.state.sidebar) {
                case "on":
                    sidebarStyle.width = '200px';
                    break;
                case "off":
                    null;
                    break;
            }
        }
        toggleTimeout();
    }


    render() {
        return <Router history={history}>
            <div>
                {/*<NavLink to='/dashboard/'><div className={'logo-holder'}><Logo/></div></NavLink>*/}
                <div id={"app-container"}>
                    <div className={'sidebar'}>
                        <nav id={'navBar'}>
                            <ul>
                                <li onClick={(e) => this.stateUpdaterSidebarToggle()} className={'sidebar__li--menu'}>
                                    <FontAwesomeIcon icon={faBars}
                                                     color={'red'}
                                                     className={'menu-icons menu-icons__item menu-icons__item--first-in-column'}
                                    />
                                </li>
                                <li className={'sidebar__li--first-item'}>
                                    <NavLink to="/dashboard/new-list" className={"navLink"}>


                                        <FontAwesomeIcon icon={faPlusSquare} className={'menu-icons menu-icons__item'}/>
                                        <span></span>
                                        <span className={'menu-item__span'} name={'create-list'}></span>
                                    </NavLink>
                                </li>
                                <li className={'sidebar__li--item'}
                                    onClick={(e) => this.newSimpleStateUpdater('all', e)}>
                                    <NavLink to="/dashboard/saved" className={"navLink"}>
                                        <FontAwesomeIcon icon={faFolderOpen}
                                                         className={'menu-icons menu-icons__folder-item'}
                                        />

                                        <span></span>
                                        <span className={'menu-item__span'} name={'display-lists'}></span>
                                    </NavLink>
                                </li>
                                <li className={'sidebar__li--item'}
                                    onClick={() => this.comboStateUpdater('anonymous', false)}>
                                    <NavLink to="/login" className={"navLink logout-btn"}>
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            className={'menu-icons menu-icons__item'}
                                        />
                                        <span></span>
                                        <span className={'menu-item__span'} name={'sign-out'}></span>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <Switch>
                        <Route exact path="/dashboard/new-list"
                            render={()=><SingleListDisplayModeCreate
                                width={this.state.width}
                                parentState={this.state}
                                addNewLine={this.addNewLine}
                                createBlankItemLine={this.state.createBlankItemLine}
                                userId={this.props.userId}
                                newSimpleStateUpdater={this.newSimpleStateUpdater}
                                currentlyDisplayedListPosition={this.state.currentlyDisplayedListPosition}
                                getToken={this.props.getToken}
                                dataStateUpdater={this.dataStateUpdater}//to verify if i really need this
                                getCurrentListOfItems={this.getCurrentArrOfItems}
                                getSavedListsToken={this.getSavedListsToken}
                                getUserListCollection={this.getUserListCollection}
                                listItemsParentUpdater={this.listItemsParentUpdater}
                                listItemsParentUpdaterDeleteOnly={this.listItemsParentUpdaterDeleteOnly}
                                listTitleParentUpdater={this.listTitleParentUpdater}
                            />}/>
                        <Route exact path="/dashboard/saved"
                               render={() => <SavedLists
                                   parentState={this.state}
                                   addNewLine={this.addNewLine}
                                   createBlankItemLine={this.state.createBlankItemLine}
                                   userId={this.props.userId}
                                   newSimpleStateUpdater={this.newSimpleStateUpdater}
                                   currentlyDisplayedListPosition={this.state.currentlyDisplayedListPosition}
                                   getToken={this.props.getToken}
                                   dataStateUpdater={this.dataStateUpdater}//to verify if i really need this
                                   getCurrentListOfItems={this.getCurrentArrOfItems}
                                   getSavedListsToken={this.getSavedListsToken}
                                   getUserListCollection={this.getUserListCollection}
                                   listItemsParentUpdater={this.listItemsParentUpdater}
                                   listItemsParentUpdaterDeleteOnly={this.listItemsParentUpdaterDeleteOnly}
                                   listTitleParentUpdater={this.listTitleParentUpdater}
                               />
                               }
                        />
                        <Route exact path="/dashboard/about" component={About}/>
                        <Route exact path="/dashboard"
                               render={() => <Dashboard userFirstName={this.props.userFirstName}/>
                               }
                        />
                    </Switch>
                </div>

            </div>

        </Router>
    }
}


class Dashboard extends Component {
    render() {
        return null;
    }
}

class About extends Component {
    render() {
        return <h2></h2>
    }

}

export {App, About};
