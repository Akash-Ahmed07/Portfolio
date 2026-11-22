import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CERTIFICATE_ASSET_PATH,
  CONTACT_PRESETS,
  EDUCATION,
  PROFILE,
  PROFILE_PHOTO,
  PROJECTS,
  RESEARCH_EXPERIENCE,
  SKILLS,
  SOCIAL_LINKS,
  filterProjects,
  filterSkills,
  getProjectById,
  resolveTheme,
  toggleTheme,
  validateContactForm,
  buildMailtoHref,
} from '../public/js/portfolioData.js';

test('skills list includes requested AI/ML, DSA, and core skills and excludes MS Word and JavaScript', () => {
  const names = SKILLS.map((s) => s.name);

  assert.ok(names.includes('Python for AI/ML'));
  assert.ok(names.includes('Pandas'));
  assert.ok(names.includes('NumPy'));
  assert.ok(names.includes('Data Structures & Algorithms'));

  const htmlCss = SKILLS.find((s) => s.name === 'HTML & CSS');
  assert.equal(htmlCss?.level, 75);

  const basicComputer = SKILLS.find((s) => s.name === 'Basic Computer Operation');
  assert.equal(basicComputer?.level, 85);

  assert.equal(
    SKILLS.some((s) => /ms\s*word/i.test(s.name)),
    false,
    'MS Word should be removed'
  );
  assert.equal(
    SKILLS.some((s) => /javascript/i.test(s.name)),
    false,
    'JavaScript should be removed'
  );
});

test('filterSkills filters cleanly by category and handles all/empty', () => {
  assert.equal(filterSkills(SKILLS, 'all').length, SKILLS.length);

  const aiSkills = filterSkills(SKILLS, 'ai-programming');
  assert.ok(aiSkills.length >= 5);
  assert.ok(aiSkills.every((s) => s.category === 'ai-programming'));

  const webCoreSkills = filterSkills(SKILLS, 'web-core');
  assert.ok(webCoreSkills.length >= 2);
  assert.ok(webCoreSkills.every((s) => s.category === 'web-core'));
});

test('research experience includes updated Dental Image Segmentation wording and certificate', () => {
  const entry = RESEARCH_EXPERIENCE[0];
  assert.equal(
    entry.heading,
    'Volunteer Data Annotator – Dental Image Segmentation Research Project'
  );
  assert.match(entry.summary, /medical image processing/i);
  assert.match(entry.recognition, /Md\. Jamaner Rahaman Sir/i);
  assert.match(entry.recognition, /59th batch/i);
  assert.equal(entry.certificatePdf, CERTIFICATE_ASSET_PATH);
});

test('projects include Algorithm Course project and completed Data Structures and Algorithms repos', () => {
  assert.equal(PROJECTS.length, 3);

  const algoProject = PROJECTS.find((p) => p.id === 'range-of-legends');
  assert.equal(algoProject?.href, 'https://range-of-legends.vercel.app/');

  const dsRepo = PROJECTS.find((p) => p.id === 'data-structures-repo');
  assert.equal(dsRepo?.href, 'https://github.com/Akash-Ahmed07/Data-Structures');

  const algoRepo = PROJECTS.find((p) => p.id === 'algorithms-repo');
  assert.equal(algoRepo?.href, 'https://github.com/Akash-Ahmed07/Algorithm-');

  assert.equal(filterProjects(PROJECTS, 'all').length, 3);
  assert.equal(filterProjects(PROJECTS, 'web-project').length, 1);
  assert.equal(filterProjects(PROJECTS, 'dsa-coursework').length, 2);
});

test('profile photo and Instagram profile link match user updates', () => {
  assert.equal(
    PROFILE.photo,
    '/assets/aistudio/WhatsApp_Image_2026-11-22_at_8.46.42_PM_87864350.jpeg'
  );
  assert.equal(PROFILE.photo, PROFILE_PHOTO);
  assert.equal(PROFILE.instagramUrl, 'https://www.instagram.com/akash.bug__');
  const ig = SOCIAL_LINKS.find((link) => link.name === 'Instagram');
  assert.equal(ig?.href, 'https://www.instagram.com/akash.bug__');
  assert.equal(ig?.handle, '@akash.bug__');
});

test('validateContactForm rejects invalid input and accepts valid messages', () => {
  const missingName = validateContactForm({
    name: 'A',
    email: 'test@example.com',
    subject: 'Hello',
    message: 'This is a valid test message.',
  });
  assert.equal(missingName.valid, false);

  const badEmail = validateContactForm({
    name: 'Akash',
    email: 'invalid-email',
    subject: 'Hello',
    message: 'This is a valid test message.',
  });
  assert.equal(badEmail.valid, false);

  const valid = validateContactForm({
    name: 'Visitor',
    email: 'visitor@example.com',
    subject: 'Collaboration Inquiry',
    message: 'Would love to collaborate on an AI/ML research project.',
  });
  assert.equal(valid.valid, true);
  const mailto = buildMailtoHref(PROFILE.email, valid.sanitized);
  assert.ok(mailto.startsWith(`mailto:${PROFILE.email}?subject=`));
});

test('education status reflects 2nd Year student', () => {
  assert.equal(EDUCATION[0].period, 'Ongoing · 2nd Year');
  assert.equal(/1st\s*Year/i.test(EDUCATION[0].period), false);
});

test('getProjectById returns detailed topics and stack for each project', () => {
  const ds = getProjectById(PROJECTS, 'data-structures-repo');
  assert.ok(ds);
  assert.ok(Array.isArray(ds.topics) && ds.topics.length >= 3);
  assert.ok(Array.isArray(ds.stack) && ds.stack.includes('C Programming'));
  assert.equal(getProjectById(PROJECTS, 'nonexistent'), null);
});

test('theme helpers resolve defaults and toggle cleanly between dark and light', () => {
  assert.equal(resolveTheme(null), 'dark');
  assert.equal(resolveTheme('light'), 'light');
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
});

test('contact presets provide non-empty subjects', () => {
  assert.ok(CONTACT_PRESETS.length >= 3);
  assert.ok(CONTACT_PRESETS.every((p) => p.label.length > 0 && p.subject.length >= 3));
});
