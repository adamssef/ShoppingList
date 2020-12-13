import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {useLocation, withRouter} from 'react-router-dom';

import {faSave} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AllListsDisplayMode from './allListsDisplayMode';
import SingleListDisplayMode from "./singleListDisplayMode";

require('../../css/app.css');

class SavedLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            visited: false,
        };

        this.setCreateBlankItemLineStateToFalse = this.setCreateBlankItemLineStateToFalse.bind(this);

    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }


    /**
     *PLEASE ADD APPROPRIATE NAME
     */
    stateChanger = () => {
        let dataMock = this.state.data;
        if (this.state.data !== null) {
            dataMock[this.props.currentlyDisplayedListPosition].listItems = this.props.getCurrentArrOfItems();

            if (this.state.data[this.props.currentlyDisplayedListPosition]['listItems'] !== undefined && this.state.data[this.props.currentlyDisplayedListPosition][['listItems']].length !== this.props.getCurrentArrOfItems().length) {
                this.setState({
                    data: dataMock
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /**
         * Every time
         */
        if (this.state.savedListsToken !== false && this.state.data === null) {
            this.props.getUserListCollection();
            this.stateChanger();
        }
    }

    setCreateBlankItemLineStateToFalse = (e) => {
        if (this.state.createBlankItemLine) {
            this.setState({
                createBlankItemLine: false
            })
        }
    }


    render() {
        if (!this.props.parentState.singleListDisplayMode && this.props.parentState.allListsDisplayMode && this.props.parentState !== null) {
            return <AllListsDisplayMode
                dataState={this.props.parentState.data}
                parentState={this.state}
                newSimpleStateUpdater={this.props.newSimpleStateUpdater}
            />
        } else if (this.props.parentState.singleListDisplayMode && !this.props.parentState.allListsDisplayMode) {
            return <SingleListDisplayMode
                listItemsParentUpdater={this.props.listItemsParentUpdater}
                listItemsParentUpdaterDeleteOnly={this.props.listItemsParentUpdaterDeleteOnly}
                listTitleParentUpdater={this.props.listTitleParentUpdater}
                currentList={this.props.parentState.data[this.props.parentState.currentlyDisplayedListPosition]}
                currentListItems={this.props.parentState.data[this.props.parentState.currentlyDisplayedListPosition].listItems}
                listId={this.props.parentState.data.length - parseInt(this.props.parentState.currentlyDisplayedListPosition)}
                newSimpleStateUpdater={this.props.newSimpleStateUpdater}
                parentListLength={this.props.parentState.data.length}
                currentlyDisplayedListPosition={this.props.currentlyDisplayedListPosition}
                userId={this.props.userId}
                addNewLine={this.props.addNewLine}
                setCreateBlankItemLineStateToFalse={this.setCreateBlankItemLineStateToFalse}
                createBlankItemLine={this.props.createBlankItemLine}
                getUserListCollection={this.props.getUserListCollection}
            />
        } else if (!this.props.parentState.singleListDisplayMode && this.props.parentState.allListsDisplayMode && this.props.parentState !== null) {
            return <div>Nie stworzyłeś jeszcze żadnej listy.</div>
        }
    }
}


export default withRouter(SavedLists);