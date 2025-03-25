New-Item -Force -Path "README.md" -ItemType "file" | Out-Null
New-Item -Force -Path "tsconfig.json" -ItemType "file" | Out-Null
New-Item -Force -Path ".env.example" -ItemType "file" | Out-Null
New-Item -Force -Path ".gitignore" -ItemType "file" | Out-Null

New-Item -Force -Path "src" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\index.ts" -ItemType "file" | Out-Null
New-Item -Force -Path "src\server.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\routes" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\routes\api.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\controllers" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\controllers\characterController.ts" -ItemType "file" | Out-Null
New-Item -Force -Path "src\controllers\imageController.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\services" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\services\groqService.ts" -ItemType "file" | Out-Null
New-Item -Force -Path "src\services\exaService.ts" -ItemType "file" | Out-Null
New-Item -Force -Path "src\services\runwareService.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\utils" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\utils\validators.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\types" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\types\index.ts" -ItemType "file" | Out-Null

New-Item -Force -Path "src\client" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\client\index.html" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\index.tsx" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\App.tsx" -ItemType "file" | Out-Null

New-Item -Force -Path "src\client\components" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\client\components\CharacterForm.tsx" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\components\CharacterPreview.tsx" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\components\ImageGenerator.tsx" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\components\LoadingSpinner.tsx" -ItemType "file" | Out-Null
New-Item -Force -Path "src\client\components\Modal.tsx" -ItemType "file" | Out-Null

New-Item -Force -Path "src\client\styles" -ItemType "directory" | Out-Null
New-Item -Force -Path "src\client\styles\index.css" -ItemType "file" | Out-Null

Write-Host "Project structure created successfully!" -ForegroundColor Green