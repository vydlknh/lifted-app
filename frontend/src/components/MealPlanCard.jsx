import { Coffee, Cookie, Moon, Apple, Croissant, Nut, Flame, Utensils, Beef } from "lucide-react"; // Added new icons for macros

const MealItem = ({ icon, meal }) => {
  if (!meal || !meal.name) return null; // Don't render if meal is not specified

  return (
    <div className="flex mt-3">
      {icon} {/* Pass the icon component directly */}
      <div>
        <h3 className="font-semibold text-gray-700">{meal.name}</h3>
        <ul className="list-disc list-inside text-gray-600">
          {meal.ingredients.map((item, i) => (
            <li key={i} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const MealPlanCard = ({ mealPlan }) => {
  // The data is now nested inside the 'meal_plan' object
  const plan = mealPlan.meal_plan;

  if (!plan) {
    return <p>Could not load meal plan details.</p>;
  }

  return (
    <div>
      <div className="bg-gray-50 rounded-xl p-8 shadow-lg h-full">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Today's Meal Plan</h2>
        <p className="text-sm font-semibold text-pink-800 mb-1">{mealPlan.rationale}</p>

        {/* Macros and Calories Section */}
        <div className="mt-6 grid grid-cols-4 gap-4 text-center border-t border-b border-pink-200 py-4">
          <div>
            <Flame className="h-6 w-6 text-pink-500 mx-auto" />
            <p className="text-xl font-bold text-gray-800">{plan.calories}</p>
            <p className="text-sm font-medium text-gray-500">Calories</p>
          </div>
          <div>
            <Beef className="h-6 w-6 text-pink-500 mx-auto" />
            <p className="text-xl font-bold text-gray-800">
              {plan.macros.protein}
            </p>
            <p className="text-sm font-medium text-gray-500">Protein</p>
          </div>
          <div>
            <Croissant className="h-6 w-6 text-pink-500 mx-auto" />
            <p className="text-xl font-bold text-gray-800">
              {plan.macros.carbohydrates}
            </p>
            <p className="text-sm font-medium text-gray-500">Carbs</p>
          </div>
          <div>
            <Nut className="h-6 w-6 text-pink-500 mx-auto" />
            <p className="text-xl font-bold text-gray-800">
              {plan.macros.fats}
            </p>
            <p className="text-sm font-medium text-gray-500">Fats</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-5 items-stretch">
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-700">Breakfast</h3>
          <MealItem
            icon={<Coffee className="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />}
            meal={plan.breakfast}
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-700">Lunch</h3>
          <MealItem
            icon={<Utensils className="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />}
            meal={plan.lunch}
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-700">Dinner</h3>
          <MealItem
            icon={<Moon className="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />}
            meal={plan.dinner}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-5 items-stretch">
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-700">Morning Snack</h3>
          <MealItem
            icon={<Apple className="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />}
            meal={plan.snacks.morning_snack}
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <h3 className="text-lg font-bold text-gray-700">Afternoon Snack</h3>
          <MealItem
            icon={<Cookie className="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />}
            meal={plan.snacks.afternoon_snack}
          />
        </div>
      </div>
    </div>
  );
};
