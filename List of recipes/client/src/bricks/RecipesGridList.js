import React from "react";
import Recipe from "./Recipe";
import '../App.css';

function RecipeGridList(props) {
    function getRecipeList(recipeList) {
        return recipeList?.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} isFullDescription={props.isFullDescription} />;
        });
    }

    return (
        <div className="recipe-list">
            {getRecipeList(props.recipeList)}
        </div>
    );
}

export default RecipeGridList;
