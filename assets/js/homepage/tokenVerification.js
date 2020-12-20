import React, {Component} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Router} from "react-router-dom";
import {text} from "@fortawesome/fontawesome-svg-core";

const history = createBrowserHistory();
import Logo from "./logo";
import FormUpperText from "./formUpperText";


function TokenVerification(props) {
    const verifyToken = (e) => {
        e.preventDefault();
        let token = document.getElementsByName('change-pwd-req-email')[0].value;


        const formData = new FormData();

        console.log(token)

        formData.append('token', token);


        let targetUrl = `${location.origin}/change-password-request`;
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
            })
            .catch((error) => {
                console.error('PASSWORD CHANGE REQUEST ERROR:', error)
            });
    }


    return <div className={'homepage-welcome-box'}>
        <div className={'landing-page-container'}>
            <div className={'change-pwd-form-title-div'}>
                <Logo/>
                <FormUpperText activeFormType={props.activeFormType}/>
            </div>
            <form className={'forgotten-password-form'}>
                <label htmlFor={'email'} className={"reg-form-label"}>Wprowadź otrzymany token.</label>
                <input type={'text'} name={'change-pwd-req-email'} className={'log-form-input'} required autoFocus/>
                <div className={'forgotten-password-form__flex-div'}>
                    <NavLink onClick={(e) => props.homepageStateUpdater(e)} className={'forgot-password-link'}
                             to='/login' name={'back-to-login-page'}>Powrót do logowania</NavLink>
                    <input type={'submit'} value={'Zweryfikuj'} className={'verify-token-form-btn'} onClick={(e)=>{verifyToken(e)}}/>
                </div>
            </form>
        </div>
    </div>
}

export default TokenVerification;