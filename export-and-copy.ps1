# Script PowerShell pour exporter les produits et les copier dans le projet client
# Usage: .\export-and-copy.ps1

Write-Host "🔄 Export des produits depuis la base de données..." -ForegroundColor Cyan

# Vérifier qu'on est dans le bon dossier
if (-not (Test-Path ".\api\export-products.php")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier SAE301" -ForegroundColor Red
    exit 1
}

# Exécuter le script PHP
Write-Host "`n📊 Exécution du script d'export..." -ForegroundColor Yellow
cd api
php export-products.php

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Export réussi!" -ForegroundColor Green
    
    # Copier le fichier vers le dossier client/public
    if (Test-Path "products-export.json") {
        Write-Host "`n📁 Copie vers client/public/mock-data.json..." -ForegroundColor Yellow
        Copy-Item "products-export.json" "../client/public/mock-data.json" -Force
        Write-Host "✅ Fichier copié!" -ForegroundColor Green
        
        # Afficher un aperçu
        Write-Host "`n📋 Aperçu du fichier:" -ForegroundColor Cyan
        $json = Get-Content "../client/public/mock-data.json" -Raw | ConvertFrom-Json
        Write-Host "  - Produits: $($json.products.Count)" -ForegroundColor White
        Write-Host "  - Catégories: $($json.categories.Count)" -ForegroundColor White
        Write-Host "  - Généré le: $($json.generated_at)" -ForegroundColor White
        
        Write-Host "`n✨ Prêt à être commité!" -ForegroundColor Green
        Write-Host "`nCommandes suivantes:" -ForegroundColor Cyan
        Write-Host "  cd .." -ForegroundColor White
        Write-Host "  git add client/public/mock-data.json" -ForegroundColor White
        Write-Host "  git commit -m 'Update: Export des produits de la BDD'" -ForegroundColor White
        Write-Host "  git push" -ForegroundColor White
    } else {
        Write-Host "❌ Fichier products-export.json non trouvé" -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Erreur lors de l'export" -ForegroundColor Red
    exit 1
}

cd ..
