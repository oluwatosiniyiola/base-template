import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";

const RecipeSharingPlatform = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: [],
    steps: "",
    cookingTime: "",
    category: "general",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const ingredientList = [
    "Flour",
    "Sugar",
    "Eggs",
    "Milk",
    "Butter",
    "Salt",
    "Yeast",
  ];

  const handleIngredientChange = (value) => {
    if (!newRecipe.ingredients.includes(value)) {
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, value],
      });
    }
  };

  const submitRecipe = () => {
    setRecipes([...recipes, { ...newRecipe, id: Date.now() }]);
    setNewRecipe({
      name: "",
      ingredients: [],
      steps: "",
      cookingTime: "",
      category: "general",
    });
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (filterCategory === "all" || recipe.category === filterCategory) &&
      (recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((i) =>
          i.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const startTimer = (time) => {
    setTimer(time * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      alert("Time is up!");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={newRecipe.name}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, name: e.target.value })
            }
            placeholder="Recipe Name"
          />
          <Select onValueChange={handleIngredientChange}>
            <SelectItem value="">Add Ingredient</SelectItem>
            {ingredientList.map((ing) => (
              <SelectItem key={ing} value={ing}>
                {ing}
              </SelectItem>
            ))}
          </Select>
          <div>
            {newRecipe.ingredients.map((ing, index) => (
              <Badge key={index} className="m-1">
                {ing}
              </Badge>
            ))}
          </div>
          <Input
            value={newRecipe.steps}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, steps: e.target.value })
            }
            placeholder="Steps"
          />
          <Input
            type="number"
            value={newRecipe.cookingTime}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, cookingTime: e.target.value })
            }
            placeholder="Cooking Time (min)"
          />
          <Select
            value={newRecipe.category}
            onChange={(value) =>
              setNewRecipe({ ...newRecipe, category: value })
            }
          >
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="gluten-free">Gluten-Free</SelectItem>
          </Select>
          <Button onClick={submitRecipe}>Submit Recipe</Button>
        </CardContent>
      </Card>

      <div className="flex mb-4 space-x-4">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="vegetarian">Vegetarian</SelectItem>
          <SelectItem value="gluten-free">Gluten-Free</SelectItem>
        </Select>
      </div>

      {filteredRecipes.map((recipe) => (
        <Card key={recipe.id} className="mb-4">
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
            <CardDescription>
              <Badge>{recipe.category}</Badge>
              <Badge>{recipe.cookingTime} min</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
            </p>
            <p>
              <strong>Steps:</strong> {recipe.steps}
            </p>
            <Button onClick={() => startTimer(recipe.cookingTime)}>
              Start Cooking Timer
            </Button>
          </CardContent>
        </Card>
      ))}

      {isTimerRunning && (
        <div className="fixed bottom-0 right-0 m-4 bg-blue-500 text-white p-4 rounded">
          Timer: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
        </div>
      )}
    </div>
  );
};

export default RecipeSharingPlatform;
