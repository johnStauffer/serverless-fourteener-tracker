import React, {Component} from 'react'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <div className="login-container">
                <div className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="Username"/>
                    </div>
                    <button type="button" className="login-btn" onClick={} ></button>
                </div>
            </div>
        )
    };

    const onLoginSubmit = (username, password) =>  {

    }


}

export default Login;
