import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Router, Switch, withRouter} from 'react-router-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import {About, App} from "./app";

import {faCheckSquare} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import '../css/app.css';


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
    }

    formSend(e) {
        e.preventDefault();
        alert('dupa');
    }

    render() {
        return <form>
            <label htmlFor={"login"}>Login</label>
            <input type={"text"} name={"login"} autoComplete={"username"}/>
            <label htmlFor={"password"}>Hasło</label>
            <input type={"password"} name={"password"} autoComplete={"current-password"}/>
            <input onClick={this.formSendLogin} type={"submit"} value={"wyślij"}/>
        </form>
    }
}

class FormUpperText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'text-box__reg-form-above'}>
            <div className={'text-box__reg-form-above--title'}>Zarejestruj się.</div>
            <div className={'text-box__reg-form-above--desc'}>Twórz proste i łatwe w użyciu listy zakupów.</div>
        </div>
    }
}

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
            regToken: '',
            formCorrect: false,
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
        window.addEventListener("resize", this.updateDimensions);

        // this.setState({regToken: document.getElementsByName('regToken')[0].value});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(document.getElementsByName('regToken')[0].value)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }


    formSendRegister(e) {
        // // alert("Złapana!")
        e.preventDefault();
        let login = document.getElementsByName('email')[0].value;
        let fName = document.getElementsByName('fName')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let token = document.getElementsByName('regToken')[0].value;
        let loginDetails = {"email": login, "password": password, "fName": fName, "regToken": token};

        // if (cpassword !== password) {
        //     Swal.fire({
        //         title: 'halo halo!',
        //         text: 'Hasła różnią się!',
        //         icon: 'warning',
        //     })
        // } else {
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
            })
            .catch((error) => {
                console.error('REGISTRATION ERROR:', error);
            });
    }

    getToken = (request) => {
        if (this.props.token === null) {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse !== 'badRequest') {
                        if (this.state.regToken !== jsonResponse) {
                            this.setState({'regToken': jsonResponse})
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

            if (notifBoxTxt.indexOf(correctMessage) === -1) {
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
                    console.log("I am BACK")
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

        //THIS IS PART FOR SCREENS NARROWER THAN 475px (assumed to be mobile devices mostly)
        if (window.innerWidth < 475) {

        }

    }


    validateEmail = (event) => {
        //(1) grabbing useful variables
        this.setState({
            loginField: document.getElementsByName('email')[0].value,
        })
        let emailInputValue = document.getElementsByName('email')[0].value;
        let notifBoxTxt = document.getElementById('reg-form-validation-div').innerText;
        let errorTerm = 'Nie prawidłowy adres e-mail.';
        let correctTerm = 'Prawidłowy adres e-mail.'
        //(2) regular expression
        const re = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        //(4) validation
        if (re.test(emailInputValue) === false && notifBoxTxt.indexOf(errorTerm) === -1 && emailInputValue.length > 0) {
            this.notifHandler(correctTerm, errorTerm, "red", event)
        } else if (re.test(emailInputValue) === true && notifBoxTxt.indexOf(correctTerm) === -1) {
            this.notifHandler(correctTerm, errorTerm, "green", event)
        }
    }

    validateName = (event) => {
        this.setState({
            fNameField: document.getElementsByName('fName')[0].value
        })
        let nameInput = document.getElementsByName('fName')[0];
        let nameInputValue = document.getElementsByName('fName')[0].value;
        let notifBoxTxt = document.getElementById('reg-form-validation-div').innerText;
        let tooLongTerm = 'Ta ilość znaków nie jest dozwolona.';
        let correctTerm = 'OK';
        if (nameInputValue.length > 50 && notifBoxTxt.indexOf(tooLongTerm) === -1 && document.activeElement === nameInput) {
            this.notifHandler(correctTerm, tooLongTerm, "red", event);
        } else if (nameInputValue.length > 0 && nameInputValue.length <= 50) {
            this.notifHandler(correctTerm, tooLongTerm, "green", event);
        }
    }

    validatePassword = (event) => {
        this.setState({
            passwordField: document.getElementsByName('password')[0].value
        })
        //(1)Useful input variables
        let passInput = document.getElementsByName('password')[0];
        let passInputVal = document.getElementsByName('password')[0].value;
        let cpassInput = document.getElementsByName('cpassword')[0];
        let cpassInputVal = document.getElementsByName('cpassword')[0].value;
        //(2) messages
        let mismatchedPass = 'Hasła różnią się.';
        const unallowedPass = 'Hasło musi zawierać 1 wielką literę, 1 liczbę oraz składać się z min. 8 znaków';
        let correctPass = 'Hasło prawidłowe.';
        let matchedPasswords = 'Hasła zgadzają się.';
        //(3) regex

        const re = /^(?=.*)(?=.*\d)(?=.*[A-Z])[-A-Za-z\d!@#$%^&*()_=+{}\[\]:;"'\\|<>,.\/?]{8,}$/


        if (re.test(passInputVal) && passInputVal.length !== 0) {
            this.notifHandler(correctPass, unallowedPass, "green", event);
        } else if (re.test(passInputVal) === false && passInputVal.length !== 0) {
            this.notifHandler(correctPass, unallowedPass, "red", event);
        }
        //(3)validation part


    }

    validateCpassword = (event) => {
        this.setState({
            cpasswordField: document.getElementsByName('cpassword')[0].value
        })
        let passInput = document.getElementsByName('password')[0];
        let passInputVal = document.getElementsByName('password')[0].value;
        let cpassInput = document.getElementsByName('cpassword')[0];
        let cpassInputVal = document.getElementsByName('cpassword')[0].value;

        let mismatchedPass = 'Hasła różnią się.';
        let unallowedPass = 'Hasło musi zawierać 1 wielką literę, 1 liczbę oraz składać się z min. 8 znaków';
        let correctPass = "Hasło prawidłowe.";
        let matchedPasswords = "Hasła zgadzają się.";

        if (passInputVal !== cpassInputVal && cpassInputVal.length !== 0) {
            this.notifHandler(matchedPasswords, mismatchedPass, "red", event);
        } else if (passInputVal === cpassInputVal && cpassInputVal.length !== 0) {
            this.notifHandler(matchedPasswords, mismatchedPass, "green", event);
        }

    }
    apiValidate = (event) => {
        let emailField = document.getElementsByName('email')[0];
        let passwordField = document.getElementsByName('password')[0];
        let cpasswordField = document.getElementsByName('cpassword')[0];
        let fNameField = document.getElementsByName('fName')[0];
        emailField.setCustomValidity("Nieprawidłowy e-mail.");
        passwordField.setCustomValidity("Nazwa nie może być pusta lub dłuższa niż 50 znaków.");
        fNameField.setCustomValidity("Dupa");


        /**
         * isFormValid is helper function
         * isFormValid checks if all the fields are filled correctly in UI
         * its validation bases on constraints validation API
         * */
        const isFormValid = () => {
            if (!emailField.validity.typeMismatch && !passwordField.validity.patternMismatch && !passwordField.validity.valueMissing && cpasswordField.value === passwordField.value && !cpasswordField.validity.valueMissing && !fNameField.validity.tooLong && !fNameField.validity.valueMissing) {
                console.log(emailField.validity.typeMismatch)
                return true;
            } else {
                return false;
            }
        }

        if (isFormValid()) {
            if (this.state.formCorrect === false) {
                this.setState({
                    formCorrect: true,
                })

            }
        }

        if(!isFormValid()) {
            this.setState({
                formCorrect: false,
            })
        }

        //cpassword verification
        if (event.target.name === 'cpassword' && event.target.value !== document.getElementsByName('password')[0].value) {
            event.target.style.borderColor = 'red';
        } else if (event.target.name === 'cpassword' && event.target.value === document.getElementsByName('password')[0].value) {
            event.target.style.borderColor = 'green';
            event.target.style.borderWidth = '1px';
        }

        //password verification
        if (event.target.name === 'password' && event.target.validity.patternMismatch !== true) {
            document.getElementsByName('cpassword')[0].disabled = false;
            event.target.style.borderColor = 'green'
            event.target.style.borderWidth = '1px';
        } else if (event.target.name === 'password' && event.target.validity.patternMismatch === true) {
            document.getElementsByName('cpassword')[0].disabled = true;
            event.target.style.borderColor = 'red'
        }

        //email verification
        if (event.target.name === 'email' && event.target.validity.typeMismatch === false) {
            event.target.style.borderColor = 'green'
            event.target.style.borderWidth = '1px';
        } else if (event.target.name === 'email' && event.target.validity.typeMismatch === true) {
            event.target.style.borderColor = 'red'
        }

        //fname verification
        if (event.target.name === 'fName' && event.target.validity.tooLong === false && event.target.validity.valueMissing === false) {
            event.target.style.borderColor = 'green'
            event.target.style.borderWidth = '1px';
        } else if (event.target.name === 'fName' && (event.target.validity.tooLong === true || event.target.validity.valueMissing === true)) {
            event.target.style.borderColor = 'red'
            event.target.style.borderWidth = '1px';
        }

    }

    isIconSuccess = () => {
        if (this.state.formCorrect) {
            return <FontAwesomeIcon icon={faCheckSquare} className={'appear'}/>
        } else {
            return <div></div>
        }
    }


    render() {
        let targetUrl = `${location.origin}/register`;
        let token;
        console.log(location.origin);
        let request = new Request(targetUrl, {
            method: 'GET',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Origin': location.origin,
                'Content-Type': 'application/json',
                'X-Custom-Header': 'regTokenRequest',
            }
        })

        this.getToken(request);

        if (window.innerWidth > 475) {
            return <div className={"landing-page-container"}>
                <form className={"reg-form"}>,
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"text"} name={"email"}
                               autoComplete={"email"}
                               className={"reg-form-input"}
                               onKeyUp={this.validateEmail}
                               placeholder=''
                               required/>
                        <span className={'reg-form__input__span-errorMsg'}></span>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"fName"}>
                            Login
                        </label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"text"}
                               name={"fName"}
                               autoComplete={"given-name"}
                               className={"reg-form-input"}
                               onKeyUp={this.validateName}
                               required/><span className={'reg-form__input__span-errorMsg'}></span>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"password"}>Utwórz hasło</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"password"}
                               name={"password"}
                               autoComplete={"new-password"}
                               placeholder=''
                               className={"reg-form-input"}
                               onKeyUp={this.validatePassword} required/><span
                        className={'reg-form__input__span-errorMsg'}></span>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"password"}
                               name={"cpassword"}
                               autoComplete={"new-password"}
                               className={"reg-form-input"}
                               onKeyUp={this.validateCpassword}
                               required/><span
                        className={'reg-form__input-span--errorMsg'}></span>
                    </div>
                    <input type={"hidden"} name={"regToken"} value={this.state.regToken}/>
                    <input onClick={this.formSendRegister} type={"submit"} value={"Zarejestruj się."}
                           className={"reg-form-btn"}/>
                </form>
                <div id={"reg-form-validation-div"}></div>
            </div>
        } else if (window.innerWidth <= 475) {
            let regFormNotifMsgBoxes = document.getElementsByClassName('reg-form-notif-msg');
            for (let item of regFormNotifMsgBoxes) {
                item.style.display = 'none';
            }

            return <div className={"landing-page-container"}>
                <form className={"reg-form"}>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={'email'}
                               name={"email"}
                               autoComplete={"email"}
                               className={"reg-form-input"}
                               placeholder='np. jan.kowalski@example.com'
                               onKeyUp={this.apiValidate}
                               required/>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"fName"}>
                            Login
                        </label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"text"} name={"fName"}
                               autoComplete={"given-name"}
                               className={"reg-form-input"}
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
                               className={"reg-form-input"}
                               pattern={"^(?=.*)(?=.*\\d)(?=.*[A-Z])[-A-Za-z\\d!@#$%^&*()_=+{}\\[\\]:;\"'\\\\|<>,.\\/?]{8,}$"}
                               onKeyUp={this.apiValidate}
                               required/>
                    </div>
                    <div className={"reg-form-div-el"}>
                        <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                        <div className={"reg-form-space-div"}></div>
                        <input type={"password"}
                               name={"cpassword"}
                               autoComplete={"new-password"}
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
        }
    }
}


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regToken: null
        };
    }

    parentTokenUpdater = (request) => {
        this.state.regToken = request;
    }

    render() {
        return <Router history={history}>
            <div>
                <nav>
                    <ul>
                        <li className={"inline saved-lists"}>
                            <NavLink to="/login">LOGIN</NavLink>
                        </li>
                        <li className={"inline saved-lists"}>
                            <NavLink to="/register">REGISTER</NavLink>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/login" render={() => <LoginPage/>}/>
                    <Route exact path="/register"
                           render={() => <RegisterPage parentTokenUpdater={this.parentTokenUpdater}
                                                       token={this.state.regToken}/>}/>
                </Switch>
            </div>
        </Router>
    }
}

class RegisterPage extends Component {
    render() {
        return <div className={'reg-form-container'}>
            <FormUpperText/>
            <RegForm token={this.props.token}/>
        </div>
    }
}


export default Homepage;