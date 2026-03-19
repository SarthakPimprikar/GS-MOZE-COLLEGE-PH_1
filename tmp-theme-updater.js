const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'student');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      // Exclude documents and fees since they are already styled
      if (file !== 'documents' && file !== 'fees') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const updateTheme = () => {
  const files = walkSync(directoryPath);
  console.log(`Found ${files.length} JSX files to process.`);

  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace blues
    content = content.replace(/text-blue-600/g, 'text-moze-primary');
    content = content.replace(/bg-blue-600/g, 'bg-moze-primary');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-maroon-800');
    content = content.replace(/bg-blue-100/g, 'bg-maroon-50 text-moze-primary');
    content = content.replace(/bg-blue-50/g, 'bg-maroon-50/50');
    content = content.replace(/text-blue-500/g, 'text-moze-primary');
    content = content.replace(/ring-blue-500/g, 'ring-moze-primary');
    content = content.replace(/border-blue-500/g, 'border-moze-primary');
    content = content.replace(/border-blue-600/g, 'border-moze-primary');
    content = content.replace(/from-blue-50/g, 'from-maroon-50/30');

    // Replace indigos
    content = content.replace(/text-indigo-600/g, 'text-moze-primary');
    content = content.replace(/bg-indigo-600/g, 'bg-moze-primary');
    content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-maroon-800');
    content = content.replace(/bg-indigo-100/g, 'bg-maroon-100');
    content = content.replace(/ring-indigo-500/g, 'ring-moze-primary');
    content = content.replace(/border-indigo-500/g, 'border-moze-primary');
    content = content.replace(/from-indigo-500 to-purple-600/g, 'from-moze-primary to-maroon-800');
    content = content.replace(/from-indigo-100/g, 'from-maroon-50 text-moze-primary');
    content = content.replace(/to-indigo-50/g, 'to-maroon-50/50');
    content = content.replace(/to-indigo-100/g, 'to-gray-100');
    
    // Gradients
    content = content.replace(/from-green-50 to-emerald-50/g, 'bg-white');
    
    // Add font-serif to headers (naively injecting it)
    content = content.replace(/text-3xl font-bold/g, 'text-3xl font-serif font-bold');
    content = content.replace(/text-2xl font-bold/g, 'text-2xl font-serif font-bold');
    content = content.replace(/text-xl font-bold/g, 'text-xl font-serif font-bold');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.basename(file)}`);
  });
};

updateTheme();
