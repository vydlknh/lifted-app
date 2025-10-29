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
            Create a personalized workout plan for a user based on their menstrual cycle phase and fitness profile.

            User Profile:
            - Fitness Goal: ${userProfile.fitnessGoal}
            - Activity Level: ${userProfile.activityLevel}
            - Dietary Restrictions: ${userProfile.dietRestriction}

            Current Cycle Information:
            - Current Phase: ${currentPhase.name}
            - Phase Description: ${currentPhase.description}

            Instructions:
            - Generate a workout for a single day.
            - The workout should be tailored to the user's energy levels and physiological state during their current cycle phase.
            - For the Menstrual phase, suggest lighter activities.
            - For the Follicular and Ovulation phases, suggest more intense workouts.
            - For the Luteal phase, suggest moderate and consistent exercise.
            - Provide a brief (1-2 sentence) rationale for why this workout is suitable for this phase.
            - Format the response as a JSON object with two keys: "rationale" and "workout" (an array of strings, where each string is an exercise with sets/reps).
            
            Example JSON output format:
            {
                "rationale": "Your energy is high during this phase, so we're focusing on strength.",
                "workout": [
                    "Barbell Squats: 3 sets of 8-10 reps",
                    "Dumbbell Bench Press: 3 sets of 10-12 reps",
                    "Pull-ups: 3 sets to failure"
                ]
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