import React, { Component } from 'react';

class FacebookLogin extends Component {

    componentDidMount() {
        console.log("FacebookLogin:componentDidMount");
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
        // calling below directly because sometimes event gets dispathed before listener is ready
        this.initializeFacebookLogin(); 
    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        console.log("initializeFacebookLogin");
        if (!window.FB) {
            console.log("initializeFacebookLogin: windowFB not set yet");
            return;
        }
        this.FB = window.FB;
        this.checkLoginStatus();
        this.FB.Event.subscribe("auth.statusChange", this.checkLoginStatus);
    }

    /**
     * Check login status
     */
    checkLoginStatus = () => {
        console.log("checkLoginStatus");
        this.FB.getLoginStatus(this.facebookLoginHandler);
    }

    /**
     * Check login status and call login api is user is not logged in
     */
    facebookLogin = () => {
        console.log("facebookLogin");
        if (!this.FB) return;

        this.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.facebookLoginHandler(response);
            } else {
                this.FB.login(this.facebookLoginHandler, { scope: 'public_profile' });
            }
        });
    }

    /**
     * Handle login response
     */
    facebookLoginHandler = response => {
        console.log("facebookLoginHandler");
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                this.props.onLogin(true, result);
            });
        } else {
            this.props.onLogin(false);
        }
    }

    render() {
        let { children } = this.props;
        return (
            <div onClick={this.facebookLogin}>
                {children}
            </div>
        );
    }
};

export default FacebookLogin;