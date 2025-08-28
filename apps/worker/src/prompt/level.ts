/**
 * TODO: Add ability to adjust the feedback to be more specific to the user level
 */
const USER_LEVEL_DESCRIPTIONS = {
  novice: [
    'Novice (less than 1 year as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'May have some experience coding, but not necessarily professional and not in the target language',
  ],
  apprentice: [
    'Apprentice (1-2 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Knowledgeable in some programming languages and frameworks',
  ],
  experienced: [
    'Experienced (3-5 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Proficient in at least one programming language, not necessarily the target language',
  ],
  professional: [
    'Professional (6-10 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Proficient in at least a few programming languages, and familiar with professional software engineering practices',
  ],
  expert: [
    'Expert (10+ years as a working software engineer)',
    'Proficient in the language of the code being reviewed',
    'Expert in professional software engineering practices',
  ],
}


export function getUserLevelDescription(level: string): string {
  return USER_LEVEL_DESCRIPTIONS[level as keyof typeof USER_LEVEL_DESCRIPTIONS].join('\n');
}