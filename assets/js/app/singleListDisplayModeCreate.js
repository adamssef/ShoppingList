import React, {Component, Fragment, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import ContentEditable from "react-contenteditable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import SingleListItem from "./singleListItem";
import SingleListItemAdd from "./singleListItemAdd";
import {withRouter} from 'react-router-dom';
import Swal from 'sweetalert2';


class SingleListDisplayModeCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newListName: '',
            newListItems: {},
            createBlankItemLine: false,
            singleListItemAdderContentEditable: '',
            width: window.innerWidth
        };

        this.addContentEditableStateHandler = this.addContentEditableStateHandler.bind(this);
    }


    componentDidMount() {
        if (this.props.parentState.createNewList !== true) {
            this.props.newSimpleStateUpdater('create');
        }

        window.addEventListener('resize', () => {
            this.windowWidthStateUpdater()
        })
        document.querySelector('.list-title').focus();
        document.querySelector('.btn-container--save').addEventListener('click', () => {
            this.props.newSimpleStateUpdater('all')
        })
        document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDM, line 20 keydown'));
        document.getElementsByClassName('single-list-item-adder-container')[0].childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e, 'single-list-item-adder-contentEditable, SLDM, CDM, line 21 keyup'));
        document.getElementsByClassName('single-list-item-adder-container')[0].dataset.isEventListenerAddedForEnter = 'true';
        document.getElementsByClassName('list-title')[0].innerText = this.state.newListName;
        [...document.querySelectorAll('.single-list-item')].map(item => {


            /** I am capturing keydown to prevent from creating new line */
            item.childNodes[1].childNodes[0].addEventListener('keydown', (e) => this.enterKeyHandler(e, 'single-list-item-content, SLDM, CDM, line 27 keydown'));
            item.childNodes[1].childNodes[0].addEventListener('keyup', (e) => this.enterKeyHandler(e, 'single-list-item-content, SLDM, CDM, line 28 keyup'));
            item.dataset.isEventListenerAddedForEnter = 'true';
            /**this will help to identify items with event listeners aleady added*/
            item.childNodes[1].childNodes[0].addEventListener('focusout', e => this.renderExsitingLines(e));
        });
        document.querySelector('.single-list-icon--add').addEventListener('click', e => {
            this.enterKeyHandler(e);
        });
        document.querySelector('.single-list-icon--add').dataset.onClickAddItem = 'true';
        document.querySelector('.list-title').addEventListener('keydown', e => this.listTitleEnterPressHandler(e));
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => {
            item.addEventListener('click', (e) => this.itemDeleteHandler(e));
            item.dataset.onClickItemDeleteHandler = 'true';
        });

    }

    componentDidUpdate() {

        if (document.querySelector('.single-list-icon--add').dataset.onClickAddItem !== 'true') {
            document.querySelector('.single-list-icon--add').addEventListener('click', e => {
                this.addNewLine();
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
            item.childNodes[1].childNodes[0].addEventListener('focusout', e => this.renderExistingLines(e, 'focusout event'));
            // item.addEventListener('click', e => this.delegateFocusDownToTextField(e))
        });
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => {
            if (item.dataset.onClickItemDeleteHandler !== 'true') {
                item.addEventListener('click', (e) => this.itemDeleteHandler(e));
                item.dataset.onClickItemDeleteHandler = 'true';
            }

        });

    }

    componentWillUnmount() {
        // this.saveChangesToDb(); I was considering saving on component willUnmount, but for now I dont fined it user friendly or practical
        this.props.getUserListCollection();
        document.querySelector('.btn-container--save').removeEventListener('click', (e) => {
            this.props.newSimpleStateUpdater('all')
        });
        [...document.querySelectorAll('.single-list-item')].map((item) => {
            item.childNodes[1].childNodes[0].removeEventListener('keyup', e => this.enterKeyHandler(e));
            item.childNodes[1].childNodes[0].removeEventListener('keyup', (e) => this.enterKeyHandler(e));
            item.childNodes[1].childNodes[0].removeEventListener('focusout', e => this.renderExistingLines(e));
            // item.removeEventListener('click', e => this.delegateFocusDownToTextField(e));
        })

        document.querySelector('.single-list-icon--add').removeEventListener('click', e => {
            this.props.addNewLine();
        });
        document.querySelector('.list-title').removeEventListener('keydown', e => this.listTitleEnterPressHandler(e));
        [...document.querySelectorAll('.single-list-item-icon--delete')].map((item) => item.removeEventListener('click', (e) => this.itemDeleteHandler(e)));

        this.setCreateBlankItemLineStateToFalse();
    }

    addNewLine = (e) => {
        if (!this.state.createBlankItemLine) {
            this.setState({
                createBlankItemLine: true
            })
        }
    }


    enterKeyHandler = (e, source) => {
        if (e.key === 'Enter' && e.currentTarget.classList.contains('single-list-item-adder-content-editable')) {
            this.addContentEditableStateHandler(e.currentTarget.innerText);
        }
        if (e.key === 'Enter' && e.type === 'keydown' || e.currentTarget.parentElement.classList.contains('single-list-item-adder-container')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.addNewLine(e);//2) set state to render new empty line
            // this.renderExistingLines(e, 'enterKeyHandler');
            this.setState({
                createBlankItemLine: false,
            })

            let singleListViewContainerChildNodes = document.querySelector('.single-list-view-container').childNodes;

            let firstNode = singleListViewContainerChildNodes[0];
            firstNode.childNodes[1].childNodes[0].innerText = '';
            firstNode.childNodes[1].childNodes[0].focus();
        }
    }

    itemDeleteHandler = (e) => {
        // 1) Selecting deleted item id
        let itemId = e.currentTarget.parentElement.id;

        // 2) Create object mock
        let objectMock = this.state.newListItems;

        // 3) Perform delete on mock
        delete objectMock[itemId];

        // 4) Reordering keys on a mock (0,1,2,3,...,n, n+1)
        let arrOfProducts = Object.values(this.state.newListItems);
        let orderedObject = {};
        arrOfProducts.map((item, index) => {
            orderedObject[index] = item;
        })

        // 5) Replace state with mock


        this.setState({
            newListItems: orderedObject
        })
        // 6) When list is empty - focus on "add new" contentEditable field
        if (Object.keys(objectMock).length < 1) {
            document.querySelector('.single-list-item-adder-content-editable').focus();
        }
    }

    listTitleEnterPressHandler = (e) => {
        this.setState({
            newListName: document.getElementsByClassName('list-title')[0].innerText
        })
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

    saveButtonComboFunctioner = (e) => {
        this.saveChangesToDb();
        this.props.newSimpleStateUpdater('all', e)
    }


    /**
     *
     * @param newItems - shoudl be array
     * @param listId - should be integer
     * @param uid - should be integer
     */
    saveChangesToDb = () => {
        let arrOfProducts = Object.values(this.state.newListItems);

        let listName = this.state.newListName;
        let uid = this.props.userId;

        let formData = new FormData;

        for (let i = 0; i < arrOfProducts.length; i++) {
            formData.append(i, arrOfProducts[i])
        }

        formData.append('name', listName);
        formData.append('id', uid)

        let targetUrl = `${location.origin}/dashboard/save`;
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
    }


    /**
     * @param e
     * this function manages setCreateBlankItemLineStateToFalse state which
     * informs SLDM component if new empty line should be added at the end of the list or
     * not.
     */
    renderExistingLines = (e, source) => {
        let listLength = document.getElementsByClassName('single-list-item').length
        let elementId = e.target.parentElement.parentElement.id;
        if (this.state.createBlankItemLine && listLength - 1 !== parseInt(elementId) && e.type !== 'focusout') {
            this.setCreateBlankItemLineStateToFalse();
        }
    }

    setCreateBlankItemLineStateToFalse = () => {
        if (this.state.createBlankItemLine) {
            this.setState({
                createBlankItemLine: false
            })
        }
    }

    addContentEditableStateHandler = (possiblyNewState) => {
        if (possiblyNewState !== this.state.singleListItemAdderContentEditable && possiblyNewState !== '') {
            this.setState({
                singleListItemAdderContentEditable: possiblyNewState,
            })


            this.setState(prevState => {
                let newListItems = Object.assign({}, prevState.newListItems);  // creating copy of state variable newListItems
                newListItems[Object.keys(newListItems).length] = possiblyNewState;//update the name property, assign a new value
                return {newListItems};// return new object newListItems object
            })
        }
    }

    windowWidthStateUpdater = () => {
        if (window.innerWidth !== this.state.width) {
            this.setState({
                width: window.innerWidth
            })
        }
    }


    /**
     * There is a conditional rendering based on the this.state.createBlankItemLine boolean value
     * If this.state.createBlankItemLine is set to TRUE - the new blank item line is
     * created and displayed under the existing item lines
     * FALSE value will just display the existing items based on the this.props.data
     * @returns {JSX.Element}
     */
    render() {
        switch (this.state.width > 450.0000000000000000000000001) {
            case true:
                if (this.state.createBlankItemLine === true) {
                    return <div className={'single-list-view-general-container'}>
                        <ContentEditable
                            className={'list-title'}
                            html={this.state.newListName}
                            data-contenteditable-plc={'nazwij swoją listę'}
                        />
                        <div className={'single-list-view-container'}>
                            <SingleListItemAdd plc={'dodaj nowy zakup'}
                                               addContentEditableStateHandler={this.addContentEditableStateHandler}
                                               singleListItemAdderContentEditable={this.state.singleListItemAdderContentEditable}
                            />
                            <SingleListItem
                                item={this.state.singleListItemAdderContentEditable}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                this.props.newSimpleStateUpdater('all')
                            }}
                            id={'backBtn'}>Wróć
                        </button>
                    </div>;
                }


                if (this.state.createBlankItemLine === false) {
                    let arrOfProducts = Object.values(this.state.newListItems);

                    return <div className={'single-list-view-general-container'}>
                        <ContentEditable
                            className={'list-title'}
                            html={this.state.newListName}
                            data-contenteditable-plc={'nazwij swoją listę'}
                        />
                        <div className={'btn-container'}>
                            <button id={'backBtn'} className={'btn-container--save'}
                                    onClick={(e)=>{this.saveButtonComboFunctioner(e)}}>Zapisz
                            </button>
                            <button id={'backBtn'}
                                    className={'btn-container--cancel'}
                                    onClick={(e) => {
                                        this.props.newSimpleStateUpdater('all')
                                    }}
                            >
                                Anuluj
                            </button>
                        </div>
                        <div className={'single-list-view-container'}>
                            <SingleListItemAdd plc={'dodaj nowy zakup'}
                                               addContentEditableStateHandler={this.addContentEditableStateHandler}
                                               singleListItemAdderContentEditable={this.state.singleListItemAdderContentEditable}
                            />
                            {arrOfProducts.map((item, index) => {
                                return <SingleListItem index={index} item={item} key={index + 'sli'}/>
                            })
                            }
                        </div>
                    </div>;
                }
            case false:
                if (this.state.createBlankItemLine === true) {
                    return <div className={'single-list-view-general-container'}>
                        <ContentEditable
                            className={'list-title'}
                            html={this.state.newListName}
                            data-contenteditable-plc={'nazwij swoją listę'}
                        />
                        <div className={'single-list-view-container'}>
                            <SingleListItemAdd plc={'dodaj nowy zakup'}
                                               addContentEditableStateHandler={this.addContentEditableStateHandler}
                                               singleListItemAdderContentEditable={this.state.singleListItemAdderContentEditable}
                            />
                            <SingleListItem
                                item={this.state.singleListItemAdderContentEditable}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                this.props.newSimpleStateUpdater('all')
                            }}
                            id={'backBtn'}>Wróć
                        </button>
                    </div>;
                }


                if (this.state.createBlankItemLine === false) {
                    let arrOfProducts = Object.values(this.state.newListItems);
                    return <div className={'single-list-view-general-container'}>
                        <ContentEditable
                            className={'list-title'}
                            html={this.state.newListName}
                            data-contenteditable-plc={'nazwij swoją listę'}
                        />

                        <div className={'single-list-view-container'}>
                            <SingleListItemAdd plc={'dodaj nowy zakup'}
                                               addContentEditableStateHandler={this.addContentEditableStateHandler}
                                               singleListItemAdderContentEditable={this.state.singleListItemAdderContentEditable}
                            />
                            {arrOfProducts.map((item, index) => {
                                return <SingleListItem index={index} item={item} key={index + 'sli'}/>
                            })
                            }
                        </div>
                        <div className={'btn-container'}>
                            <button id={'backBtn'} className={'btn-container--save'}
                                    onClick={(e) => this.saveButtonComboFunctioner(e)}>Zapisz
                            </button>
                            <button id={'backBtn'}
                                    className={'btn-container--cancel'}
                                    onClick={(e) => {
                                        this.props.newSimpleStateUpdater('all')
                                    }}
                            >Anuluj
                            </button>
                        </div>
                    </div>;
                }
        }

    }
}


export default SingleListDisplayModeCreate;