/**
 * MCQ Duplicate Detection Utility - ENHANCED FUZZY VERSION
 * Normalizes + Jaro-Winkler similarity (85% threshold)
 * Backward compatible with existing exact matching
 */

import {
  findFuzzyDuplicates,
  isQualityQuestion,
  normalizeQuestion,
} from './stringSimilarity';

export { findFuzzyDuplicates, isQualityQuestion };

// Removed unused `stringSimilarity` named import — all functions are sourced
// from stringSimilarity.ts directly. No circular imports.

/**
 * Legacy exact match across collection (deprecated, use findFuzzyDuplicatesCollection)
 */
export const findDuplicatesInCollection = (
  question: string,
  documents: any[],
  excludeId?: string
): Array<{
  bankId?: string;
  examId?: string;
  mcqId: string;
  bankName?: string;
  examName?: string;
  question: string;
}> => {
  const normalized = normalizeQuestion(question);
  const duplicates: Array<{
    bankId?: string;
    examId?: string;
    mcqId: string;
    bankName?: string;
    examName?: string;
    question: string;
  }> = [];

  documents.forEach((doc) => {
    const docId = doc._id.toString();

    if (excludeId && docId === excludeId) return;

    doc.mcqs?.forEach((mcq: any) => {
      if (normalizeQuestion(mcq.question) === normalized) {
        duplicates.push({
          bankId: doc.title ? docId : undefined,
          examId: doc.examName ? docId : undefined,
          mcqId: mcq.mcqId,
          bankName: doc.title,
          examName: doc.examName,
          question: mcq.question,
        });
      }
    });
  });

  return duplicates;
};

/**
 * Bulk wrapper around findDuplicatesInCollection.
 * Checks each question in the input array against all documents,
 * excluding itself by mcqId if provided.
 */
export const findDuplicatesInBulk = (
  questions: Array<{ mcqId: string; question: string }>,
  documents: any[],
  excludeId?: string
): Array<{
  inputMcqId: string;
  inputQuestion: string;
  duplicates: ReturnType<typeof findDuplicatesInCollection>;
}> => {
  return questions.map(({ mcqId, question }) => ({
    inputMcqId: mcqId,
    inputQuestion: question,
    duplicates: findDuplicatesInCollection(question, documents, excludeId),
  }));
};

/**
 * NEW: Primary function — fuzzy duplicates with similarity score.
 * @param threshold 0.85 = 85% similar (tunable)
 * @param limit     Max results returned (default 5)
 */
export const findFuzzyDuplicatesCollection = (
  question: string,
  documents: any[],
  threshold: number = 0.90,
  limit: number = 5,
  excludeId?: string
): Array<{
  similarity: number;
  mcqId: string;
  bankName?: string;
  examName?: string;
  question: string;
  bankId?: string;
  examId?: string;
}> => {
  const filteredDocs = excludeId
    ? documents.filter((doc) => doc._id.toString() !== excludeId)
    : documents;

  return findFuzzyDuplicates(question, filteredDocs, threshold, limit);

};

/**
 * Service wrapper — use this in controllers.
 * Defaults to fuzzy mode; falls back to exact match when fuzzy=false.
 */
export const checkDuplicates = (
  question: string,
  documents: any[],
  options: {
    fuzzy?: boolean;
    threshold?: number;
    limit?: number;
    excludeId?: string;
  } = {}
): any => {
  const { fuzzy = true, threshold = 0.85, limit = 5, excludeId } = options;

  if (fuzzy) {
    return findFuzzyDuplicatesCollection(question, documents, threshold, limit, excludeId);
  }

  // Fallback: exact match, normalised similarity = 1.0
  return findDuplicatesInCollection(question, documents, excludeId).map((dup) => ({
    ...dup,
    similarity: 1.0,
  }));
};

export default {
  normalizeQuestion,
  findDuplicatesInCollection,
  findDuplicatesInBulk,       
  findFuzzyDuplicatesCollection,
  checkDuplicates,
};