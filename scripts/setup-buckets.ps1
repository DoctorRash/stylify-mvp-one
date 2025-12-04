# Disable SSL verification
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

# Read .env.local
$envPath = Join-Path $PSScriptRoot "..\.env.local"
$envContent = Get-Content $envPath

$supabaseUrl = ""
$serviceKey = ""

foreach ($line in $envContent) {
    if ($line -match "NEXT_PUBLIC_SUPABASE_URL=(.*)") {
        $supabaseUrl = $matches[1].Trim()
    }
    if ($line -match "SUPABASE_SERVICE_KEY=(.*)") {
        $serviceKey = $matches[1].Trim()
    }
}

if (-not $supabaseUrl -or -not $serviceKey) {
    Write-Host "Error: Could not find credentials in .env.local"
    exit 1
}

Write-Host "Found URL: $supabaseUrl"
# Write-Host "Found Key: $serviceKey" # Don't print secret

$headers = @{
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json"
}

function Create-Bucket {
    param (
        [string]$BucketName
    )

    $url = "$supabaseUrl/storage/v1/bucket"
    $body = @{
        id = $BucketName
        name = $BucketName
        public = $true
    } | ConvertTo-Json

    Write-Host "Creating bucket '$BucketName'..."
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        Write-Host "Success: $($response | ConvertTo-Json -Depth 1)"
    } catch {
        $err = $_.Exception.Response
        if ($err.StatusCode -eq "Conflict") {
             Write-Host "Bucket '$BucketName' already exists. Updating to public..."
             # Update to public
             $updateUrl = "$supabaseUrl/storage/v1/bucket/$BucketName"
             $updateBody = @{ public = $true } | ConvertTo-Json
             try {
                $updateResponse = Invoke-RestMethod -Uri $updateUrl -Method Put -Headers $headers -Body $updateBody
                Write-Host "Update Success: $($updateResponse | ConvertTo-Json -Depth 1)"
             } catch {
                Write-Host "Update Failed: $($_.Exception.Message)"
             }
        } else {
            Write-Host "Failed: $($_.Exception.Message)"
            # Print detailed error if available
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                Write-Host "Details: $($reader.ReadToEnd())"
            }
        }
    }
}

Create-Bucket "portfolios"
Create-Bucket "try-on-images"
