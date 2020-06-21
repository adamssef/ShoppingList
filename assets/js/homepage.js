import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Router, Switch, withRouter} from 'react-router-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import {About, App} from "./app";

require('../css/app.css');
import Swal from 'sweetalert2'

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

class RegisterPage extends Component {
    constructor(props) {
        super(props);
    }

    formSendRegister(e) {
        e.preventDefault();
        let login = document.getElementsByName('email')[0].value;
        let fName = document.getElementsByName('fName')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let token = document.getElementsByName('regToken')[0].value;
        let loginDetails = {"email": login, "password": password, "fName": fName, "regToken": token};

        if (cpassword !== password) {
            Swal.fire({
                title: 'halo halo!',
                text: 'Hasła różnią się!',
                icon: 'warning',
            })
        } else {
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

    }

    getToken = (request) => {
        if (this.props.token === null) {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    if (jsonResponse !== 'badRequest') {
                        // this.props.parentTokenUpdater(jsonResponse);
                        // sessionStorage.setItem('regToken', jsonResponse);
                        document.getElementsByName('regToken')[0].value = jsonResponse;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    validateEmail = (notifHandle) => {
        //(1) grabbing useful variables
        let emailInputValue = document.getElementsByName('email')[0].value;
        let notifBoxTxt = document.getElementById('reg-form-validation-div').innerText;
        let errorTerm = 'Nie prawidłowy adres e-mail.';
        let correctTerm = 'Prawidłowy adres e-mail.'
        //(2) regular expression
        const re = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        //(4) validation
        if (re.test(emailInputValue) === false && notifBoxTxt.indexOf(errorTerm) === -1 && emailInputValue.length > 0) {
            notifHandle(correctTerm, errorTerm, "red")
        } else if (re.test(emailInputValue) === true && notifBoxTxt.indexOf(correctTerm) === -1) {
            notifHandle(correctTerm, errorTerm, "green")
        }
    }

    validateName = (notifHandler) => {
        let nameInput = document.getElementsByName('fName')[0];
        let nameInputValue = document.getElementsByName('fName')[0].value;
        let notifBoxTxt = document.getElementById('reg-form-validation-div').innerText;
        let unallowedCharsTerm = 'Imię lub nick mogą się składać tylko z liter alfabetu lub cyfr.';
        let tooLongTerm = 'Ta ilość znaków nie jest dozwolona.';
        let correctTerm = 'Prawidłowe imię lub nick.';
        if (nameInputValue.length > 50 && notifBoxTxt.indexOf(tooLongTerm) === -1 && document.activeElement === nameInput) {
            notifHandler(correctTerm, tooLongTerm, "red");
        } else if (nameInputValue.length > 0 && nameInputValue.length <= 50) {
            notifHandler(correctTerm, tooLongTerm, "green");
        }
    }

    validatePassword = (notifHandler) => {
        //(1)Useful input variables
        let passInput = document.getElementsByName('password')[0];
        let passInputVal = document.getElementsByName('password')[0].value;
        let cpassInput = document.getElementsByName('cpassword')[0];
        let cpassInputVal = document.getElementsByName('cpassword')[0].value;
        //(2) messages
        let mismatchedPass = 'Hasła różnią się.';
        let unallowedPass = 'Hasło musi zawierać 1 wielką literę, 1 liczbę oraz składać się z min. 8 znaków';
        let correctPass = "Hasło prawidłowe.";
        let matchedPasswords = "Hasła zgadzają się";
        //(3)validation part
        if (passInputVal !== cpassInputVal && cpassInputVal.length !== 0) {
            notifHandler(matchedPasswords, mismatchedPass, "red");
        } else if (passInputVal === cpassInputVal && cpassInputVal.length !== 0) {
            notifHandler(matchedPasswords, mismatchedPass, "green");
        }
    }

    comboFunctioner = () => {
        const notifHandler = (correctMessage, incorrectMessage, color) => {
            let notifBox = document.getElementById('reg-form-validation-div');
            let notifBoxTxt = document.getElementById('reg-form-validation-div').innerText;

            if (color === "green") {
                for (var i = 0; i < notifBox.children.length; i++) {
                    if (notifBox.children[i].innerText === incorrectMessage) {
                        notifBox.children[i].remove();
                    }
                }
                var node = document.createElement('p')
                node.style.color = color;
                node.innerText = correctMessage;
                if (notifBoxTxt.indexOf(correctMessage) === -1) {
                    notifBox.appendChild(node);
                }
            } else if (color === "red") {
                for (var i = 0; i < notifBox.children.length; i++) {
                    if (notifBox.children[i].innerText === correctMessage) {
                        notifBox.children[i].remove();
                    }
                }
                var node = document.createElement('p')
                node.style.color = color;
                node.innerText = incorrectMessage;
                if (notifBoxTxt.indexOf(incorrectMessage) === -1) {
                    notifBox.appendChild(node);
                }
            }
        }
        

        this.validateEmail(notifHandler);
        this.validateName(notifHandler);
        this.validatePassword(notifHandler);
    }

    render() {
        let targetUrl = `${location.origin}/register`;
        let token;
        let request = new Request(targetUrl, {
            method: "GET",
            headers: {
                "Access-Control-Request-Method": "GET",
                "Origin": location.origin,
                "Content-Type": "application/json"
            }
        })
        this.getToken(request);

        return <div className={"landing-page-container"}>
            <form className={"registerForm"}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"email"} autoComplete={"email"} className={"reg-form-input"}
                           required={'required'} onKeyUp={this.comboFunctioner}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"fName"}>Imię lub Nick</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"fName"} autoComplete={"given-name"} className={"reg-form-input"}
                           required={'required'} onKeyUp={this.comboFunctioner}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Utwórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"} autoComplete={"new-password"}
                           className={"reg-form-input"} required={'required'} onKeyUp={this.comboFunctioner}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"cpassword"} autoComplete={"new-password"}
                           className={"reg-form-input"} required={'required'} onKeyUp={this.comboFunctioner}/>
                </div>
                <input type={"hidden"} name={"regToken"} value=""/>
                <input onClick={this.formSendRegister} type={"submit"} value={"wyślij"}/>
            </form>
            <div id={"reg-form-validation-div"}></div>
        </div>
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


export default Homepage;