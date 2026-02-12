export const translate = (text, lang) => {
    // Placeholder for 9 languages
    const translations = {
        'es': 'Hola',
        'fr': 'Bonjour'
    };
    return translations[lang] || text;
};
