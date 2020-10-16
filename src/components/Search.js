import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import {
  withRouter, Redirect,
} from "react-router-dom";
import '../App.css';

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { placeholder: "Search", query: "" };
  }

  componentDidMount() {
    if (this.props && this.props.query) {
      this.setState({ query: this.props.query })
    }
  }

  searchOnFocus = (ev) => {
    if (ev === "in") {
      this.setState({ "placeholder": '' });
      document.querySelector("#searchContainer").classList.add("highlight")
    }
    else {
      this.setState({ "placeholder": 'Search' });
      document.querySelector("#searchContainer").classList.remove("highlight")
    }
  }

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push({
      pathname: "/search",
      search: `?query=${this.state.query}`
    });
  }

  render() {
    return (
      <form className="h-100 w-100" onSubmit={this.handleSubmit}>
        < div className="flex-column d-flex text-center justify-content-center align-items-center h-100 " >
          <div id="searchContainer" className="overflow-hidden w-50 align-items-center d-flex border pl-3 corner-rounded">
            <SearchIcon className="text-secondary" />
            <input type="search" name="query" value={this.state.query} onBlur={() => this.searchOnFocus('out')}
              onFocus={() => this.searchOnFocus('in')} onChange={this.handleChange} placeholder={this.state.placeholder}
              className="form-control border-0 searchbox" />
          </div>
          {
            this.props.showSearchButton !== 'false' ? (<div className="mt-2">
              <Button type="submit" variant="contained" className="searchBtn" endIcon={<Icon>send</Icon>} disableElevation>Search</Button>
            </div>) : null
          }
        </div >
      </form >
    )
  }
}
export default withRouter(Search)