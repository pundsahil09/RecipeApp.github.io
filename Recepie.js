const searchBtn = document.querySelector(".searchBtn");
const searchBox = document.querySelector(".searchBox");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const fetchRecipes = async(value)=>{
    recipeContainer.innerHTML = "Fetching Recipes...";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
    
    const response = await data.json();
    console.log(response);

    if(response.meals === null)
    {
        recipeContainer.innerHTML = "Oops Something Went Wrong, Search Again";
        return;
    }

    recipeContainer.innerHTML = "";
    response.meals.forEach((meal)=>{
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = ` <img src="${meal.strMealThumb}"> 
        <h3>${meal.strMeal}</h3>
        <h5><span>${meal.strArea}</span> Dish.</h5><h5>Known As <span>${meal.strCategory}</span></h5>
        
        `
        const button = document.createElement("button");
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        // adding event listner to show recipe btn 
        button.addEventListener('click',()=>{
            openRecipePopup(meal)
        })

        recipeContainer.appendChild(recipeDiv);
        
    });


}

const fetchIngredients=(meal)=>{
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient)
        {
            const measure = meal[`strMeasure${i}`];
            ingredientsList+=`<li> ${measure} : ${ingredient}</li>`
        }
        else{
            break;
        }
        
    }
    return ingredientsList;
}

const openRecipePopup=(meal)=>{
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName"> ${meal.strMeal} </h2>
        <h3>Ingredients : </h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions : </h3>
            <p>${meal.strInstructions}</p>
        </div>

    `
    recipeDetailsContent.parentElement.style.display = "block";
    recipeCloseBtn.addEventListener('click',()=>{
        recipeDetailsContent.parentElement.style.display = "none";
    })
}

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    
    let val = searchBox.value.trim();

    if(!val){
        recipeContainer.innerHTML = ` <h2> Search For Recipe In the Box </h2> `;
        return
    }

    fetchRecipes(val);
})