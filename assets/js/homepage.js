import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';
import SavedLists from "./savedLists";
import {About, App} from "./app";

import {createBrowserHistory} from "history";
import {Router} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoffee} from "@fortawesome/free-solid-svg-icons";
import '../css/app.css';


class RegForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginField: '',
            fNameField: '',
            passwordField: '',
            cpasswordField: '',
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            // token: 'initialVal',
            formCorrect: false,
            doesUserExists: null,
        }
    }

    updateDimensions = () => {
        this.setState({
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            }
        )
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        document.querySelector('#reg-form').addEventListener("keyup", this.inputValidator);
        document.querySelector("#reg-form").addEventListener("focusout", this.borderWidthRegulator);
        document.querySelector("#reg-form").addEventListener("focusin", this.borderWidthRegulator);

        let targetUrl = `${location.origin}/register`;
        let token;
        let request = new Request(targetUrl, {
            method: 'GET',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Origin': location.origin,
                'Content-Type': 'application/json',
                'X-Custom-Header': 'regTokenRequest',
            }
        })

        if (this.props.token === 'initialVal') {
            this.props.getToken(request, 'reg');
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.isFormValid();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    getTokenRequest = (input) => {
        if (input === 'reg') {
            let targetUrl = `${location.origin}/register`;
            return new Request(targetUrl, {
                method: 'GET',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Origin': location.origin,
                    'Content-Type': 'application/json',
                    'X-Custom-Header': 'regTokenRequest',
                }
            })
        }

        if(input === 'log') {
            let targetUrl = `${location.origin}/login`;
            let request = new Request(targetUrl, {
                method: 'GET',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Origin': location.origin,
                    'Content-Type': 'application/json',
                    'X-Custom-Header': 'logTokenRequest',
                }
            })
        }
    }


    formSendRegister = (e) => {
        e.preventDefault();
        let login = document.getElementsByName('email')[0].value;
        let fName = document.getElementsByName('fName')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let token = document.getElementsByName('regToken')[0].value;
        let loginDetails = {"email": login, "password": password, "fName": fName, "regToken": token};

        const formData = new FormData();
        for (let [key, value] of Object.entries(loginDetails)) {
            formData.append(key, value);
        }


        let targetUrl = `${location.origin}/register`;
        let request = new Request(targetUrl, {
            body: formData,
            method: "POST",
            headers: {
                "Access-Control-Request-Method": "POST, GET, OPTIONS",
                "Origin": location.origin,
                // 'X-Custom-Header': this.state.doesUserExists ? ''
            }
        });

        fetch(request)
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
                if (response === 'user already exists') {
                    console.log('user exists')
                    this.setState({
                        doesUserExists: true,
                        formCorrect: false,
                    })
                } else if (response[0] === 'registration successful') {
                    response.shift();
                    console.log('user does not exists. reg success')
                    //TODO test to be deleted
                    console.log(response)
                    //TODO END
                    this.setState({
                        doesUserExists: false,
                        formCorrect: true,
                    })

                    this.props.loginStateUpdater(true);
                    this.props.userStateUpdater(response);
                }
            })
            .catch((error) => {
                console.error('REGISTRATION ERROR:', error)
            });
    }


    /**
     * isFormValid used to be helper funcion of api validate, but it has been moved up as a component function
     * isFormValid checks if all the fields are filled correctly UI-wise
     * its validation bases on constraints validation API
     * */
    isFormValid = () => {
        let emailField = document.getElementsByName('email')[0];
        let passwordField = document.getElementsByName('password')[0];
        let cpasswordField = document.getElementsByName('cpassword')[0];
        let fNameField = document.getElementsByName('fName')[0];

        if (!emailField.validity.typeMismatch && !passwordField.validity.patternMismatch && !passwordField.validity.valueMissing && cpasswordField.value === passwordField.value && !cpasswordField.validity.valueMissing && !fNameField.validity.tooLong && !fNameField.validity.valueMissing && this.state.doesUserExists !== true) {
            if (this.state.formCorrect === false) {
                this.setState({
                    formCorrect: true,
                })
            }
            return true;
        } else {
            return false;
        }
    }


    /**
     *  apiValidate is a function that sets the formCorrect state of the form and is triggered on onKeyUp event on a form for mobile screens
     *  this is much faster and prettier than the verification method used for large screens
     *  it handles the way input are styled depending on the values provided by 'Constraint validation API'
     *
     * */
    inputValidator = (event) => {
        this.isFormValid();

        let password = document.querySelector("input[name='password']");
        let cpassword = document.querySelector("input[name='cpassword']");

        if (
            event.target.name === 'cpassword' &&
            event.target.value !== password.value
        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(255,0,0, 0.5)',
                borderWidth: '2px',
                borderStyle: 'solid'
            });
        } else if (
            event.target.name === 'cpassword' &&
            (event.target.value !== password.value)
        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(255,0,0, 0.5)',
                borderWidth: '2px',
                borderStyle: 'solid'
            });

        } else if (
            event.target.name === 'cpassword' &&
            event.target.value === password.value

        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(0,128,0, 0.5)',
                borderWidth: '2px',
                borderStyle: 'solid'
            });
        }
        if (
            event.target.name === 'password' &&
            !event.target.validity.patternMismatch
        ) {
            if (cpassword.readOnly !== false) cpassword.readOnly = false;
            if (cpassword.disabled !== false) cpassword.disabled = false;


        } else if (
            event.target.name === 'password' && event.target.validity.patternMismatch ||
            password.value === '' && event.target.validity.patternMismatch
        ) {
            if (cpassword.readOnly !== true) cpassword.readOnly = true;
            if (cpassword.disabled !== true) cpassword.disabled = true;

            if (
                cpassword.style.borderColor !== 'rgba(255,0,0, 0.5)' ||
                cpassword.borderWidth !== '1px' ||
                cpassword.borderStyle !== 'solid'
            ) {
                Object.assign(cpassword.style, {
                    borderColor: 'rgba(255,0,0, 0.5)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                });
            }
        }
    }

    borderWidthRegulator = (event) => {
        console.log('border function triggered')
        if (event.type === 'focusin') {
            console.log('i am focused')
            event.target.style.borderWidth = '2px';
        }


        if (event.type === 'focusout') {
            console.log('i am blurred');
            event.target.style.borderWidth = '1px'
        }
    }

    isIconSuccess = () => {
        if (this.state.formCorrect) {
            return <span className={'appear'}>Zaczynamy?</span>
        } else if (this.state.doesUserExists) {
            // let regFormEmailInputColor = document.getElementsByName('email')[0].style.color;
            document.getElementsByName('email')[0].style.color = 'red';
            const timeout = setTimeout(() => {
                document.getElementsByName('email')[0].style.color = 'black'
            }, 5000)
            return <div className={'reg-form-failureMsg-container'}>Podany adres jest już zarejestrowany.</div>
        } else {
            return <div></div>
        }
    }


    render() {
        return <div className={"landing-page-container"}>
            <form className={"reg-form"} autoComplete={'false'} id={'reg-form'}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={'email'}
                           name={"email"}
                           autoComplete={"new-password"}
                           className={"reg-form-input reg-form-input-post"}
                           placeholder='np. jan.kowalski@example.com'
                        // onKeyUp={this.apiValidate}
                           required autoFocus/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"fName"}>
                        Login
                    </label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"fName"}
                           autoComplete={"new-password"}
                           className={"reg-form-input reg-form-input-post"}
                        // onChange={this.apiValidate}
                           minLength={1}
                           maxLength={50}
                           placeholder='max. 50 znaków'
                        // onKeyUp={this.apiValidate}
                           required/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"}
                           autoComplete={"new-password"}
                           placeholder='min. 8 znaków, 1 liczba i wielka litera'
                           className={"reg-form-input reg-form-input-post"}
                           pattern={"^(?=.*)(?=.*\\d)(?=.*[A-Z])[-A-Za-z\\d!@#$%^&*()_=+{}\\[\\]:;\"'\\\\|<>,.\\/?]{8,}$"}
                        // onKeyUp={this.apiValidate}
                           required/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"}
                           name={"cpassword"}
                           autoComplete={"off"}
                           placeholder=''
                           className={"reg-form-input"}
                        // onKeyUp={this.apiValidate}
                        // onBlur={this.apiValidate}
                           readOnly
                           disabled
                           required/>
                </div>
                <input type={"hidden"} name={"regToken"} value={this.props.token}/>
                <div className={'reg-form-btn-container'}>
                    <div className={'reg-form-successMsg-container'}> {this.isIconSuccess()}</div>
                    <input onClick={this.formSendRegister}
                           type={"submit"}
                           value={"Start"}
                           className={"reg-form-btn"}/>
                </div>
            </form>
            <div></div>
        </div>
    }
}


