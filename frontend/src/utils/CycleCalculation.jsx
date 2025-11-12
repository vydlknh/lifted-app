import { format, addDays } from 'date-fns';

export const calculateCycleInfo = (profileData) => {
  const cycleLength = parseInt(profileData.cycleLength, 10);
  const periodLength = parseInt(profileData.periodLength, 10);

  if (!profileData || !profileData.cycleStart || isNaN(cycleLength) || isNaN(periodLength)) {
    return null;
  }

  const lastPeriodDate = new Date(profileData.cycleStart);
  const today = new Date();

  const totalDaysPassed = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
  
  
  if (totalDaysPassed < 0) return null; // In case the date is in the future
  const cyclesPassed = Math.floor(totalDaysPassed / cycleLength);
  const currentCycleStartDate = addDays(lastPeriodDate, cyclesPassed * cycleLength);

  const daysOfCycle = Math.floor((today - currentCycleStartDate) / (1000 * 60 * 60 * 24));
  
  let currentPhase = {}
  const ovulationDay = cycleLength - 14;

  if (daysOfCycle >=1 && daysOfCycle <= periodLength) {
    currentPhase = {
      name: 'Menstrual Phase',
      duration: `Day 1 - ${periodLength}`,
      description: "This phase begins on the first day of your period. Your body sheds the uterine lining, and you may experience cramps, bloating, and fatigue.",
      whathappens: "The uterine lining (endometrium) is shed, resulting in menstrual bleeding. Hormone levels (estrogen and progesterone) are at their lowest.",
      symptoms: "Cramps, bloating, fatigue, mood swings, headaches.",
      managing: "During the menstrual phase, comfort is key. Use heat pads or over-the-counter pain relievers for cramps, stay hydrated, and get plenty of rest. Light exercise like walking or yoga can also help alleviate symptoms."
    };
  } else if (daysOfCycle > periodLength && daysOfCycle < ovulationDay) {
    currentPhase = {
      name: 'Follicular Phase',
      duration: `Day ${parseInt(periodLength) + 1} - ${ovulationDay - 1}`,
      description: "After your period, estrogen levels rise as your body prepares to release an egg. You may feel more energetic and optimistic.",
      whathappens: "The pituitary gland releases follicle-stimulating hormone (FSH), which stimulates the growth of ovarian follicles. One follicle will become dominant and mature into an egg.",
      symptoms: "Increased energy, improved mood, clearer skin, and heightened focus.",
      managing: "During the follicular phase, take advantage of your increased energy levels. Engage in regular exercise, focus on productivity, and maintain a balanced diet with lean proteins, complex carbohydrate carbs, and cruciferous vegetables to support energy and balance increasing estrogen levels."
    };
  } else if (daysOfCycle === ovulationDay) {
    currentPhase = {
      name: 'Ovulation Phase',
      duration: `Around Day ${ovulationDay}`,
      description: "The mature egg is released from the ovary. This is your most fertile time. Libido is often at its peak.",
      whathappens: "A surge in luteinizing hormone (LH) triggers the release of the mature egg from the dominant follicle. The egg travels down the fallopian tube, where it may meet sperm for fertilization.",
      symptoms: "Mild pelvic or abdominal pain, increased cervical mucus, heightened senses, and increased libido.",
      managing: "During ovulation, stay hydrated and maintain a healthy diet rich in antioxidants, such as fruits and vegetables, to support overall reproductive health. If you're trying to conceive, this is the optimal time for intercourse."
    };
  } else {
    currentPhase = {
      name: 'Luteal Phase',
      duration: `Day ${ovulationDay + 3} - ${cycleLength}`,
      description: "Progesterone levels rise to prepare the uterus for pregnancy. If pregnancy doesn't occur, you may experience PMS symptoms like mood swings and cravings as hormone levels drop.",
      whathappens: "The ruptured follicle transforms into the corpus luteum, which secretes progesterone. This hormone prepares the uterine lining for a potential pregnancy. If fertilization does not occur, the corpus luteum degenerates, leading to a drop in progesterone and the start of menstruation.",
      symptoms: "Mood swings, irritability, bloating, breast tenderness, fatigue, and food cravings.",
      managing: "To manage PMS symptoms, consider over-the-counter pain relievers, light exercises to improve mood and reduce bloating, and stress-reducing activities such as meditation or yoga to help manage emotional fluctuations. Focus on a balanced diet rich in complex carbohydrates, lean proteins, and healthy fats. Supplements such as calcium and magnesium may help alleviate symptoms."
    };
  }  
  
  return {
    currentCycleDay: daysOfCycle,
    currentPhase,
    nextPeriod: format(addDays(currentCycleStartDate, cycleLength), 'MMMM do'),
    lastCalculated: new Date().toISOString()
  };
}