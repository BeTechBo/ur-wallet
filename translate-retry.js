// Map Arabic book names to English for the bible-api
const bookMap = {
  "مزمور": "Psalm",
  "مز": "Psalm",
  "فيلبي": "Philippians",
  "رومية": "Romans",
  "إر": "Jeremiah",
  "إرميا": "Jeremiah",
  "مر": "Mark",
  "مرقس": "Mark",
  "مت": "Matthew",
  "متى": "Matthew",
  "يو": "John",
  "يوحنا": "John",
  "يُوحَنَّا": "John",
  "١ يوحنا": "1 John",
  "1 يوحنا": "1 John",
  "٢ يوحنا": "2 John",
  "2 يوحنا": "2 John",
  "٣ يوحنا": "3 John",
  "3 يوحنا": "3 John",
  "رو": "Romans",
  "1 كو": "1 Corinthians",
  "١ كورنثوس": "1 Corinthians",
  "كُورِنْثُوسَ ٱلْأُولَى": "1 Corinthians",
  "كُورِنْثُوسَ ٱلأُولَى": "1 Corinthians",
  "كو": "Colossians",
  "كولوسي": "Colossians",
  "2 كو": "2 Corinthians",
  "٢ كورنثوس": "2 Corinthians",
  "كُورِنْثُوسَ ٱلثَّانِيَةُ": "2 Corinthians",
  "غل": "Galatians",
  "غلاطية": "Galatians",
  "أف": "Ephesians",
  "أفسس": "Ephesians",
  "أَفَسُسَ": "Ephesians",
  "في": "Philippians",
  "1 تس": "1 Thessalonians",
  "١ تسالونيكي": "1 Thessalonians",
  "2 تس": "2 Thessalonians",
  "٢ تسالونيكي": "2 Thessalonians",
  "1 تي": "1 Timothy",
  "١ تيموثاوس": "1 Timothy",
  "2 تي": "2 Timothy",
  "٢ تيموثاوس": "2 Timothy",
  "تي": "Titus",
  "تيطس": "Titus",
  "فل": "Philemon",
  "فليمون": "Philemon",
  "عب": "Hebrews",
  "عبرانيين": "Hebrews",
  "يع": "James",
  "يعقوب": "James",
  "1 بط": "1 Peter",
  "١ بطرس": "1 Peter",
  "بطرس الأُولَى": "1 Peter",
  "رسالة بطرس الأولى": "1 Peter",
  "2 بط": "2 Peter",
  "٢ بطرس": "2 Peter",
  "يه": "Jude",
  "يهوذا": "Jude",
  "رؤ": "Revelation",
  "رؤيا": "Revelation",
  "تك": "Genesis",
  "تكوين": "Genesis",
  "خر": "Exodus",
  "خروج": "Exodus",
  "لا": "Leviticus",
  "لاويين": "Leviticus",
  "عد": "Numbers",
  "العدد": "Numbers",
  "تث": "Deuteronomy",
  "تثنية": "Deuteronomy",
  "يش": "Joshua",
  "يشوع": "Joshua",
  "يشوع بن سيراخ": "Sirach", // Or Ecclesiasticus
  "قض": "Judges",
  "قضاة": "Judges",
  "را": "Ruth",
  "راعوث": "Ruth",
  "1 صم": "1 Samuel",
  "١ صموئيل": "1 Samuel",
  "2 صم": "2 Samuel",
  "٢ صموئيل": "2 Samuel",
  "1 مل": "1 Kings",
  "١ ملوك": "1 Kings",
  "2 مل": "2 Kings",
  "٢ ملوك": "2 Kings",
  "1 اخ": "1 Chronicles",
  "١ أخبار": "1 Chronicles",
  "2 اخ": "2 Chronicles",
  "٢ أخبار": "2 Chronicles",
  "عز": "Ezra",
  "عزرا": "Ezra",
  "نح": "Nehemiah",
  "نحميا": "Nehemiah",
  "اس": "Esther",
  "أستير": "Esther",
  "اي": "Job",
  "أيوب": "Job",
  "ام": "Proverbs",
  "أم": "Proverbs",
  "أمثال": "Proverbs",
  "جا": "Ecclesiastes",
  "الجامعة": "Ecclesiastes",
  "جامعة": "Ecclesiastes",
  "نش": "Song of Solomon",
  "نشيد": "Song of Solomon",
  "اش": "Isaiah",
  "إشعياء": "Isaiah",
  "إش": "Isaiah",
  "مراثي": "Lamentations",
  "حز": "Ezekiel",
  "حزقيال": "Ezekiel",
  "دا": "Daniel",
  "دانيال": "Daniel",
  "هو": "Hosea",
  "هوشع": "Hosea",
  "يؤ": "Joel",
  "يوئيل": "Joel",
  "عا": "Amos",
  "عاموس": "Amos",
  "عو": "Obadiah",
  "عوبديا": "Obadiah",
  "يون": "Jonah",
  "يونان": "Jonah",
  "مي": "Micah",
  "ميخا": "Micah",
  "نا": "Nahum",
  "ناحوم": "Nahum",
  "حب": "Habakkuk",
  "حبقوق": "Habakkuk",
  "صف": "Zephaniah",
  "صفنيا": "Zephaniah",
  "حج": "Haggai",
  "حجي": "Haggai",
  "زك": "Zechariah",
  "زكريا": "Zechariah",
  "ملا": "Malachi",
  "ملاخي": "Malachi",
  "لو": "Luke",
  "لوقا": "Luke",
  "إرْمِيَا": "Jeremiah"
};

