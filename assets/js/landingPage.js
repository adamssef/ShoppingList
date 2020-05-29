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

class LandingPage extends Component {
    render() {
        return <Router history={history}>
            <div>
                <nav>
                    <ul>
                        <li className={"inline left create"}>
                            <NavLink to="/">WELCOME</NavLink>
                        </li>
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
                    <Route exact path="/" component={LandingPageContent}/>
                    <Route exact path="/login" render={() => <App/>}/>
                    {/*<Route exact path="/saved" render={() => <SavedLists title={`Props through render`} />} />*/}
                    {/*<Route exact path="/register" component={About}/>*/}
                </Switch>
            </div>
        </Router>
    }
}


export default LandingPage;