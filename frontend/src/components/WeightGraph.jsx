import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
} from 'firebase/firestore';
import { Chart } from 'chart.js';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';

function WeightGraph({ user, initialWeight }) {
  const [weightLog, setWeightLog] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null); 

  useEffect(() => {
    const fetchWeightLog = async () => {
      if (!user) {
        setError('No user is signed in.');
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        const weightLogRef = collection(db, 'UserProfiles', uid, 'WeightLog');
        const q = query(weightLogRef, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);

        const fetchedLog = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const initialEntry = {
            id: 'initial',
            date: new Date(user.metadata.creationTime).toISOString(), // Use account creation time
            weight: parseFloat(initialWeight)
        };

        const combinedLog = [initialEntry, ...fetchedLog.filter(entry => 
            format(new Date(entry.date), 'yyyy-MM-dd') !== format(new Date(initialEntry.date), 'yyyy-MM-dd')
        )];

        setWeightLog(combinedLog);
      } catch (err) {
        setError('Failed to fetch weight log.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeightLog();
  }, [user, initialWeight]);

  useEffect(() => {
    if (weightLog.length > 0) {
      const ctx = chartCanvasRef.current.getContext('2d');

      if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
      }

      const dates = weightLog.map(entry => format(new Date(entry.date), 'yyyy-MM-dd'));
      const weights = weightLog.map(entry => entry.weight);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
              label: 'Weight',
              data: weights,
              backgroundColor: 'oklch(40.8% 0.153 2.432)',
              borderColor: 'oklch(40.8% 0.153 2.432)',
              tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              min: Math.min(...weights) - 2,
              max: Math.max(...weights) + 2
            }
          }
          }
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    }
  }, [weightLog]);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!newWeight || isNaN(newWeight)) {
      setError('Please enter a valid weight.');
      return;
    }
    setError('');

    const uid = user.uid;
    const weightValue = parseFloat(newWeight);
    try {
      const weightLogRef = collection(db, 'UserProfiles', uid, 'WeightLog');
      await addDoc(weightLogRef, {
        date: new Date().toISOString(),
        weight: weightValue
      });

      setWeightLog(prevLog => [
        ...prevLog,
        { date: new Date().toISOString(), weight: weightValue }
      ]);
      setNewWeight('');
    } catch (err) {
      setError('Failed to add weight entry.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className='text-sm font-semibold text-pink-800 mb-1'>Loading...</h2>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-8">
      <canvas ref={chartCanvasRef} id="weightChart" width="400" height="150"></canvas>
      <form onSubmit={handleAddWeight} className="mt-4">
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Enter weight"
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <span className="font-semibold">
            Add Weight
          </span>
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
export default WeightGraph;