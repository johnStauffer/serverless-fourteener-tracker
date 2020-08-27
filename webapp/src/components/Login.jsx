import React, {Component} from 'react'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className="login-container">
                <div className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={this.state.password} name="password" placeholder="Username"/>
                    </div>
                    <input type="submit" value="submit"/>
                </div>
            </div>
        )
    };
}

export default Login;
