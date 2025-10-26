import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { calculateCycleInfo } from "../../components/CycleCalculation";

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
  const [cycleLength, setCycleLength] = useState('');

  // for error handling and loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const getErrorClass = (fieldName) => {
    return validationErrors[fieldName]
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-green-700 focus:border-green-700';
  };

  const validateForm = (formData) => {
    const errors = {};
    const { 
        firstName, lastName, age, height, weight, activityLevel, 
        fitnessGoal, dietRestriction, cycleStart, periodLength, cycleLength 
    } = formData;

    // Rule: First Name is required
    if (!firstName.trim()) {
        errors.firstName = 'First name is required.';
    }

    // Rule: Last Name is required
    if (!lastName.trim()) {
        errors.lastName = 'Last name is required.';
    }

    // Rule: Age must be a positive and realistic number
    if (!age) {
        errors.age = 'Age is required.';
    } else if (age <= 0 || age > 120) {
        errors.age = 'Please enter a valid age.';
    }
    
    // Rule: Height must be a and realistic number
    if (!height) {
        errors.height = 'Height is required.';
    } else if (height <= 100) {
        errors.height = 'Please enter a valid height.';
    }

    // Rule: Weight must be a and realistic number
    if (!weight) {
        errors.weight = 'Weight is required.';
    } else if (weight <= 30) {
        errors.weight = 'Please enter a valid weight.';
    }

    // Rule: Selections must be made
    if (!activityLevel) errors.activityLevel = 'Please select an activity level.';
    if (!fitnessGoal) errors.fitnessGoal = 'Please select a fitness goal.';
    if (!dietRestriction) errors.dietRestriction = 'Please select a dietary restriction.';
    
    // Rule: Cycle information is required and must be positive
    if (!cycleStart) errors.cycleStart = 'Please enter your last cycle start date.';
    if (!periodLength) {
        errors.periodLength = 'Period length is required.';
    } else if (periodLength <= 0) {
        errors.periodLength = 'Period length must be a positive number.';
    }
    if (!cycleLength) {
        errors.cycleLength = 'Cycle length is required.';
    } else if (cycleLength <= 0) {
        errors.cycleLength = 'Cycle length must be a positive number.';
    }

    return errors;
};

  const onSubmmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

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

    const formData = {
      firstName, lastName, age, height, weight, activityLevel, 
      fitnessGoal, dietRestriction, cycleStart, periodLength, cycleLength 
    };

    const cycleInfo = calculateCycleInfo({
      cycleStart,
      periodLength,
      cycleLength
    });

    const validationResult = validateForm(formData);

    if (Object.keys(validationResult).length > 0) {
      setValidationErrors(validationResult);
      return; 
    }

    try {
      const userProfileData = {
        ...formData,
        cycleInfo,
        email: user.email,
        createdAt: new Date()
      };
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
    <div className="bg-pink-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">Your Profile</h1>
            <p className="text-gray-500 mt-2">This information helps us personalize your journey.</p>
          </div>
        <form onSubmit={onSubmmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
            {/* Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First name</label>
              <input
              id="firstname"
              type="text"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('firstName')}`}
              />
              {validationErrors.firstName && <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last name</label>
              <input
              id="lastname"
              type="text"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('lastName')}`}
              />
              {validationErrors.lastName && <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>}
            </div>
          </div>

          {/* Physical stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                id="age"
                type="number"
                value={age}
                required
                onChange={(e) => setAge(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('age')}`}
              />
              {validationErrors.age && <p className="mt-1 text-xs text-red-600">{validationErrors.age}</p>}
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                required
                onChange={(e) => setHeight(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('height')}`}
              />
              {validationErrors.height && <p className="mt-1 text-xs text-red-600">{validationErrors.height}</p>}
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                required
                onChange={(e) => setWeight(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('weight')}`}
              />
              {validationErrors.weight && <p className="mt-1 text-xs text-red-600">{validationErrors.weight}</p>}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="pt-3">
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select
              id="activityLevel"
              value={activityLevel}
              required
              onChange={(e) => setActivityLevel(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('activityLevel')}`}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly active</option>
              <option value="moderately_active">Moderately active</option>
              <option value="very_active">Very active</option>
              <option value="extra_active">Extra active</option>
            </select>
            {validationErrors.activityLevel && <p className="mt-1 text-xs text-red-600">{validationErrors.activityLevel}</p>}
          </div>

          {/* Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
            <div>
              <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700">Fitness Goal</label>
              <select
                id="fitnessGoal"
                value={fitnessGoal}
                required
                onChange={(e) => setFitnessGoal(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('fitnessGoal')}`}
              >
                <option value="">Select fitness goal</option>
                <option value="lose_weight">Lose weight</option>
                <option value="maintain_weight">Maintain weight</option>
                <option value="gain_muscle">Gain muscle</option>
                <option value="improve_endurance">Improve endurance</option>
              </select>
              {validationErrors.fitnessGoal && <p className="mt-1 text-xs text-red-600">{validationErrors.fitnessGoal}</p>}
            </div>
            <div>
              <label htmlFor="dietRestriction" className="block text-sm font-medium text-gray-700">Dietary Restriction</label>
              <select
                id="dietRestriction"
                value={dietRestriction}
                required
                onChange={(e) => setDietRestriction(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('dietRestriction')}`}
              >
                <option value="">Select dietary restriction</option>
                <option value="none">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten_free">Gluten-Free</option>
                <option value="dairy_free">Dairy-Free</option>
              </select>
              {validationErrors.dietRestriction && <p className="mt-1 text-xs text-red-600">{validationErrors.dietRestriction}</p>}
            </div>
          </div>

          {/* Cycle details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 border-t py-2 mt-6">Cycle Details</h3>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="cycleStart" className="block text-sm font-medium text-gray-700">Last Cycle Start</label>
                <input
                  id="cycleStart"
                  type="date"
                  value={cycleStart}
                  required
                  onChange={(e) => setCycleStart(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('cycleStart')}`}
                />
                {validationErrors.cycleStart && <p className="mt-1 text-xs text-red-600">{validationErrors.cycleStart}</p>}
              </div>
              <div>
                <label htmlFor="periodLength" className="block text-sm font-medium text-gray-700">Period Length (days)</label>
                <input
                  id="periodLength"
                  type="number"
                  value={periodLength}
                  required
                  onChange={(e) => setPeriodLength(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('periodLength')}`}
                />
                {validationErrors.periodLength && <p className="mt-1 text-xs text-red-600">{validationErrors.periodLength}</p>}
              </div>
              <div>
                <label htmlFor="cycleLength" className="block text-sm font-medium text-gray-700">Avg. Cycle (days)</label>
                <input
                  id="cycleLength"
                  type="number"
                  value={cycleLength}
                  required
                  onChange={(e) => setCycleLength(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 ${getErrorClass('cycleLength')}`}
                />
                {validationErrors.cycleLength && <p className="mt-1 text-xs text-red-600">{validationErrors.cycleLength}</p>}
              </div>
          </div>

          {error && <p className="error">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 mt-6">
            <span className="font-bold">
              {loading ? 'Submitting...' : 'Submit'}
            </span>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};
export default Questionnaire;