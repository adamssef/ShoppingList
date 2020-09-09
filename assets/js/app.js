import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';

import Homepage, {Logo} from './homepage.js'
import CreateList from './createNewList';
import SavedLists from './savedLists';
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

import '../css/app.css';

const $ = require('jquery');

import 'bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faFolderOpen, faPlusSquare} from '@fortawesome/free-solid-svg-icons'


class App extends Component {
    constructor(props) {
        super(props);
        this.singleListVerifier = this.singleListVerifier.bind(this);
        this.refreshAttemptVerifier = this.refreshAttemptVerifier.bind(this);
        this.state = {
            createListStateReset: false,
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
        // let events = ['mouseover', 'mouseleave'];
        // for (let i = 0; i < events.length; i++) {
        //     document.querySelector('.faBars-wrapper__hover-square').addEventListener(events[i], e => this.menuHoverEffect(e))
        // }
        // document.querySelector('.faBars-wrapper__hover-square')
        history.push('/dashboard')
        if (this.props.view === 'new_list') {
            this.setState({createNewList: true})
        }
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

    removeDefaultNavClass = (e) => {
        if (e.target.id !== 'defNavEl' && !e.target.classList.contains('')) {
            document.getElementById("defNavEl").classList.remove("default")
        } else {
            document.getElementById("defNavEl").classList.add("default")
        }
    }

    stateUpdater = (e) => {
        if (e.target.href !== '/dashboard/new_list') {
            this.setState({
                isCreateListShown: false
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
                isCreateListShown: true,
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
        if (this.state.saveListsSingleListMode) {
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

    showMenu = () => {
        // let menuStyle = document.querySelector('#navBar').style;
        // let faBarsWrapperStyle = document.querySelector('.faBars-wrapper').style;
        let sidebarStyle = document.querySelector('.sidebar').style;

        // let elements = [menuStyle, faBarsWrapperStyle, sidebarStyle];
        let elements = [sidebarStyle];

        sidebarStyle.width === '80px' || sidebarStyle.width === '79px' ? sidebarStyle.width = '300px' : sidebarStyle.width = '80px';


        // for (let i = 0; i < elements.length; i++) {
        //         elements[i].width === '80px' || '79px' ? elements[i].width = '300px' || '299px' : elements[i].width = '80px';
        // }

    }

    render() {
        return <Router history={history}>
            <div>
                <div className={'logo-holder'}><Logo/></div>
                <div id={"app-container"}>
                    <div className={'sidebar'}>

                        <nav id={'navBar'}>
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faBars}
                                                     color={'red'}
                                                     onClick={() => this.showMenu()}
                                                     className={'menu-icons'}
                                    />
                                </li>
                                {/*<li className={"inline left create"}>*/}
                                <li>
                                    <NavLink to="/dashboard/new_list" className={"navLink default"}
                                             onClick={e => this.comboFunctioner(e)}
                                             id={"defNavEl"}>

                                            <FontAwesomeIcon icon={faPlusSquare} className = {'menu-icons'}/>

                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/saved" className={"navLink"}
                                             onClick={e => this.comboFunctioner(e)}>

                                            <FontAwesomeIcon icon={faFolderOpen} className = {'menu-icons'}/>

                                    </NavLink>
                                </li>
                                {/*<li className={"freeSpaceNavLi"}>{null}</li>*/}
                                {/*<li className={"freeSpaceNavLi"}>{null}</li>*/}
                                {/*<li className={"inline right about"}>*/}
                                {/*</li>*/}
                            </ul>
                        </nav>

                        <Switch>
                            <Route exact path="/dashboard/new_list"
                                   render={() => <CreateList
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
                        <NavLink to="/login" className={"navLink logout-btn"} onClick={e => this.comboFunctioner(e)}>
                            <button onClick={() => this.comboStateUpdater('anonymous', false)}>Wyloguj</button>
                        </NavLink>

                        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

                    </div>
                </div>
            </div>
        </Router>
    }
}

class Dashboard extends Component {
    render() {
        // return <h1>Witaj {this.props.userFirstName} !</h1>
        return null;
    }
}

class About extends Component {
    render() {
        return <h2>WDupa!</h2>
    }

}

export {App, About};
