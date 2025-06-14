#!/usr/bin/env node

/**
 * Tag Category Checker for Staatslogica
 * 
 * This script checks that all tags used in articles are properly mapped to themes.
 * It should be run after adding new articles to ensure content organization.
 * 
 * Usage: node scripts/check-tags.js
 */

const fs = require('fs');
const path = require('path');

// Read all MDX files from articles directory
const articlesDir = path.join(__dirname, '..', 'content', 'articles');
const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.mdx'));

// Extract all tags from all articles
const allTags = new Set();
const articleTags = [];

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    
    // Extract tags section
    const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n)*)/);
    if (tagsMatch) {
      const tagsSection = tagsMatch[1];
      const tags = tagsSection.match(/^\s*-\s*(.+)$/gm);
      
      if (tags) {
        const fileTags = tags.map(tag => tag.replace(/^\s*-\s*/, '').trim());
        articleTags.push({ file, tags: fileTags });
        fileTags.forEach(tag => allTags.add(tag));
      }
    }
  }
});

// Read themes from the actual lib/categories.ts file
const themesPath = path.join(__dirname, '..', 'lib', 'categories.ts');
const themesContent = fs.readFileSync(themesPath, 'utf8');

// Extract topics from categories.ts
const allCategoryTopics = new Set();
const topicsMatches = themesContent.match(/topics:\s*\[(.*?)\]/gs);

if (topicsMatches) {
  topicsMatches.forEach(match => {
    const topicsArray = match.match(/'([^']+)'/g);
    if (topicsArray) {
      topicsArray.forEach(topic => {
        const cleanTopic = topic.replace(/'/g, '');
        allCategoryTopics.add(generateSlug(cleanTopic));
      });
    }
  });
}

// Function to generate slug (matching the actual generateSlug function)
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Check which tags are not mapped to themes
const unmappedTags = [];
const mappedTags = [];

Array.from(allTags).forEach(tag => {
  const tagSlug = generateSlug(tag);
  if (allCategoryTopics.has(tagSlug)) {
    mappedTags.push({ original: tag, slug: tagSlug });
  } else {
    unmappedTags.push({ original: tag, slug: tagSlug });
  }
});

console.log('=== STAATSLOGICA TAG CATEGORY ANALYSIS ===\n');

console.log(`Total unique tags found: ${allTags.size}`);
console.log(`Mapped tags: ${mappedTags.length}`);
console.log(`Unmapped tags: ${unmappedTags.length}\n`);

if (unmappedTags.length > 0) {
  console.log('🚨 UNMAPPED TAGS (need to be added to themes):');
  unmappedTags.forEach(tag => {
    console.log(`  - ${tag.original} (slug: ${tag.slug})`);
  });
  console.log('\nPlease add these tags to the appropriate themes in lib/categories.ts\n');
} else {
  console.log('✅ All tags are properly mapped to themes!\n');
}

console.log('=== RECENT ARTICLES ===');
const recentArticles = articleTags.slice(-3);
recentArticles.forEach(({ file, tags }) => {
  console.log(`\n${file}:`);
  tags.forEach(tag => {
    const tagSlug = generateSlug(tag);
    const isMapped = allCategoryTopics.has(tagSlug);
    console.log(`  ${isMapped ? '✅' : '❌'} ${tag}`);
  });
});

// Exit with error code if there are unmapped tags
if (unmappedTags.length > 0) {
  console.log('\n❌ FAILED: There are unmapped tags that need to be categorized.');
  process.exit(1);
} else {
  console.log('\n✅ SUCCESS: All tags are properly categorized.');
  process.exit(0);
} 