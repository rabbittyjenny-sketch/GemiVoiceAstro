#!/usr/bin/env node

/**
 * Integration Test - Verifies app structure and components
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Running Integration Tests\n');
console.log('═══════════════════════════════════════════════════════\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    console.log(`Testing: ${name}`);
    fn();
    console.log('  ✓ Passed\n');
    testsPassed++;
  } catch (error) {
    console.log(`  ✗ Failed: ${error.message}\n`);
    testsFailed++;
  }
}

// Test 1: Check if all main components exist
test('Main React components exist', () => {
  const components = [
    'App.tsx',
    'index.tsx',
    'components/Header.tsx',
    'components/Sidebar.tsx',
    'components/console/control-tray/ControlTray.tsx',
    'components/demo/streaming-console/StreamingConsole.tsx',
    'components/demo/ErrorScreen.tsx',
  ];
  
  for (const component of components) {
    const path = join(__dirname, component);
    if (!existsSync(path)) {
      throw new Error(`Component not found: ${component}`);
    }
  }
});

// Test 2: Check if contexts are properly set up
test('React contexts are defined', () => {
  const contextPath = join(__dirname, 'contexts/LiveAPIContext.tsx');
  if (!existsSync(contextPath)) {
    throw new Error('LiveAPIContext not found');
  }
  
  const content = readFileSync(contextPath, 'utf8');
  if (!content.includes('LiveAPIProvider') || !content.includes('useLiveAPIContext')) {
    throw new Error('LiveAPIContext is missing required exports');
  }
});

// Test 3: Check if hooks are defined
test('Custom hooks are defined', () => {
  const hookPath = join(__dirname, 'hooks/media/use-live-api.ts');
  if (!existsSync(hookPath)) {
    throw new Error('use-live-api hook not found');
  }
  
  const content = readFileSync(hookPath, 'utf8');
  if (!content.includes('useLiveApi')) {
    throw new Error('useLiveApi hook is missing');
  }
});

// Test 4: Check if state management is set up
test('State management (Zustand) is configured', () => {
  const statePath = join(__dirname, 'lib/state.ts');
  if (!existsSync(statePath)) {
    throw new Error('State file not found');
  }
  
  const content = readFileSync(statePath, 'utf8');
  const requiredStores = ['useSettings', 'useUI', 'useUserData', 'useTools', 'useLogStore'];
  
  for (const store of requiredStores) {
    if (!content.includes(store)) {
      throw new Error(`Store not found: ${store}`);
    }
  }
});

// Test 5: Check if all tool modules are connected
test('Tool modules are properly imported in state', () => {
  const statePath = join(__dirname, 'lib/state.ts');
  const content = readFileSync(statePath, 'utf8');
  
  const requiredImports = [
    'dailyHoroscopeTools',
    'loveReadingTools',
    'careerForecastTools'
  ];
  
  for (const imp of requiredImports) {
    if (!content.includes(imp)) {
      throw new Error(`Import not found: ${imp}`);
    }
  }
});

// Test 6: Check if templates are configured
test('Templates are properly configured', () => {
  const statePath = join(__dirname, 'lib/state.ts');
  const content = readFileSync(statePath, 'utf8');
  
  const templates = ['daily-horoscope', 'love-reading', 'career-forecast'];
  
  for (const template of templates) {
    if (!content.includes(`'${template}'`)) {
      throw new Error(`Template not found: ${template}`);
    }
  }
});

// Test 7: Check if Vite config is valid
test('Vite configuration is valid', () => {
  const vitePath = join(__dirname, 'vite.config.ts');
  const content = readFileSync(vitePath, 'utf8');
  
  // Check for required configurations
  if (!content.includes('defineConfig')) {
    throw new Error('Vite config missing defineConfig');
  }
  
  if (!content.includes('GEMINI_API_KEY')) {
    throw new Error('Vite config missing GEMINI_API_KEY environment variable');
  }
  
  if (!content.includes('port: 3000')) {
    throw new Error('Vite config missing port configuration');
  }
});

// Test 8: Check if TypeScript config is valid
test('TypeScript configuration is valid', () => {
  const tsconfigPath = join(__dirname, 'tsconfig.json');
  const content = readFileSync(tsconfigPath, 'utf8');
  const config = JSON.parse(content);
  
  if (!config.compilerOptions) {
    throw new Error('TypeScript config missing compilerOptions');
  }
});

// Test 9: Check if index.html is properly configured
test('index.html is properly configured', () => {
  const htmlPath = join(__dirname, 'index.html');
  const content = readFileSync(htmlPath, 'utf8');
  
  if (!content.includes('AI โหราศาสตร์')) {
    throw new Error('index.html missing Thai title');
  }
  
  if (!content.includes('index.tsx')) {
    throw new Error('index.html missing script reference to index.tsx');
  }
});

// Test 10: Check if CSS exists
test('CSS file exists', () => {
  const cssPath = join(__dirname, 'index.css');
  if (!existsSync(cssPath)) {
    throw new Error('index.css not found');
  }
});

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log('═══════════════════════════════════════════════════════');

if (testsFailed === 0) {
  console.log('\n🎉 All integration tests passed!');
  console.log('✓ App structure is correct');
  console.log('✓ All components are in place');
  console.log('✓ Configuration is valid');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.');
  process.exit(1);
}
