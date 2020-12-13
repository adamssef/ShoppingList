import React, {Component, Fragment, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import ContentEditable from "react-contenteditable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import SingleListItem from "./singleListItem";
import SingleListItemAdd from "./singleListItemAdd";

class SingleListDisplayMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enterCLickCounter: 0,
            singleListItemAdderContentEditable: ''
        };

        this.addContentEditableStateHandler = this.addContentEditableStateHandler.bind(this);
    }


    componentDidMount() {
        document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDM, line 20 keydown'));
        document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDM, line 21 keyup'));
        document.getElementsByClassName('single-list-item-adder-container')[0].dataset.isEventListenerAddedForEnter = 'true';
        document.getElementsByClassName('list-title')[0].innerText = this.props.currentList.name;
        [...document.querySelectorAll('.single-list-item')].map(item => {


            /** I am capturing keydown to prevent from creating new line */
            item.childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e, 'single-list-item-content, SLDM, CDM, line 27 keydown'));
            item.childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e, 'single-list-item-content, SLDM, CDM, line 28 keyup'));
            item.dataset.isEventListenerAddedForEnter = 'true';
            /**this will help to identify items with event listeners aleady added*/
            item.childNodes[1].childNodes[0].addEventListener('focusout', e => this.renderExsitingLines(e));
        });
        document.querySelector('.single-list-icon--add').addEventListener('click', e => {
            this.props.listItemsParentUpdater();
            this.props.addNewLine();
            this.props.listItemsParentUpdater()
        });
        document.querySelector('.single-list-icon--add').dataset.onClickAddItem = 'true';
        document.querySelector('.list-title').addEventListener('keyup', e => this.props.listTitleParentUpdater(e, this.props.listId));
        document.querySelector('.list-title').addEventListener('keydown', e => this.listFieldEnterPressHandler(e));
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => {
            item.addEventListener('click', (e) => this.itemDeleteHandler(e));
            item.dataset.onClickItemDeleteHandler = 'true';
        });

    }

    componentDidUpdate() {
        // this.focusOnFirstEditableItem();
        if (document.querySelector('.single-list-icon--add').dataset.onClickAddItem !== 'true') {
            document.querySelector('.single-list-icon--add').addEventListener('click', e => {
                this.props.listItemsParentUpdater('single list icon add');
                this.props.addNewLine();
                this.props.listItemsParentUpdater('single list icon add');
                document.querySelector('.single-list-icon--add').dataset.onClickAddItem = 'true';
            });
        }

        if (document.getElementsByClassName('single-list-item-adder-container')[0].dataset.isEventListenerAddedForEnter !== 'true') {
            document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDU, line 56 keydown'));
            document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDU, line 58L keyup'));
            document.getElementsByClassName('single-list-item-adder-container')[0].dataset.isEventListenerAddedForEnter = 'true';
        }

        [...document.querySelectorAll('.single-list-item')].map(item => {
            /**
             * checks if event listener is already added so that it wont get added twice.
             */
            if (item.dataset.isEventListenerAddedForEnter !== 'true') {
                /** I am capturing keydown to prevent from creating new line */
                item.childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e));
                item.childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e));
                item.dataset.isEventListenerAddedForEnter = 'true'
            }
            item.childNodes[1].childNodes[0].addEventListener('focusout', e => this.renderExistingLines(e));
        });
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => {
            if (item.dataset.onClickItemDeleteHandler !== 'true') {
                item.addEventListener('click', (e) => this.itemDeleteHandler(e));
                item.dataset.onClickItemDeleteHandler = 'true';
            }

        });

    }

    componentWillUnmount() {
        this.saveChangesToDb();
        this.props.getUserListCollection();
        [...document.querySelectorAll('.single-list-item')].map((item) => {
            item.childNodes[1].childNodes[0].removeEventListener('keyup', e => this.enterKeyHandler(e));
            item.childNodes[1].childNodes[0].removeEventListener('keyup', (e) => this.enterKeyHandler(e));
            item.childNodes[1].childNodes[0].removeEventListener('focusout', e => this.renderExistingLines(e));
            // item.removeEventListener('click', e => this.delegateFocusDownToTextField(e));
        })

        // document.querySelector('.single-list-save-btn').removeEventListener('click', e => this.props.listItemsParentUpdater());
        document.querySelector('.single-list-icon--add').removeEventListener('click', e => {
            this.props.addNewLine();
            this.props.listItemsParentUpdater()
        });
        document.querySelector('.list-title').removeEventListener('keydown', e => this.props.listTitleParentUpdater(e, this.props.listId));
        document.querySelector('.list-title').removeEventListener('keydown', e => this.listFieldEnterPressHandler(e));
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => item.removeEventListener('click', (e) => this.itemDeleteHandler(e)));

        this.props.setCreateBlankItemLineStateToFalse();
    }


    enterKeyHandler = (e, source) => {
        if (e.key === 'Enter' && e.type === 'keydown') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.props.listItemsParentUpdater('enter key handler');//1) updates data state in app.js
            this.props.addNewLine(e);//2) set state to render new empty line
            this.props.listItemsParentUpdater('enter key handler'); //3) updates state again to take into account the empty line just created. this is necessary to keep the list items up to date with state data.
            this.renderExistingLines(e);


            let singleListViewContainerChildNodes = document.querySelector('.single-list-view-container').childNodes;


            let firstNode = singleListViewContainerChildNodes[0];
            firstNode.childNodes[1].childNodes[0].focus();
        }
    }

    itemDeleteHandler = (e) => {
        let itemId = e.currentTarget.parentElement.id;
        let listId = e.currentTarget.parentNode.parentNode.parentNode.id;

        this.props.listItemsParentUpdaterDeleteOnly(itemId, listId)
    }

    listFieldEnterPressHandler = (e) => {
        if (e.key === 'Enter' && e.currentTarget !== document.getElementsByClassName('list-title')[0]) {
            e.stopImmediatePropagation();
            e.preventDefault();
            let singleListItemContent = document.querySelector('.single-list-item-content');
            if (singleListItemContent !== undefined && singleListItemContent !== null) {
                document.querySelector('.single-list-item-content').focus();
            }
        } else if (e.key === 'Enter' && e.currentTarget === document.getElementsByClassName('list-title')[0]) {
            e.stopImmediatePropagation();
            e.preventDefault();

            document.getElementsByClassName('single-list-item-adder-content-editable')[0].focus();
        }
    }


    /**
     *
     * @param newItems - shoudl be array
     * @param listId - should be integer
     * @param uid - should be integer
     */
    saveChangesToDb = () => {
        let unfilteredNewItems = this.props.currentListItems

        let listId = document.querySelector('.single-list-view-general-container').id;
        let listName = this.props.currentList.name;
        let uid = this.props.userId;
        let arr = [];

        for (const property in unfilteredNewItems) {
            if (!isNaN(property)) {
                arr.push(unfilteredNewItems[property])
            }
        }


        if (Array.isArray(unfilteredNewItems) ||
            Number.isFinite(uid) ||
            unfilteredNewItems.length > 0 ||
            typeof listName === 'string' ||
            unfilteredNewItems !== 'undefined') {
            let formData = new FormData;

            for (let i = 0; i < unfilteredNewItems.length; i++) {
                formData.append(i, unfilteredNewItems[i])
            }

            formData.append('name', listName);
            formData.append('listId', listId);
            formData.append('id', uid)

            let targetUrl = `${location.origin}/dashboard/update-list-items`;
            let request = new Request(targetUrl, {
                body: formData,
                method: "POST",
                headers: {
                    "Access-Control-Request-Methods": "POST",
                    "Origin": location.origin,
                },
                mode: "cors"
            });

            fetch(request)
                .then(res => res.json())
        } else {
            return null;
        }
    }


    /**
     * @param e
     * this function manages setCreateBlankItemLineStateToFalse state which informs SLDM component if new empty line should be added at the end of the list or not.
     */
    renderExistingLines = (e) => {
        let listLength = document.getElementsByClassName('single-list-item').length
        let elementId = e.target.parentElement.parentElement.id;
        if (this.props.createBlankItemLine && listLength - 1 !== parseInt(elementId) && e.type !== 'focusout') {
            this.props.setCreateBlankItemLineStateToFalse();
        }
    }

    addContentEditableStateHandler = (possiblyNewState) => {
        if (possiblyNewState !== this.state.singleListItemAdderContentEditable) {
            this.setState({
                singleListItemAdderContentEditable: possiblyNewState
            });
        }
    }


    /**
     * There is a conditional rendering based on the this.state.createBlankItemLine boolean value
     * If this.state.createBlankItemLine is set to TRUE - the new blank item line is created and displayed under the existing item lines
     * FALSE value will just display the existing items based on the this.props.data
     * @returns {JSX.Element}
     */
    render() {
        let arrOfProducts = Object.values(this.props.currentList)[2]

        if (typeof arrOfProducts === 'object') {
            arrOfProducts = Object.values(arrOfProducts);
        }

        if (this.props.createBlankItemLine === false) {
            return <div className={'single-list-view-general-container'} id={this.props.currentList.id}>
                <ContentEditable
                    className={'list-title'}
                    html={this.props.currentList.name}
                    data-contenteditable-plc={'nazwij swoją listę'}
                />
                <div className={'single-list-view-container'}>
                    <SingleListItemAdd listItemsParentUpdater={this.props.listItemsParentUpdater}
                                       plc={'dodaj nowy zakup'}
                                       addContentEditableStateHandler={this.addContentEditableStateHandler}
                                       singleListItemAdderContentEditable={this.state.singleListItemAdderContentEditable}

                    />
                    {arrOfProducts.map((item, index) => {
                        return <SingleListItem index={index} item={item} key={index + 'sli'}
                                               listItemsParentUpdater={this.props.listItemsParentUpdater}
                        />
                    })
                    }

                </div>
                <button
                    onClick={(e) => {
                        this.props.newSimpleStateUpdater('all')
                    }}
                    id={'backBtn'}>Wróć
                </button>

            </div>;
        }

        if (this.props.createBlankItemLine === true) {
            return <div className={'single-list-view-general-container'} id={this.props.currentList.id}>
                <ContentEditable
                    className={'list-title'}
                    html={this.props.currentList.name}
                    data-contenteditable-plc={'nazwij swoją listę'}
                />
                <FontAwesomeIcon icon={faPlus}
                                 color={'#ff1a8c'}
                                 className={'single-list-icon--add'}
                />
                <div className={'single-list-view-container'}>
                    <SingleListItemAdd listItemsParentUpdater={this.props.listItemsParentUpdater}
                                       plc={'dodaj nowy zakup'}
                                       addContentEditableStateHandler={this.addContentEditableStateHandler}
                                       singleListItemAdderContentEditable={this.singleListItemAdderContentEditable}
                    />
                    <SingleListItem
                        item={this.state.singleListItemAdderContentEditable}
                        listItemsParentUpdater={this.props.listItemsParentUpdater}
                    />

                    />
                    {arrOfProducts.map((item, index) => {
                        return <SingleListItem index={index} item={item} key={index + 'sli'}
                                               listItemsParentUpdater={this.props.listItemsParentUpdater}
                                               plc={'dodaj nowy zakup'}/>
                    })
                    }

                </div>
                <button
                    onClick={(e) => {
                        this.props.newSimpleStateUpdater('all')
                    }}
                    id={'backBtn'}>Wróć
                </button>
            </div>;
        }
    }
}



export default SingleListDisplayMode;