const TRANSLATION = "web";

function parseArabicReference(arabicRef) {
  let cleanRef = arabicRef.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '').replace(/[\*\(\)]/g, '').trim();
  
  const match = cleanRef.match(/^([^\d:]*[^\d:\s])\s*(\d+)\s*[:\u061B]\s*([\d-]+)$/) || 
                cleanRef.match(/^([\d١٢٣123]+\s+[^\d:]*[^\d:\s])\s*(\d+)\s*[:\u061B]\s*([\d-]+)$/) ||
                cleanRef.match(/^(.+?)\s+(\d+)\s*[:\u061B]\s*([\d-]+)$/);
                
  if (!match) {
    const reverseMatch = cleanRef.match(/^([^\d:]*[^\d:\s])\s*(\d+)\s*[:\u061B]\s*(\d+)$/);
    if (reverseMatch) {
        return {
           bookRaw: reverseMatch[1].trim(),
           chapter: reverseMatch[2],
           verse: reverseMatch[3]
        };
    }
    
    // Check for weird formats like "أَمْثَالٌ 34 : 13"
    const spacesMatch = cleanRef.match(/^(.+?)\s+(\d+)\s*[:\u061B\?]\s*\??(\d+)\??$/);
    if (spacesMatch) {
        return { bookRaw: spacesMatch[1].trim(), chapter: spacesMatch[2], verse: spacesMatch[3] };
    }
    
    return null;
  }
  
  let bookRaw = match[1].trim();
  let chapter = match[2];
  let verse = match[3];
  
  if (parseInt(chapter) > 150) {
      const temp = chapter;
      chapter = verse;
      verse = temp;
  }

  return { bookRaw, chapter, verse };
}

async function fetchEnglishVerse(arabicRef) {
  const parsed = parseArabicReference(arabicRef);
  if (!parsed) return { error: `Could not parse reference: ${arabicRef}` };
  
  let englishBook = bookMap[parsed.bookRaw];
  if (!englishBook) {
    for (const [ar, en] of Object.entries(bookMap)) {
      if (parsed.bookRaw.includes(ar) || ar.includes(parsed.bookRaw)) {
        englishBook = en;
        break;
      }
    }
  }
  
  if (!englishBook) return { error: `Could not find English book for: ${parsed.bookRaw}`, parsed };
  
  // RTL swaps
  if (englishBook === 'Ephesians' && parsed.chapter === '32' && parsed.verse === '4') { parsed.chapter = '4'; parsed.verse = '32'; }
  if (englishBook === 'John' && parsed.chapter === '34' && parsed.verse === '13') { parsed.chapter = '13'; parsed.verse = '34'; }
  if (englishBook === '1 Corinthians' && parsed.chapter === '13' && parsed.verse === '10') { parsed.chapter = '10'; parsed.verse = '13'; }
  
  const englishRef = `${englishBook} ${parsed.chapter}:${parsed.verse}`;
  
  try {
    const url = `https://bible-api.com/${encodeURIComponent(englishRef)}?translation=${TRANSLATION}`;
    const response = await fetch(url);
    if (!response.ok) {
      const altRef = `${englishBook} ${parsed.verse}:${parsed.chapter}`;
      const altUrl = `https://bible-api.com/${encodeURIComponent(altRef)}?translation=${TRANSLATION}`;
      const altResponse = await fetch(altUrl);
      if (altResponse.ok) {
         const data = await altResponse.json();
         return { text: data.text.trim(), reference: data.reference };
      }
      return { error: `API error for ${englishRef}` };
    }
    const data = await response.json();
    return { text: data.text.trim().replace(/\n/g, ' '), reference: data.reference };
  } catch (err) {
    return { error: `Fetch error: ${err.message}` };
  }
}

async function run() {
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('verses_with_english.json', 'utf8'));
  
  const missing = data.filter(v => !v.english_text);
  console.log(`Need to translate ${missing.length} verses...\n`);
  
  let changed = false;
  
  for (let i = 0; i < data.length; i++) {
    const verse = data[i];
    if (verse.english_text) continue; // Skip already translated
    
    process.stdout.write(`Fetching ${verse.reference}... `);
    
    let success = false;
    let attempts = 0;
    while (!success && attempts < 5) {
        attempts++;
        const english = await fetchEnglishVerse(verse.reference);
        if (english.error) {
            if (english.error.includes("429") || english.error.includes("fetch")) {
                process.stdout.write(`Wait (att ${attempts})... `);
                await new Promise(r => setTimeout(r, 3000)); // Wait 3s on rate limit
            } else {
                console.log(`FAILED: ${english.error}`);
                success = true; // Stop trying
            }
        } else {
            console.log(`OK -> ${english.reference}`);
            data[i].english_text = english.text;
            data[i].english_reference = english.reference;
            changed = true;
            success = true;
        }
    }
    
    await new Promise(r => setTimeout(r, 1500)); // Respect API rate limit heavily
  }
  
  if (changed) {
      fs.writeFileSync('verses_with_english.json', JSON.stringify(data, null, 2));
      fs.writeFileSync('src/lib/verses-en.ts', `export const versesData = ${JSON.stringify(data, null, 2)};`);
      console.log('Saved translations.');
  }
}

run();
