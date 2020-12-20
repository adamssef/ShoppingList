import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import LogForm from './logform'
import Logo from './logo';
import SavedLists from '../app/savedLists';
import RegForm from './regform'
import ChangePasswordForm from './changePasswordForm'
import TokenVerification from './tokenVerification'
import {About, App} from '../app/app';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../../css/app.css';
import Swal from 'sweetalert2';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Router} from "react-router-dom";
import FormUpperText from "./formUpperText";
const history = createBrowserHistory();



class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFormType: 'login',
            loggedIn: false,
            logToken: 'initialVal',
            regToken: 'initialVal',
            user: 'anonymous',
            userFirstName: 'anonymous',
        };

        this.getToken = this.getToken.bind(this);
        this.loginStateUpdater = this.loginStateUpdater.bind(this);
        this.userStateUpdater = this.userStateUpdater.bind(this);
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
        this.setState({
            regToken: 'initialVal'
        })
    }


    stateUpdater = (event) => {
        event.preventDefault();
        if(event.currentTarget.name === 'forgotten-password-link'){
            this.setState({activeFormType:'changePasswordRequest'})
            history.push('/change-password-request')
        }

        if(event.currentTarget.classList.contains('change-pwd-form-btn')){
            this.setState({activeFormType:'tokenVerification'})
            history.push('/token-verification')
        }

        if (event.currentTarget.name === 'navLinkFormReg' && this.state.activeFormType !== 'register') {
            this.setState({activeFormType: 'register'})
            history.push('/register');
        }

        if (event.currentTarget.name === 'navLinkFormLog' && this.state.activeFormType !== 'login') {
            this.setState({activeFormType: 'login'})
            history.push('/login');
        }

        if (event.currentTarget.name === 'back-to-login-page' && this.state.activeFormType !== 'login') {
            this.setState({activeFormType: 'login'})
            history.push('/login');
        }
    }
    /**
     * The predominant use of this function is to take care of loggedIn state and is both used in LoginPage, RegisterPage (login functionalities)
     * It is also used in logout functionality in App component and its use is to set loggedIn state to false.
     * @param input
     */
    loginStateUpdater = (input) => {
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
        this.setState(
            {
                user: input[0],
                userFirstName: input[1]
            }
        )
    }

    getToken = (request, formType) => {
        if (this.state.regToken === 'initialVal' && formType === 'reg') {
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


    render() {
        if(!this.state.loggedIn && this.state.activeFormType === 'changePasswordRequest') {
            return <ChangePasswordForm
                activeFormType={this.state.activeFormType}
                homepageStateUpdater={this.stateUpdater}
            />
        }

        if(!this.state.loggedIn && this.state.activeFormType === 'tokenVerification') {
            return <TokenVerification
                activeFormType={this.state.activeFormType}
                homepageStateUpdater={this.stateUpdater}
            />
        }

        if (!this.state.loggedIn && (this.state.activeFormType === 'register' || this.state.activeFormType === 'login')) {
            return <div className={'homepage-main-container'}>
                <div className={'homepage-welcome-box'}>
                    <div className={'logo-and-upper-form-text-div'}>
                        <Logo/>
                        <FormUpperText activeFormType={this.state.activeFormType}/>
                    </div>
                    <Router history={history}>
                        <ul className={'homepage-btns-div'}>
                            <li className={'homepage-btn--log'} autoFocus>
                                <NavLink to='/login' name={'navLinkFormLog'} className={'form-link'}
                                         activeClassName={'form-link form-link--active'} onClick={this.stateUpdater}>Zaloguj
                                    się</NavLink>
                            </li>
                            <li className={'homepage-btn--reg'} autoFocus>
                                <NavLink to='/register' name={'navLinkFormReg'} className={'form-link'}
                                         activeClassName={'form-link form-link--active'} onClick={(e)=>this.stateUpdater(e)}>Bezpłatna
                                    rejestracja</NavLink>
                            </li>
                        </ul>
                        <Switch>
                            <Route exact path='/login'
                                   render={() => <LogForm
                                       activeFormType = {this.state.activeFormType}
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
                                       token={this.state.logToken}
                                       homepageStateUpdater={this.stateUpdater}
                                       userStateUpdater={this.userStateUpdater}
                                   />}
                            />
                            <Route exact path='/register'
                                   render={() => <RegForm
                                       activeFormType = {this.state.activeFormType}
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
                                       setRegTokenBackToInitialVal={this.setRegTokenBackToInitialVal}
                                       token={this.state.regToken}
                                       userStateUpdater={this.userStateUpdater}
                                   />
                                   }
                            />
                            <Route exact path='/change-password-request'/>
                            <Route exact path='token-verification'/>
                            <Redirect from="/" exact to="/login"/>
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
export {Logo};