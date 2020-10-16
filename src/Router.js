import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { Search } from "./components/Search";
import { Result } from "./components/Result";
import { getQuery } from "./utils/helper";

export default () => (
    <Router>
        <Switch>
            <Route exact path="/">
                <div className="App w-100">
                    <Search />
                </div>
            </Route>
            <Route path="/search">
                <Result query={getQuery().query} from={getQuery().from} />
            </Route>
        </Switch>
    </Router>
)