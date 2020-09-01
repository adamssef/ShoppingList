import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    withRouter,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";

import { Router } from 'react-router-dom';

import {createBrowserHistory} from "history";
const history = createBrowserHistory();

import '../css/app.css';
const $ = require('jquery');

import 'bootstrap';
import savedLists from "./savedLists";





class App extends Component {
    constructor(props) {
        super(props);
        this.singleListVerifier = this.singleListVerifier.bind(this);
        this.refreshAttemptVerifier = this.refreshAttemptVerifier.bind(this);
        this.state = {
            createListStateReset:false,
            isCreateListShown: true,
            createNewList: true,
            savedLists: false,
            about: false,
            savedListsCounter: -1,
            visited: false,
            saveListsSingleListMode: false,
            singleListRefreshAttempt: false
        };


    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.savedListsCounter === 1 && !this.state.visited) {
            this.setState({
                visited: true,
            })
        } else if (this.state.visited && this.state.saveListsCounter > 0) {
            this.setState({
                savedListsCounter: -1
            })
        }
    }

    componentDidMount() {
        history.push('/dashboard')
        if (this.props.view === 'new_list') {
            this.setState({createNewList: true})
        }
    }

    removeDefaultNavClass = (e) => {
        if (e.target.id !== 'defNavEl' && !e.target.classList.contains('')) {
            document.getElementById("defNavEl").classList.remove("default")
        } else {
            document.getElementById("defNavEl").classList.add("default")
        }
    }

    stateUpdater = (e) => {
       if (e.target.href !== '/dashboard/new_list'){
           this.setState({
               isCreateListShown:false
           })
        }
        if (e.target.href === 'https://localhost:8000/dashboard/about') {
            this.setState({
                createNewList: false,
                savedLists: false,
                about: true,
                savedListsCounter: -1,
                visited: false,
                createListStateReset: true,
                isCreateListShown: false,
            })
        } else if (e.target.href === 'https://localhost:8000/dashboard/saved') {
            this.setState({
                createNewList: false,
                savedLists: true,
                about: false,
                savedListsCounter: this.state.savedListsCounter + 1,
                createListStateReset: true,
                isCreateListShown: false
            })
        } else if (e.target.href === 'https://localhost:8000/dashboard/new_list') {
            console.log('I am waorking')
            this.setState({
                isCreateListShown:true,
                createNewList: true,
                savedLists: false,
                about: false,
                savedListsCounter: -1,
                visited: false,
                createListStateReset: true,

            })
        }

    }


    comboFunctioner = (e) => {
        this.removeDefaultNavClass(e);
        this.stateUpdater(e);
        this.refreshAttemptVerifier(e)
    }

    comboStateUpdater = (userState, loginState) => {
        this.props.userStateUpdater(userState);
        this.props.loginStateUpdater(loginState);
        this.props.logoutAction();
    }

    refreshAttemptVerifier = (e) => {
        if(this.state.saveListsSingleListMode) {
            this.setState({
                singleListRefreshAttempt: true
            })
        }
    }

    singleListVerifier = (value) => {
        if (value === true) {
            this.setState({
                saveListsSingleListMode: true,
            })
        } else if (!value) {
            this.setState({
                saveListsSingleListMode: false,
                singleListRefreshAttempt: false
            })
        }
    }

    render() {
        return <Router history={history}>
            <div>
                <nav>
                    <ul>
                        <li className={"inline left create"}>
                            <NavLink to="/dashboard/new_list" className={"navLink default"} onClick={e => this.comboFunctioner(e)}
                                     id={"defNavEl"}>Nowa lista</NavLink>
                        </li>
                        <li className={"inline saved-lists"}>
                            <NavLink to="/dashboard/saved" className={"navLink"} onClick={e => this.comboFunctioner(e)}>Zapisane
                                listy</NavLink>
                        </li>
                        <li className={"freeSpaceNavLi"}>{null}</li>
                        <li className={"freeSpaceNavLi"}>{null}</li>
                        <li className={"inline right about"}>
                            <NavLink to="/login" className={"navLink"} onClick={e => this.comboFunctioner(e)}><button onClick={()=>this.comboStateUpdater('anonymous', false)}>Wyloguj</button></NavLink>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/dashboard/new_list"
                            render={()=><CreateList
                                            shown={this.state.isCreateListShown}
                                            createListStateReset={this.state.createListStateReset}
                                            userId={this.props.userId}

                            />}/>
                    <Route exact path="/dashboard/saved"
                           render={() => <SavedLists
                                stateProps={this.state.savedListsCounter}
                                singleListVerifier={this.singleListVerifier}
                                appProps={this.state}
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
        </Router>
    }
}

class Dashboard extends Component {
    render(){
        return <h1>Witaj {this.props.userFirstName}  !</h1>
    }
}

class About extends Component {
    render(){
        return <h2>WDupa!</h2>
    }

}
export  {App, About};
