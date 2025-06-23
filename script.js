//Javascript

const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
const modalBodyDiv = document.querySelector('.modal-body');
const modalFooterDiv = document.querySelector('.modal-footer');
const randomRecipesDiv = document.querySelector('.random-result');
const searchWrapper = document.querySelector(".search-input")

let restrictions = '';
let searchQuery = '';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'REDACTED',
		'X-RapidAPI-Key': 'REDACTED'
	}
};

if (searchForm){
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    fetchRecipes();
}) 
}

fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=9', options)
	.then(response => response.json())
	.then(data => {
        const rinfo = data;
        generateRecipesHTML(rinfo.recipes);
        console.log(rinfo);
    })


async function fetchRecipes () {

    fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${searchQuery}&to=20${restrictions}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "REDACTED",
		"x-rapidapi-key": "REDACTED"
	}
})
.then(response => response.json())
.then(data => {
    const info = data;
    generateSearchHTML(info.hits);
})
}

function generateRecipesHTML(results){
    let generatedRecipesHTML = '';
    results.map(result => {
        generatedRecipesHTML +=
        `
        <div class="col ritem">
          <img src="${result.image}" alt="">
          <div class="recipe-description">
            <h2 class="recipe-title">${truncate(result.title, 22)}</h2>
          </div>
          <button onclick="generateModalHTML('${result.sourceUrl}')" type="button" class="btn btn-sm recipe-btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">View Recipe</button>
          <a class="btn btn-sm btn-primary recipe-site-btn" href="${result.sourceUrl}" target="_blank">Recipe Website</a>
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
            <h2 class="recipe-title">${truncate(result.recipe.label, 22)}</h2>
          </div>
          <button onclick="generateModalHTML('${result.recipe.url}')" type="button" class="btn btn-sm recipe-btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">View Recipe</button>
          <a class="btn btn-sm btn-primary recipe-site-btn" href="${result.recipe.url}" target="_blank">Recipe Website</a>
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
        <iframe src="${recipeURL}"></iframe>  
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

const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

inputBox.onkeyup = (e) => {
    console.log(e.target.value);
    let acquery = e.target.value;
    fetchAutocomplete(acquery);
}

function fetchAutocomplete (autocomplete) {
    fetch(`https://api.edamam.com/auto-complete?app_id=2002a689&app_key=38af78e6450d87e0ad69d768be64cfa8&q=${autocomplete}&limit=10`)
    .then(response => response.json())
    .then(data => {
        const acinfo = data;
        generateAutoCompleteData(acinfo);
    })
}

function generateAutoCompleteData (autocompleteData) {
    let acArray = [];
    if(autocompleteData) {
        acArray = autocompleteData.map((data) => {
            return data = '<li>' + data + '</li>';
        });
        console.log(acArray);
        searchWrapper.classList.add("active");
        showSuggestions(acArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)")
        }
    } else {
        searchWrapper.classList.remove("active");
    }
}

function select(element) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
}

function showSuggestions(list) {
    let listData;
    if(!list.length) {
        acquery = inputBox.value;
        listData = '<li>' + acquery + '</li>';
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}
