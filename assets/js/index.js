import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {
    withRouter,
    Router,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";
import {App, About} from "./app.js";
import LandingPage from "./landingPage";

class LandingPage1 extends Component {
    render(){
        return <LandingPage/>
    }
}

ReactDOM.render(<LandingPage1/>, document.getElementById('root'));