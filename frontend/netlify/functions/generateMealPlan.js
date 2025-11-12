import admin from 'firebase-admin';
import OpenAI from 'openai';
import process from 'process';
import { Buffer } from 'buffer';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const handler = async (event) => {

  try {
    const { userProfile, currentPhase } = JSON.parse(event.body);

    const prompt = `
      Create a personalized meal plan for a user based on their menstrual cycle phase, fitness goal, and dietary restrictions.

      User Profile:
      - Fitness Goal: ${userProfile.fitnessGoal}
      - Activity Level: ${userProfile.activityLevel}
      - Dietary Restrictions: ${userProfile.dietRestriction}

      Meal plan requirements:
      - Total Daily Energy Expenditure (TDEE): ${userProfile.tdee.calories} calories
      - Macronutrients:
        - Protein: ${userProfile.tdee.protein}g
        - Carbohydrates: ${userProfile.tdee.carbohydrates}g
        - Fats: ${userProfile.tdee.fats}g

      Current Cycle Information:
      - Current Phase: ${currentPhase.name}
      - Phase Description: ${currentPhase.description}

      Instructions:
      - Generate a meal plan for a single day, including breakfast, lunch, dinner, and two snacks.
      - The meal plan should take into account of the user's total daily energy expenditure (TDEE), macronutrients requirements, and tailored to the user's fitness goal and dietary restrictions.
      - For users who want to lose weight, create a meal plan with the total calories within 85% of their TDEE.
      - For users who want to gain weight, create a meal plan with the total calories within 115% of their TDEE.
      - For users who want to maintain weight, create a meal plan with the total calories within their TDEE.
      - For the Menstrual phase, suggest food high in iron, vitamin C and magnesium.
      - For the Follicular and Ovulation phases, suggest food high in lean protein, non-starchy vegetables, healthy fats, and high-fiber carbohydrates.
      - For the Luteal phase, suggest food rich in complex carbohydrates, B vitamins, and omega-3 fatty acids. For cravings, suggest whole food options for sweet and salty treats, such as dark chocolate, fruit, nuts or seeds.
      - Provide a brief (1-2 sentence) rationale for why this meal plan is suitable for this phase.
      - Format the response as a JSON object with two keys: "rationale" and "meal_plan" (an object containing meal names as keys and their details as values).
      
      Example JSON output format:
      {
        "rationale": "During the luteal phase, focus your meals around lean proteins and complex carbohydrates.",
        "meal_plan": {
          "calories": 1500,
          "macros": { 
            "protein": "110g",
            "carbohydrates": "150g",
            "fats": "50g"
          },
          "breakfast" : {
            "name": "Oatmeal with Banana, Mixed Berries and Almond Milk",
            "ingredients": [
              "Oats: 1/2 cups",
              "Almond Milk: 1 cup", 
              "Banana: 1 medium",
              "Mixed Berries: 1/2 cup"          
            ],
          },
          "lunch": {
            "name": "Grilled Chicken Salad with Quinoa and Avocado",
            "ingredients": [
              "Chicken Breast - 150g",
              "Quinoa - 1/2 cup cooked", 
              "Avocado - 1/4 medium",
              "Mixed Greens - 2 cups",
              "Cherry Tomatoes - 1/2 cup sliced",
              "Cucumber - 1/2 medium, sliced", 
              "Red Onion - 1/4 medium, thinly sliced",
              "Balsamic Vinaigrette - for dressing"
            ]
          },
          "dinner": {
            "name": "Baked Salmon with Sweet Potato and Steamed Broccoli",
            "ingredients": [
              "Salmon Fillet - 150g",
              "Sweet Potato - 1 medium",
              "Broccoli - 1 cup steamed", 
              "Olive Oil - 1 tbsp"
            ]
          },          
          "snacks": {
            "morning_snack": {
              "name": "Greek Yogurt with Honey and Walnuts",
              "ingredients": [
                "Greek Yogurt - 3/4 cup",
                "Honey - 1 tsp",
                "Walnuts - 12 halves"
              ]
            },
            "afternoon_snack": {
              "name": "Apple Slices with Almond Butter",
              "ingredients": [
                "Apple - 1 medium, sliced",
                "Almond Butter - 2 tbsp"
              ]
            }
          }
        }
      }
    `;
    console.log(prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: response.choices[0].message.content,
    };

  } catch (error) {
    console.error('Error in serverless function:', error);
    return {
      statusCode: 500,
      body: error.message || 'Internal Server Error',
    };
  }
};