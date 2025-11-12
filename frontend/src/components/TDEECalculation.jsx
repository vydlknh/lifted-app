  export const calculateTDEE = (profileData) => {
    const { age, height, weight, activityLevel, fitnessGoal } = profileData;
    let bmr;
    if (!age || !height || !weight) {
      return null;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    bmr = 10 * weight + 6.25 * height - 5 * age - 161; // for female
    // Adjust BMR based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    const activityMultiplier = activityMultipliers[activityLevel] || 1.2;
    let tdee = bmr * activityMultiplier;
    // Adjust TDEE based on fitness goal
    if (fitnessGoal === 'lose_weight') {
      tdee *= 0.85; // 15% calorie deficit
    } else if (fitnessGoal === 'gain_muscle') {
      tdee *= 1.15; // 15% calorie surplus
    }
    let protein = Math.round((tdee * 0.3) / 4); // 30% of calories from protein
    let fats = Math.round((tdee * 0.25) / 9); // 25% of calories from fats
    let carbohydrates = Math.round((tdee - (protein * 4 + fats * 9)) / 4); // Remaining calories from carbs
    return {
      calories: Math.round(tdee),
      protein: protein,
      fats: fats,
      carbohydrates: carbohydrates
    };
  };