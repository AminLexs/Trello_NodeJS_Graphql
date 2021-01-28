import React, { Component } from "react";
import AccountAction from "../action/accountAction"

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task_status: ""
        };
    }

    logout(){
        AccountAction.logoutQL();
    }

    render() {
        return (
        <div> 
            <nav className="navbar navbar-expand-lg navbar-dark bg-warning">
                <p className="navbar-brand">Trello 3.0</p>


                <div className="d-flex">                 
                    <button className="btn btn-primary mr-2" type="button" onClick={this.props.login}>Войти</button>
                    <button className="btn btn-secondary" type="button" onClick={this.logout}>Выйти</button>
                </div>
            </nav>
        </div>
    );
  }
}
export default NavBar;