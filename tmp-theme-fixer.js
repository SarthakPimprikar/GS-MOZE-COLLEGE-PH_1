const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'student');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
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

const fixTypo = () => {
  const files = walkSync(directoryPath);
  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/bg-maroon-50\/500/g, 'bg-moze-primary');
    fs.writeFileSync(file, content, 'utf8');
  });
};

fixTypo();
