import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import ReactPlayer from 'react-player';
import { Col, Row, Container } from "../components/Grid";
import Globe from "../components/Globe";
import dbAPI from "../utils/dbAPI";
import FacebookLoginButton from '../components/FacebookLoginButton';
import { Link } from "react-router-dom";
import "./Signin.css";

class Signin extends Component {

    state = {
        userData: null, // just store database record.  Do I need the individual fields?
        buttonEnabled: false, // initially disable start button. Only enable if user is logged in
        userName: null,
        userID: null,
        wins: 0,
        losses: 0,
        redirect: false
    }

    loadUserData = (userName, userID) => {
        dbAPI.getUser(userID)
            .then(res => {
                if (!res || !res.data.length) { // didn't find so create record
                    console.log("loadUserData: did not find so create");
                    let userData = { userid: userID, username: userName, wins: 0, losses: 0 };
                    dbAPI.createUser(userData)
                        .then(res => {
                            console.log("loadUserData: created new user: " + JSON.stringify(res.data));
                            this.setState({
                                userData: res.data,
                                buttonEnabled: true,
                                userName: res.data.username,
                                userID: res.data.userid,
                                wins: res.data.wins,
                                losses: res.data.losses
                            })
                        })
                        .catch(err => (console.log("error creating User: " + err)));
                }
                else {
                    console.log("loadUserData: found user: " + JSON.stringify(res.data[0]));
                    this.setState({
                        userData: res.data[0],
                        buttonEnabled: true,
                        userName: res.data[0].username,
                        userID: res.data[0].userid,
                        wins: res.data[0].wins,
                        losses: res.data[0].losses
                    })
                }
            })
            .catch(err => console.log(err));
    };

    onFacebookLogin = (loginStatus, resultObject) => {
        console.log("onFacebookLogin");
        if (loginStatus === true) {
            console.log("onFacebookLogin: loginStatus=" + loginStatus);
            this.loadUserData(resultObject.user.name, resultObject.user.id);
        } else {
            //alert("Facebook login error");
            console.log("Facebook login error");
        }
    }

    startBtnClicked = () => {
        this.setState({ redirect: true });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            //return <Redirect to='/games' />
            return <Redirect to={{
                pathname: "/games",
                state: {
                    userData: this.state.userData,
                    userName: this.state.userName,
                    userID: this.state.userID,
                    wins: this.state.wins,
                    losses: this.state.losses
                }
            }} ></Redirect>
        }
    }

    render() {
        return (
            <Container fluid>
                {this.renderRedirect()}
                <Row> 
                    <Col size="md-12">
                       <h1 className="sigin navbar navbar-expand-sm navbar-dark bg-primary">
                            <Link className="navbar-brand" to="/">
                                <img className="pull-left" id="logo" src="/images/carmensandiego.jpeg" alt="" style={{ height: 150, marginTop: -4 }} />
                             </Link>
                             
                            <div>
                                <Row>
                                    <Col size="md-10">
                                        
                                    </Col>
                                    <Col size="md-2" className="navBtns">
                                        <FacebookLoginButton onLogin={this.onFacebookLogin}>
                                            <div className="fb-login-button" data-size="large" data-button-type="login_with" data-auto-logout-link="true" data-use-continue-as="false" width="10px"></div>
                                        </FacebookLoginButton>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size="md-10" className="navTitle">
                                        <div className="navTitle">
                                            Carmen's Travel App
                                        </div>
                                    </Col>
                                    <Col size="md-2" className="navBtns">
                                        <button disabled={!this.state.buttonEnabled} onClick={this.startBtnClicked} id="start" size="lg"> Start Game </button>
                                    </Col>
                                </Row>
                            </div>
                        </h1>
                    </Col>
                </Row>
                <Row>
                    <Col size="md-12">
                        <Globe />
                    </Col>
                </Row>
                <ReactPlayer url={"./music/carmensandiegotheme.m4a"} playing={true} width="1px" height="1px" onReady={() => console.log('onRead')} onStart={() => console.log('onStart')} onEnded={() => console.log('onEnded')} onPause={() => console.log('onPause')} />
            </Container>
        );
    }
}

export default Signin;
