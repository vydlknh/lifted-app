import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { registerCharts } from "../utils/registerCharts";
import WeightGraph from "../components/WeightGraph";
import EditProfile from "../components/EditProfile";

registerCharts();

function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const titleCase = (s) => {
    return s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
      c ? c.toUpperCase() : " " + d.toUpperCase()
    );
  };

  const initializeProfile = useCallback(async () => {
    if (!user) {
      setError("No user is signed in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const uid = user.uid;

    try {
      const userRef = doc(db, "UserProfiles", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const profileData = userSnap.data();
        setUserProfile(profileData);
      } else {
        setError("No user profile found.");
      }
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]); // This function depends on the user object

  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]); // Run once on mount

  const handleCloseModal = (didSave) => {
    setIsEditing(false);
    // If the user clicked "Save", we re-fetch the profile data
    // to show the updated information.
    if (didSave) {
      initializeProfile();
    }
  };

  if (loading) {
    return (
      <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-900">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
      {isEditing && (
        <EditProfile 
          user={user} 
          profileData={userProfile} 
          onClose={handleCloseModal} 
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="header">
          <h1 className="text-3xl font-bold text-green-900">Profile</h1>
        </div>

        {userProfile && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 mt-5 gap-8 items-stretch">
            <div className="lg:col-span-1 lg:row-span-3 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">
                Account
              </h2>
              <h2 className="text-sm uppercase font-bold text-pink-800 my-2">
                Personal Information
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span>{" "}
                {userProfile.firstName} {userProfile.lastName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <hr className="my-4 border-pink-200" />

              <h2 className="text-sm uppercase font-bold text-pink-800 my-2">
                Physical Stats
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Age:</span> {userProfile.age}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Height:</span>{" "}
                {userProfile.height} cm
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Weight (initial):</span>{" "}
                {userProfile.weight} kg
              </p>
              <hr className="my-4 border-pink-200" />

              <h2 className="text-sm uppercase font-extrabold text-pink-800 my-2">
                Lifestyle
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Fitness Goal:</span>{" "}
                {titleCase(userProfile.fitnessGoal)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Activity Level:</span>{" "}
                {titleCase(userProfile.activityLevel)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Dietary Preference:</span>{" "}
                {titleCase(userProfile.dietRestriction)}
              </p>
              <button onClick={() => setIsEditing(true)} className="bg-green-800 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700">
                <span className="font-semibold">Edit Profile</span>
              </button>
            </div>

            <div className="lg:col-span-2 lg:row-span-3 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">
                Weight Trend
              </h2>
              <WeightGraph user={user} initialWeight={userProfile.weight} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;
