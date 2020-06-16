import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    withRouter,
    Router,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";

import {createBrowserHistory} from "history";
const history = createBrowserHistory();

require('../css/app.css');
const $ = require('jquery');

import 'bootstrap';
import savedLists from "./savedLists";

const imgPath = require('../images/photo.jpg');


class App extends Component {
    constructor(props) {
        super(props);
        this.singleListVerifier = this.singleListVerifier.bind(this);
        this.refreshAttemptVerifier = this.refreshAttemptVerifier.bind(this);
        this.state = {
            createNewList: true,
            savedLists: false,
            about: false,
            savedListsCounter: -1,
            visited: false,
            saveListsSingleListMode: false,
            singleListRefreshAttempt: false
        };


    }

    componentDidMount() {
        document.getElementById('root').style = {backgroundImage: "url('images/photo.1af09e53.jpg')"}
        console.log("APP: I got mounted!")
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("APP: savedListsCounter state: " + this.state.savedListsCounter)
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

    removeDefaultNavClass = (e) => {
        if (e.target.id !== 'defNavEl' && !e.target.classList.contains('')) {
            document.getElementById("defNavEl").classList.remove("default")
        } else {
            document.getElementById("defNavEl").classList.add("default")
        }
    }

    stateUpdater = (e) => {
        if (e.target.href === 'https://localhost:8000/about') {
            this.setState({
                createNewList: false,
                savedLists: false,
                about: true,
                savedListsCounter: -1,
                visited: false
            })
        } else if (e.target.href === 'https://localhost:8000/saved') {
            this.setState({
                createNewList: false,
                savedLists: true,
                about: false,
                savedListsCounter: this.state.savedListsCounter + 1
            })
        } else if (e.target.href === 'https://localhost:8000/') {
            this.setState({
                createNewList: true,
                savedLists: false,
                about: false,
                savedListsCounter: -1,
                visited: false
            })
        }

    }


    comboFunctioner = (e) => {
        this.removeDefaultNavClass(e);
        this.stateUpdater(e);
        this.refreshAttemptVerifier(e)
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
                            <NavLink to="/" className={"navLink default"} onClick={e => this.comboFunctioner(e)}
                                     id={"defNavEl"}>Nowa lista</NavLink>
                        </li>
                        <li className={"inline saved-lists"}>
                            <NavLink to="/saved" className={"navLink"} onClick={e => this.comboFunctioner(e)}>Zapisane
                                listy</NavLink>
                        </li>
                        <li className={"freeSpaceNavLi"}>{null}</li>
                        <li className={"freeSpaceNavLi"}>{null}</li>
                        <li className={"inline right about"}>
                            <NavLink to="/about" className={"navLink"} onClick={e => this.comboFunctioner(e)}>O
                                mnie</NavLink>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/" component={CreateList}/>
                    <Route exact path="/saved"
                           render={() => <SavedLists
                                stateProps={this.state.savedListsCounter}
                                singleListVerifier={this.singleListVerifier}
                                appProps={this.state}
                            />
                        }
                    />
                    <Route exact path="/about" component={About}/>
                </Switch>
            </div>
        </Router>
    }
}

class About extends Component {
    render(){
        return <h2>work in progress...</h2>
    }

}
export  {App, About};
