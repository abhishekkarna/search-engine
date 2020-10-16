import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import '../App.css';
import axios from 'axios';
import { search_engine_cred } from '../env';
import { Search } from "./Search";

export class Result extends React.Component {
  constructor(props) {
    super(props);
    let query = ""
    if (!this.props.query) {
      query = this.getQuery()
    }else{
      query = this.props.query
    }
    this.state = { query };
  }
  componentWillMount() {
    this.searchHandler(this.state.query)
  }

  getQuery() {
    let url = new URL(window.location.href)
    let searchParam = new URLSearchParams(url.search)
    return searchParam.get("query")
    // let queryParams = getQueryParams()
    // return queryParams.get("query")
  }


  createSearchResultItem(item) {
    return <div className="d-flex result-item border mt-2 mb-3 p-3 rounded">
      <div className="w-25 text-center">
        {item.pagemap.cse_thumbnail ? <img className="w-75 result-item-img" src={item.pagemap.cse_thumbnail[0].src} /> : null}
      </div>
      <div className="w-75">
        <div className="result-title">
          <span className="result-title-text"><a href={item.link} target="_blank">{item.title}</a></span>
          <div className="font-sm mt-0 pt-0">{item.link}</div>
        </div>
        <div className="result-body mt-2">{item.snippet}</div>
      </div>
    </div>
  }

  generateResults(data) {
    let resultLists = data.items.map(item => {
      return this.createSearchResultItem(item)
    })
    return resultLists
  }

  searchHandler = (query) => {
    // return this.generateResults(test)
    axios.get(`https://customsearch.googleapis.com/customsearch/v1`, {
      params: {
        q: query,
        key: search_engine_cred.CSE_API_KEY,
        start: 0,
        fields:"items(link,title,snippet,pagemap,)",
        cx: search_engine_cred.SEARCH_ENGINE_ID
      }
    }).then(async res => {
      let results = await this.generateResults(res.data)
      this.setState({ results })
      return results
    })
  }

  render() {
    return <div className="w-100">
      <nav className="w-100 navbar sticky-top navbar-light bg-light">
        <Search showSearchButton="false" query={this.state.query} />
      </nav>
      <div className="pl-2 pr-2">
        {this.state.results}
      </div>
    </div >
  }
}