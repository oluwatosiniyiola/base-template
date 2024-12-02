import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    steps: "",
  });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const addRecipe = () => {
    if (newRecipe.title && newRecipe.ingredients && newRecipe.steps) {
      setRecipes((prev) => [
        ...prev,
        { ...newRecipe, rating: 0, id: Date.now() },
      ]);
      setNewRecipe({ title: "", ingredients: "", steps: "" });
    }
  };

  const updateRating = (id, newRating) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, rating: newRating } : recipe
      )
    );
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.rating >= ratingFilter &&
      (recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Recipe Sharing Widget
      </h1>

      {/* Add Recipe Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add a New Recipe</CardTitle>
          <CardDescription>
            Enter the details of your recipe to share with others.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={newRecipe.title}
              onChange={handleInputChange}
              placeholder="Recipe Title"
              className="w-full border border-gray-300 rounded p-2"
            />
            <textarea
              name="ingredients"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
              placeholder="Ingredients (comma-separated)"
              className="w-full border border-gray-300 rounded p-2"
            />
            <textarea
              name="steps"
              value={newRecipe.steps}
              onChange={handleInputChange}
              placeholder="Preparation Steps"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </CardContent>
        <CardFooter>
          <button
            onClick={addRecipe}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Recipe
          </button>
        </CardFooter>
      </Card>

      {/* Filters and View Mode */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title or ingredients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded p-2 w-2/3"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          className="border border-gray-300 rounded p-2"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4 Stars & Above</option>
          <option value={5}>5 Stars Only</option>
        </select>
        <button
          onClick={() =>
            setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
          }
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Toggle {viewMode === "grid" ? "List" : "Grid"} View
        </button>
      </div>

      {/* Recipe List */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Steps:</strong> {recipe.steps}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateRating(recipe.id, star)}
                    className={`${
                      star <= recipe.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    } text-xl`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No recipes found.</p>
      )}
    </div>
  );
};

export default App;
