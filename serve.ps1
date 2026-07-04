$port = 8765
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port/"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path $root ($path -replace '/', [IO.Path]::DirectorySeparatorChar)
    if (Test-Path $file -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $mime = switch ($ext) {
            '.html' { 'text/html' }
            '.css'  { 'text/css' }
            '.js'   { 'application/javascript' }
            '.jpg'  { 'image/jpeg' }
            '.png'  { 'image/png' }
            '.svg'  { 'image/svg+xml' }
            default { 'application/octet-stream' }
        }
        $context.Response.ContentType = "$mime; charset=utf-8"
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
