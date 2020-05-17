import React, {Component, Fragment} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Router, Switch, withRouter} from 'react-router-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";
import {About, App} from "./app";
//thanks to withRouter I can access match

require('../css/app.css');
// const $ = require('jquery');
// import Swal from 'sweetalert2'

// require('bootstrap');
// var url = require('url');
// var https = require('https');
// var HttpsProxyAgent = require('https-proxy-agent');


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

    formSend(e){
        e.preventDefault();
        alert('dupa');
    }

    render() {
        return <form>
            <label htmlFor={"login"}>Login</label>
            <input type={"text"} name={"login"} autoComplete={"username"}/>
            <label htmlFor={"password"} >Hasło</label>
            <input type={"password"} name={"password"} autoComplete={"current-password"}/>
            <input onClick={this.formSendLogin} type={"submit"} value={"wyślij"}/>
        </form>
    }
}

class RegisterPage extends Component {
    constructor(props) {
        super(props);
    }

    formSendRegister(e){
        e.preventDefault();
        let login = document.getElementsByName('login')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let loginDetails = {"login":login, "password":password};
        if (cpassword !== password) {
            console.log("Hasła różnią się");
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
                   console.log("Response successfully returned")
                })
                .catch((error) => {
                    console.error('REGISTRATION ERROR:', error);
                });


        }

    }

    render() {
        return <form>
            <label htmlFor={"login"}>Podaj nazwę użytkownika</label>
            <input type={"text"} name={"login"} autoComplete={"username"}/>
            <label htmlFor={"password"}>Podaj hasło</label>
            <input type={"password"} name={"password"} autoComplete={"new-password"}/>
            <label htmlFor={"cpassword"}>Podaj hasło</label>
            <input type={"password"} name={"cpassword"} autoComplete={"new-password"}/>
            <input onClick={this.formSendRegister} type={"submit"} value={"wyślij"}/>
        </form>
    }
}



class LandingPage extends Component {
    render() {
        return <Router history={history}>
            <div>
                <nav>
                    <ul>
                        {/*<li className={"inline left create"}>*/}
                        {/*    <NavLink to="/">WELCOME</NavLink>*/}
                        {/*</li>*/}
                        <li className={"inline saved-lists"}>
                            <NavLink to="/login">LOGIN</NavLink>
                        </li>
                        <li className={"inline saved-lists"}>
                            <NavLink to="/register">REGISTER</NavLink>
                        </li>
                        {/*<li className={"inline saved-lists"}>*/}
                        {/*    <NavLink to="/app">APP</NavLink>*/}
                        {/*</li>*/}

                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    {/*<Route exact path="/" component={LandingPageContent}/>*/}
                    <Route exact path="/login" render={() => <LoginPage/>}/>
                    {/*<Route exact path="/saved" render={() => <SavedLists title={`Props through render`} />} />*/}
                    <Route exact path="/register" component={RegisterPage}/>
                    {/*<Route exact path="/app" component={App}/>*/}
                </Switch>
            </div>
        </Router>
    }
}


export default LandingPage;