import Swal from 'sweetalert2';


const history = createBrowserHistory();

class LandingPageContent extends Component {
    render() {
        return <div>PROSTA I DARMOWA LISTA ZAKUPÓW</div>
    }
}

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logToken: 'initialVal',
            isLoginSuccess:''
        }
    }

    componentDidMount() {
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

        if (this.props.token === 'initialVal') {
            this.props.getToken(request, 'log');
        }
    }
    formSendLogin = (e) => {
        e.preventDefault();
        let login = document.getElementsByName('login')[0].value;
        let password = document.getElementsByName("password")[0].value
        // let loginDetails = {"email": login, "password": password,};
        let token = document.getElementsByName('logToken')[0].value;
        let loginDetails = {"email": login, "password": password, "logToken": token};


        const formData = new FormData();
        for (let [key, value] of Object.entries(loginDetails)) {
            formData.append(key, value);
        }


        let targetUrl = `${location.origin}/login`;
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
                if (response !== false) {
                    console.log(response)
                    this.setState({
                        isLoginSuccess: true
                    })
                    this.props.loginStateUpdater(true);
                    this.props.userStateUpdater(response);
                }
                if (response === false) {
                    this.setState({
                        isLoginSuccess:false
                    })
                    console.log(response)
                }
            })
            .catch((error) => {
                console.error('LOGIN ERROR:', error)
            });
    }




    render() {

        return <div className={"landing-page-container"}>
            <form className={"reg-form"} autoComplete={'false'}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"login"}>E-mail</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={'text'}
                           name={"login"}
                           autoComplete={'new-password'} //for dev purposes
                           className={"log-form-input"}
                           required autoFocus/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"}
                           autoComplete={'new-password'} //for dev purposes
                           className={"log-form-input"}
                           required/>
                </div>
                <div className={'reg-form-btn-container'}>
                    <a className={'forgot-password-link'}>Nie pamiętasz hasła?</a>
                    {/*<div className={'reg-form-successMsg-container'}></div>*/}
                    <div className={'reg-form-space-div'}></div>
                    <input onClick={this.formSendLogin}
                           type={"submit"}
                           value={"Zaloguj się."}
                           className={"reg-form-btn"}/>
                </div>
                <input type={"hidden"} name={"logToken"} value={this.props.token}/>
            </form>
            <div></div>
        </div>
    }

}


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


