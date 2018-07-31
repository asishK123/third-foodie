import "../node_modules/jquery/dist/jquery.js";
import "../node_modules/popper.js/dist/popper.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/bootstrap/scss/bootstrap.scss";
import $ from 'jquery';
import 'jquery-ui';
import sortable from 'jquery-ui/ui/widgets/sortable';
import disableSelection from 'jquery-ui/ui/disable-selection';

import './scss/base.scss';
const v =document.getElementById("searchid");
v.onclick = (event)=>{
    event.preventDefault();
    restaurantsearch();
}
function restaurantsearch(){
    const form =document.getElementById("formSearch");
    const url= "https://developers.zomato.com/api/v2.1/search?q=" + form.value;

    let searchHeader ={
        "user-key" : "168986ae991bd8e231ad27f246ad844a"
    }

    let requireddata ={
        headers : searchHeader,
        method: 'GET'
    }
    
    fetch(url,requireddata)
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then(function(data){
        data.restaurants.map(function(dataItem){
          const html =  `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${dataItem.restaurant.featured_image}" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">${dataItem.restaurant.name}</h5>
              <p class="card-text">${dataItem.restaurant.cuisines}</p>
            
              <button type="button" class="btn btn-primary" id ="${dataItem.restaurant.id}">Add to Collection</button>
            </div>
          </div>`;
              const html1 =   createHTMLElement(html);
              var variable = document.getElementById("card-body")
              variable.appendChild(html1);
             
               document.getElementById(`${dataItem.restaurant.id}`).onclick = () => {
                console.log('clicked add from search')
                addToCollection(`${dataItem.restaurant.id}`);
            }
        })
    })
};

// code for the top rated
const topRated =document.getElementById("toprated");
 topRatedRestaurant();
function topRatedRestaurant(){
    const url ="https://developers.zomato.com/api/v2.1/collections?city_id=4&count=4";

    let topHeader ={
        "user-key" : "168986ae991bd8e231ad27f246ad844a"
    }

    let collectiondata ={
        headers : topHeader,
        method: 'GET'
    }

    fetch(url, collectiondata)
    .then((res) => res.json())
    .then(function(data){
         data.collections.map(function(dataItem){
            const colhtml =  `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${dataItem.collection.image_url}" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">${dataItem.collection.title}</h5>
              <p class="card-text">${dataItem.collection.description}</p>
              <button  type= "button" class="btn btn-primary" id="${dataItem.collection.collection_id}">Add to Collection</button>
            </div>
          </div>`;

          const html2 =   createHTMLElement(colhtml);
          topRated.appendChild(html2);

          document.getElementById(`${dataItem.collection.collection_id}`).onclick = () => {
            addToCollection(`${dataItem.collection.collection_id}`);
        }

        })
    })
};


// code for my collection
const restCollections =document.getElementById("myCollection");
function addToCollection(id){
    const div =document.getElementById(`${id}`).parentElement.parentElement ;    
    console.log(div);
    var image = div.firstElementChild;
    var cardBody =image.nextElementSibling;
    var title = cardBody.firstElementChild;
    var description= title.nextElementSibling;
    console.log(image); 
    var jsonString ={
        "id" : id,
        "img" : image.src,
        "name" : title.innerHTML
    }

    let MyData = { 
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(jsonString) 
    }

    let mycollectionUrl = "http://localhost:3000/collections";
    fetch(mycollectionUrl, MyData)
    .then(reload());
};

function reload(){
    const url = "http://localhost:3000/collections";
    restCollections.innerHTML = "";

    let myHeader ={
        "user-key" : "168986ae991bd8e231ad27f246ad844a"
    }

    let mycollectiondata ={
        headers : myHeader,
        method: 'GET'
    }

    fetch(url, mycollectiondata)
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
         data.map(function(dataItem){
            const colhtm2 =  `<div class="card p-card" style="width: 18rem;">
            <img class="card-img-top" src="${dataItem.img}" alt="Card image cap" />
            <div class="card-body">
             <h5 class="card-title">${dataItem.name}</h5>
              <button type="buttoon" class="btn btn-primary" id ="${dataItem.id}">Remove Collection</button>
            </div>
          </div>`;

          const html3 =   createHTMLElement(colhtm2);
          restCollections.appendChild(html3);
         console.log(document.getElementById(`${dataItem.id}`));
        //   document.getElementById(`${dataItem.id}`).onclick = () => {
        //     deleteCollection(`${dataItem.id}`);
        // }
        // document.getElementById(`${dataItem.id}`).addEventListener("click",function() {
        //     deleteCollection(`${dataItem.id}`);
        
        // });
        $('.p-card').on("click", function(){ 
           console.log('hello = ', this.childNodes[3].childNodes[3].id)
            let id = this.childNodes[3].childNodes[3].id;
            let newid = parseInt(id);
            deleteCollection(newid);
        });
    })
});
}

function deleteCollection(id){
    let fetchData = { 
        method: "DELETE", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        redirect: "follow", 
        referrer: "no-referrer", 
    }
    let deleteUrl = "http://localhost:3000/collections/"+id;
    
    fetch(deleteUrl, fetchData)
    .then(reload());       
}

function createHTMLElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
}
