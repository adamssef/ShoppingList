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
        console.log(e.target);
        let id = e.target.parentElement.id;
        let listItems = this.state.data[id].listItems;
        let listItemsOl = e.target.parentElement.getElementsByTagName('OL')[0];
        for (let item in listItems) {
            let li = document.createElement('li');
            li.innerHTML = listItems[item];
            listItemsOl.appendChild(li);
        }

    }


    render() {
        // let handleClick = this.showListItems();


        // console.log(callback);

        return <div className={"listContainer"}>{this.state.data.map(function (item, index) {
            return <div className="topDown5pxMargin listContainerEl" key={item.id}  id={index}>
                <p className="inline right25pxMargin listContainerElParagraph">{item.id} {item.name}</p>
                <button onClick={this.showListItems} className={"listContainerElButton"}>pokaż artykuły!</button>
                <ol className="listContainerElElements" id="list"></ol>
            </div>;
        }, this)}</div>

        // return <button onClick={()=>this.showListItems()}>Click me bitch</button>
    }
}


export default SavedLists;