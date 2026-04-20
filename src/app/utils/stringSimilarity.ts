/**
 * Pure JS Jaro-Winkler string similarity (0.0 - 1.0)
 * Implementation for MCQ duplicate detection
 * No external dependencies
 * Fixed circular import issue
 */

type SimilarMatch = {
  similarity: number;
  mcqId: string;
  bankName?: string;
  examName?: string;
  question: string;
  bankId?: string;
  examId?: string;
};

// ✅ Quality checks for duplicate detection
const PLACEHOLDERS = [
  'what is the disease or condition',
  'select the correct answer',
  'which of the following',
  'best describes',
  'most appropriate',
  'next step in management',
  'initial management',
  'most likely diagnosis',
].map(p => p.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim());

export const isQualityQuestion = (norm: string): boolean => {
  if (norm.length < 10) return false;
  const wordCount = norm.split(' ').filter(w => w.length > 0).length;
  if (wordCount < 4) return false;
  return !PLACEHOLDERS.includes(norm);
};

/**
 * Normalize question text for comparison
 * - Convert to lowercase
 * - Remove special characters  
 * - Collapse multiple spaces
 */
export const normalizeQuestion = (question: string): string => {
  return question
    .toLowerCase()
    .replace(/[^\\w\\s]/g, '') // Remove special characters
    .replace(/\\s+/g, ' ')     // Collapse multiple spaces
    .trim();
};

/**
 * Jaro distance metric
 */
function jaro(a: string, b: string): number {
  if (a === b) return 1.0;
  if (a.length === 0 || b.length === 0) return 0.0;

  const matchWindow = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  const matches = new Map<number, number>();

  let aMatches = 0, bMatches = 0, transpositions = 0;

  // Find matches
  for (let i = 0; i < a.length; i++) {
    const rangeStart = Math.max(0, i - matchWindow);
    const rangeEnd = Math.min(b.length - 1, i + matchWindow);
    for (let j = rangeStart; j <= rangeEnd; j++) {
      if (b[j] === a[i] && !matches.has(j)) {
        matches.set(j, i);
        aMatches++;
        bMatches++;
        break;
      }
    }
  }

  if (aMatches === 0) return 0.0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < b.length; i++) {
    if (matches.has(i)) {
      if (matches.get(i)! === k) k++;
      else transpositions++;
    }
  }

  const transpositionsHalf = transpositions / 2;
  return (
    (aMatches / a.length + aMatches / b.length + (aMatches - transpositionsHalf) / aMatches) / 3
  );
}

/**
 * Winkler adjustment for prefix matches
 */
function winklerAdjustment(jaroScore: number, a: string, b: string, scaling = 0.1): number {
  const prefixLength = Math.min(
    4,
    [...a.toLowerCase(), ...b.toLowerCase()]
      .findIndex((char, i, arr) => arr[i] !== arr[i + 1])
  );
  return jaroScore + (prefixLength * scaling * (1 - jaroScore));
}

/**
 * Jaro-Winkler similarity score (higher = more similar)
 */
export function stringSimilarity(a: string, b: string): number {
  return winklerAdjustment(jaro(a, b), a, b);
}

/**
 * Find fuzzy duplicates using normalization + similarity threshold
 */
export function findFuzzyDuplicates(
  question: string,
  documents: any[],
  threshold: number = 0.85, // Original threshold restored
  limit: number = 5
): SimilarMatch[] {
  const normalized = normalizeQuestion(question);

// Quality skip UNDONE per user request - now matches all questions
  // if (!isQualityQuestion(normalized)) {
  //   return [];
  // }

  const candidates: SimilarMatch[] = [];

  documents.forEach((doc) => {
    doc.mcqs?.forEach((mcq: any) => {
      const mcqNorm = normalizeQuestion(mcq.question);
      
      // Quality skip UNDONE per user request - now checks all MCQs
      // if (!isQualityQuestion(mcqNorm)) {
      //   return;
      // }
      
      const sim = stringSimilarity(normalized, mcqNorm);
      
      if (sim >= threshold) {
        candidates.push({
          similarity: sim,
          mcqId: mcq.mcqId,
          bankName: doc.title,
          examName: doc.examName,
          question: mcq.question,
          bankId: doc.title ? doc._id.toString() : undefined,
          examId: doc.examName ? doc._id.toString() : undefined,
        });
      }
    });
  });

  return candidates
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Bulk duplicates (exact normalized, for upload internal dupes)
export const findDuplicatesInBulk = (
  questions: string[]
): Map<number, number[]> => {
  const duplicatesMap = new Map<number, number[]>();
  const normalizedMap = new Map<string, number[]>();

  questions.forEach((question, index) => {
    const normalized = normalizeQuestion(question);
    
    if (!normalizedMap.has(normalized)) {
      normalizedMap.set(normalized, []);
    }
    normalizedMap.get(normalized)!.push(index);
  });

  // Build duplicates map
  normalizedMap.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((idx) => {
        duplicatesMap.set(
          idx,
          indices.filter((i) => i !== idx)
        );
      });
    }
  });

  return duplicatesMap;
};