class RegisterPage extends Component {
    render() {
        return <div className={'reg-form-container'}>
            <RegForm getToken={this.props.getToken}
                     token={this.props.token}
                     loginStateUpdater={this.props.loginStateUpdater}
                     userStateUpdater={this.props.userStateUpdater}
            />
        </div>
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
            userFirstName: 'anonymous'
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
                    console.log(jsonResponse)
                    if (jsonResponse !== 'badRequest') {
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
            console.log('dupsko')
            console.log(request);
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse)
                    if (jsonResponse !== 'badRequest') {
                        if (this.state.token !== jsonResponse) {
                            console.log(jsonResponse)
                            this.setState({logToken: jsonResponse})
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
            return <div>
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
                                   render={() => <LoginPage
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
                                       token={this.state.logToken}
                                       userStateUpdater={this.userStateUpdater}
                                   />}
                            />
                            <Route exact path="/register"
                                   render={() => <RegisterPage
                                       getToken={this.getToken}
                                       loginStateUpdater={this.loginStateUpdater}
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
        } else if (this.state.loggedIn === true) {
            return <App view={'new_list'} userId={this.state.user}
                        loginStateUpdater={this.loginStateUpdater}
                        logoutAction={this.logoutAction}
                        userStateUpdater={this.userStateUpdater}
                        userFirstName={this.state.userFirstName}

            />
        }
    }
}


export default Homepage;
export {Logo}