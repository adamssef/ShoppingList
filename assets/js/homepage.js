import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Router, Switch, withRouter, Redirect,} from 'react-router-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import {About, App} from "./app";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
            regToken: 'initialVal',
            formCorrect: false,
            doesUserExists: null,
            activeFormType: null,
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
        console.log('pre isformvalid')
        if (this.state.regToken !== 'initialVal') {
            this.props.parentTokenUpdater(this.state.regToken);
            console.log('dupa');
        }
        // this.setState({regToken: document.getElementsByName('regToken')[0].value});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.isFormValid();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }


    formSendRegister = (e) => {
        // // alert("Złapana!")
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
            }
        });

        fetch(request)
            .then((response) => response.json())
            .then((response) => {
                console.log('am I here?')
                console.log(response);
                if (response === 'user already exists') {
                    console.log('user exists')
                    this.setState({
                        doesUserExists: true,
                        formCorrect: false,
                    })
                } else if (response === 'registration successful') {
                    console.log('user does not exists. reg success')
                    this.setState({
                        doesUserExists: false,
                        formCorrect: true,
                    })
                }
            })
            .catch((error) => {
                console.error('REGISTRATION ERROR:', error)
            });
    }

    getToken = (request) => {
        if (this.props.token === null) {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse)
                    if (jsonResponse !== 'badRequest') {
                        if (this.state.regToken !== jsonResponse) {
                            this.setState({regToken: jsonResponse})
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    /**
     * notifHandler function is used to generate notification messages that are aimed to help user fill the form correctly
     * @param correctMessage
     * @param incorrectMessage
     * @param color
     * @param event
     * @returns {null|*}
     *
     */
    notifHandler = (correctMessage, incorrectMessage, color, event) => {
        let notifBox = event.currentTarget.nextSibling;
        let notifBoxTxt = event.currentTarget.nextSibling.innerText;

        /**
         * this helper function is used to create list for wrong-pass-notif-msg and it is ONLY for the screens >= 475
         * small screens are assumed to be mostly mobile devices and therefore forms have to be presented in more mobile-friendly manner
         */
        let createWrongPassNotifList = () => {
            let notifBoxTxt = event.currentTarget.nextSibling.innerText;
            var list = document.createElement('ul');
            list.classList.add('reg-form-notif-msg');
            // const unallowedPass = 'Hasło musi zawierać 1 wielką literę, 1 liczbę oraz składać się z min. 8 znaków';
            var span = document.createElement('span');
            span.innerText = 'Upewnij się, że hasło zawiera:';
            span.classList.add('reg-form-notif-msg');
            span.style.color = color;
            var li1 = document.createElement('li');
            li1.innerText = '1 wielką literę';
            var li2 = document.createElement('li')
            li2.innerText = '1 liczbę';
            var li3 = document.createElement('li')
            li3.innerText = 'min. 8 znaków';
            ;
            list.appendChild(li1);
            list.appendChild(li2);
            list.appendChild(li3);


            list.setAttribute('style', `color: ${color}; padding-left:18px`)
            console.log(notifBoxTxt.indexOf(correctMessage) === -1);
            if (notifBoxTxt.indexOf(correctMessage) === -1 && notifBoxTxt.indexOf(incorrectMessage) === -1) {
                notifBox.appendChild(span)
                notifBox.appendChild(list);
                // console.log('notif handler is working')
            }
        }

        //THIS IS PART FOR SCREENS WIDER THAN 475px
        if (window.innerWidth >= 475) {
            //1) GENERAL RUN (does not inlcude password input)
            let spans = document.getElementsByClassName('reg-form-div-el')

            for (var i = 0; i < spans.length; i++) {
                if (spans[i].getElementsByTagName('span')[0] !== undefined) {
                    spans[i].getElementsByTagName('span')[0].style.display = 'inline';
                }
            }

            //CASE 1 - all the green inputs
            if (color === 'green') {
                // CASE 1a - green input && is notifbox is not empty && notifbox first child is <ul>
                try {
                    if (notifBox.children.length > 0 && notifBox.children[0].localName === 'p' && notifBox.children[0].innerText !== correctMessage) {
                        notifBox.removeChild(notifBox.children[0]);
                    } else if (notifBox.children.length > 0 && (notifBox.children[0].localName === 'ul' || notifBox.children[1].localName === 'ul')) {
                        notifBox.removeChild(notifBox.children[0]);
                        notifBox.removeChild(notifBox.children[0]);
                        // CASE 1b - green input && notifbox is not empty && notifbox first child is <p> && notifBoxTxt isn't already a correctMessage
                    }
                } catch (e) {
                    if (e.message === 'Cannot read property \'localName\' of undefined') {
                        return null;
                    } else {
                        return e;
                    }

                }

                var node = document.createElement('p')
                node.style.color = color;
                node.innerText = correctMessage;
                node.classList.add('reg-form-notif-msg');

                if (notifBoxTxt.indexOf(correctMessage) === -1 || notifBoxTxt === "" || notifBoxTxt === undefined) {
                    notifBox.appendChild(node);
                }

                //CASE 2a)INCORRECT INPUT CRITERIAS IN GENERAL
            } else if (color === "red" && correctMessage !== 'Hasło prawidłowe.') {
                for (var i = 0; i < notifBox.children.length; i++) {
                    if (notifBox.children[i].innerText === correctMessage) {
                        notifBox.removeChild(notifBox.children[i])
                    }
                }
                var node = document.createElement('p')
                node.classList.add('reg-form-notif-msg');
                node.style.color = color;
                node.innerText = incorrectMessage;
                if (notifBoxTxt.indexOf(incorrectMessage) === -1) {
                    notifBox.appendChild(node);
                }
                //2b INCORRECT INPUT CRITERIAS - PASSWORD ONLY CASE
            } else if (color === 'red' && correctMessage === 'Hasło prawidłowe.') {
                //2b first: notifbox is not empty && first notifbox child is different than <p>
                if (notifBox.children.length > 0 && notifBox.children[0].localName !== 'p') {
                    if (notifBox.children[1].localName === 'ul' && notifBox.children.length > 0) {
                        notifBox.removeChild(notifBox.children[0]);
                        notifBox.removeChild(notifBox.children[0]);
                    }
                    //2b second: notifbox is not empty && first notifbox child is different than p
                } else if (notifBox.children.length > 0 && (notifBox.children[0].localName === 'p' || notifBox.children[2].localName === 'p')) {
                    notifBox.children[0].localName === 'p' ? notifBox.removeChild(notifBox.children[0]) : notifBox.removeChild(notifBox.children[2]);
                    createWrongPassNotifList();
                }

                if (document.getElementsByClassName('reg-form-wrong-pass-li').length === 0) {
                    createWrongPassNotifList();
                }
            }
        }


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
    apiValidate = (event) => {
        this.isFormValid();
        if (event.target.name === 'cpassword' && (event.target.value !== document.getElementsByName('password')[0].value)) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(255,0,0, 0.5)',
                borderWidth: '2px',
                borderStyle: 'solid'
            });

        } else if (event.target.name === 'cpassword' && event.target.value === document.getElementsByName('password')[0].value) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(0,128,0, 0.5)',
                borderWidth: '2x',
                borderStyle: 'solid'
            });
        }
        if (event.target.name === 'password' && event.target.validity.patternMismatch !== true) {
            document.getElementsByName('cpassword')[0].disabled = false;
        } else if ((event.target.name === 'password' && event.target.validity.patternMismatch === true) || document.getElementsByName('password')[0].value === '') {
            document.getElementsByName('cpassword')[0].disabled = true;
        }
    }

    isIconSuccess = () => {
        if (this.state.formCorrect) {
            return <span className={'appear'}>Zaczynamy?</span>
        } else if (this.state.doesUserExists) {
            // let regFormEmailInputColor = document.getElementsByName('email')[0].style.color;
            document.getElementsByName('email')[0].style.color = 'red';
            const timeout = setTimeout(()=>{document.getElementsByName('email')[0].style.color = 'black'}, 5000)
            return <div className={'reg-form-failureMsg-container'}>E-mail jest już w naszej bazie.U</div>
        } else {
            return <div></div>
        }
    }


    render() {
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

        if (this.state.regToken === 'initialVal') {
            this.getToken(request);
        }

        // if (window.innerWidth > 475) {
            return <div className={"landing-page-container"}>
                <form className={"reg-form"} autoComplete={'false'}>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={'email'}
                               name={"email"}
                               autoComplete={"new-password"}
                               className={"reg-form-input reg-form-input-post"}
                               placeholder='np. jan.kowalski@example.com'
                               onKeyUp={this.apiValidate}
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
                               onChange={this.apiValidate}
                               minLength={1}
                               maxLength={50}
                               placeholder='max. 50 znaków'
                               onKeyUp={this.apiValidate}
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
                               onKeyUp={this.apiValidate}
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
                               onKeyUp={this.apiValidate}
                               disabled={true}
                               required/>
                    </div>
                    <input type={"hidden"} name={"regToken"} value={this.state.regToken}/>
                    <div className={'reg-form-btn-container'}>
                        <div className={'reg-form-successMsg-container'}> {this.isIconSuccess()}</div>
                        <input onClick={this.formSendRegister}
                               type={"submit"}
                               value={"Zarejestruj się."}
                               className={"reg-form-btn"}/>
                    </div>
                </form>
                <div></div>
            </div>
        // }
        // else if (window.innerWidth <= 475) {
        //     let regFormNotifMsgBoxes = document.getElementsByClassName('reg-form-notif-msg');
        //     for (let item of regFormNotifMsgBoxes) {
        //         item.style.display = 'none';
        //     }
        //     return <div className={"landing-page-container"}>
        //         <form className={"reg-form"} autoComplete={'false'}>
        //             <div className={"reg-form-div-el"}>
        //                 <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
        //                 <div className={"reg-form-space-div"}></div>
        //                 <input type={'email'}
        //                        name={"email"}
        //                        autoComplete={"off"}
        //                        className={"reg-form-input"}
        //                        placeholder='np. jan.kowalski@example.com'
        //                        onKeyUp={this.apiValidate}
        //                        required/>
        //             </div>
        //             <div className={"reg-form-div-el"}>
        //                 <label className={"reg-form-label"} htmlFor={"fName"}>
        //                     Login
        //                 </label>
        //                 <div className={"reg-form-space-div"}></div>
        //                 <input type={"text"} name={"fName"}
        //                        autoComplete={"off"}
        //                        className={"reg-form-input"}
        //                        onChange={this.apiValidate}
        //                        minLength={1}
        //                        maxLength={50}
        //                        placeholder='max. 50 znaków'
        //                        onKeyUp={this.apiValidate}
        //                        required/>
        //             </div>
        //             <div className={"reg-form-div-el"}>
        //                 <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
        //                 <div className={"reg-form-space-div"}></div>
        //                 <input type={"password"} name={"password"}
        //                        autoComplete={"off"}
        //                        placeholder='min. 8 znaków, 1 liczba i wielka litera'
        //                        className={"reg-form-input"}
        //                        pattern={"^(?=.*)(?=.*\\d)(?=.*[A-Z])[-A-Za-z\\d!@#$%^&*()_=+{}\\[\\]:;\"'\\\\|<>,.\\/?]{8,}$"}
        //                        onKeyUp={this.apiValidate}
        //                        required/>
        //             </div>
        //             <div className={"reg-form-div-el"}>
        //                 <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
        //                 <div className={"reg-form-space-div"}></div>
        //                 <input type={"password"}
        //                        name={"cpassword"}
        //                        autoComplete={"off"}
        //                        placeholder=''
        //                        className={"reg-form-input"}
        //                        onKeyUp={this.apiValidate}
        //                        disabled={true}
        //                        required/>
        //             </div>
        //             <input type={"hidden"} name={"regToken"} value={this.state.regToken}/>
        //
        //             <div className={'reg-form-btn-container'}>
        //                 <div className={'reg-form-successMsg-container'}> {this.isIconSuccess()}</div>
        //                 <input onClick={this.formSendRegister}
        //                        type={"submit"}
        //                        value={"Zarejestruj się."}
        //                        className={"reg-form-btn"}/>
        //             </div>
        //         </form>
        //         <div></div>
        //     </div>
        // }
    }
}


