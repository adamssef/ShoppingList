import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


class SavedLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            allListsDisplayMode: true,
            singleListDisplayMode: false,
        };

    }

    componentDidMount() {
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

    showListItems = (e) => {


        // let headingListElement = document.getElementsByClassName('headingFlexElList')[0].style.display;
        // if (headingListElement === '') {
        //     // 1. Selecting lists to show
        //     let listId = e.target.parentElement.nextSibling.children[0].id;
        //     console.log(e.target.parentElement.nextSibling);
        //     let list = document.getElementById(listId);
        //
        //     // 2. Hiding unnecesary elements
        //     let wrapper = document.getElementById("savedListsWrapper");
        //
        //     for(let i = 0; i < wrapper.children.length; i++){
        //         wrapper.children[i].style.display = 'none';
        //     }
        //
        //     //3. Assigning list elements to a wrapper again
        //
        //     let itemsToDisplayInTheFrame = this.state.data[listId.substring(4)].listItems
        //     for (let i = 0; i < itemsToDisplayInTheFrame.length; i++) {
        //         wrapper.append(itemsToDisplayInTheFrame[0])
        //     }
        //
        // }


        let listId = e.target.parentElement.nextSibling.children[0].id;

        let list = document.getElementById(listId);



        // console.log(list);
        if (list.style.display === "") {
            let id = e.target.parentElement.parentElement.id;
            let listItems = this.state.data[id].listItems;
            console.log(listItems);
            let listItemsOl = e.target.parentElement.parentElement.getElementsByTagName('OL')[0];
            console.log(listItemsOl);
            for (let item in listItems) {
                console.log(listItems[item]);
                let li = document.createElement('li');
                li.innerHTML = listItems[item];
                listItemsOl.appendChild(li);
            }

            list.style.display = "block";
            e.target.innerHTML = "ukryj"
        } else if (list.style.display === "block") {
                list.style.display = "none";
                e.target.innerHTML = "pokaż!";
        } else {
            list.style.display = "block";
            e.target.innerHTML = "ukryj";
        }
    }


    render() {
        return <div id={"savedListsWrapper"}>
            <h2>Twoje 10 ostatnio zapisanych list:</h2>
            <div className={"headingFlexContainer"}>
                <div className={"headingFlexElName"}>Nazwa</div>
                <div className={"headingFlexElDate"}>Data</div>
                <div className={"headingFlexElAction"}>Akcja</div>
                <div className={"headingFlexElList"}>Twoje zakupy</div>
            </div>
            <div className={"listsWrapper"}>{this.state.data.map(function (item, index) {
                return <div className=" listContainerEl" key={item.id} id={index}>

                    <div className="listContainerElParagraph"><p
                        className={"listIndex"}> {index + 1}</p><p className={"listIndex2"}> {item.name}</p></div>
                    <div className={"listCreationDateColumn"}>{item.creationDate.substring(0,10)}</div>
                    <div className={"listContainerElButton"}>
                        <button className={"btn-sm btn-success"} onClick={this.showListItems}>pokaż!</button>
                    </div>
                    <div className="listContainerElElements">
                        <ol id={`list` + index}></ol>
                    </div>
                </div>;
            }, this)}</div>
        </div>
    }
}

class singleListDisplayMode {

}

export default SavedLists;