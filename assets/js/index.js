import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import {
    withRouter,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";
import {App, About} from "./app/app.js";
import Homepage from "./homepage/homepage.js";




ReactDOM.render(<Router><Homepage/></Router>, document.getElementById('root'));