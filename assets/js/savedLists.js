import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


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

        let port = location.port;
        let targetUrl = `https://localhost:${port}/saved`;
        let request = new Request(targetUrl, {
            method: "POST",
            headers: {
                "Access-Control-Request-Methods": "POST, GET, OPTIONS",
                "Origin": `https://localhost:${port}`,
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
                    let li = document.createElement('li');
                    li.innerHTML = listItems[item];
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
                <div className={"headingFlexElName"}>Nazwa</div>
                <div className={"headingFlexElDate"}>Data</div>
                <div className={"headingFlexElAction"}>Akcja</div>
                <div className={"headingFlexElList"}>Twoje zakupy</div>
            </div>
            <div className={"listsWrapper"}>{this.props.dataState.map(function (item, index) {
                return <div className="listContainerEl" key={item.id} id={index}>

                    <div className={"listContainerElParagraph"}><p
                        className={"listIndex"}> {index + 1}</p><p className={"listIndex2"}> {item.name}</p></div>
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