export type Language = "en" | "ar";

export const translations = {
  en: {
    brand: "QuizCard",
    nav: {
      home: "Home",
      results: "Results",
      lightMode: "Switch to light mode",
      darkMode: "Switch to dark mode",
      arabic: "Arabic",
      english: "English",
    },
    upload: {
      title: "Start a new quiz",
      subtitle: "Upload a file or paste your questions below.",
      dropTitle: "Upload PDF or Word",
      dropHint: "Drag & drop, or click to browse",
      orPaste: "or paste text",
      placeholder:
        "1. What is the capital of France?\nA) London\nB) Paris\nC) Berlin\nAnswer: B",
      remove: "Remove",
      quizMode: "Quiz mode",
      allQuestions: "All Questions",
      randomSample: "Random Sample",
      questionsToInclude: "Questions to include",
      decreaseSample: "Decrease sample size",
      increaseSample: "Increase sample size",
      processing: "Processing…",
      generateQuiz: "Generate Quiz",
      errorNoContent: "Please upload a file or paste MCQ text",
      errorProcess: "Failed to process content",
      processingFile: "Processing {name}…",
      processingQuiz: "Processing your quiz…",
      selectedFile: "Selected: {name}",
    },
    quiz: {
      hint: "Hint",
      tip: "Tip",
      hintText:
        "Rule out wrong answers first, then pick the best match for the question.",
      back: "Back",
      seeResults: "See Results",
      nextQuestion: "Next Question",
      calculating: "Calculating",
      scoring: "Scoring your session…",
      noQuestions: "No questions were loaded.",
      tryAgain: "Try again",
      errorSubmit: "Failed to submit quiz",
    },
    results: {
      title: "Session complete",
      correctOf: "{correct} of {total} correct",
      perfectTitle: "Perfect score",
      perfectText: "You got every question right.",
      toReview: "To review ({count})",
      you: "You: {answer}",
      correct: "Correct: {answer}",
      newQuiz: "New Quiz",
    },
  },
  ar: {
    brand: "QuizCard",
    nav: {
      home: "الرئيسية",
      results: "النتائج",
      lightMode: "التبديل إلى الوضع الفاتح",
      darkMode: "التبديل إلى الوضع الداكن",
      arabic: "العربية",
      english: "English",
    },
    upload: {
      title: "ابدأ اختبارًا جديدًا",
      subtitle: "ارفع ملفًا أو الصق أسئلتك أدناه.",
      dropTitle: "ارفع PDF أو Word",
      dropHint: "اسحب وأفلت، أو انقر للتصفح",
      orPaste: "أو الصق النص",
      placeholder:
        "1. ما عاصمة فرنسا؟\nأ) لندن\nب) باريس\nج) برلين\nالإجابة: ب",
      remove: "إزالة",
      quizMode: "وضع الاختبار",
      allQuestions: "كل الأسئلة",
      randomSample: "عينة عشوائية",
      questionsToInclude: "عدد الأسئلة",
      decreaseSample: "تقليل عدد الأسئلة",
      increaseSample: "زيادة عدد الأسئلة",
      processing: "جاري المعالجة…",
      generateQuiz: "إنشاء الاختبار",
      errorNoContent: "يرجى رفع ملف أو لصق نص الأسئلة",
      errorProcess: "فشلت معالجة المحتوى",
      processingFile: "جاري معالجة {name}…",
      processingQuiz: "جاري معالجة الاختبار…",
      selectedFile: "تم اختيار: {name}",
    },
    quiz: {
      hint: "تلميح",
      tip: "نصيحة",
      hintText: "استبعد الإجابات الخاطئة أولاً، ثم اختر الأنسب للسؤال.",
      back: "رجوع",
      seeResults: "عرض النتائج",
      nextQuestion: "السؤال التالي",
      calculating: "جاري الحساب",
      scoring: "جاري تصحيح إجاباتك…",
      noQuestions: "لم يتم تحميل أي أسئلة.",
      tryAgain: "حاول مرة أخرى",
      errorSubmit: "فشل إرسال الاختبار",
    },
    results: {
      title: "اكتمل الاختبار",
      correctOf: "{correct} من {total} صحيحة",
      perfectTitle: "درجة كاملة",
      perfectText: "أجبت على كل الأسئلة بشكل صحيح.",
      toReview: "للمراجعة ({count})",
      you: "إجابتك: {answer}",
      correct: "الصحيحة: {answer}",
      newQuiz: "اختبار جديد",
    },
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationKey = DeepStringify<typeof translations.en>;

export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}
