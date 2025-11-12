# PowerShell script to run tests and show output
Write-Host "Running tests..." -ForegroundColor Green
npm test -- --watchAll=false --verbose 2>&1 | Tee-Object -FilePath "test-results.txt"
Write-Host "`nTest results saved to test-results.txt" -ForegroundColor Cyan
