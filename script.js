//Javascript
//import {MY_API_KEY} from './config.js';

//const homeSearchForm = document.querySelector('')
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
const modalBodyDiv = document.querySelector('.modal-body');
const modalFooterDiv = document.querySelector('.modal-footer');
const randomRecipesDiv = document.querySelector('.random-result');
const n = 23;
let restrictions = '';
let searchQuery = '';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
		'X-RapidAPI-Key': '71941119eemsh8df4ce163e7bf67p1093dcjsn2a642fcae6dc'
	}
};

if (searchForm){
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    fetchRecipes();
}) 
}

fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=10', options)
	.then(response => response.json())
	.then(data => {
        console.log(data);
        const rinfo = data;
        generateRecipesHTML(rinfo.recipes);
    })
	.catch(err => console.error(err));

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

function generateRecipesHTML(results){
    let generatedRecipesHTML = '';
    results.map(result => {
        generatedRecipesHTML +=
        `
        <div class="col item">
          <img src="${result.image}" alt="">
          <div class="recipe-description">
            <h2 class="recipe-title">${truncate(result.title, 24)}</h2>
          </div>
          <button onclick="generateModalHTML('${result.sourceUrl}')" type="button" class="btn btn-lg recipe-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">View Recipe</button>
        </div>
        `
    })
    randomRecipesDiv.innerHTML = generatedRecipesHTML;
}

function generateSearchHTML(results){
    let generatedSearchHTML = '';
    results.map(result => {
        generatedSearchHTML +=
        `
        <div class="col item">
          <img src="${result.recipe.image}" alt="">
          <div class="recipe-description">
            <h2 class="recipe-title">${truncate(result.recipe.label, 24)}</h2>
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
    let generatedModalBodyHTML = '';
    generatedModalBodyHTML =
        `
        <iframe src="${recipeURL}" height="700" width="1700"></iframe>  
        `
    modalBodyDiv.innerHTML = generatedModalBodyHTML;

    let generatedModalFooterHTML = '';
    generatedModalFooterHTML =
    `
    <a class="btn btn-primary" href="${recipeURL}" target="_blank">Original Website</a>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `
    modalFooterDiv.innerHTML = generatedModalFooterHTML;
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

function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
}
