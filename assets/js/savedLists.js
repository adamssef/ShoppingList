import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom'


class SavedLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            allListsDisplayMode: true,
            singleListDisplayMode: false,
            currentlyDisplayedListId: null,
            width: null,
        };

    }

    componentDidMount() {
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    switchToSingleDisplayMode = (e) => {
        let listId = e.target.parentElement.parentElement.id;
        console.log(listId);

        if (window.innerWidth <= 475) {
            this.setState({
                singleListDisplayMode: true,
                allListsDisplayMode: false,
                currentlyDisplayedListId: listId,
            });
        } else {
            // let listId = e.target.parentElement.nextSibling.children[0].id;

            let list = document.getElementById(listId);
            let listColumn = list.children[3].children[0];

            // console.log(list);
            if (listColumn.style.display === "") {
                let listItems = this.state.data[listId].listItems;
                let listItemsOl = e.target.parentElement.parentElement.getElementsByTagName('OL')[0];
                // console.log(listItemsOl)
                for (let item in listItems) {
                    console.log(listItems[item]);
                    let div = document.createElement('div');
                    let li = document.createElement('li');
                    let input = document.createElement("input");
                    input.type = "checkbox";
                    li.classList.add('liSavedLists')
                    li.innerHTML = listItems[item];
                    li.appendChild(input);
                    listItemsOl.appendChild(li);

                }


                listColumn.style.display = "block";
                e.target.innerHTML = "ukryj"
            }
            else if (listColumn.style.display === "block") {
                    listColumn.style.display = "none";
                    e.target.innerHTML = "pokaż!";
            } else {
                listColumn.style.display = "block";
                e.target.innerHTML = "ukryj";
            }
        }

    };

    render() {
        if ((this.state.allListsDisplayMode && !this.state.singleListDisplayMode) || window.innerWidth > 475.0000) {
            return <AllListsDisplayMode dataState={this.state.data} stateSwitch={e => {
                this.switchToSingleDisplayMode(e)
            }}/>
        } else if (!this.state.allListsDisplayMode && this.state.singleListDisplayMode) {
            console.log("SingleDisplayMode On!")
            return <SingleListDisplayMode currentList={this.state.data[this.state.currentlyDisplayedListId]}/>
        }
    }
}

// class singleListDisplayMode extends Component {
//
// }
//
class AllListsDisplayMode extends Component {
    render() {
        return <>
            <div className={"h2FlexContainer"}><h2>Twoje 10 ostatnio zapisanych list:</h2></div>
            <div className={"headingFlexContainer"}>
                <div className={"headingFlexElName"}><span className={"headingElFlexItem"}>Nazwa</span></div>
                <div className={"headingFlexElDate"}><span className={"headingElFlexItem"}>Data</span></div>
                <div className={"headingFlexElAction"}><span className={"headingElFlexItem"}>Akcja</span></div>
                <div className={"headingFlexElList"}><span className={"headingElFlexItem"}>Twoje zakupy</span></div>
            </div>
            <div className={"listsWrapper"}>{this.props.dataState.map(function (item, index) {
                return <div className="listContainerEl" key={item.id} id={index}>

                    <div className={"listContainerElName"}><p
                        className={"listIndex"}> {index + 1+'.'}</p><p className={"listIndex2"}> {item.name}</p></div>
                    <div className={"listCreationDateColumn"}>{item.creationDate.substring(0, 10)}</div>
                    <div className={"listContainerElButton"}>
                        <button id ={"listBtn"}className={"btn-sm btn-success"} onClick={this.props.stateSwitch}>pokaż!</button>
                    </div>
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

        return <div>
            <h2>Zapisane zakupy:</h2>
            <div className={"singleListViewContainer"}>{arrOfProducts.map((item, index) => {
                return <div className={"singleListItem"} key={index}><span className={'span'}>{item}</span><input
                    type='checkbox' className={'checkbox'}/></div>
            })
            }</div>
        </div>
    }
}

export default SavedLists;