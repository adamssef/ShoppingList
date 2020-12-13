import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {formatDistance} from "date-fns";
import {pl} from "date-fns/locale";

class AllListsDisplayMode extends Component {
    render() {
        if(this.props.dataState !== null && this.props.dataState.length > 0) {
            return <>
                <div className={'lists-container'}>{[...this.props.dataState].map(function (item, index) {
                    return <div key={index} className={'list-item'} id={item.id} data-index={index}
                                onClick={(e) => this.props.newSimpleStateUpdater('single', e)}>
                        <p>{item.name}</p>
                        <div className={'list-item-time-container'}>{
                            formatDistance(new Date(item.creationDate), new Date(), {
                                    locale: pl,
                                    addSuffix: true
                                }
                            )
                        }
                        </div>
                    </div>;
                }, this)}</div>
            </>
        } else {
            return <div>Nie utworzono jeszcze żadnej listy. Utwórz ją!</div>
        }

    }
}

export default AllListsDisplayMode;