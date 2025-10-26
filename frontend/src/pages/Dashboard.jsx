import { React, useState, useEffect} from "react";
import { useAuth } from "./auth/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { format, isToday } from "date-fns";

function Dashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  const [workoutError, setWorkoutError] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
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
          const storedWorkout = profileData.dailyWorkout;

          if (storedWorkout && storedWorkout.generatedDate && isToday(new Date(storedWorkout.generatedDate))) {
            setWorkoutPlan(storedWorkout);
          } else {
            await handleGenerateWorkout(profileData, uid);
          }
        } else {
          setError('No user profile found.');
        }
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const handleGenerateWorkout = async (profileData, uid) => {
      if (!user) {
        setWorkoutError('No user is signed in.');
        return;
      }
  
      setGeneratingWorkout(true);
      setWorkoutError(null);
      setWorkoutPlan(null);
  
      try {
        const response = await fetch('/.netlify/functions/generateWorkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile: profileData,
            currentPhase: profileData.cycleInfo.currentPhase,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const newWorkoutData = await response.json();
  
        const todaysWorkout = {
          ...newWorkoutData,
          generatedDate: new Date().toISOString()
        };
  
        const userProfileRef = doc(db, 'UserProfiles', uid);
        await setDoc(userProfileRef, { dailyWorkout: todaysWorkout }, { merge: true });
  
        setWorkoutPlan(todaysWorkout);
      } catch (err) {
        setWorkoutError('Failed to generate workout plan.');
        console.error(err);
      } finally {
        setGeneratingWorkout(false);
      }
    }
    initializeDashboard();
  
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
          <h1 className="text-3xl font-bold text-green-900">
            Hello{userProfile ? `, ${userProfile.firstName}` : ''}
          </h1>
          <p className="text-gray-500 mt-2">
              Here is your personalized plan for today, {format(new Date(), 'MMMM do')}.
          </p>
        </div>

        <div className="mt-6 border-t border-pink-200 pt-6">
          {generatingWorkout && <p className="text-gray-500">Creating your personalized workout plan for today...</p>}
          {workoutError && <p className="text-red-600">{workoutError}</p>}
          {workoutPlan ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-8 items-stretch">
                <div className="md:col-span-3 bg-gray-50 rounded-xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-green-900 mb-4">Today's Workout Plan</h2>
                  <h2 className="text-sm font-semibold text-pink-800 mb-1">{workoutPlan.rationale}</h2>
                  <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
                    {workoutPlan.workout.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
              !generatingWorkout && <p className="text-gray-500">Your workout plan should appear here.</p>
            )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;