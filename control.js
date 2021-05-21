import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import React from 'react'
import App from './App';  
import Detailed from './singlePersona'
import SkillList from './SkillList'
import { skillList } from "./Data/SkillData";

let inBetween = {sending: null}

function Root(){
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <App inBetween = {inBetween}/>
                </Route>
                <Route exact path="/persona/:name" render={(props) => {
                    const { name } = props.match.params
                    return <Detailed persona ={name} />
                }}
                >
                </Route>

                <Route exact path = "/Skills/">
                    <SkillList />
                </Route>
            </Switch>
        </Router>
    )
}

export default Root