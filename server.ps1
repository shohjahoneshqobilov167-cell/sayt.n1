# A native PowerShell static web server using .NET HttpListener

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Static server started successfully!"
    Write-Host "Listening on http://localhost:$port/"
    Write-Host "Press Ctrl+C to stop the server."
} catch {
    Write-Host "Error starting listener: $_"
    exit 1
}

# Keep running loop to handle incoming HTTP requests
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get path and map it locally
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or $localPath -eq "") {
            $localPath = "/index.html"
        }
        
        # Normalize file path separating subfolders
        $relativePath = $localPath.TrimStart('/')
        $filePath = Join-Path (Get-Location) $relativePath
        
        if (Test-Path $filePath -PathType Leaf) {
            # Read all file bytes
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Identify MIME types
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            
            if ($ext -eq ".html" -or $ext -eq ".htm") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".json") { $contentType = "application/json; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".gif") { $contentType = "image/gif" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
            elseif ($ext -eq ".pdf") { $contentType = "application/pdf" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # 404 Response
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found - File: $localPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
    } catch {
        Write-Host "Error serving request: $_"
    } finally {
        if ($null -ne $response) {
            $response.Close()
        }
    }
}