import Swal from 'sweetalert2';

import {createBrowserHistory} from "history";

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
            isRegistrationSuccess: '',
            logToken: 'initialVal'
        }
    }

    getLogToken = (request) => {
        fetch(request)
            .then((response) => response.json())
            .then(jsonResponse => {
                // if (this.state.logToken !== jsonResponse) {
                //     this.setState({logToken: jsonResponse})
                // }
            })
            .catch(error => {
                console.log(error);
            });
    }

    formSendLogin = (e) => {
        e.preventDefault();
        let login = document.getElementsByName('login')[0].value;
        let password = document.getElementsByName("password")[0].value
        let loginDetails = {"email": login, "password": password,};

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
                console.log(response);
                console.log('dupa')
                if (response === 'Login unsuccessful') {
                    console.log('user does not exist')
                    this.setState({
                        isRegistrationSuccess: false
                    })
                } else if (response == 'Login successful') {
                    console.log(response);
                    console.log('dupa')
                    this.setState({
                        isLoginSuccess: true
                    })

                    this.props.stateUpdater(true)
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.error('LOGIN ERROR:', error)
            });
    }

    componentDidMount() {
        this.props.regFormParentStateUpdater;
    }


    render() {
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

        if (this.state.logToken === 'initialVal') {
            this.getLogToken(request);
        }

        // if (window.innerWidth > 475) {
            return <div className={"landing-page-container"}>
                <form className={"reg-form"} autoComplete={'false'}>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"login"}>E-mail</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={'text'}
                               name={"login"}
                               autoComplete
                               className={"reg-form-input"}
                               required autoFocus/>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"password"} name={"password"}
                               autoComplete={'currentPassword'}
                               className={"reg-form-input"}
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
                    <input type={"hidden"} name={"logToken"} value={this.state.logToken}/>
                </form>
                <div></div>
            </div>
        }
    // }
}

