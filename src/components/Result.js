import React from 'react';
import '../App.css';
import axios from 'axios';
import { search_engine_cred } from '../env';
import Search from "./Search";
import { getQuery } from "../utils/helper";
import { SearchInfo } from "./searchinfo";
import { withRouter } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';

class Result extends React.Component {
  constructor(props) {
    super(props);
    let query = ""
    if (!this.props.query) {
      ({ query } = getQuery())
    } else {
      query = this.props.query
    }
    if (!query) this.props.history.push("/")
    let { from } = getQuery()
    if (!from) {
      from = 1
    }
    this.state = { query, from };
  }

  componentWillMount() {
    this.searchHandler(this.state.query)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps) return
    let { query, from = 1 } = getQuery()
    if (query !== this.state.query) {
      this.searchHandler(query, from)
    }
  }

  createSearchResultItem(item, index) {
    return <div key={index} className="d-flex result-item border mt-2 mb-3 p-3 rounded">
      {item.pagemap && item.pagemap.cse_thumbnail ?
        <div className="w-25 text-center">
          <img className="w-75 result-item-img" alt={item.title} src={item.pagemap.cse_thumbnail[0].src} />
        </div>
        : null}
      <div className={item.pagemap && item.pagemap.cse_thumbnail ? "w-75" : "w-100"} >
        <div className="result-title">
          <span className="result-title-text">
            <a href={item.link} target="_blank" rel="noopener noreferrer" >{item.title}</a>
          </span>
          <div className="font-sm mt-0 pt-0">{item.link}</div>
        </div>
        <div className="result-body mt-2">{item.snippet}</div>
      </div>
    </div>
  }

  generateResults(data) {
    let resultLists = data.items.map((item, i) => {
      return this.createSearchResultItem(item, i)
    })
    return resultLists
  }

  searchHandler = (query, from = this.state.from) => {
    axios.get(`https://customsearch.googleapis.com/customsearch/v1`, {
      params: {
        q: query,
        key: search_engine_cred.CSE_API_KEY,
        start: from,
        fields: "items(link,title,snippet,pagemap),searchInformation,queries",
        cx: search_engine_cred.SEARCH_ENGINE_ID
      }
    }).then(async res => {
      let results = await this.generateResults(res.data)
      let total_pages = Math.ceil(res.data.searchInformation.totalResults / 10)
      window.scrollTo(0, 0)
      this.setState({
        results,
        from,
        query,
        searchInfo: res.data.searchInformation,
        searchQueries: res.data.queries,
        total_pages: total_pages
      })
      return results
    })
  }

  paginationChange = (event, page) => {
    let from = ((page - 1) * 10) + 1
    let url = `/search?query=${this.state.query}&from=${from}`;
    const { history } = this.props;
    history.push(url);
    this.searchHandler(this.state.query, from)
  }

  currentPage = () => {
    if (!this.state.from) return 1
    return Math.floor(this.state.from / 10) + 1
  }

  render() {
    return (<div className="w-100">
      <nav className="w-100 navbar sticky-top navbar-light bg-light">
        <Search showSearchButton="false" query={this.state.query} />
      </nav>
      <div className="pl-2 pr-2">
        {this.state.searchInfo ? (
          <div className="mt-1 mb-2">
            <SearchInfo query={this.state.searchQueries} searchInfo={this.state.searchInfo} />
          </div>
        ) : null}
        {this.state.results}
      </div>
      <div className="mt-2 mb-2 text-center">
        <Pagination page={this.currentPage()} onChange={(event, page) => { this.paginationChange(event, page) }} count={this.state.total_pages} shape="rounded" />
      </div>
    </div >)
  }
}
export default withRouter(Result)