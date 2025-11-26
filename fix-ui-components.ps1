# Script pour mettre à jour tous les composants UI pour utiliser processTemplate
# Usage: .\fix-ui-components.ps1

$componentsPath = "d:\SAE301\client\src\ui"
$count = 0
$updated = 0

Write-Host "🔍 Recherche des composants à mettre à jour..." -ForegroundColor Cyan

Get-ChildItem -Path $componentsPath -Filter "index.js" -Recurse | ForEach-Object {
    $count++
    $file = $_.FullName
    $content = Get-Content $file -Raw
    
    # Vérifier si le fichier importe htmlToFragment et un template
    if (($content -match "import.*htmlToFragment") -and ($content -match "import template from")) {
        
        # Vérifier s'il a déjà processTemplate
        if ($content -notmatch "processTemplate") {
            Write-Host "📝 Mise à jour: $($_.Directory.Name)/index.js" -ForegroundColor Yellow
            
            # Ajouter processTemplate à l'import
            $content = $content -replace "import \{ htmlToFragment \}", "import { htmlToFragment, processTemplate }"
            $content = $content -replace "import \{ (.*?)htmlToFragment(.*?) \}", 'import { $1htmlToFragment, processTemplate$2 }'
            
            # Remplacer htmlToFragment(template) par htmlToFragment(processTemplate(template))
            $content = $content -replace "htmlToFragment\(template\)", "htmlToFragment(processTemplate(template))"
            
            # Remplacer return template par return processTemplate(template) dans les fonctions html()
            $content = $content -replace "(\s+)return template;", '$1return processTemplate(template);'
            
            # Sauvegarder
            Set-Content $file -Value $content -NoNewline
            $updated++
        }
    }
}

Write-Host ""
Write-Host "✅ Terminé!" -ForegroundColor Green
Write-Host "   Fichiers examinés: $count" -ForegroundColor White
Write-Host "   Fichiers mis à jour: $updated" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Vérifier les modifications avec: git diff" -ForegroundColor White
Write-Host "   2. Tester localement: cd client; npm run dev" -ForegroundColor White
Write-Host "   3. Commit: git add .; git commit -m 'Fix: Assets paths pour GitHub Pages'" -ForegroundColor White
Write-Host "   4. Push: git push" -ForegroundColor White
