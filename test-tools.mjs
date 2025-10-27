#!/usr/bin/env node

/**
 * Tool Logic Test - Tests all astrology functions
 */

import { 
  get_daily_horoscope,
  get_lucky_number_and_color,
  check_love_compatibility,
  get_love_advice,
  get_career_prediction,
  get_best_career_matches
} from './lib/tools/tool-logic.ts';

console.log('🧪 Testing GemiVoiceAstro Tool Functions\n');
console.log('═══════════════════════════════════════════════════════\n');

let testsPassed = 0;
let testsFailed = 0;

function testFunction(name, fn, args, expectedKeys) {
  try {
    console.log(`Testing: ${name}`);
    const result = fn(args);
    
    // Check if error
    if (result.error) {
      console.log(`  ✗ Error: ${result.error}`);
      testsFailed++;
      return;
    }
    
    // Check expected keys
    const missingKeys = expectedKeys.filter(key => !(key in result));
    if (missingKeys.length > 0) {
      console.log(`  ✗ Missing keys: ${missingKeys.join(', ')}`);
      testsFailed++;
      return;
    }
    
    console.log(`  ✓ Passed`);
    console.log(`  Result: ${JSON.stringify(result, null, 2).substring(0, 100)}...`);
    testsPassed++;
  } catch (error) {
    console.log(`  ✗ Exception: ${error.message}`);
    testsFailed++;
  }
  console.log();
}

// Test 1: Daily Horoscope (Thai name)
testFunction(
  'get_daily_horoscope (ราศีเมษ)',
  get_daily_horoscope,
  { zodiac_sign: 'ราศีเมษ' },
  ['ราศี', 'ภาพรวมวันนี้', 'ลักษณะนิสัย', 'คำแนะนำพิเศษ']
);

// Test 2: Daily Horoscope (English name)
testFunction(
  'get_daily_horoscope (Taurus)',
  get_daily_horoscope,
  { zodiac_sign: 'Taurus' },
  ['ราศี', 'ภาพรวมวันนี้', 'ลักษณะนิสัย', 'คำแนะนำพิเศษ']
);

// Test 3: Lucky Number and Color
testFunction(
  'get_lucky_number_and_color (Gemini)',
  get_lucky_number_and_color,
  { zodiac_sign: 'Gemini' },
  ['ราศี', 'เลขนำโชค', 'สีมงคล', 'อัญมณีเสริมดวง', 'เครื่องราง']
);

// Test 4: Love Compatibility
testFunction(
  'check_love_compatibility (Leo + Sagittarius)',
  check_love_compatibility,
  { zodiac_sign_1: 'Leo', zodiac_sign_2: 'Sagittarius' },
  ['คู่ราศี', 'ความเข้ากันได้', 'ลักษณะของราศีที่หนึ่ง', 'ลักษณะของราศีที่สอง']
);

// Test 5: Love Compatibility (incompatible)
testFunction(
  'check_love_compatibility (Virgo + Aries)',
  check_love_compatibility,
  { zodiac_sign_1: 'Virgo', zodiac_sign_2: 'Aries' },
  ['คู่ราศี', 'ความเข้ากันได้', 'ลักษณะของราศีที่หนึ่ง', 'ลักษณะของราศีที่สอง']
);

// Test 6: Love Advice (single)
testFunction(
  'get_love_advice (Cancer, โสด)',
  get_love_advice,
  { zodiac_sign: 'Cancer', relationship_status: 'โสด' },
  ['ราศี', 'สถานะ', 'คำแนะนำความรัก']
);

// Test 7: Love Advice (in relationship)
testFunction(
  'get_love_advice (Libra, มีแฟน)',
  get_love_advice,
  { zodiac_sign: 'Libra', relationship_status: 'มีแฟน' },
  ['ราศี', 'สถานะ', 'คำแนะนำความรัก']
);

// Test 8: Career Prediction
testFunction(
  'get_career_prediction (Scorpio)',
  get_career_prediction,
  { zodiac_sign: 'Scorpio' },
  ['ราศี', 'ภาพรวมการงาน', 'คำแนะนำด้านการเงิน']
);

// Test 9: Best Career Matches
testFunction(
  'get_best_career_matches (Capricorn)',
  get_best_career_matches,
  { zodiac_sign: 'Capricorn' },
  ['ราศี', 'อาชีพที่เหมาะสม', 'จุดแข็ง']
);

// Test 10: Invalid zodiac sign (error handling)
console.log('Testing: get_daily_horoscope (Invalid Sign)');
const errorResult = get_daily_horoscope({ zodiac_sign: 'InvalidSign' });
if (errorResult.error) {
  console.log('  ✓ Error handling works correctly');
  console.log(`  Error message: ${errorResult.error}`);
  testsPassed++;
} else {
  console.log('  ✗ Should have returned an error');
  testsFailed++;
}
console.log();

// Test 11: Test all 12 zodiac signs
console.log('Testing: All 12 zodiac signs can be found');
const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
               'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
let allSignsWork = true;
for (const sign of signs) {
  const result = get_daily_horoscope({ zodiac_sign: sign });
  if (result.error) {
    console.log(`  ✗ Failed for ${sign}: ${result.error}`);
    allSignsWork = false;
  }
}
if (allSignsWork) {
  console.log('  ✓ All 12 zodiac signs work correctly');
  testsPassed++;
} else {
  testsFailed++;
}
console.log();

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log('═══════════════════════════════════════════════════════');

if (testsFailed === 0) {
  console.log('\n🎉 All tool function tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.');
  process.exit(1);
}