class FormUpperText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.formType === 'register') {
            return <div className={'homepage-welcome-box-h2-container'}>
                <h2><span className={'logo-span-color'}>lista</span>zakupow.<span
                    className={'logo-span-color'}>com</span>.pl</h2>
                <h1>Utwórz konto</h1>
            </div>
        }

        if (this.props.formType === 'login') {
            return <div className={'homepage-welcome-box-h2-container'}>
                <h2><span className={'logo-span-color'}>lista</span>zakupow.<span
                    className={'logo-span-color'}>com</span>.pl</h2>
                <h1>Zaloguj się</h1>
            </div>
        }

    }
}


class RegisterPage extends Component {


    componentDidMount() {
        this.props.regFormParentStateUpdater;
    }

    render() {

        return <div className={'reg-form-container'}>
            <RegForm token={this.props.token}/>
        </div>
    }
}

class Homepage extends Component {
    constructor(props) {
        super(props);
        // this.parentTokenUpdater = this.parentTokenUpdater(this);
        // this.loginStateUpdater = this.loginStateUpdater.bind(this);
        // this.formTypeLoginUpdater = this.formTypeLoginUpdater.bind(this);
        // this.formTypeRegisterUpdater = this.formTypeRegisterUpdater.bind(this);
        this.state = {
            regToken: null,
            activeFormType: 'register',
            loggedIn: false,
        };
    }

    parentTokenUpdater = (token) => {
        this.setState({regToken: token})
    }

    stateUpdater = (event) => {
        if (event.currentTarget.name === 'navLinkFormReg' && this.state.activeFormType !== 'register') {
            this.setState({activeFormType: 'register'})
        }

        if (event.currentTarget.name === 'navLinkFormLog' && this.state.activeFormType !== 'login') {
            this.setState({activeFormType: 'login'})
        }
    }

    loginStateUpdater = (input) => {
        console.log('dupa')
        if (input === true) {
            this.setState({
                loggedIn: true
            })
        }
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
                                   onClick={() => this.formTypeLoginUpdater()}
                                   render={() => <LoginPage stateUpdater={this.loginStateUpdater.bind(this)}/>}/>
                            <Route exact path="/register"
                                   render={() => <RegisterPage parentTokenUpdater={this.parentTokenUpdater}
                                                               token={this.state.regToken}
                                   />}/>
                            <Redirect from="/" exact to="/register"/>
                        </Switch>
                    </Router>

                </div>
            </div>
        } else if (this.state.loggedIn === true) {
            return <Router>
            <CreateList/>
            </Router>
        }
    }
}


export default Homepage;