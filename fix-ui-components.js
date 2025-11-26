// Script Node.js pour mettre à jour tous les composants UI
const fs = require('fs');
const path = require('path');

const componentsPath = path.join(__dirname, 'client', 'src', 'ui');

function updateComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Vérifier si le fichier importe htmlToFragment et un template
  if (content.includes('htmlToFragment') && content.includes('import template from')) {
    
    // Vérifier s'il a déjà processTemplate
    if (!content.includes('processTemplate')) {
      console.log(`📝 Mise à jour: ${path.basename(path.dirname(filePath))}/index.js`);
      
      // Ajouter processTemplate à l'import
      content = content.replace(
        /import \{ ([^}]*?)htmlToFragment([^}]*?) \}/,
        'import { $1htmlToFragment, processTemplate$2 }'
      );
      
      // Remplacer htmlToFragment(template) par htmlToFragment(processTemplate(template))
      content = content.replace(
        /htmlToFragment\(template\)/g,
        'htmlToFragment(processTemplate(template))'
      );
      
      // Remplacer return template; par return processTemplate(template);
      content = content.replace(
        /(\s+)return template;/g,
        '$1return processTemplate(template);'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      updated = true;
    }
  }
  
  return updated;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  let updated = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const result = walkDir(filePath);
      count += result.count;
      updated += result.updated;
    } else if (file === 'index.js') {
      count++;
      if (updateComponent(filePath)) {
        updated++;
      }
    }
  });
  
  return { count, updated };
}

console.log('🔍 Recherche des composants à mettre à jour...\n');
const result = walkDir(componentsPath);

console.log('\n✅ Terminé!');
console.log(`   Fichiers examinés: ${result.count}`);
console.log(`   Fichiers mis à jour: ${result.updated}`);
console.log('\n🔄 Prochaines étapes:');
console.log('   1. Vérifier: git diff');
console.log('   2. Tester: cd client && npm run dev');
console.log('   3. Commit: git add . && git commit -m "Fix: Assets paths pour GitHub Pages"');
console.log('   4. Push: git push');
