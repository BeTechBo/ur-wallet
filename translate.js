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
  "كو": "Colossians",
  "كولوسي": "Colossians",
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
};

// Map of translations to try (KJV, ASV, WEB) - WEB is modern and public domain
const TRANSLATION = "web";

function parseArabicReference(arabicRef) {
  // Try to extract book name and chapter/verse
  // e.g., "يوحنا 3: 16" or "يو 3: 16"
  // e.g., "١ يوحنا 3: 16"
  
  // Clean the reference
  let cleanRef = arabicRef.replace(/[()]/g, '').trim();
  
  // Try to find the last space which usually separates book from numbers
  // But wait, "1 يوحنا 3: 16" has spaces in book name.
  // Let's use regex to separate words from numbers
  
  const match = cleanRef.match(/^([^\d:]*[^\d:\s])\s*(\d+)\s*:\s*([\d-]+)$/) || 
                cleanRef.match(/^([\d١٢٣123]+\s+[^\d:]*[^\d:\s])\s*(\d+)\s*:\s*([\d-]+)$/) ||
                cleanRef.match(/^(.+?)\s+(\d+)\s*:\s*([\d-]+)$/);
                
  if (!match) {
    // Special handling for cases like "أَفَسُسَ 32:4" (Sometimes RTL text gets flipped)
    const reverseMatch = cleanRef.match(/^([^\d:]*[^\d:\s])\s*(\d+)\s*:\s*(\d+)$/);
    if (reverseMatch) {
        return {
           bookRaw: reverseMatch[1].trim(),
           chapter: reverseMatch[2],
           verse: reverseMatch[3]
        };
    }
    return null;
  }
  
  let bookRaw = match[1].trim();
  
  // Fix RTL artifacts and normalize
  bookRaw = bookRaw.replace(/[^\u0600-\u06FF0-9\s]/g, '').trim();
  
  let chapter = match[2];
  let verse = match[3];
  
  // Sometimes due to RTL, chapter and verse are swapped in string representation (like 32:4 instead of 4:32)
  if (parseInt(chapter) > 150) {
      // Unlikely to be a chapter
      const temp = chapter;
      chapter = verse;
      verse = temp;
  }

  return { bookRaw, chapter, verse };
}

async function fetchEnglishVerse(arabicRef) {
  const parsed = parseArabicReference(arabicRef);
  
  if (!parsed) {
    return { error: `Could not parse reference: ${arabicRef}` };
  }
  
  // Try to find the English book name
  let englishBook = bookMap[parsed.bookRaw];
  
  if (!englishBook) {
    // Try fuzzy match
    for (const [ar, en] of Object.entries(bookMap)) {
      if (parsed.bookRaw.includes(ar) || ar.includes(parsed.bookRaw)) {
        englishBook = en;
        break;
      }
    }
  }
  
  if (!englishBook) {
    return { error: `Could not find English book for: ${parsed.bookRaw}`, parsed };
  }
  
  // Special fix for Ephesians 4:32 which was written as 32:4
  if (englishBook === 'Ephesians' && parsed.chapter === '32' && parsed.verse === '4') {
     parsed.chapter = '4';
     parsed.verse = '32';
  }
  
  const englishRef = `${englishBook} ${parsed.chapter}:${parsed.verse}`;
  
  try {
    const url = `https://bible-api.com/${encodeURIComponent(englishRef)}?translation=${TRANSLATION}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      // Try again by flipping chapter and verse (common RTL issue)
      const altRef = `${englishBook} ${parsed.verse}:${parsed.chapter}`;
      const altUrl = `https://bible-api.com/${encodeURIComponent(altRef)}?translation=${TRANSLATION}`;
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
         const data = await altResponse.json();
         return {
            text: data.text.trim(),
            reference: data.reference,
            flipped: true
         };
      }
      
      return { error: `API error for ${englishRef}: ${response.status}` };
    }
    
    const data = await response.json();
    return {
      text: data.text.trim().replace(/\n/g, ' '),
      reference: data.reference
    };
  } catch (err) {
    return { error: `Fetch error: ${err.message}` };
  }
}

async function run() {
  const { versesData } = require('./src/lib/verses.ts');
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  console.log(`Starting translation for ${versesData.length} verses...\n`);
  
  for (const verse of versesData) {
    console.log(`Processing [${verse.id}]: ${verse.reference}`);
    const english = await fetchEnglishVerse(verse.reference);
    
    if (english.error) {
      console.log(`❌ ERROR: ${english.error}`);
      console.log(`   Raw: ${verse.reference}`);
      failCount++;
      results.push({ ...verse, english_text: "", english_reference: "" });
    } else {
      console.log(`✅ SUCCESS: ${english.reference}`);
      console.log(`   ${english.text.substring(0, 50)}...`);
      successCount++;
      results.push({ 
        ...verse, 
        english_text: english.text, 
        english_reference: english.reference 
      });
    }
    
    // Add small delay to respect API limits
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nFinished! Success: ${successCount}, Fail: ${failCount}`);
  
  // Write to a temporary file
  const fs = require('fs');
  fs.writeFileSync('verses_with_english.json', JSON.stringify(results, null, 2));
  console.log('Saved to verses_with_english.json');
}

run();
