import React from 'react';
import '../App.css';
import axios from 'axios';
import { search_engine_cred } from '../env';
import Search from "./Search";
import { getQuery } from "../utils/helper";
import { SearchInfo } from "./searchinfo";
import { withRouter } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { FormDialog } from "../utils/chooseTypeDialog";
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
    const search_mode = "youtube"
    if (search_mode == "youtube") {
      let { token } = getQuery()
      this.state = { query, token, search_mode };
    } else {
      let { from } = getQuery()
      if (!from) {
        from = 1
      }
      this.state = { query, from, openDialog: false };
    }
  }

  componentWillMount() {
    if (this.state.search_mode === "youtube") {
      this.youtubeSearchHandler(this.state.query, this.state.token)
    } else {
      this.searchHandler(this.state.query)
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps) return
    let { query, from = 1 } = getQuery()
    if (query !== this.state.query) {
      if (this.state.search_mode === "youtube") {
        this.youtubeSearchHandler(query)
      } else {
        this.searchHandler(query)
      }
    }
  }

  saveYoutubeResult = ({ snippet, id }) => {
    let vid = id.videoId
    let title = snippet.title
    let thumbnail = snippet.thumbnails.default.url
    let url = `https://youtu.be/${vid}`
    let data = {
      title, thumbnail, url, vid
    }
    console.log("here", data)
    // Pass url to dialog component
    this.setState({ openDialog: true, dialogData: data })
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
            <span className="ml-2 text-secondary cursor-pointer"><BookmarkBorderIcon /></span>
          </span>
          <div className="font-sm mt-0 pt-0">{item.link}</div>
        </div>
        <div className="result-body mt-2">{item.snippet}</div>
      </div>
    </div>
  }

  createYoutubeSearchResultItem(item, index) {
    return <div key={index} className="d-flex result-item border mt-2 mb-3 p-3 rounded">
      {item.snippet && item.snippet.thumbnails ?
        <div className="w-25 text-center">
          <img className="w-75 result-item-img" alt={item.snippet.title} src={item.snippet.thumbnails.default.url} />
        </div>
        : null}
      <div className={item.snippet && item.snippet.thumbnails ? "w-75" : "w-100"} >
        <div className="result-title">
          <span className="result-title-text">
            <a href={"https://youtu.be/" + item.id.videoId} target="_blank" rel="noopener noreferrer" >{item.snippet.title}</a>
            <span className="ml-2 text-secondary cursor-pointer" onClick={() => {
              this.saveYoutubeResult(item)
            }} ><BookmarkBorderIcon /></span>
          </span>
          <div className="font-sm mt-0 pt-0">{"https://youtu.be/" + item.id.videoId}</div>
        </div>
        <div className="result-body mt-2">{item.snippet.description}</div>
      </div>
    </div>
  }

  generateResults(data) {
    let resultLists = data.items.map((item, i) => {
      return this.createSearchResultItem(item, i)
    })
    return resultLists
  }

  generateYoutubeResults(data) {
    console.log("resu", data)
    let resultLists = data.items.map((item, i) => {
      return this.createYoutubeSearchResultItem(item, i)
    })
    return resultLists
  }

  /**
   * 
   * @param {*-Searched query} query 
   * @param {*Next page token} token 
   */
  youtubeSearchHandler = (query, token = null) => {
    axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        q: query,
        part: "snippet",
        maxResults: 10,
        key: search_engine_cred.CSE_API_KEY,
        type: "video",
        pageToken: token
      }
    }).then(async res => {
      let results = await this.generateYoutubeResults(res.data)
      let total_pages = Math.ceil(res.data.pageInfo.totalResults / res.data.pageInfo.resultsPerPage)
      window.scrollTo(0, 0)
      this.setState({
        results,
        query,
        nextPageToken: res.data.nextPageToken,
        prevPageToken: res.data.prevPageToken,
        searchInfo: res.data.pageInfo,
        total_pages: total_pages
      })
      return results
    })
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

  youtubePaginationChange(from) {
    let { nextPageToken, prevPageToken } = this.state, url = "", token = null
    if (from == "next" && nextPageToken) {
      url = `/search?query=${this.state.query}&token=${nextPageToken}`;
      token = nextPageToken
    } else if (from == "prev" && prevPageToken) {
      url = `/search?query=${this.state.query}&token=${prevPageToken}`;
      token = prevPageToken
    } else {
      console.log("error")
      return
    }
    const { history } = this.props;
    history.push(url);
    this.youtubeSearchHandler(this.state.query, token)
  }

  currentPage = () => {
    if (!this.state.from) return 1
    return Math.floor(this.state.from / 10) + 1
  }

  dialogHandler = (event) => {
    this.setState({ openDialog: event })
  }

  render() {
    return (<div className="w-100">
      <nav className="w-100 navbar sticky-top navbar-light bg-light">
        <Search showSearchButton="false" query={this.state.query} />
      </nav>
      <FormDialog dialogHandler={this.dialogHandler} open={this.state.openDialog} data={this.state.dialogData} />
      {this.state.openDialog}
      <div className="pl-2 pr-2">
        {this.state.searchInfo && this.state.search_mode !== 'youtube' ? (
          <div className="mt-1 mb-2">
            <SearchInfo query={this.state.searchQueries} searchInfo={this.state.searchInfo} />
          </div>
        ) : null}
        {this.state.results}
      </div>
      <div className="mt-2 mb-2 text-center">
        {this.state.search_mode === "youtube"
          ? (
            <div className="d-flex align-items-center m-auto justify-content-center">
              {this.state.prevPageToken ? <button onClick={() => { this.youtubePaginationChange('prev') }} className="mr-1">Previous</button> : null}
              {this.state.nextPageToken ? <button onClick={() => { this.youtubePaginationChange('next') }} className="ml-1">Next</button> : null}
            </div>
          ) : (
            <Pagination page={this.currentPage()} onChange={(event, page) => { this.paginationChange(event, page) }} count={this.state.total_pages} shape="rounded" />
          )}
      </div>
    </div >)
  }
}
export default withRouter(Result)