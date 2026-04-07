import { Injectable } from '@angular/core';

type Language = 'english' | 'kannada' | 'hindi' | 'urdu';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly translations: Record<Language, Record<string, string>> = {
    english: {
      appName: 'Mom2Be',
      selectLanguage: 'Select Language',
      kannada: 'Kannada',
      hindi: 'Hindi',
      urdu: 'Urdu',
      english: 'English',
      registration: 'Registration',
      motherName: 'Mother Name',
      lmpDate: 'LMP Date',
      language: 'Language',
      phone: 'Phone',
      husbandPhone: 'Husband Phone',
      ashaWorker: 'ASHA Worker',
      anganwadiName: 'Anganwadi Name',
      anganwadiPhone: 'Anganwadi Phone',
      email: 'Email',
      register: 'Register',
      symptoms: 'Symptoms',
      chat: 'Chat',
      medicine: 'Medicine',
      schemes: 'Schemes',
      history: 'History',
      injection: 'Injection',
      anganwadi: 'Anganwadi',
      symptomChecker: 'Symptom Checker',
      describeSymptoms: 'Describe your symptoms...',
      analyzeSymptoms: 'Analyze Symptoms',
      riskLevel: 'Risk Level',
      analysisComplete: 'Analysis complete.',
      send: 'Send',
      typeMessage: 'Type your message...',
      loading: 'Loading...',
      pageContentPlaceholder: 'This page content will be available soon.',
      risk_high: 'High',
      risk_medium: 'Medium',
      risk_low: 'Low'
    },
    kannada: {
      appName: 'ಮಾಂಮ್2ಬಿ',
      selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      kannada: 'ಕನ್ನಡ',
      hindi: 'ಹಿಂದಿ',
      urdu: 'ಉರ್ದು',
      english: 'ಇಂಗ್ಲಿಷ್',
      registration: 'ನೋಂದಣಿ',
      motherName: 'ತಾಯಿಯ ಹೆಸರು',
      lmpDate: 'ಕೊನೆಯ ಮಾಸಿಕ ದಿನಾಂಕ',
      language: 'ಭಾಷೆ',
      phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
      husbandPhone: 'ಗಂಡನ ಫೋನ್ ಸಂಖ್ಯೆ',
      ashaWorker: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆ',
      anganwadiName: 'ಅಂಗನವಾಡಿ ಹೆಸರು',
      anganwadiPhone: 'ಅಂಗನವಾಡಿ ಫೋನ್ ಸಂಖ್ಯೆ',
      email: 'ಇಮೇಲ್',
      register: 'ನೋಂದಾಯಿಸಿ',
      symptoms: 'ಲಕ್ಷಣಗಳು',
      chat: 'ಚಾಟ್',
      medicine: 'ಔಷಧಿ',
      schemes: 'ಯೋಜನೆಗಳು',
      history: 'ಇತಿಹಾಸ',
      injection: 'ಇಂಜೆಕ್ಷನ್',
      anganwadi: 'ಅಂಗನವಾಡಿ',
      symptomChecker: 'ಲಕ್ಷಣ ಪರಿಶೀಲನೆ',
      describeSymptoms: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ...',
      analyzeSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
      riskLevel: 'ಅಪಾಯದ ಮಟ್ಟ',
      analysisComplete: 'ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ.',
      send: 'ಕಳುಹಿಸಿ',
      typeMessage: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      pageContentPlaceholder: 'ಈ ಪುಟದ ವಿಷಯ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗುತ್ತದೆ.',
      risk_high: 'ಹೆಚ್ಚು',
      risk_medium: 'ಮಧ್ಯಮ',
      risk_low: 'ಕಡಿಮೆ'
    },
    hindi: {
      appName: 'मॉम2बी',
      selectLanguage: 'भाषा चुनें',
      kannada: 'कन्नड़',
      hindi: 'हिंदी',
      urdu: 'उर्दू',
      english: 'अंग्रेज़ी',
      registration: 'पंजीकरण',
      motherName: 'माँ का नाम',
      lmpDate: 'अंतिम माहवारी तिथि',
      language: 'भाषा',
      phone: 'फोन नंबर',
      husbandPhone: 'पति का फोन नंबर',
      ashaWorker: 'आशा कार्यकर्ता',
      anganwadiName: 'आंगनवाड़ी का नाम',
      anganwadiPhone: 'आंगनवाड़ी फोन नंबर',
      email: 'ईमेल',
      register: 'पंजीकरण करें',
      symptoms: 'लक्षण',
      chat: 'चैट',
      medicine: 'दवा',
      schemes: 'योजनाएँ',
      history: 'इतिहास',
      injection: 'इंजेक्शन',
      anganwadi: 'आंगनवाड़ी',
      symptomChecker: 'लक्षण जांच',
      describeSymptoms: 'अपने लक्षण लिखें...',
      analyzeSymptoms: 'लक्षण जांचें',
      riskLevel: 'जोखिम स्तर',
      analysisComplete: 'विश्लेषण पूरा हुआ।',
      send: 'भेजें',
      typeMessage: 'अपना संदेश लिखें...',
      loading: 'लोड हो रहा है...',
      pageContentPlaceholder: 'इस पेज की सामग्री जल्द उपलब्ध होगी।',
      risk_high: 'उच्च',
      risk_medium: 'मध्यम',
      risk_low: 'कम'
    },
    urdu: {
      appName: 'مام2بی',
      selectLanguage: 'زبان منتخب کریں',
      kannada: 'کنڑ',
      hindi: 'ہندی',
      urdu: 'اردو',
      english: 'انگریزی',
      registration: 'رجسٹریشن',
      motherName: 'ماں کا نام',
      lmpDate: 'آخری ماہواری کی تاریخ',
      language: 'زبان',
      phone: 'فون نمبر',
      husbandPhone: 'شوہر کا فون نمبر',
      ashaWorker: 'آشا ورکر',
      anganwadiName: 'آنگن واڑی کا نام',
      anganwadiPhone: 'آنگن واڑی فون نمبر',
      email: 'ای میل',
      register: 'رجسٹر کریں',
      symptoms: 'علامات',
      chat: 'چیٹ',
      medicine: 'دوا',
      schemes: 'اسکیمیں',
      history: 'ریکارڈ',
      injection: 'انجکشن',
      anganwadi: 'آنگن واڑی',
      symptomChecker: 'علامات کی جانچ',
      describeSymptoms: 'اپنی علامات لکھیں...',
      analyzeSymptoms: 'علامات جانچیں',
      riskLevel: 'خطرے کی سطح',
      analysisComplete: 'تجزیہ مکمل ہوا۔',
      send: 'بھیجیں',
      typeMessage: 'اپنا پیغام لکھیں...',
      loading: 'لوڈ ہو رہا ہے...',
      pageContentPlaceholder: 'اس صفحے کا مواد جلد دستیاب ہوگا۔',
      risk_high: 'زیادہ',
      risk_medium: 'درمیانہ',
      risk_low: 'کم'
    }
  };

  normalizeLanguage(language: string | null | undefined): Language {
    switch ((language || '').toLowerCase()) {
      case 'kn':
      case 'kannada':
        return 'kannada';
      case 'hi':
      case 'hindi':
        return 'hindi';
      case 'ur':
      case 'urdu':
        return 'urdu';
      default:
        return 'english';
    }
  }

  setLanguage(language: string): void {
    const normalized = this.normalizeLanguage(language);
    localStorage.setItem('language', normalized);
    this.applyLanguage();
  }

  getCurrentLanguage(): Language {
    return this.normalizeLanguage(localStorage.getItem('language'));
  }

  translate(key: string): string {
    const currentLanguage = this.getCurrentLanguage();
    return this.translations[currentLanguage][key] || this.translations.english[key] || key;
  }

  applyLanguage(): void {
    const language = this.getCurrentLanguage();
    const dir = language === 'urdu' ? 'rtl' : 'ltr';
    const documentLanguage = language === 'english' ? 'en' : language === 'hindi' ? 'hi' : language === 'kannada' ? 'kn' : 'ur';

    document.documentElement.lang = documentLanguage;
    document.documentElement.dir = dir;
    document.body.classList.remove('lang-english', 'lang-kannada', 'lang-hindi', 'lang-urdu');
    document.body.classList.add(`lang-${language}`);
  }
}
