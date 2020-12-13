import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import SingleListDisplayMode from "./singleListDisplayMode";

function SingleListItemAdd(props) {
    // const [singleListItemAdderContentEditable, setSingleListItemAdderContentEditable] = useState('');

    useEffect(
        () => {
            // console.log(props)
            /**
             * parent state "singleListItemAdderContentEditable" should be updated only when there
             * is any difference between current state value and contentEditable div value
             */
            console.log(document.getElementsByClassName('single-list-item-adder-content-editable'));
            console.log('porównoanie useEffect', props.singleListItemAdderContentEditable !== document.getElementsByClassName('single-list-item-adder-content-editable')[0].innerText)
            if(props.singleListItemAdderContentEditable !== document.getElementsByClassName('single-list-item-adder-content-editable')[0].innerText){
                props.addContentEditableStateHandler(document.getElementsByClassName('single-list-item-adder-content-editable')[0].innerText)
            }
        }
    )
    return (
        <div className={'single-list-item-adder-container'} key={props.index} id={props.index}
             data-is-event-listener-added-for-enter={'false'}>
            <FontAwesomeIcon icon={faPlus}
                             color={'#ff1a8c'}
                             className={'single-list-icon--add'}
            />
            <span className={'single-list-item-adder-container__span'}>
                <div
                    onKeyDown={()=>this.props.addContentEditableStateHandler(document.getElementsByClassName('single-list-item-adder-content-editable')[0].innerText)}
                    className={'single-list-item-adder-content-editable'}
                    contentEditable={true} spellCheck={"false"}
                    suppressContentEditableWarning={true}
                    data-contenteditable-plc={props.plc}
                >{''}</div>
            </span>
        </div>
    );
}

export default SingleListItemAdd;