import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Router, Switch, withRouter} from 'react-router-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import {About, App} from "./app";
//thanks to withRouter I can access match

require('../css/app.css');


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
    // state = {
    //     token: null,
    // }
    //
    // static getDerivedStateFromProps(props, state) {
    //     if (props.token !== state.token) {
    //         return {
    //            token:props.token
    //         };
    //     }
    //
    //     // Return null to indicate no change to state.
    //     return null;
    // }

    formSendRegister(e) {
        e.preventDefault();
        let login = document.getElementsByName('email')[0].value;
        let fName = document.getElementsByName('fName')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let loginDetails = {"email": login, "password": password, "fName": fName};
        let token = document.getElementsByName('regToken')[0].value;
        if (cpassword !== password) {
            console.log("Hasła różnią się");
        } else {
            const formData = new FormData();
            for (let [key, value] of Object.entries(loginDetails)) {
                formData.append(key, value);
                console.log(value);
            }


            let targetUrl = `${location.origin}/register`;
            console.log(targetUrl);

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
                    console.log("Response successfully returned")
                    console.log(response);
                })
                .catch((error) => {
                    console.error('REGISTRATION ERROR:', error);
                });
        }

    }

    render() {
        let targetUrl = `${location.origin}/register`;
        console.log(targetUrl);
        let token;
        let request = new Request(targetUrl, {
            method: "GET",
            headers: {
                "Access-Control-Request-Method": "GET",
                "Origin": location.origin,
            }
        })
        console.log(this.props.token);
        if (this.props.token === null) {
            fetch(request)
                .then((response) => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    if(jsonResponse !== 'badRequest'){
                    // this.props.parentTokenUpdater(jsonResponse);
                    sessionStorage.setItem('regToken', jsonResponse);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        console.log(sessionStorage.getItem('regToken'));

        return <div className={"landing-page-container"}>
            <form className={"registerForm"}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"email"}>Email</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"email"} autoComplete={"email"} className={"reg-form-input"}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"fName"}>Imię</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"fName"} autoComplete={"given-name"} className={"reg-form-input"}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Utwórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"} autoComplete={"new-password"}
                           className={"reg-form-input"}/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"cpassword"} autoComplete={"new-password"}
                           className={"reg-form-input"}/>
                </div>
                <input type={"hidden"} name={"regToken"} value={sessionStorage.getItem('regToken')}/>
                <input onClick={this.formSendRegister} type={"submit"} value={"wyślij"}/>
            </form>
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