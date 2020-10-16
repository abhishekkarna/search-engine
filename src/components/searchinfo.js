import React from 'react';

export class SearchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        if (this.props.searchInfo) {
            let { formattedSearchTime, formattedTotalResults } = this.props.searchInfo
            let { request } = this.props.query
            this.setState({ formattedSearchTime, formattedTotalResults })
            this.setState({ startIndex: request[0].startIndex, count: request[0].count })
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.query.request[0].startIndex !== this.props.query.request[0].startIndex) {
            let { formattedSearchTime, formattedTotalResults } = this.props.searchInfo
            let { request } = this.props.query
            this.setState({ formattedSearchTime, formattedTotalResults })
            this.setState({ startIndex: request[0].startIndex, count: request[0].count })
        }
    }

    render() {
        return (
            this.state.formattedTotalResults ? (
                <div key={this.state.startIndex} className="text-secondary d-flex align-items-center font-sm">
                    <div className="mr-auto">
                        Showing {this.state.startIndex}-{(this.state.startIndex + this.state.count) - 1} of {this.state.formattedTotalResults}
                    </div >
                    <div className="ml-auto">
                        {this.state.formattedTotalResults} results searched in {this.state.formattedSearchTime} seconds
                    </div >
                </div >
            ) : null)
    }
}