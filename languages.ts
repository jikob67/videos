
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
];

export type LanguageCode = 'en' | 'ar';

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    home: "home", support: "support", profile: "me", upload: "studio", search: "explore",
    points: "Points", posts: "Videos", myVideos: "My Videos", noVideos: "No videos recorded yet.",
    welcome: "welcome to videos", createAccount: "create account", login: "Login",
    fullName: "Full Name", username: "Username", email: "Email Address", password: "Password",
    confirmPassword: "Confirm Password", privacyPolicy: "Privacy Policy", termsOfUse: "Terms of Use",
    agreeTo: "By creating an account, you agree to our", and: "and", 
    uploadPhoto: "Upload Profile Photo", photoRequired: "Profile photo is required!",
    passwordRequired: "Password (min 6 characters)",
    trending: "Trending Now", exploreTopics: "Popular Topics", searchPlaceholder: "Search topics, interests...",
    recordTopic: "Record Daily Topic", startRecording: "Start Recording", stopRecording: "Stop & Save",
    cameraAccess: "Accessing Camera...", saveSuccess: "Topic saved successfully!",
    aiSuggestions: "AI Topic Ideas", getIdeas: "Get Ideas",
    selectInterests: "What are your interests?", selectAtLeastOne: "Choose at least 1 topic to continue",
    finish: "Finish & Explore", next: "Next Step", back: "Go Back",
    alreadyHaveAccount: "Already have an account?", signUpNow: "Sign Up Now",
    invalidLogin: "Invalid email/username or password",
    changeLanguage: "Change Language",
    videoTitle: "Video Title (Optional)",
    videoDescription: "Description (Optional)",
    savePost: "Save Post",
    discard: "Discard",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this topic?",
    noNotifications: "No notifications yet",
    shareMessage: "Check out this topic on videos!",
    privacyContent: "At videos, we take your privacy seriously. Your personal data is encrypted and stored securely. We only use your information to personalize your experience and never share it with third parties without your explicit consent. You have full control over your recorded topics and can delete them at any time.",
    termsContent: "By using videos, you agree to record content that is respectful and legal. Users are prohibited from uploading copyrighted material, hate speech, or explicit content. videos reserves the right to suspend accounts that violate these guidelines. You are responsible for the security of your account and password."
  },
  ar: {
    home: "الرئيسية", support: "الدعم", profile: "أنا", upload: "الاستوديو", search: "استكشف",
    points: "نقاط", posts: "فيديوهات", myVideos: "فيديوهاتي", noVideos: "لا توجد مواضيع مسجلة بعد.",
    welcome: "مرحباً بك في videos", createAccount: "إنشاء حساب", login: "تسجيل الدخول",
    fullName: "الاسم الكامل", username: "اسم المستخدم", email: "البريد الإلكتروني", password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور", privacyPolicy: "سياسة الخصوصية", termsOfUse: "شروط الاستخدام",
    agreeTo: "بإنشائك حساباً، أنت توافق على", and: "و",
    uploadPhoto: "رفع صورة الملف الشخصي", photoRequired: "الصورة الشخصية مطلوبة!",
    passwordRequired: "كلمة المرور (6 أحرف على الأقل)",
    trending: "رائج الآن", exploreTopics: "مواضيع شائعة", searchPlaceholder: "ابحث عن مواضيع، اهتمامات...",
    recordTopic: "سجل اهتمامك اليومي", startRecording: "بدء التسجيل", stopRecording: "إيقاف وحفظ",
    cameraAccess: "جاري فتح الكاميرا...", saveSuccess: "تم حفظ الموضوع بنجاح!",
    aiSuggestions: "اقتراحات الذكاء الاصطناعي", getIdeas: "أعطني أفكاراً",
    selectInterests: "ما هي اهتماماتك؟", selectAtLeastOne: "اختر موضوعاً واحداً على الأقل للمتابعة",
    finish: "إنهاء واستكشاف", next: "الخطوة التالية", back: "الرجوع",
    alreadyHaveAccount: "لديك حساب بالفعل؟", signUpNow: "سجل الآن",
    invalidLogin: "البريد/اسم المستخدم أو كلمة المرور غير صحيحة",
    changeLanguage: "تغيير اللغة",
    videoTitle: "عنوان الفيديو (اختياري)",
    videoDescription: "الوصف (اختياري)",
    savePost: "حفظ الفيديو",
    discard: "تجاهل",
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من حذف هذا الموضوع؟",
    noNotifications: "لا توجد إشعارات حالياً",
    shareMessage: "شاهد هذا الموضوع على تطبيق videos!",
    privacyContent: "في videos، نأخذ خصوصيتك على محمل الجد. يتم تشفير بياناتك الشخصية وتخزينها بشكل آمن. نحن نستخدم معلوماتك فقط لتخصيص تجربتك ولا نشاركها أبداً مع أطراف ثالثة دون موافقتك الصريحة. لديك السيطرة الكاملة على مواضيعك المسجلة ويمكنك حذفها في أي وقت.",
    termsContent: "باستخدام videos، فإنك توافق على تسجيل محتوى محترم وقانوني. يُحظر على المستخدمين تحميل المواد المحمية بحقوق الطبع والنشر، أو خطاب الكراهية، أو المحتوى الفاضح. يحتفظ videos بالحق في تعليق الحسابات التي تنتهك هذه الإرشادات. أنت مسؤول عن أمن حسابك وكلمة مرورك."
  }
};
