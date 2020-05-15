import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./components/Login";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <main>
                <Login/>
            </main>
        );
    }
}

export default App;
