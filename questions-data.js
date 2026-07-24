// Default LevelX placement test questions pool (30 questions)
// Friendly, engaging questions across CEFR levels A1 to C2

const defaultQuestions = [
  {
    id: 'q_1',
    category: 'grammar',
    difficulty: 'A1',
    question: 'She ___ a teacher at our local school.',
    passage: '',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1
  },
  {
    id: 'q_2',
    category: 'vocabulary',
    difficulty: 'A1',
    question: 'I usually drink a cup of ___ in the morning.',
    passage: '',
    options: ['tea', 'stone', 'chair', 'shoe'],
    correctIndex: 0
  },
  {
    id: 'q_3',
    category: 'grammar',
    difficulty: 'A1',
    question: 'We ___ to the park last Sunday.',
    passage: '',
    options: ['go', 'went', 'going', 'goes'],
    correctIndex: 1
  },
  {
    id: 'q_4',
    category: 'vocabulary',
    difficulty: 'A1',
    question: 'A person who helps sick people in a hospital is a ___ .',
    passage: '',
    options: ['driver', 'doctor', 'cook', 'artist'],
    correctIndex: 1
  },
  {
    id: 'q_5',
    category: 'reading',
    difficulty: 'A1',
    question: 'What does Sara like to do after school?',
    passage: 'Sara is 11 years old. After school, she likes to read books and play with her little brother.',
    options: ['She likes to swim.', 'She likes to read books and play.', 'She likes to cook.', 'She likes to sleep all day.'],
    correctIndex: 1
  },
  {
    id: 'q_6',
    category: 'grammar',
    difficulty: 'A2',
    question: 'Have you ever ___ sushi?',
    passage: '',
    options: ['eat', 'eaten', 'ate', 'eats'],
    correctIndex: 1
  },
  {
    id: 'q_7',
    category: 'vocabulary',
    difficulty: 'A2',
    question: 'We need some fresh ___ for the salad.',
    passage: '',
    options: ['vegetables', 'windows', 'papers', 'pens'],
    correctIndex: 0
  },
  {
    id: 'q_8',
    category: 'grammar',
    difficulty: 'A2',
    question: 'This film is ___ than the one we watched yesterday.',
    passage: '',
    options: ['interesting', 'more interesting', 'most interesting', 'interestinger'],
    correctIndex: 1
  },
  {
    id: 'q_9',
    category: 'vocabulary',
    difficulty: 'A2',
    question: 'The weather was so ___ that we stayed at home.',
    passage: '',
    options: ['sunny', 'rainy', 'happy', 'noisy'],
    correctIndex: 1
  },
  {
    id: 'q_10',
    category: 'reading',
    difficulty: 'A2',
    question: 'Where does Amir work?',
    passage: 'Amir works in a small café near the station. He prepares coffee and sandwiches for customers every morning.',
    options: ['In a school', 'In a café', 'In a library', 'In a hospital'],
    correctIndex: 1
  },
  {
    id: 'q_11',
    category: 'grammar',
    difficulty: 'B1',
    question: 'If I ___ more time, I would learn a new instrument.',
    passage: '',
    options: ['have', 'had', 'will have', 'would have'],
    correctIndex: 1
  },
  {
    id: 'q_12',
    category: 'vocabulary',
    difficulty: 'B1',
    question: 'The meeting was postponed because the manager needed more ___ .',
    passage: '',
    options: ['time', 'noise', 'money', 'glass'],
    correctIndex: 0
  },
  {
    id: 'q_13',
    category: 'grammar',
    difficulty: 'B1',
    question: 'She was tired because she ___ all day.',
    passage: '',
    options: ['works', 'is working', 'had been working', 'has worked'],
    correctIndex: 2
  },
  {
    id: 'q_14',
    category: 'vocabulary',
    difficulty: 'B1',
    question: 'His ___ to the project helped the team finish on time.',
    passage: '',
    options: ['contribution', 'distance', 'furniture', 'holiday'],
    correctIndex: 0
  },
  {
    id: 'q_15',
    category: 'reading',
    difficulty: 'B1',
    question: 'What is one benefit of regular exercise?',
    passage: 'Regular exercise helps people stay healthy. It improves sleep, boosts energy, and can make you feel happier.',
    options: ['It makes you tired all the time.', 'It improves sleep and energy.', 'It causes stress.', 'It stops you from eating well.'],
    correctIndex: 1
  },
  {
    id: 'q_16',
    category: 'grammar',
    difficulty: 'B2',
    question: 'I’d rather you ___ mention this to anyone else.',
    passage: '',
    options: ['don’t', 'didn’t', 'won’t', 'not'],
    correctIndex: 1
  },
  {
    id: 'q_17',
    category: 'vocabulary',
    difficulty: 'B2',
    question: 'Her explanation was so ___ that the whole class understood it quickly.',
    passage: '',
    options: ['clear', 'confusing', 'slow', 'boring'],
    correctIndex: 0
  },
  {
    id: 'q_18',
    category: 'grammar',
    difficulty: 'B2',
    question: 'By the time we arrive, the film ___ already started.',
    passage: '',
    options: ['will start', 'starts', 'will have started', 'has started'],
    correctIndex: 2
  },
  {
    id: 'q_19',
    category: 'vocabulary',
    difficulty: 'B2',
    question: 'The team worked hard to ___ its goals before the deadline.',
    passage: '',
    options: ['achieve', 'ignore', 'delay', 'forget'],
    correctIndex: 0
  },
  {
    id: 'q_20',
    category: 'reading',
    difficulty: 'B2',
    question: 'What is the main idea of the text?',
    passage: 'Many people are choosing to cycle to work because it is cheaper than driving and better for the environment.',
    options: ['Cycling is a cheap and eco-friendly option.', 'Driving is always faster.', 'People dislike exercise.', 'Cycling is only for sports lovers.'],
    correctIndex: 0
  },
  {
    id: 'q_21',
    category: 'grammar',
    difficulty: 'C1',
    question: 'Little ___ that the event would become so popular.',
    passage: '',
    options: ['they knew', 'did they know', 'had they known', 'they did know'],
    correctIndex: 1
  },
  {
    id: 'q_22',
    category: 'vocabulary',
    difficulty: 'C1',
    question: 'The manager made a ___ comment that helped calm the tension.',
    passage: '',
    options: ['conciliatory', 'aggressive', 'careless', 'formal'],
    correctIndex: 0
  },
  {
    id: 'q_23',
    category: 'grammar',
    difficulty: 'C1',
    question: 'Hard though they ___, they could not solve the problem quickly.',
    passage: '',
    options: ['tried', 'try', 'have tried', 'trying'],
    correctIndex: 0
  },
  {
    id: 'q_24',
    category: 'vocabulary',
    difficulty: 'C1',
    question: 'The room had a ___ smell of old books and wood polish.',
    passage: '',
    options: ['pleasant', 'subtle', 'faint', 'distinctive'],
    correctIndex: 3
  },
  {
    id: 'q_25',
    category: 'reading',
    difficulty: 'C1',
    question: 'What does the passage suggest about innovation?',
    passage: 'Innovation often begins with a simple idea, but successful change requires patience, collaboration, and careful testing before it can grow.',
    options: ['It grows instantly on its own.', 'It needs planning and teamwork.', 'It only happens in big companies.', 'It never requires testing.'],
    correctIndex: 1
  },
  {
    id: 'q_26',
    category: 'grammar',
    difficulty: 'C2',
    question: 'Were it not for your support, we ___ in serious trouble now.',
    passage: '',
    options: ['would be', 'would have been', 'will be', 'were'],
    correctIndex: 0
  },
  {
    id: 'q_27',
    category: 'vocabulary',
    difficulty: 'C2',
    question: 'His comments were so ___ that many people felt offended.',
    passage: '',
    options: ['encouraging', 'pejorative', 'supportive', 'gentle'],
    correctIndex: 1
  },
  {
    id: 'q_28',
    category: 'grammar',
    difficulty: 'C2',
    question: 'So ___ was the applause that even the performers looked surprised.',
    passage: '',
    options: ['loud', 'louder', 'loudly', 'much loud'],
    correctIndex: 0
  },
  {
    id: 'q_29',
    category: 'vocabulary',
    difficulty: 'C2',
    question: 'She has an ___ talent for noticing tiny details others miss.',
    passage: '',
    options: ['ordinary', 'uncanny', 'simple', 'common'],
    correctIndex: 1
  },
  {
    id: 'q_30',
    category: 'reading',
    difficulty: 'C2',
    question: 'What is the main point of the passage?',
    passage: 'In the digital age, attention is limited and easily divided. People often absorb information in short bursts, which can weaken deep understanding and critical thinking.',
    options: ['Short bursts of information improve deep thinking.', 'Digital habits can reduce deep understanding.', 'People never lose focus.', 'Long reading is no longer useful.'],
    correctIndex: 1
  }
];

window.defaultQuestions = defaultQuestions;
