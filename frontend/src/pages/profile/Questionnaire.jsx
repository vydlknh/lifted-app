import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Questionnaire() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // for tdee calculation
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  // for fitness & diet plans
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [dietRestriction, setDietRestriction] = useState('');

  // for cycle prediction
  const [cycleStart, setCycleStart] = useState('');
  const [periodLength, setPeriodLength] = useState('');
  const [cycleLength, setcycleLength] = useState('');

  // for error handling and loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('No user is signed in.');
      setLoading(false);
      return
    };

    const uid = user.uid;

    // Validate inputs
    if (!firstName || !lastName || !age || !height || !weight || !activityLevel || !fitnessGoal || !dietRestriction || !cycleStart || !periodLength || !cycleLength) {
      setError('Please fill in all fields.');
      return;
    }

    const userProfileData = {
      uid,
      firstName,
      lastName,
      age,
      height,
      weight,
      activityLevel,
      fitnessGoal,
      dietRestriction,
      cycleStart,
      periodLength,
      cycleLength,
      createAt: new Date()
    };

    try {
      const userRef = doc(db, 'UserProfiles', uid);
      await setDoc(userRef, userProfileData, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving user profile:', err);
      setError('Failed to save user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="header">
        <h1>Questionnaire</h1>
        <form onSubmit={onSubmmit}>
          <div>
            <label htmlFor="firstname">First name</label>
            <input
              id="firstname"
              type="text"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastname">Last name</label>
            <input
              id="lastname"
              type="text"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              value={age}
              required
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              value={height}
              required
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              type="number"
              value={weight}
              required
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="activityLevel">Activity Level</label>
            <select
              id="activityLevel"
              value={activityLevel}
              required
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="lightly_active">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="moderately_active">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="very_active">Very active (heavy exercise/sports 6-7 days a week)</option>
              <option value="extra_active">Extra active (very heavy exercise/sports & physical job or 2x training)</option>
            </select>
          </div>
          <div>
            <label htmlFor="fitnessGoal">Fitness Goal</label>
            <select
              id="fitnessGoal"
              value={fitnessGoal}
              required
              onChange={(e) => setFitnessGoal(e.target.value)}
            >
              <option value="">Select fitness goal</option>
              <option value="lose_weight">Lose weight</option>
              <option value="maintain_weight">Maintain weight</option>
              <option value="gain_muscle">Gain muscle</option>
              <option value="improve_endurance">Improve endurance</option>
            </select>
          </div>
          <div>
            <label htmlFor="dietRestriction">Dietary Restriction</label>
            <select
              id="dietRestriction"
              value={dietRestriction}
              required
              onChange={(e) => setDietRestriction(e.target.value)}
            >
              <option value="">Select dietary restriction</option>
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten_free">Gluten-Free</option>
              <option value="dairy_free">Dairy-Free</option>
            </select>
          </div>
          <div>
            <label htmlFor="cycleStart">Last Menstrual Cycle Start Date</label>
            <input
              id="cycleStart"
              type="date"
              value={cycleStart}
              required
              onChange={(e) => setCycleStart(e.target.value)}
            /> 
          </div>
          <div>
            <label htmlFor="periodLength">Period Length (days)</label>
            <input
              id="periodLength"
              type="number"
              value={periodLength}
              required
              onChange={(e) => setPeriodLength(e.target.value)}
            /> 
          </div>
          <div>
            <label htmlFor="cycleLength">Average Cycle Length (days)</label>
            <input
              id="cycleLength"
              type="number"
              value={cycleLength}
              required
              onChange={(e) => setcycleLength(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};
export default Questionnaire;