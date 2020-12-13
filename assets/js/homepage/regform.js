import React, {Component} from 'react';
import {ReactDOM} from 'react-dom';

class RegForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginField: '',
            fNameField: '',
            passwordField: '',
            cpasswordField: '',
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            // token: 'initialVal',
            formCorrect: false,
            doesUserExists: null,
        }
    }

    updateDimensions = () => {
        this.setState({
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            }
        )
    }

    componentDidMount() {
        console.log('mounted');
        /**
         * making sure that when component is mount "initialVal" is brought back. It is important to
         * have it that way, because this helps the app mechanism to reset the regToken value (that is the behaviour I desire at the moment)
         */
            this.props.setRegTokenBackToInitialVal();

        /**
         * Event listeners section
         */
        window.addEventListener('resize', this.updateDimensions);
        document.querySelector('#reg-form').addEventListener("keyup", this.inputValidator);
        document.querySelector("#reg-form").addEventListener("focusout", this.borderWidthRegulator);
        document.querySelector("#reg-form").addEventListener("focusin", this.borderWidthRegulator);

        // let targetUrl = `${location.origin}/register`;
        // let token;
        // let request = new Request(targetUrl, {
        //     method: 'GET',
        //     headers: {
        //         'Access-Control-Request-Method': 'GET',
        //         'Origin': location.origin,
        //         'Content-Type': 'application/json',
        //         'X-Custom-Header': 'regTokenRequest',
        //     }
        // })

        /**
         * I am commenting below if clause out because I want this always to be "initial val" also after use switches between "zaloguj" and "bezpłatna rejestracja"
         * to achieve above component on every mount will trigger the setRegTokenBackToInitialVal function that is passed in props from parent Homepage component
         */
        // if (this.props.a === 'initialVal') {
        this.props.getToken(this.getTokenRequest('reg'), 'reg')
        // }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.isFormValid();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    /**
     * this is a function that depending on form type will receive session token that is needed to effectively communicate with backend
     * the result of that function is then used in this.props.getToken fn that is passed in props from hompage.js
     * @param input
     * @returns {Request}
     */
    getTokenRequest = (input) => {
        if (input === 'reg') {
            let targetUrl = `${location.origin}/register`;
            return new Request(targetUrl, {
                method: 'GET',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Origin': location.origin,
                    'Content-Type': 'application/json',
                    'X-Custom-Header': 'regTokenRequest',
                }
            })
        }

        if(input === 'log') {
            let targetUrl = `${location.origin}/login`;
            let request = new Request(targetUrl, {
                method: 'GET',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Origin': location.origin,
                    'Content-Type': 'application/json',
                    'X-Custom-Header': 'logTokenRequest',
                }
            })

            return request;
        }
    }


    formSendRegister = (e) => {
        e.preventDefault();
        let login = document.getElementsByName('email')[0].value;
        let fName = document.getElementsByName('fName')[0].value;
        let password = document.getElementsByName("password")[0].value
        let cpassword = document.getElementsByName("cpassword")[0].value;
        let token = document.getElementsByName('regToken')[0].value;
        let loginDetails = {"email": login, "password": password, "fName": fName, "regToken": token};

        const formData = new FormData();
        for (let [key, value] of Object.entries(loginDetails)) {
            console.log(key, value);
            formData.append(key, value);
        }


        let targetUrl = `${location.origin}/register`;
        console.log(`${location.origin}/register`, 'to jest napewno tu')
        let request = new Request(targetUrl, {
            body: formData,
            method: "POST",
            headers: {
                "Access-Control-Request-Method": "POST, GET, OPTIONS",
                "Origin": location.origin,
                // 'X-Custom-Header': this.state.doesUserExists ? ''
            }
        });

        fetch(request)
            .then(response => response.json())
            .then(response => {
                console.log(response, 'tu konsołloguję cos');
                if (response === 'user already exists') {
                    this.setState({
                        doesUserExists: true,
                        formCorrect: false,
                    })
                } else if (response[0] === 'registration successful') {
                    response.shift();
                    this.setState({
                        doesUserExists: false,
                        formCorrect: true,
                    })

                    this.props.userStateUpdater(response);
                    this.props.loginStateUpdater(true);
                }
            })
            .catch((error) => {
                console.error('REGISTRATION ERROR:', error)
            })
    }


    /**
     * isFormValid used to be helper funcion of api validate, but it has been moved up as a component function
     * isFormValid checks if all the fields are filled correctly UI-wise
     * its validation bases on constraints validation API
     * */
    isFormValid = () => {
        let emailField = document.getElementsByName('email')[0];
        let passwordField = document.getElementsByName('password')[0];
        let cpasswordField = document.getElementsByName('cpassword')[0];
        let fNameField = document.getElementsByName('fName')[0];

        if (!emailField.validity.typeMismatch && !passwordField.validity.patternMismatch && !passwordField.validity.valueMissing && cpasswordField.value === passwordField.value && !cpasswordField.validity.valueMissing && !fNameField.validity.tooLong && !fNameField.validity.valueMissing && this.state.doesUserExists !== true) {
            if (this.state.formCorrect === false) {
                this.setState({
                    formCorrect: true,
                })
            }
            return true;
        } else {
            return false;
        }
    }


    /**
     *  apiValidate is a function that sets the formCorrect state of the form and is triggered on onKeyUp event on a form for mobile screens
     *  this is much faster and prettier than the verification method used for large screens
     *  it handles the way input are styled depending on the values provided by 'Constraint validation API'
     *
     * */
    inputValidator = (event) => {
        this.isFormValid();

        let password = document.querySelector("input[name='password']");
        let cpassword = document.querySelector("input[name='cpassword']");

        if (
            event.target.name === 'cpassword' &&
            event.target.value !== password.value
        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(255,0,0, 0.5)',
                borderWidth: '1.5px',
                borderStyle: 'solid'
            });
        } else if (
            event.target.name === 'cpassword' &&
            (event.target.value !== password.value)
        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(255,0,0, 0.5)',
                borderWidth: '1.5px',
                borderStyle: 'solid'
            });

        } else if (
            event.target.name === 'cpassword' &&
            event.target.value === password.value

        ) {
            Object.assign(event.target.style, {
                borderColor: 'rgba(0,128,0, 0.5)',
                borderWidth: '1.5px',
                borderStyle: 'solid'
            });
        }
        if (
            event.target.name === 'password' &&
            !event.target.validity.patternMismatch
        ) {
            if (cpassword.readOnly !== false) cpassword.readOnly = false;
            if (cpassword.disabled !== false) cpassword.disabled = false;


        } else if (
            event.target.name === 'password' && event.target.validity.patternMismatch ||
            password.value === '' && event.target.validity.patternMismatch
        ) {
            if (cpassword.readOnly !== true) cpassword.readOnly = true;
            if (cpassword.disabled !== true) cpassword.disabled = true;

            if (
                cpassword.style.borderColor !== 'rgba(255,0,0, 0.5)' ||
                cpassword.borderWidth !== '1px' ||
                cpassword.borderStyle !== 'solid'
            ) {
                Object.assign(cpassword.style, {
                    borderColor: 'rgba(255,0,0, 0.5)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                });
            }
        }
    }

    borderWidthRegulator = (event) => {
        if (event.type === 'focusin') {
            event.target.style.borderWidth = '1.5px';
        }

        if (event.type === 'focusout') {
            event.target.style.borderWidth = '1px'
        }
    }

    isIconSuccess = () => {
        if (this.state.formCorrect) {
            return <span className={'appear'}>Zaczynamy?</span>
        } else if (this.state.doesUserExists) {
            document.getElementsByName('email')[0].style.color = 'red';
            const timeout = setTimeout(() => {
                document.getElementsByName('email')[0].style.color = 'black'
            }, 5000)
            return <div className={'reg-form-failureMsg-container'}>Podany adres jest już zarejestrowany.</div>
        } else {
            return <div></div>
        }
    }


    render() {
        return <div className={"landing-page-container"}>
            <form className={"reg-form"} autoComplete={'false'} id={'reg-form'}>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"email"}>E-mail</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={'email'}
                           name={"email"}
                           autoComplete={"new-password"}
                           className={"reg-form-input reg-form-input-post"}
                           placeholder='np. jan.kowalski@example.com'
                        // onKeyUp={this.apiValidate}
                           required autoFocus/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"fName"}>
                        Login
                    </label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"text"} name={"fName"}
                           autoComplete={"new-password"}
                           className={"reg-form-input reg-form-input-post"}
                        // onChange={this.apiValidate}
                           minLength={1}
                           maxLength={50}
                           placeholder='max. 50 znaków'
                        // onKeyUp={this.apiValidate}
                           required/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"password"}>Hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"} name={"password"}
                           autoComplete={"new-password"}
                           placeholder='min. 8 znaków, 1 liczba i wielka litera'
                           className={"reg-form-input reg-form-input-post"}
                           pattern={"^(?=.*)(?=.*\\d)(?=.*[A-Z])[-A-Za-z\\d!@#$%^&*()_=+{}\\[\\]:;\"'\\\\|<>,.\\/?]{8,}$"}
                        // onKeyUp={this.apiValidate}
                           required/>
                </div>
                <div className={"reg-form-div-el"}>
                    <label className={"reg-form-label"} htmlFor={"cpassword"}>Powtórz hasło</label>
                    <div className={"reg-form-space-div"}></div>
                    <input type={"password"}
                           name={"cpassword"}
                           autoComplete={"off"}
                           placeholder=''
                           className={"reg-form-input"}
                        // onKeyUp={this.apiValidate}
                        // onBlur={this.apiValidate}
                           readOnly
                           disabled
                           required/>
                </div>
                <input type={"hidden"} name={"regToken"} value={this.props.token}/>
                <div className={'reg-form-btn-container'}>
                    <div className={'reg-form-successMsg-container'}> {this.isIconSuccess()}</div>
                    <input onClick={this.formSendRegister}
                           type={"submit"}
                           value={"Start"}
                           className={"reg-form-btn"}/>
                </div>
            </form>
            <div></div>
        </div>
    }
}

export default RegForm;