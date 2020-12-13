import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";

class SingleListItem extends Component {
    render() {
        return <div className={'single-list-item'} key={this.props.index} id={this.props.index}
                    data-is-event-listener-added-for-enter={'false'}>
            <input
                type='checkbox'
                className={'single-list-item-checkbox'}
            />
            <span className={'span'}>
                <div
                    className={'single-list-item-content'}
                    contentEditable={true} spellCheck={"false"}
                    suppressContentEditableWarning={true}
                    data-contenteditable-plc={this.props.plc}
                >{this.props.item}
                </div>
            </span>
            <FontAwesomeIcon icon={faMinusCircle}
                             className={'single-list-item-icon--delete'}
                             color={'#4B4B4B'}
            />
        </div>
    }
}

export default SingleListItem;