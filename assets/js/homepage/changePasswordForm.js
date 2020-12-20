import React, {Component, useState, useEffect} from 'react';
import {ReactDOM} from 'react-dom';
import {NavLink, Route, Switch, withRouter, Redirect,} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Router} from "react-router-dom";
import {text} from "@fortawesome/fontawesome-svg-core";

const history = createBrowserHistory();
import Logo from "./logo";
import FormUpperText from "./formUpperText";


function ChangePasswordForm(props) {
    useEffect(() => {
        document.querySelector('.change-pwd-form-btn').addEventListener('click', e=> {sendPasswordChangeRequest(e)})
    });

    const sendPasswordChangeRequest = (e) => {
        e.preventDefault();
        let email = document.getElementsByName('change-pwd-req-email')[0].value;



        const formData = new FormData();

        console.log(email)

        formData.append('email', email);


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
                // if (response === 'true') {
                //    console.log('success')
                //
                // } else if (response === 'false') {
                //     console.log('failure');
                // }
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
                <label htmlFor={'email'} className={"reg-form-label"}>Na podany adres email wyślemy kod potrzebny do
                    zmiany hasła.</label>
                <input type={'email'} name={'change-pwd-req-email'} className={'log-form-input'} required autoFocus/>
                <div className={'forgotten-password-form__flex-div'}>
                    <NavLink onClick={(e) => props.homepageStateUpdater(e)} className={'forgot-password-link'}
                             to='/login' name={'back-to-login-page'}>Powrót do logowania</NavLink>
                    <NavLink  className={'forgot-password-link'}
                             to='/token-verification' name={'back-to-login-page'}><input type={'submit'} value={'Zresetuj hasło'} className={'change-pwd-form-btn'} onClick={(e) => props.homepageStateUpdater(e)}/></NavLink>

                </div>
            </form>
        </div>
    </div>
}

export default ChangePasswordForm;