/**
 * Generate library.json from downloads/ folder structure
 * Run: node scripts/generate-library.js
 */

const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = path.join(__dirname, '../assets/downloads');
const OUTPUT_FILE = path.join(__dirname, '../assets/content/library.json');

const GRADE_NAMES = {
  '7': 'هفتم',
  '8': 'هشتم',
  '9': 'نهم'
};

const SUBJECT_MAPPING = {
  'بیولوژی': 'زیست',
  'زیست': 'زیست',
  'فیزیک': 'فیزیک',
  'شیمی': 'شیمی',
  'ریاضی': 'ریاضی',
  'علوم': 'عمومی'
};

/**
 * Extract metadata from filename
 */
function parseFilename(filename) {
  const nameWithoutExt = filename.replace('.pdf', '');
  
  // Try to match patterns like "روبیک جامع هفتم - فصل (1)"
  const chapterMatch = nameWithoutExt.match(/فصل\s*\(\s*(\d+)\s*\)/);
  const chapterNum = chapterMatch ? chapterMatch[1] : null;
  
  return {
    name: filename,
    title: nameWithoutExt,
    chapter: chapterNum,
    isWorksheet: filename.includes('کاربرگ'),
    isSummary: filename.includes('روبیک') || filename.includes('جامع')
  };
}

/**
 * Generate library structure from downloads
 */
function generateLibrary() {
  const library = {
    videos: [],
    notes: []
  };
  
  // Read grades
  const grades = fs.readdirSync(DOWNLOADS_DIR).filter(f => {
    return fs.statSync(path.join(DOWNLOADS_DIR, f)).isDirectory();
  }).sort();
  
  let fileId = 1;
  
  grades.forEach(grade => {
    const gradeDir = path.join(DOWNLOADS_DIR, grade);
    const chapters = fs.readdirSync(gradeDir).filter(f => {
      return fs.statSync(path.join(gradeDir, f)).isDirectory();
    }).sort((a, b) => parseInt(a) - parseInt(b));
    
    chapters.forEach(chapter => {
      const chapterDir = path.join(gradeDir, chapter);
      const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.pdf'));
      
      files.forEach(file => {
        const metadata = parseFilename(file);
        const relativePath = `assets/downloads/${grade}/${chapter}/${file}`;
        const id = `note-${grade}-${chapter}-${fileId}`;
        
        const note = {
          id: id,
          title: metadata.title,
          summary: `مطالب درسی فصل ${chapter} پایه ${GRADE_NAMES[grade]}`,
          grade: grade,
          topic: 'عمومی',
          pages: 'PDF',
          level: metadata.isWorksheet ? 'تمرینی' : 'مفاهیمی',
          file: relativePath
        };
        
        library.notes.push(note);
        fileId++;
      });
    });
  });
  
  return library;
}

/**
 * Read existing library.json and merge with new data
 * Preserves videos and merges notes intelligently
 */
function mergeLibraries(existingPath, newLibrary) {
  let existing = { videos: [], notes: [] };
  
  if (fs.existsSync(existingPath)) {
    try {
      const content = fs.readFileSync(existingPath, 'utf8');
      const parsed = JSON.parse(content);
      existing = parsed;
      console.log(`📖 Found existing library with ${(existing.videos || []).length} videos`);
    } catch (e) {
      console.warn('⚠️  Could not parse existing library.json, will create new one');
      console.warn(`   Error: ${e.message}`);
    }
  } else {
    console.warn('⚠️  No existing library.json found, creating new one');
  }
  
  // Keep videos as-is (they're manually curated), use new notes
  const result = {
    videos: existing.videos || [],
    notes: newLibrary.notes
  };
  
  return result;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🔍 Scanning downloads directory...');
    const newLibrary = generateLibrary();
    
    console.log(`📝 Found ${newLibrary.notes.length} note files`);
    
    const finalLibrary = mergeLibraries(OUTPUT_FILE, newLibrary);
    
    // Write with pretty formatting
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(finalLibrary, null, 2) + '\n',
      'utf8'
    );
    
    console.log(`✅ Successfully generated library.json`);
    console.log(`   - Videos: ${finalLibrary.videos.length}`);
    console.log(`   - Notes: ${finalLibrary.notes.length}`);
    console.log(`   File: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('❌ Error generating library:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
