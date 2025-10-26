import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { format } from 'date-fns';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { calculateCycleInfo } from '../components/CycleCalculation';

function CycleTracking() {
  const { user } = useAuth();
  const [cycleInfo, setCycleInfo] = useState(null)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycleInfo = async () => {
      if (!user) {
        setError('No user is signed in.');
        return;
      }

      const uid = user.uid;
  
      try {
        const userRef = doc(db, 'UserProfiles', uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const profileData = userSnap.data();
          // const storedInfo = profileData.cycleInfo

          // if (storedInfo) {
          //   setCycleInfo(storedInfo);
          // } else {
            const newCycleInfo = calculateCycleInfo(profileData);
            if (newCycleInfo) {
              // Save the newly calculated info back to Firebase
              await setDoc(userRef, { cycleInfo: newCycleInfo }, { merge: true });
              setCycleInfo(newCycleInfo);
            } else {
              setError("Could not calculate cycle info from your profile.");
            }
          // }
        }
      }
      catch (err) {
        setError('Failed to fetch cycle information.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCycleInfo();
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
    return <div className="p-8 text-center text-red-600 bg-red-100 rounded-lg mx-auto max-w-md">{error}</div>;
  }

  return (
    <div className="bg-pink-100 text-grey-900 flex justify-center min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="header">
          <h1 className="text-3xl font-bold text-green-900">Cycle Tracker</h1>
          <p className="text-gray-500 mt-2">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        {cycleInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-8 items-stretch">
            {/* current day */}
            <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <p className="text-lg font-semibold text-pink-800">You are on day</p>
              <p className="text-7xl font-bold text-pink-600 my-2">{cycleInfo.currentCycleDay}</p>
              <p className="text-lg font-semibold text-pink-800">of your cycle</p>
              <p className="text-sm text-gray-500 mt-4">Next period expected around <br/><strong>{cycleInfo.nextPeriod}</strong></p>
            </div>

            {/* current phase */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-sm uppercase font-semibold text-pink-800 mb-1">Current Phase</h2>
              <h3 className="text-3xl font-bold text-green-900">{cycleInfo.currentPhase.name}</h3>
              <p className="text-pink-600 font-medium my-2">{cycleInfo.currentPhase.duration}</p>
              <hr className="my-4 border-pink-200"/>
              <p className="text-gray-600 leading-relaxed">{cycleInfo.currentPhase.description}</p>
            </div>

            <div className="md:col-span-3 bg-gray-50 rounded-xl p-8 shadow-lg">
              <h2 className="text-sm uppercase font-semibold text-pink-800 mb-2">What happens during the {cycleInfo.currentPhase.name}</h2>
              <p className="text-gray-600 leading-relaxed">{cycleInfo.currentPhase.whathappens}</p>
              <h2 className="text-sm uppercase font-semibold text-pink-800 mt-4 mb-2">Symptoms</h2>
              <p className="text-gray-600 leading-relaxed">{cycleInfo.currentPhase.symptoms}</p>
              <h2 className="text-sm uppercase font-semibold text-pink-800 mt-4 mb-2">Managing the {cycleInfo.currentPhase.name}</h2>
              <p className="text-gray-600 leading-relaxed">{cycleInfo.currentPhase.managing}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CycleTracking;