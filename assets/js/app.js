import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import CreateList from "./createNewList";
import SavedLists from "./savedLists";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


class App extends Component {

    removeDefaultNavClass = (e)=>{
        if(e.target.id !== 'defNavEl'){
            document.getElementById("defNavEl").classList.remove("default")
        } else {
            document.getElementById("defNavEl").classList.add("default")
        }
    }



    render() {
        return <Router>
            <div>
                <nav>
                    <ul>
                        <li className={"inline left main"} >
                            <Link to="/" className={"navLink default"} onClick={e=>this.removeDefaultNavClass(e)} id={"defNavEl"}>Stwórz nową listę</Link>
                        </li>
                        <li className={"inline main"}>
                            <Link to="/saved" className={"navLink"} onClick={e=>this.removeDefaultNavClass(e)}>Zapisane listy</Link>
                        </li>
                        <li className={"inline right about"}>
                            <Link to="/about" className={"navLink"} onClick={e=>this.removeDefaultNavClass(e)}>O mnie</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/" component={CreateList}/>
                    <Route path="/saved" component={SavedLists}/>
                    <Route path="/about" component={About}/>
                </Switch>
            </div>
        </Router>
    }
}

// function CreateNewList(props) {
//     return <CreateList/>
// }

function About() {
    return <h2>Tu znajdzie się krótka strona About</h2>
}

// function SavedLists() {
//     return <h2>Tu znajdą się wcześniej zapisane listy pobrane z bazy</h2>
// }


ReactDOM.render(<App/>, document.getElementById('root'));