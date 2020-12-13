import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';
import SavedLists from '../app/savedLists';
import RegForm from './regform'
import LogForm from './logform'
import {About, App} from '../app/app';

import {createBrowserHistory} from 'history';
import {Router} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../../css/app.css';
import Swal from 'sweetalert2';
const history = createBrowserHistory();


/**
 * Experimenting with hook..
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Logo() {
    return (
        <h2>
            <span className={'logo-span-color'}>lista</span>zakupow.<span className={'logo-span-color'}>com</span>.pl
        </h2>
    )
}

class FormUpperText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.formType === 'register') {
            return <div className={'homepage-welcome-box-h2-container'}>
                <Logo/>
                <h1>Zarejestruj się</h1>
            </div>
        }

        if (this.props.formType === 'login') {
            return <div className={'homepage-welcome-box-h2-container'}>
                <Logo/>
                <h1>Zaloguj się</h1>
            </div>
        }

    }
}


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regToken: 'initialVal',
            logToken: 'initialVal',
            activeFormType: 'register',
            loggedIn: false,
            user: 'anonymous',
            userFirstName: 'anonymous',
        };

        this.getToken = this.getToken.bind(this);
        this.loginStateUpdater = this.loginStateUpdater.bind(this);
        this.userStateUpdater = this.userStateUpdater.bind(this);
        this.historyLocationPusher = this.historyLocationPusher.bind(this);
        this.logoutAction = this.logoutAction.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.logToken === 'loggedOut') {
            this.logoutAction();
        }
    }

    componentDidMount() {
        if(this.state.logToken !== 'initialVal')
        this.setState({
            logToken: 'initialVal'
        })
    }

    logoutAction = () => {
        if (this.state.logToken === 'loggedOut') {
            let targetUrl = `${location.origin}/logout`;
            let request = new Request(targetUrl, {
                method: "POST",
                headers: {
                    "Access-Control-Request-Method": "POST, GET, OPTIONS",
                    "Origin": location.origin,
                }
            });

            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse === 'session invalidated') {
                        let targetUrl = `${location.origin}/login`;
                        let token;
                        let request = new Request(targetUrl, {
                            method: 'GET',
                            headers: {
                                'Access-Control-Request-Method': 'GET',
                                'Origin': location.origin,
                                'Content-Type': 'application/json',
                                'X-Custom-Header': 'logTokenRequest',
                            }
                        })
                        this.getToken(request, 'log');
                        this.setState({
                            user: 'anonymous',
                            userFirstName: 'anonymous',
                            logToken:'initialVal',
                            regToken:'initialVal'
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    setRegTokenBackToInitialVal = () => {
        console.log('triggered setRegTokenback fn')
        this.setState({
            regToken: 'initialVal'
        })
    }


    stateUpdater = (event) => {
        if (event.currentTarget.name === 'navLinkFormReg' && this.state.activeFormType !== 'register') {
            this.setState({activeFormType: 'register'})
        }

        if (event.currentTarget.name === 'navLinkFormLog' && this.state.activeFormType !== 'login') {
            this.setState({activeFormType: 'login'})
        }
    }
    /**
     * The predominant use of this function is to take care of loggedIn state and is both used in LoginPage, RegisterPage (login functionalities)
     * It is also used in logout functionality in App component and its use is to set loggedIn state to false.
     * @param input
     */
    loginStateUpdater = (input) => {
        console.log('loginStateUpdater triggered. Input:', input)
        if (input === true) {
            this.setState({
                loggedIn: true,
                activeFormType: '',
                logToken: '',
                regToken: ''
            })
        }

        if (input === false) {
            this.setState({
                loggedIn: false,
                activeFormType: 'login',
                logToken: 'loggedOut',
            })
            history.replace('/login');
        }
    }

    userStateUpdater = (input) => {
        console.log('userStateUpdater input', input)
        this.setState(
            {
                user: input[0],
                userFirstName: input[1]
            }
        )
    }

    getToken = (request, formType) => {
        if (this.state.regToken === 'initialVal' && formType === 'reg') {
            console.log('get token first condition met')
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse !== 'badRequest' && jsonResponse !== null && jsonResponse !== undefined & jsonResponse !== '') {
                        if (this.state.token !== jsonResponse) {
                            this.setState({regToken: jsonResponse})
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

        if (this.state.logToken === 'initialVal' && this.state.activeFormType !== 'register' || this.state.logToken === 'loggedOut' && formType === 'log') {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse !== 'badRequest' && jsonResponse !== null && jsonResponse !== undefined & jsonResponse !== '') {
                        if (this.state.token !== jsonResponse) {
                            this.setState({logToken: jsonResponse})
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

        if(formType === 'savedLists') {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse !== 'badRequest' && jsonResponse !== null && jsonResponse !== undefined & jsonResponse !== '') {
                        if (this.state.token !== jsonResponse) {
                            this.setState({savedListsToken: jsonResponse})
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    historyLocationPusher(path) {
        history.push(path);
    }

    render() {
        if (this.state.loggedIn === false) {
            return <div className={'homepage-main-container'}>
                <div className={'homepage-welcome-box'}>
                    <FormUpperText formType={this.state.activeFormType}/>
                    <Router history={history}>
                        <ul className={'homepage-btns-div'}>
                            <li className={'homepage-btn--log'} autoFocus>
                                <NavLink to='/login' name={'navLinkFormLog'} className={'form-link'}
                                         activeClassName={'form-link form-link--active'} onClick={this.stateUpdater}>Zaloguj
                                    się</NavLink>
                            </li>
                            <li className={'homepage-btn--reg'} autoFocus>
                                <NavLink to='/register' name={'navLinkFormReg'} className={'form-link'}
                                         activeClassName={'form-link form-link--active'} onClick={this.stateUpdater}>Bezpłatna
                                    rejestracja</NavLink>
                            </li>
                        </ul>
                        <Switch>
                            <Route exact path="/login"
                                   render={() => <LogForm
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
                                       token={this.state.logToken}
                                       userStateUpdater={this.userStateUpdater}
                                   />}
                            />
                            <Route exact path="/register"
                                   render={() => <RegForm
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
                                       setRegTokenBackToInitialVal={this.setRegTokenBackToInitialVal}
                                       token={this.state.regToken}
                                       userStateUpdater={this.userStateUpdater}
                                   />
                                   }

                            />
                            <Redirect from="/" exact to="/register"/>
                        </Switch>
                    </Router>

                </div>
            </div>
        } else if (this.state.loggedIn === true && this.state.user !== 'anonymous') {
            return <App view={'application'}
                        userId={this.state.user}
                        loginStateUpdater={this.loginStateUpdater}
                        logoutAction={this.logoutAction}
                        userStateUpdater={this.userStateUpdater}
                        userFirstName={this.state.userFirstName}
                        getToken={this.getToken}

            />
        }
    }
}


export default Homepage;
export {Logo}