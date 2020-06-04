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
import Homepage from "./homepage.js";



ReactDOM.render(<Homepage/>, document.getElementById('root'));