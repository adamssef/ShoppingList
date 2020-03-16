import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';


class SavedLists extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        //
        // this.showListItems = this.showListItems.bind(this);
    }

    componentDidMount() {

        let port = location.port;
        let targetUrl = `https://localhost:${port}/saved`;
        let request = new Request(targetUrl, {
            method: "POST",
            headers: {
                "Access-Control-Request-Methods": "POST, GET",
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

        let listId = e.target.parentElement.nextSibling.children[0].id;
        let list = document.getElementById(listId);

        if (list.style.display === "") {
            console.log(e.target.parentElement);
            let id = e.target.parentElement.parentElement.id;
            console.log(id);
            let listItems = this.state.data[id].listItems;
            let listItemsOl = e.target.parentElement.parentElement.getElementsByTagName('OL')[0];
            for (let item in listItems) {
                let li = document.createElement('li');
                li.innerHTML = listItems[item];
                listItemsOl.appendChild(li);
            }

            list.style.display = "block";
            e.target.innerHTML = "ukryj"
        } else if (list.style.display === "block") {
                list.style.display = "none";
                e.target.innerHTML = "pokaż!"
        } else {
            list.style.display = "block"
            console.log(e.target.element);
            e.target.innerHTML = "ukryj"
        }
        ;
    }


    render() {
        // let handleClick = this.showListItems();

        console.log(this.state.data);
        // console.log(callback);
        console.log("dupa");
        return <div>
            <h2>Twoje 10 ostatnio zapisanych list:</h2>
            <div className={"headingFlexContainer"}>
                <div className={"headingFlexElName px10MarginLeft"}>Nazwa</div>
                <div className={"headingFlexElDate"}>Data</div>
                <div className={"headingFlexElAction"}>Akcja</div>
                <div className={"headingFlexElList"}>Twoje zakupy</div>
            </div>
            <div className={"listContainer"}>{this.state.data.map(function (item, index) {
                return <div className="topDown5pxMargin listContainerEl" key={item.id} id={index}>

                    <div className="listContainerElParagraph px10MarginLeft"><p
                        className={"listIndex"}> {index + 1}</p><p className={"listIndex2"}> {item.name}</p></div>
                    <div className={"listCreationDateColumn"}>{item.creationDate.substring(0,10)}</div>
                    <div className={"listContainerElButton"}>
                        <button className={"px10MarginUpDown btn-sm btn-success"} onClick={this.showListItems}>pokaż!</button>
                    </div>
                    <div className="listContainerElElements px10MarginUpDown">
                        <ol id={`list` + (index + 1)}></ol>
                    </div>
                </div>;
            }, this)}</div>
        </div>

        // return <button onClick={()=>this.showListItems()}>Click me bitch</button>
    }
}

export default SavedLists;