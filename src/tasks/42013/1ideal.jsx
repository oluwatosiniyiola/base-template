import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    steps: "",
    image: "",
  });

  const addRecipe = () => {
    if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.steps) return;
    setRecipes([...recipes, { ...newRecipe, id: Date.now(), rating: 0 }]);
    setNewRecipe({ title: "", ingredients: "", steps: "", image: "" });
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const updateRating = (id, rating) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id ? { ...recipe, rating } : recipe
      )
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Recipe Sharing Platform
      </h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes"
          className="p-2 border rounded-md w-full sm:w-1/3 mx-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
              <CardDescription>{recipe.ingredients}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={recipe.image || "https://via.placeholder.com/150"}
                alt="Recipe"
                className="w-full h-40 object-cover rounded-md"
              />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center">
                <Button onClick={() => toggleFavorite(recipe.id)}>
                  {favorites.includes(recipe.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </Button>
                <Button
                  onClick={() => deleteRecipe(recipe.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Rating</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateRating(recipe.id, star)}
                    className={`${
                      recipe.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-400"
                    } text-xl`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 sm:w-1/2 mx-auto">
        <h2 className="text-xl font-semibold mb-4">Create a New Recipe</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipe Title"
            className="p-2 border rounded-md w-full"
            value={newRecipe.title}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, title: e.target.value })
            }
          />
          <textarea
            placeholder="Ingredients"
            className="p-2 border rounded-md w-full"
            rows="4"
            value={newRecipe.ingredients}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, ingredients: e.target.value })
            }
          />
          <textarea
            placeholder="Steps to Prepare"
            className="p-2 border rounded-md w-full"
            rows="4"
            value={newRecipe.steps}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, steps: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL (Optional)"
            className="p-2 border rounded-md w-full"
            value={newRecipe.image}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, image: e.target.value })
            }
          />
          <Button onClick={addRecipe} className="w-full">
            Add Recipe
          </Button>
        </div>
      </div>
    </div>
  );
}
