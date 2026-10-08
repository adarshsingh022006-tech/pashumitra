const express = require('express');
const router = express.Router();

const SYMPTOM_DICTIONARY = {
  fever: [
    'fever', 'temperature', 'pyrexia', 'hot body', 'warm',
    'bukhar', 'bukhaar', 'taap', 'tapman', 'garam', 'jwar',
    'tāp', 'bukhaar hai'
  ],
  coughing: [
    'cough', 'coughing', 'wheezing', 'breath sounds',
    'khansi', 'khānsī', 'khokh', 'khans raha', 'khansi aa rahi',
    'khangh', 'khang'
  ],
  difficulty_walking: [
    'difficulty walking', 'unable to walk', 'cannot stand', 'struggling to walk', 'staggering',
    'chalne mein dikkat', 'chal nahi pa raha', 'khada nahi ho raha', 'ladkhada',
    'turn vich mushkil', 'turn nahi sakda', 'khalo nahi sakda', 'tur nahi reha'
  ],
  salivation: [
    'salivation', 'drooling', 'foaming', 'froth', 'excessive saliva', 'mouth drool',
    'laar', 'thook', 'muh se jhaag', 'laar tapak rahi', 'jhag nikal raha', 'laar tapakna',
    'ral', 'ral vag rahi', 'muh cho jhag', 'thuk'
  ],
  loss_of_appetite: [
    'loss of appetite', 'not eating', 'refusing feed', 'off feed', 'eating less',
    'bhookh nahi', 'chara nahi kha raha', 'khana band', 'ghaas nahi', 'daana nahi kha raha',
    'bhukh nahi', 'chara nahi chuk reha', 'khaan peen band', 'patte nahi kha reha'
  ],
  diarrhea: [
    'diarrhea', 'loose motion', 'watery stool', 'scouring', 'dysentery',
    'dast', 'pet kharab', 'patla gobar', 'dast lag gaye', 'loose potty',
    'mok', 'patla gohar', 'dast lage ne'
  ],
  skin_lesions: [
    'skin lesions', 'blisters', 'bumps', 'nodules', 'sores', 'ulcers', 'lumpy skin',
    'daane', 'chhale', 'phaphole', 'chamdi kharab', 'zakhm', 'fode',
    'folhe', 'gath', 'chhale bane ne'
  ],
  nasal_discharge: [
    'nasal discharge', 'runny nose', 'mucus from nose', 'snot',
    'naak se paani', 'naak beh rahi', 'naak mein resha',
    'nakk cho paani', 'nakk vag reha', 'resha'
  ],
  lameness: [
    'lame', 'lameness', 'limping', 'hoof sore', 'foot rot',
    'langda', 'langdapan', 'khur mein dard', 'khur kharab', 'langda raha hai',
    'lang mar reha', 'khur dukh reha', 'pair te bojh nahi'
  ],
  swelling: [
    'swelling', 'swollen', 'edema', 'lump', 'enlarged',
    'soojan', 'sujan', 'phoola hua', 'gale mein soojan',
    'sooj', 'gale di sooj', 'phulliya'
  ]
};

// POST /api/voice/parse
router.post('/parse', (req, res) => {
  const { transcript = '', language = 'en-US' } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    return res.json({
      detectedSymptoms: [],
      transcript: '',
      suggestedNotes: ''
    });
  }

  const cleanText = transcript.toLowerCase();
  const detectedSymptoms = [];

  for (const [symptomKey, keywords] of Object.entries(SYMPTOM_DICTIONARY)) {
    const isMatched = keywords.some(kw => cleanText.includes(kw.toLowerCase()));
    if (isMatched && !detectedSymptoms.includes(symptomKey)) {
      detectedSymptoms.push(symptomKey);
    }
  }

  res.json({
    detectedSymptoms,
    transcript,
    language,
    matchedCount: detectedSymptoms.length,
    suggestedNotes: transcript
  });
});

module.exports = router;
