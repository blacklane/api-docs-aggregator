#!/usr/bin/env node

// This script is used to build the search index for the API documentation.
// It is used to generate the search-index.json file that is used by the search component.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub token from environment variable
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Extracts repository info from GitHub URL
 */
function extractRepoInfo(url) {
  const match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2]
  };
}

/**
 * Fetches repository information including description and topics
 */
async function fetchRepoInfo(repoInfo) {
  if (!repoInfo) return null;
  
  const repoUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`;
  
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'swagger-aggregator-build'
    };
    
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(repoUrl, { headers });
    
    if (!response.ok) {
      console.warn(`Failed to fetch repo info for ${repoInfo.owner}/${repoInfo.repo}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    return {
      description: data.description || '',
      topics: data.topics || [],
      language: data.language || '',
      fullName: data.full_name || `${repoInfo.owner}/${repoInfo.repo}`
    };
  } catch (error) {
    console.warn(`Error fetching repo info for ${repoInfo.owner}/${repoInfo.repo}:`, error.message);
    return null;
  }
}

/**
 * Extracts description and keywords from repository information
 */
function extractMetadata(repoData, name) {
  // Use GitHub description or fallback to default
  let description = repoData?.description?.trim() || `${name} API Documentation`;
  
  // If description is too short or generic, enhance it
  if (description.length < 10 || description.toLowerCase().includes('todo')) {
    description = `${name} API Documentation`;
  }
  
  // Start with basic keywords from name
  const keywords = new Set();
  
  // Add name components as keywords
  const nameWords = name.toLowerCase().split(/[\s\-_]+/);
  for (const word of nameWords) {
    if (word.length > 1) {
      keywords.add(word);
    }
  }
  
  // Add full name as a keyword for exact matches
  keywords.add(name.toLowerCase());
  
  // PRIMARY: Add GitHub topics as keywords (most important)
  if (repoData?.topics && repoData.topics.length > 0) {
    for (const topic of repoData.topics) {
      keywords.add(topic.toLowerCase());
    }
  } else {
    // Fallback: Add generic API-related keywords only if no topics exist
    keywords.add('api');
    keywords.add('service');
  }
  
  // Add programming language as keyword
  if (repoData?.language) {
    keywords.add(repoData.language.toLowerCase());
  }
  
  // Add meaningful words from GitHub description (but not all words)
  if (repoData?.description) {
    const descriptionWords = repoData.description.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && // Only longer words
        !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were'].includes(word) // Skip common words
      );
    
    // Only add the most relevant description words (limit to avoid noise)
    const relevantWords = descriptionWords.slice(0, 5);
    for (const word of relevantWords) {
      keywords.add(word);
    }
  }
  
  return {
    description: description.trim(),
    keywords: Array.from(keywords)
  };
}

/**
 * Main function to build search index
 */
async function buildSearchIndex() {
  console.log('🔍 Building search index...');
  
  try {
    // Read configuration files
    const apisConfig = JSON.parse(
      await fs.readFile(path.join(__dirname, '../apis.config.json'), 'utf-8')
    );
    const eventsConfig = JSON.parse(
      await fs.readFile(path.join(__dirname, '../events.config.json'), 'utf-8')
    );
    
    const searchIndex = {
      apis: [],
      events: [],
      lastUpdated: new Date().toISOString()
    };
    
    // Process APIs
    console.log(`📚 Processing ${apisConfig.apis.length} APIs...`);
    for (const api of apisConfig.apis) {
      console.log(`  - ${api.name}`);
      
      const repoInfo = extractRepoInfo(api.url);
      const repoData = await fetchRepoInfo(repoInfo);
      const metadata = extractMetadata(repoData, api.name);
      
      searchIndex.apis.push({
        name: api.name,
        url: api.url,
        description: metadata.description,
        keywords: metadata.keywords,
        repository: repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : null,
        language: repoData?.language || undefined,
        topics: repoData?.topics || undefined
      });
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Process Events
    console.log(`📅 Processing ${eventsConfig.events.length} events...`);
    for (const event of eventsConfig.events) {
      console.log(`  - ${event.name}`);
      
      const repoInfo = extractRepoInfo(event.url);
      const repoData = await fetchRepoInfo(repoInfo);
      const metadata = extractMetadata(repoData, event.name);
      
      searchIndex.events.push({
        name: event.name,
        url: event.url,
        description: metadata.description,
        keywords: metadata.keywords,
        repository: repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : null,
        language: repoData?.language || undefined,
        topics: repoData?.topics || undefined
      });
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Write search index to public directory
    const outputPath = path.join(__dirname, '../public/search-index.json');
    await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));
    
    console.log('✅ Search index built successfully!');
    console.log(`   - ${searchIndex.apis.length} APIs indexed`);
    console.log(`   - ${searchIndex.events.length} events indexed`);
    console.log(`   - Output: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error building search index:', error);
    process.exit(1);
  }
}

// Run the script
buildSearchIndex(); 