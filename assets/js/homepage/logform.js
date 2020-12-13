import React, {Component} from 'react';
import {ReactDOM} from 'react-dom';

class LogForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logToken: 'initialVal',
            isLoginSuccess: ''
        }
    }

    componentDidMount() {
        let targetUrl = `${location.origin}/login`;
        let token;
        let request = new Request(targetUrl, {
            method: 'GET',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Origin': location.origin,
                'Content-Type': 'application/json',
                'X-Custom-Header': 'logTokenRequest',
            }
        })

        if (this.props.token === 'initialVal') {
            this.props.getToken(request, 'log');
        }
    }

    sendChangePasswordRequest = (e) => {
        let formData = new FormData();
        console.log('sendChangePasswordRequestTriggered');
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
            .then((response) => response.json()).then(response => console.log(response))
    }

    formSendLogin = (e) => {
        e.preventDefault();
        let login = document.getElementsByName('login')[0].value;
        let password = document.getElementsByName("password")[0].value
        // let loginDetails = {"email": login, "password": password,};
        let token = document.getElementsByName('logToken')[0].value;
        let loginDetails = {"email": login, "password": password, "logToken": token};


        const formData = new FormData();
        for (let [key, value] of Object.entries(loginDetails)) {
            formData.append(key, value);
        }


        let targetUrl = `${location.origin}/login`;
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
                if (response !== 'false') {
                    this.props.userStateUpdater(response);
                    this.props.loginStateUpdater(true);
                    this.setState({
                        isLoginSuccess: true
                    })

                } else if (response === 'false') {
                    console.log('false');
                    this.setState({
                        isLoginSuccess: false
                    })
                }
            })
            .catch((error) => {
                console.error('LOGIN ERROR:', error)
            });
    }


    render() {
        return <div className={"landing-page-container"}>
            <form className={"reg-form"} autoComplete={'false'}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"login"}>E-mail</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={'text'}
                           name={"login"}
                           autoComplete={'false'} //for dev purposes
                           className={"log-form-input"}
                           required autoFocus/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"}
                           autoComplete={'false'} //for dev purposes
                           className={"log-form-input"}
                           required/>
                </div>
                <div className={'reg-form-btn-container'}>
                    <a className={'forgot-password-link'} onClick={()=>{this.sendChangePasswordRequest()}}>Nie pamiętasz hasła?</a>
                    {/*<div className={'reg-form-successMsg-container'}></div>*/}
                    <div className={'reg-form-space-div'}></div>
                    <input onClick={this.formSendLogin}
                           type={"submit"}
                           value={"Zaloguj się."}
                           className={"reg-form-btn"}/>
                </div>
                <input type={"hidden"} name={"logToken"} value={this.props.token}/>
            </form>
            <div></div>
        </div>
    }
}

export default LogForm;