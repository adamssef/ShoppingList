import React, {Component} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';


class FormUpperText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.activeFormType === 'register') {
            return <div className={'form-upper-text__div'}>
                <h1 >Zarejestruj się</h1>
            </div>
        }

        if (this.props.activeFormType === 'login') {
            return <div className={'form-upper-text__div'}>
                <h1>Zaloguj się</h1>
            </div>
        }

        if(this.props.activeFormType === 'changePasswordRequest') {
            return <div className={'form-upper-text__div'}>
                <h1>Zapomniane hasło?</h1>
            </div>
        }

        if(this.props.activeFormType === 'tokenVerification') {
            return <div className={'form-upper-text__div'}>
                <h1>Wprowadź token</h1>
            </div>
        }



    }
}

export default FormUpperText;