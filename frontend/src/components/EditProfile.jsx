import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";

function EditProfile({ user, profileData, onClose }) {
  const [formData, setFormData] = useState({
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    age: profileData.age || "",
    height: profileData.height || "",
    weight: profileData.weight || "",
    activityLevel: profileData.activityLevel || "sedentary",
    fitnessGoal: profileData.fitnessGoal || "lose_weight",
    dietRestriction: profileData.dietRestriction || "none",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userProfileRef = doc(db, "UserProfiles", user.uid);

      await setDoc(
        userProfileRef,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
          activityLevel: formData.activityLevel,
          fitnessGoal: formData.fitnessGoal,
          dietRestriction: formData.dietRestriction,
        },
        { merge: true }
      );

      setLoading(false);
      onClose(true);
    } catch (err) {
      console.error("Error updating profile: ", err);
      setError("Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Your Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
          )}

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (kg)
              </label>
              <input
                type="text"
                name="lastName"
                id="lastname"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          {/* Physical Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (initial) (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label
              htmlFor="fitnessGoal"
              className="block text-sm font-medium text-gray-700"
            >
              Fitness Goal
            </label>
            <select
              name="fitnessGoal"
              id="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="lose_weight">Lose weight</option>
              <option value="maintain_weight">Maintain weight</option>
              <option value="gain_muscle">Gain muscle</option>
              <option value="improve_endurance">Improve endurance</option>
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label
              htmlFor="activityLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Activity Level
            </label>
            <select
              name="activityLevel"
              id="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="sedentary">
                Sedentary (little or no exercise)
              </option>
              <option value="lightly_active">
                Lightly active (light exercise/sports 1-3 days/week)
              </option>
              <option value="moderately_active">
                Moderately active (moderate exercise/sports 3-5 days/week)
              </option>
              <option value="very_active">
                Very active (heavy exercise/sports 6-7 days a week)
              </option>
              <option value="extra_active">
                Extra active (very heavy exercise/sports & physical job)
              </option>
            </select>
          </div>

          {/* Dietary Restriction */}
          <div>
            <label
              htmlFor="dietRestriction"
              className="block text-sm font-medium text-gray-700"
            >
              Dietary Restriction
            </label>
            <select
              name="dietRestriction"
              id="dietRestriction"
              value={formData.dietRestriction}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten_free">Gluten-Free</option>
              <option value="dairy_free">Dairy-Free</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
