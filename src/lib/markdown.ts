import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocContent {
  content: string;
  data: Record<string, unknown>;
  title?: string;
}

const docsDirectory = path.join(process.cwd(), 'public', 'data-science-lab');

export async function getDocContent(slug: string[]): Promise<DocContent | null> {
  try {
    let filePath: string;
    
    if (slug.length === 1) {
      // Root level files
      filePath = path.join(docsDirectory, `${slug[0]}.md`);
    } else {
      // Files in subdirectories (modules, tutorial)
      filePath = path.join(docsDirectory, ...slug.slice(0, -1), `${slug[slug.length - 1]}.md`);
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract title from content if not in frontmatter
    let title = data.title;
    if (!title) {
      const titleMatch = content.match(/^#\s+(.+)$/m);
      title = titleMatch ? titleMatch[1] : 'Untitled';
    }

    return {
      content,
      data,
      title,
    };
  } catch (error) {
    console.error('Error reading doc:', error);
    return null;
  }
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  try {
    // Root level files
    const rootFiles = fs.readdirSync(docsDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
    
    rootFiles.forEach(file => {
      slugs.push([file]);
    });

    // Subdirectories
    const subdirectories = ['modules', 'tutorial'];
    
    subdirectories.forEach(subdir => {
      const subdirPath = path.join(docsDirectory, subdir);
      if (fs.existsSync(subdirPath)) {
        const files = fs.readdirSync(subdirPath)
          .filter(file => file.endsWith('.md'))
          .map(file => file.replace(/\.md$/, ''));
        
        files.forEach(file => {
          slugs.push([subdir, file]);
        });
      }
    });

    return slugs;
  } catch (error) {
    console.error('Error getting doc slugs:', error);
    return [];
  }
}