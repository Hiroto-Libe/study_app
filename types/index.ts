export type Subject = 'japanese' | 'math';
export type Format = 'reading' | 'writing' | 'stroke' | 'choice' | 'calculation' | 'sentence';
export type InputType = 'voice' | 'photo' | 'stroke' | 'choice' | 'keypad';
export type Source = 'api_generated' | 'seed' | 'manual';
export type WeakType = 'reading' | 'writing' | 'stroke' | 'meaning' | 'calculation';
export type CharacterStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult';
export type Mode = 'voice' | 'stroke' | 'choice' | 'number' | 'study';

export type Question = {
    id: string;
    subject: Subject;
    format: Format;
    input_type: InputType;
    body: string;
    answer: string;
    hint?: string | null;
    unit: string;
    grade: number;
    kanji?: string | null;
    options?: string[];
    correct_index?: 0 | 1;
};

export type AnswerResult = {
    questionId: string;
    isCorrect: boolean;
    selectedValue: string;
};

export type QuizSessionState = {
    sessionId: string;
    currentMode: Mode;
    questions: Question[];
    currentIndex: number;
    answers: AnswerResult[];
    consecutiveCorrect: number;
    isDailyFirst: boolean;
    isLoading: boolean;
    fetchError: string | null;
    submittedIds: string[];
};

export type Learner = {
    id: string;
    name: string;
    grade: number;
    avatar_name: string;
};

export type GameProgress = {
    learner_id: string;
    xp_total: number;
    level: number;
    character_stage: CharacterStage;
    coins: number;
    streak_days: number;
    last_study_date: string | null;
    consecutive_correct?: number | null;
    badges: string[];
};

export type AnswerRequest = {
    question_id: string;
    is_correct: boolean;
    input_type: InputType;
    used_hint: boolean;
    session_id: string;
};

export type AnswerResponse = {
    xp_earned: number;
    coins_earned: number;
    total_xp: number;
    level: number;
    level_up: boolean;
    prev_level: number;
    character_stage: CharacterStage;
    character_stage_changed: boolean;
    prev_stage: CharacterStage;
    new_badges: string[];
    streak_days: number;
    next_level_xp: number;
};
