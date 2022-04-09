//Javascript
//import {MY_API_KEY} from './config.js';

//const homeSearchForm = document.querySelector('')
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
const modalDiv = document.querySelector('.modal-body')

let restrictions = '';
let searchQuery = '';
const baseSearchURL = `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}`;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    fetchRecipes();
}) 

async function fetchRecipes () {

    fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${searchQuery}&to=20${restrictions}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
		"x-rapidapi-key": "71941119eemsh8df4ce163e7bf67p1093dcjsn2a642fcae6dc"
	}
})
.then(response => response.json())
.then(data => {
    const info = data;
    generateSearchHTML(info.hits);
    console.log(data);
})
}

function generateSearchHTML(results){
    let generatedSearchHTML = '';
    results.map(result => {
        generatedSearchHTML +=
        `
        <div class="col item">
          <img src="${result.recipe.image}" alt="">
          <div class="recipe-description">
            <h2 class="recipe-title">${result.recipe.label}</h2>
          </div>
          <button onclick="generateModalHTML('${result.recipe.url}')" type="button" class="btn btn-lg recipe-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">View Recipe</button>
        </div>
        `
    })

    searchResultDiv.innerHTML = generatedSearchHTML;
}

function generateModalHTML(url){
    let recipeURL = url;
    console.log(recipeURL);
    let generatedModalHTML = '';
    
        generatedModalHTML =
        `
        <iframe src="${recipeURL}" height="800" width="1700"></iframe>
              
        `
    modalDiv.innerHTML = generatedModalHTML;
}

function getCheckedCheckboxesFor(checkboxName) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    var prefix = '&health=';
    let index = 0;
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
        values[index] = prefix + values[index];
        index += 1;
    });
    console.log(values.join(''));
    restrictions = (values.join(''));
    fetchRecipes();
}
