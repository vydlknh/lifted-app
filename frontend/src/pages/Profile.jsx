import React, { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const titleCase = (s) => {
    return s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
      c ? c.toUpperCase() : ' ' + d.toUpperCase()
    );
  };

  useEffect(() => {
    const initializeProfile = async () => {
        
      if (!user) {
        setError('No user is signed in.');
        setLoading(false);
        return;
      }

      const uid = user.uid;
  
      try {
        const userRef = doc(db, 'UserProfiles', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profileData = userSnap.data();
          setUserProfile(profileData);
        } else {
          setError('No user profile found.');
        }
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initializeProfile();
  }, [user]);

  if (loading) {
    return (
    <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-green-900">Loading...</h1>
      </div>
    </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="header">
          <h1 className="text-3xl font-bold text-green-900">Account</h1>
        </div>

        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-8 items-stretch">
            <div className="md:col-span-1 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">Profile Information</h2>
              <p className="text-gray-700 font-semibold"><span className="text-pink-800 my-2">Name:</span> {userProfile.firstName} {userProfile.lastName}</p>
              <p className="text-gray-700 font-semibold"><span className="text-pink-800 my-2">Email:</span> {user.email}</p>
            </div>

            <div className="md:col-span-2 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">Weight Trend</h2>
              <p className="text-gray-700">[Weight trend graph will be displayed here]</p>
            </div>

            <div className="md:col-span-1 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">Goals</h2>
              <p className="text-gray-700 font-semibold"><span className="text-pink-800 my-2">Fitness Goal:</span> {titleCase(userProfile.fitnessGoal)}</p>
              <p className="text-gray-700 font-semibold"><span className="text-pink-800 my-2">Activity Level:</span> {titleCase(userProfile.activityLevel)}</p>
              <p className="text-gray-700 font-semibold"><span className="text-pink-800 my-2">Dietary Preference:</span> {titleCase(userProfile.dietRestriction)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;