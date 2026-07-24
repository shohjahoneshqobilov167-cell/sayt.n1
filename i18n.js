(function () {
  const translations = {
    uz: {
      titles: {
        home: 'LevelX | Premium CEFR English Placement Test',
        auth: 'Tizimga kirish / Ro\'yxatdan o\'tish - LevelX',
        profile: 'Mening Profilim - LevelX',
        levels: 'CEFR Darajalari Tavsifi - LevelX',
        stats: 'Tizim Statistikasi - LevelX',
        test: 'Placement Test - Ingliz tili testi',
        result: 'Test Natijasi - LevelX',
        admin: 'Admin Panel - LevelX',
        lessons: 'Video Darslar - LevelX',
        teachers: "O'qituvchilar - LevelX"
      },
      nav: {
        home: 'Bosh sahifa',
        lessons: 'Darslar',
        teachers: "O'qituvchilar",
        levels: 'Darajalar haqida',
        stats: 'Statistika',
        admin: 'Admin Panel',
        profile: 'Profil',
        login: 'Kirish',
        signup: 'Ro\'yxatdan o\'tish',
        logout: 'Chiqish'
      },      common: {
        save: 'Saqlash',
        cancel: 'Bekor qilish',
        next: 'Keyingisi',
        previous: 'Oldingisi',
        finish: 'Yakunlash',
        startTest: 'Testni boshlash',
        exploreLevels: 'Darajalarni ko\'rish',
        download: 'Yuklab olish',
        reset: 'Asliga qaytarish',
        addQuestion: 'Yangi savol qo\'shish',
        actions: 'Amallar',
        category: 'Yo\'nalish',
        level: 'Daraja',
        question: 'Savol',
        options: 'Variantlar',
        answer: 'To\'g\'ri javob',
        current: 'Joriy',
        answered: 'Belgilangan',
        unanswered: 'Belgilanmagan'
      },
      hero: {
        badge: 'CEFR • 30 daqiqa • Instant sertifikat',
        title: 'Ingliz tilining haqiqiy darajasini daqiqada aniqlang',
        subtitle: 'LevelX — tinch, premium CEFR test tajribasi. Aniq natija va ishonchli ko\'rsatkichlar.',
        start: 'Testni boshlash',
        levels: 'Darajalarni ko\'rish',
        footer: 'Barcha huquqlar himoyalangan'
      },
      auth: {
        loginTab: 'Kirish',
        signupTab: 'Ro\'yxatdan o\'tish',
        email: 'Email manzil',
        password: 'Parol',
        firstName: 'Ism',
        lastName: 'Familiya',
        age: 'Yosh',
        avatar: 'Profil rasmi',
        loginButton: 'Tizimga kirish',
        signupButton: 'Ro\'yxatdan o\'tish',
        noAccount: 'Hisobingiz yo\'qmi?',
        haveAccount: 'Allaqachon hisobingiz bormi?',
        loginSuccess: 'Tizimga muvaffaqiyatli kirildi! Yo\'naltirilmoqda...',
        signupSuccess: 'Hisob muvaffaqiyatli yaratildi! Yo\'naltirilmoqda...',
        passwordShort: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak!',
        loginRedirect: 'Profilga o\'tish',
        signupRedirect: 'Profilga o\'tish',
        wrongCredentials: 'Email yoki parol xato!',
        emailTaken: 'Bu email orqali allaqachon ro\'yxatdan o\'tilgan!',
        notLoggedIn: 'Tizimga kirilmagan!',
        userNotFound: 'Foydalanuvchi topilmadi!'
      },
      profile: {
        title: 'Mening profilim',
        settings: 'Sozlamalar',
        avatar: 'Avatar tanlash',
        newPassword: 'Yangi parol',
        ageLabel: 'Yosh',
        ageDisplay: 'Yosh',
        chartTitle: 'Progress grafigi',
        chartSubtitle: 'Vaqt o\'tishi bilan ingliz tili darajangizning o\'sishi',
        historyTitle: 'Test topshirish tarixi',
        newTest: 'Yangi test',
        noHistory: 'Siz hali test topshirmagansiz.',
        startTest: 'Testni boshlash',
        details: 'Batafsil',
        saveSuccess: 'Profil muvaffaqiyatli saqlandi!',
        result: 'Natija',
        takenOn: 'Topshirilgan vaqt',
        grammar: 'Grammatika',
        vocabulary: 'Lug\'at',
        reading: 'O\'qish',
        chartLoading: 'Grafikni chizish uchun kamida bitta test topshirishingiz kerak.',
        logoutBtn: 'Chiqish'
      },
      levels: {
        title: 'CEFR Ingliz tili darajalari',
        subtitle: 'CEFR — tillarni o\'rganish, o\'qitish va baholashning umumevropa tizimi bo\'lib, til bilish darajasini 6 ta bosqichga ajratadi.'
      },
      stats: {
        loggedInAs: 'Profil',
        logout: 'Chiqish',
        loginBtn: 'Kirish'
      },
      result: {
        title: 'Sizning ingliz tili darajangiz',
        summary: 'Siz testda {max} ta savoldan {score} tasiga to\'g\'ri javob berdingiz.',
        breakdown: 'Yo\'nalishlar bo\'yicha tahlil',
        retake: 'Qayta test',
        profile: 'Profilga o\'tish',
        download: 'Sertifikatni yuklash',
        recommendations: 'Keyingi qadamlar va tavsiyalar',
        recommendationsText: 'Siz uchun maxsus tuzilgan rivojlanish rejasi:',
        downloadLoading: 'Yuklanmoqda...',
        downloadError: 'PDF yuklashda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.',
        downloadRetry: 'Kutubxona yuklanmoqda, iltimos bir necha soniyadan so\'ng qayta urining.'
      },
      test: {
        finish: 'Testni yakunlash',
        question: 'Savol',
        level: 'Daraja',
        timeLeft: 'Qolgan vaqt',
        map: 'Savollar xaritasi',
        current: 'Joriy',
        answered: 'Belgilangan',
        unanswered: 'Belgilanmagan',
        finishModalTitle: 'Testni yakunlaysizmi?',
        finishModalText: 'Belgilanmagan savollar qolgan bo\'lishi mumkin. Haqiqatdan ham testni topshirib natijalarni hisoblamoqchimisiz?',
        cancel: 'Bekor qilish',
        confirmFinish: 'Ha, yakunlash',
        timeUpTitle: 'Vaqt tugadi!',
        timeUpText: 'Test uchun ajratilgan 25 daqiqa vaqt nihoyasiga yetdi. Sizning natijalaringiz avtomatik tarzda hisoblanadi.',
        viewResults: 'Natijalarni ko\'rish',
        previous: 'Oldingisi',
        next: 'Keyingisi',
        notFound: 'Test savollari topilmadi! Loyiha sozlanmagan.',
        leaveWarning: 'Haqiqatan ham sahifani tark etmoqchimisiz? Kiritilgan javoblaringiz yo\'qolishi mumkin.',
        catGrammar: 'Grammatika',
        catVocabulary: 'Lug\'at boyligi',
        catReading: 'O\'qib tushunish',
        catOther: 'Boshqa'
      },
      admin: {
        title: 'Savollarni tahrirlash',
        count: 'Jami savollar soni',
        countSuffix: 'ta',
        reset: 'Asliga qaytarish',
        add: 'Yangi savol qo\'shish',
        tableCategory: 'Yo\'nalish',
        tableLevel: 'Daraja',
        tableQuestion: 'Savol matni',
        tableOptions: 'Variantlar',
        tableActions: 'Amallar',
        modalTitle: 'Yangi savol qo\'shish',
        editModalTitle: 'Savolni tahrirlash',
        categoryLabel: 'Yo\'nalish',
        difficultyLabel: 'Qiyinchilik darajasi',
        passageLabel: 'O\'qish matni',
        questionLabel: 'Savol matni',
        optionA: 'Variant A',
        optionB: 'Variant B',
        optionC: 'Variant C',
        optionD: 'Variant D',
        correctLabel: 'To\'g\'ri javob',
        emptyList: 'Savollar ro\'yxati bo\'sh. Savol qo\'shish uchun "Yangi savol qo\'shish" tugmasini bosing yoki dastlabki holatiga qaytaring.',
        editBtn: 'Tahrirlash',
        deleteBtn: 'O\'chirish',
        deleteConfirm: 'Haqiqatan ham ushbu savolni o\'chirmoqchimisiz?',
        resetConfirm: 'Savollarni dastlabki (default) holatiga qaytarasizmi? Barcha kiritilgan yangi savollar va o\'zgarishlar o\'chib ketadi.',
        catGrammar: 'Grammatika',
        catVocabulary: 'Lug\'at',
        catReading: 'O\'qish',
        passagePrefix: 'Matn'
      },
    },
    en: {
      titles: {
        home: 'LevelX | Premium CEFR English Placement Test',
        auth: 'Login / Sign up - LevelX',
        profile: 'My Profile - LevelX',
        levels: 'CEFR Levels Overview - LevelX',
        stats: 'System Statistics - LevelX',
        test: 'Placement Test - English Test',
        result: 'Test Result - LevelX',
        admin: 'Admin Panel - LevelX',
        lessons: 'Video Lessons - LevelX',
        teachers: 'Teachers - LevelX'
      },
      nav: {
        home: 'Home',
        lessons: 'Lessons',
        teachers: 'Teachers',
        levels: 'Levels',
        stats: 'Statistics',
        admin: 'Admin Panel',
        profile: 'Profile',
        login: 'Login',
        signup: 'Sign up',
        logout: 'Logout'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        startTest: 'Start test',
        exploreLevels: 'Explore levels',
        download: 'Download',
        reset: 'Reset',
        addQuestion: 'Add question',
        actions: 'Actions',
        category: 'Category',
        level: 'Level',
        question: 'Question',
        options: 'Options',
        answer: 'Correct answer',
        current: 'Current',
        answered: 'Answered',
        unanswered: 'Unanswered'
      },
      hero: {
        badge: 'CEFR • 30 min • Instant certificate',
        title: 'Find your true English level in minutes',
        subtitle: 'LevelX offers a calm, premium CEFR placement experience with clear insights and trustworthy results.',
        start: 'Start test',
        levels: 'Explore levels',
        footer: 'All rights reserved'
      },
      auth: {
        loginTab: 'Login',
        signupTab: 'Sign up',
        email: 'Email address',
        password: 'Password',
        firstName: 'First name',
        lastName: 'Last name',
        age: 'Age',
        avatar: 'Profile picture',
        loginButton: 'Log in',
        signupButton: 'Create account',
        noAccount: 'Don\'t have an account?',
        haveAccount: 'Already have an account?',
        loginSuccess: 'Logged in successfully! Redirecting...',
        signupSuccess: 'Account created successfully! Redirecting...',
        passwordShort: 'Password must be at least 6 characters long!',
        loginRedirect: 'Go to profile',
        signupRedirect: 'Go to profile',
        wrongCredentials: 'Invalid email or password!',
        emailTaken: 'An account with this email already exists!',
        notLoggedIn: 'Not logged in!',
        userNotFound: 'User not found!'
      },
      profile: {
        title: 'My profile',
        settings: 'Settings',
        avatar: 'Choose avatar',
        newPassword: 'New password',
        ageLabel: 'Age',
        ageDisplay: 'Age',
        chartTitle: 'Progress chart',
        chartSubtitle: 'Your English level growth over time',
        historyTitle: 'Test history',
        newTest: 'New test',
        noHistory: 'You have not taken a test yet.',
        startTest: 'Start test',
        details: 'Details',
        saveSuccess: 'Profile saved successfully!',
        result: 'Result',
        takenOn: 'Taken on',
        grammar: 'Grammar',
        vocabulary: 'Vocabulary',
        reading: 'Reading',
        chartLoading: 'You need to complete at least one test to see the chart.',
        logoutBtn: 'Logout'
      },
      levels: {
        title: 'CEFR English levels',
        subtitle: 'CEFR is the European framework for language learning, teaching, and assessment, divided into 6 levels.'
      },
      stats: {
        loggedInAs: 'Profile',
        logout: 'Logout',
        loginBtn: 'Login'
      },
      result: {
        title: 'Your English level',
        summary: 'You answered {score} out of {max} questions correctly.',
        breakdown: 'Skill breakdown',
        retake: 'Retake test',
        profile: 'Go to profile',
        download: 'Download certificate',
        recommendations: 'Next steps',
        recommendationsText: 'A personalized development plan for you:',
        downloadLoading: 'Loading...',
        downloadError: 'Failed to generate PDF. Please try again.',
        downloadRetry: 'Library is loading, please try again in a few seconds.'
      },
      test: {
        finish: 'Finish test',
        question: 'Question',
        level: 'Level',
        timeLeft: 'Time left',
        map: 'Question map',
        current: 'Current',
        answered: 'Answered',
        unanswered: 'Unanswered',
        finishModalTitle: 'Finish the test?',
        finishModalText: 'You may have unanswered questions. Do you want to finish the test and calculate the result?',
        cancel: 'Cancel',
        confirmFinish: 'Yes, finish',
        timeUpTitle: 'Time is up!',
        timeUpText: 'The 25-minute testing time has expired. Your results will be calculated automatically.',
        viewResults: 'View results',
        previous: 'Previous',
        next: 'Next',
        notFound: 'Test questions not found! The project is not configured.',
        leaveWarning: 'Are you sure you want to leave? Your answers may be lost.',
        catGrammar: 'Grammar',
        catVocabulary: 'Vocabulary',
        catReading: 'Reading',
        catOther: 'Other'
      },
      admin: {
        title: 'Edit questions',
        count: 'Total questions',
        countSuffix: '',
        reset: 'Reset',
        add: 'Add question',
        tableCategory: 'Category',
        tableLevel: 'Level',
        tableQuestion: 'Question',
        tableOptions: 'Options',
        tableActions: 'Actions',
        modalTitle: 'Add question',
        editModalTitle: 'Edit question',
        categoryLabel: 'Category',
        difficultyLabel: 'Difficulty',
        passageLabel: 'Passage',
        questionLabel: 'Question',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctLabel: 'Correct answer',
        emptyList: 'The question list is empty. Add a question or reset to default.',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        deleteConfirm: 'Are you sure you want to delete this question?',
        resetConfirm: 'Reset questions to default? All new changes will be removed.',
        catGrammar: 'Grammar',
        catVocabulary: 'Vocabulary',
        catReading: 'Reading',
        passagePrefix: 'Passage'
      }
    },
    ru: {
      titles: {
        home: 'LevelX | Premium CEFR English Placement Test',
        auth: 'Вход / Регистрация - LevelX',
        profile: 'Мой профиль - LevelX',
        levels: 'Описание уровней CEFR - LevelX',
        stats: 'Статистика системы - LevelX',
        test: 'Тест на placement - English Test',
        result: 'Результат теста - LevelX',
        admin: 'Панель администратора - LevelX',
        lessons: 'Видеоуроки - LevelX',
        teachers: 'Преподаватели - LevelX'
      },
      nav: {
        home: 'Главная',
        lessons: 'Уроки',
        teachers: 'Преподаватели',
        levels: 'Уровни',
        stats: 'Статистика',
        admin: 'Панель администратора',
        profile: 'Профиль',
        login: 'Войти',
        signup: 'Регистрация',
        logout: 'Выйти'
      },
      common: {
        save: 'Сохранить',
        cancel: 'Отмена',
        next: 'Далее',
        previous: 'Назад',
        finish: 'Завершить',
        startTest: 'Начать тест',
        exploreLevels: 'Изучить уровни',
        download: 'Скачать',
        reset: 'Сбросить',
        addQuestion: 'Добавить вопрос',
        actions: 'Действия',
        category: 'Категория',
        level: 'Уровень',
        question: 'Вопрос',
        options: 'Варианты',
        answer: 'Правильный ответ',
        current: 'Текущий',
        answered: 'Отвечено',
        unanswered: 'Не отвечено'
      },
      hero: {
        badge: 'CEFR • 30 мин • Сертификат сразу',
        title: 'Узнайте свой уровень английского за минуты',
        subtitle: 'LevelX — спокойный премиальный опыт CEFR с понятной аналитикой и надежными результатами.',
        start: 'Начать тест',
        levels: 'Изучить уровни',
        footer: 'Все права защищены'
      },
      auth: {
        loginTab: 'Войти',
        signupTab: 'Регистрация',
        email: 'Email адрес',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        age: 'Возраст',
        avatar: 'Аватар',
        loginButton: 'Войти',
        signupButton: 'Зарегистрироваться',
        noAccount: 'Нет аккаунта?',
        haveAccount: 'Уже есть аккаунт?',
        loginSuccess: 'Успешный вход! Перенаправление...',
        signupSuccess: 'Аккаунт успешно создан! Перенаправление...',
        passwordShort: 'Пароль должен содержать минимум 6 символов!',
        loginRedirect: 'Перейти в профиль',
        signupRedirect: 'Перейти в профиль',
        wrongCredentials: 'Неверный email или пароль!',
        emailTaken: 'Аккаунт с таким email уже существует!',
        notLoggedIn: 'Вы не вошли в систему!',
        userNotFound: 'Пользователь не найден!'
      },
      profile: {
        title: 'Мой профиль',
        settings: 'Настройки',
        avatar: 'Выберите аватар',
        newPassword: 'Новый пароль',
        ageLabel: 'Возраст',
        ageDisplay: 'Возраст',
        chartTitle: 'График прогресса',
        chartSubtitle: 'Рост вашего уровня английского со временем',
        historyTitle: 'История тестов',
        newTest: 'Новый тест',
        noHistory: 'Вы ещё не прошли тест.',
        startTest: 'Начать тест',
        details: 'Подробнее',
        saveSuccess: 'Профиль успешно сохранён!',
        result: 'Результат',
        takenOn: 'Проходил',
        grammar: 'Грамматика',
        vocabulary: 'Словарь',
        reading: 'Чтение',
        chartLoading: 'Вам нужно пройти хотя бы один тест, чтобы увидеть график.',
        logoutBtn: 'Выйти'
      },
      levels: {
        title: 'Уровни английского по CEFR',
        subtitle: 'CEFR — это европейская система оценки языковых навыков, разделённая на 6 уровней.'
      },
      stats: {
        loggedInAs: 'Профиль',
        logout: 'Выйти',
        loginBtn: 'Войти'
      },
      result: {
        title: 'Ваш уровень английского',
        summary: 'Вы ответили правильно на {score} из {max} вопросов.',
        breakdown: 'Разбор навыков',
        retake: 'Пройти заново',
        profile: 'Перейти в профиль',
        download: 'Скачать сертификат',
        recommendations: 'Следующие шаги',
        recommendationsText: 'Персональный план развития:',
        downloadLoading: 'Загрузка...',
        downloadError: 'Ошибка создания PDF. Попробуйте ещё раз.',
        downloadRetry: 'Библиотека загружается, попробуйте через несколько секунд.'
      },
      test: {
        finish: 'Завершить тест',
        question: 'Вопрос',
        level: 'Уровень',
        timeLeft: 'Осталось времени',
        map: 'Карта вопросов',
        current: 'Текущий',
        answered: 'Отвечено',
        unanswered: 'Не отвечено',
        finishModalTitle: 'Завершить тест?',
        finishModalText: 'У вас могут быть неотвеченные вопросы. Вы хотите завершить тест и рассчитать результат?',
        cancel: 'Отмена',
        confirmFinish: 'Да, завершить',
        timeUpTitle: 'Время вышло!',
        timeUpText: 'Отведённое на тест 25 минут истекло. Ваш результат будет рассчитан автоматически.',
        viewResults: 'Посмотреть результат',
        previous: 'Назад',
        next: 'Далее',
        notFound: 'Вопросы теста не найдены! Проект не настроен.',
        leaveWarning: 'Вы уверены, что хотите покинуть страницу? Ваши ответы могут быть потеряны.',
        catGrammar: 'Грамматика',
        catVocabulary: 'Словарь',
        catReading: 'Чтение',
        catOther: 'Другое'
      },
      admin: {
        title: 'Редактировать вопросы',
        count: 'Всего вопросов',
        countSuffix: '',
        reset: 'Сбросить',
        add: 'Добавить вопрос',
        tableCategory: 'Категория',
        tableLevel: 'Уровень',
        tableQuestion: 'Вопрос',
        tableOptions: 'Варианты',
        tableActions: 'Действия',
        modalTitle: 'Добавить вопрос',
        editModalTitle: 'Редактировать вопрос',
        categoryLabel: 'Категория',
        difficultyLabel: 'Сложность',
        passageLabel: 'Текст для чтения',
        questionLabel: 'Текст вопроса',
        optionA: 'Вариант A',
        optionB: 'Вариант B',
        optionC: 'Вариант C',
        optionD: 'Вариант D',
        correctLabel: 'Правильный ответ',
        emptyList: 'Список вопросов пуст. Добавьте вопрос или вернитесь к стандартным.',
        editBtn: 'Изменить',
        deleteBtn: 'Удалить',
        deleteConfirm: 'Вы уверены, что хотите удалить этот вопрос?',
        resetConfirm: 'Сбросить вопросы к стандартным? Все новые изменения будут удалены.',
        catGrammar: 'Грамматика',
        catVocabulary: 'Словарь',
        catReading: 'Чтение',
        passagePrefix: 'Текст'
      }
    }
  };

  let currentLanguage = localStorage.getItem('levelx_lang') || 'uz';

  function getLanguage() { return currentLanguage; }

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('levelx_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    applyTranslations();
    updateSwitcher();
  }

  function t(path) {
    const segments = path.split('.');
    let value = translations[currentLanguage];
    for (const segment of segments) {
      if (!value || typeof value !== 'object') return path;
      value = value[segment];
    }
    return typeof value === 'string' ? value : path;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const text = t(key);
      if (text) element.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.getAttribute('data-i18n-placeholder');
      const text = t(key);
      if (text) element.placeholder = text;
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.getAttribute('data-i18n-title');
      const text = t(key);
      if (text) element.title = text;
    });

    const titleKey = document.documentElement.getAttribute('data-page-title');
    if (titleKey) {
      document.title = t(titleKey);
    }
  }

  function updateSwitcher() {
    document.querySelectorAll('[data-lang-switcher] .lang-btn').forEach((button) => {
      const isActive = button.getAttribute('data-lang') === currentLanguage;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);

    document.querySelectorAll('[data-lang-switcher] .lang-btn').forEach((button) => {
      button.addEventListener('click', () => setLanguage(button.getAttribute('data-lang')));
    });
  });

  window.i18n = { getLanguage, setLanguage, t };
})();
