import { React, useState, useEffect} from "react";
import { useAuth } from "./auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Dashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setUserProfile(userSnap.data());
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
    fetchUserProfile();
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
          <h1 className="text-3xl font-bold text-green-900">Hello{userProfile ? `, ${userProfile.firstName}` : ''}</h1>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;