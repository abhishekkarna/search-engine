import {
    useLocation
} from "react-router-dom";

// export function getQueryParams() {
//     const location = useLocation();
//     console.log("location.search", location.search)
//     return new URLSearchParams(location.search)
// }

/**
 * Helper function to get query from queryparams
 */
export function getQuery() {
    let url = new URL(window.location.href)
    let searchParam = new URLSearchParams(url.search)
    return searchParam.get("query")
    // let queryParams = getQueryParams()
    // return queryParams.get("query")
}