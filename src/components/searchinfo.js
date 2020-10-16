import React from 'react';

export class SearchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log("this.props", this.props)
        if (this.props.searchInfo) {
            let { formattedSearchTime, formattedTotalResults } = this.props.searchInfo
            let { request, nextPage } = this.props.query
            this.setState({ formattedSearchTime, formattedTotalResults })
            this.setState({ startIndex:request[0].startIndex, count:request[0].count })
        }
    }

    render() {
        return this.state.formattedTotalResults ? (
            <div className="text-secondary d-flex align-items-center font-sm">
                <div className="mr-auto">
                    Showing {this.state.startIndex}-{(this.state.startIndex+this.state.count)-1} of {this.state.formattedTotalResults}
                </div >
                <div className="ml-auto">
                    {this.state.formattedTotalResults} results searched in {this.state.formattedSearchTime} seconds
                </div >
            </div >
        ) : null
    }
}