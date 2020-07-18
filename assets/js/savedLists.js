import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import {useLocation, withRouter} from 'react-router-dom'

require('../css/app.css');

class SavedLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            allListsDisplayMode: true,
            singleListDisplayMode: false,
            currentlyDisplayedListId: null,
            width: null,
            visited: false,
            counter: this.props.stateProps -1
        };
    }

    componentDidMount() {

        console.log("SAVED:Mounted too!")
        console.log(this.props.stateProps)
        // console.log(this.props.match)
        //event listening to window width changes
        window.addEventListener('resize', this.updateDimensions);
        let targetUrl = `${location.origin}/saved`;
        let request = new Request(targetUrl, {
            method: "POST",
            headers: {
                "Access-Control-Request-Methods": "POST, GET, OPTIONS",
                "Origin": location.origin,
            },
            mode: "cors"
        });

        fetch(request)
            .then(res => res.json())
            .then(json => {
                this.setState({data: json})
            });
    }

    comboFunctionerAllListsBtn = (e)=> {
        this.props.singleListVerifier(true);
        this.switchToSingleDisplayMode(e)

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.appProps.singleListRefreshAttempt && this.state.singleListDisplayMode) {
            this.setState({
                allListsDisplayMode: true,
                singleListDisplayMode: false,
                counter:-1
            });

            this.props.singleListVerifier(false);
        }
    }

    componentWillUnmount() {
        console.log("unmounted")
        window.removeEventListener("resize", this.updateDimensions);
        this.setState({
            visited: false
        })
    }

    updateDimensions = () => {
        this.setState({width: window.innerWidth});
    };

    switchToSingleDisplayMode = (e) => {
        let listId = e.target.parentElement.parentElement.id;

        //if  device width is less than 475 the display mode for small devices is applied
        if (window.innerWidth <= 475) {
            console.log("switchToSingleDisplayMode first condition <= 475")
            this.setState({
                singleListDisplayMode: true,
                allListsDisplayMode: false,
                currentlyDisplayedListId: listId,
                counter: this.state.counter +1,
            });

            //if the above condition is not met than large devices mode is applied
        } else {
            //BELOW CODE RENDERS LIST FOR LARGE SCREENS > 475 device width
            console.log("switchToSingleDisplayMode secondConditions: everything what is not <=475")
            let list = document.getElementById(listId);
            let listColumn = list.children[2].children[0];

            if (listColumn.style.display === "") {
                let listItems = this.state.data[listId].listItems;
                let listItemsOl = e.target.parentElement.parentElement.getElementsByTagName('OL')[0];
                for (let item in listItems) {
                    let div = document.createElement("div");
                    let li = document.createElement("li");
                    let input = document.createElement("input");
                    let span = document.createElement("span");
                    span.classList.add('listItemSpan');


                    input.type = "checkbox";
                    input.classList.add("liSavedListsInput")
                    li.classList.add("liSavedListsContainer")
                    span.innerHTML = listItems[item];
                    li.appendChild(span);
                    li.appendChild(input);
                    listItemsOl.appendChild(li);
                }
                listColumn.style.display = "flex";
                listColumn.classList.add("olStyle")
                e.target.innerHTML = "ukryj";
            } else if (listColumn.style.display === "flex") {
                listColumn.style.display = "none";
                e.target.innerHTML = "pokaż!";
            } else {
                listColumn.style.display = "flex";
                e.target.innerHTML = "ukryj";
            }
        }
    };


    back = () => {
        this.setState({
            allListsDisplayMode: true,
            singleListDisplayMode: false,
            currentlyDisplayedListId: null,
        })
    }



    render() {
        if ((this.state.allListsDisplayMode && !this.state.singleListDisplayMode) || window.innerWidth > 475.0000) {
            //this covers "refresh experience" when user clicked again on the same link that has been currently active
            console.log("Pierwszy warunek: renderuję AllListsDisplayMode")
            if (this.state.visited  && !this.state.singleListDisplayMode) {
                let olElements = document.getElementsByTagName("OL");
                [...olElements].map(element => {
                    if (element.style.display === "flex") {
                        element.style.display = "none";
                        element.parentElement.parentElement.firstChild.lastChild.innerHTML = "pokaż!";
                    }
                })
            }
            return <AllListsDisplayMode
                dataState={this.state.data}
                parentState={this.state}
                stateSwitch={e => {
                    this.comboFunctionerAllListsBtn(e)
                }}/>
        } else if (!this.state.allListsDisplayMode && this.state.singleListDisplayMode)  {
            console.log("drugi warunek: renderuję SingleList")
            return <SingleListDisplayMode
                currentList={this.state.data[this.state.currentlyDisplayedListId]}
                backOnClick={e => {
                    this.back()
                    this.props.singleListVerifier(true);
                                    }}
            />
        }
        else if (this.state.visited && this.state.singleListDisplayMode && !this.state.allListsDisplayMode) {
            console.log("trzeci warunek");
            return <AllListsDisplayMode
                dataState={this.state.data}
                stateSwitch={e => {
                    this.comboFunctionerAllListsBtn(e)
                }}
                parentState={this.state}
                stateReset={this.back}
            />

        }
    }
}

class AllListsDisplayMode extends Component {

    render() {
        return <>
            <div className={"h2FlexContainer"}><h2>Ostatnie listy:</h2></div>
            <div className={"headingFlexContainer"}>
                <div className={"headingFlexElName"}><span className={"headingElFlexItem"}>Nazwa</span></div>
                <div className={"headingFlexElDate"}><span className={"headingElFlexItem"}>Data</span></div>
                <div className={"headingFlexElList"}><span className={"headingElFlexItem"}>Twoje zakupy</span></div>
            </div>
            <div className={"listsWrapper"}>{this.props.dataState.map(function (item, index) {
                return <div className="listContainerEl" key={item.id} id={index}>

                    <div className={"listContainerElName"}>
                        <p className={"listIndex2"}> {item.name}</p>
                        <button
                                className={"btn-sm listBtn"}
                                onClick={this.props.stateSwitch}>pokaż!
                        </button>
                    </div>
                    <div className={"listCreationDateColumn"}>{item.creationDate.substring(0, 10)}</div>
                    <div className="listContainerElElements">
                        <ol id={`list` + index}></ol>
                    </div>
                </div>;
            }, this)}</div>
        </>
    }
}

class SingleListDisplayMode extends Component {


    render() {
        let arrOfProducts = Object.values(this.props.currentList)[1];

        return <div className={"singleListViewGeneralContainer"}>
            <h2>Zapisane zakupy:</h2>
            <div className={"singleListViewContainer"}>{arrOfProducts.map((item, index) => {
                return <div className={"singleListItem"} key={index}><span className={'span'}>{item}</span><input
                    type='checkbox' className={'checkbox saved'}/></div>
            })
            }</div>
            <button onClick={this.props.backOnClick} id={"backBtn"}>Wróć</button>
        </div>;
    }
}

export default withRouter(SavedLists);