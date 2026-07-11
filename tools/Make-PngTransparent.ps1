<#
  Removes a solid/near-uniform background from every PNG in a folder, making it
  transparent - no matter what color the background actually is.

  How it works (two passes, so edges come out smooth instead of a hard cutoff):
    1. Flood fill from every border pixel through pixels within a *strict*
       tolerance of the detected background color (sampled from the image's
       own top-left corner). This finds the "core" background region -
       everything genuinely connected to the edge, so a similarly-colored
       region trapped inside the artwork (e.g. a dark shadow in a logo) is
       left alone.
    2. For the thin ring of pixels bordering that core region (the
       anti-aliased transition between artwork and background), estimate how
       much of the background color is still mixed into each pixel and
       "unmix" it back out (given observed = trueColor*alpha + bg*(1-alpha),
       solve for trueColor). This is close to what a browser does for CSS
       `mix-blend-mode: lighten` against a dark backdrop, and is why it
       produces a smooth, halo-free edge instead of the jagged/dark fringe a
       plain flood-fill-only cutoff leaves behind. It only runs on the
       boundary ring, not the whole image, so solid interior artwork (even
       dark parts) stays fully opaque and untouched.

  This is a connectivity-based color-key removal, not AI segmentation - it
  will not work well on photographic or textured/gradient backgrounds, only
  on flat or near-flat ones (the common case for logos/icons/badges).

  Usage:
    Make-PngTransparent.ps1 [-Folder <path>] [-Tolerance <0-255>]

  Non-destructive by default: outputs go to a "transparent" subfolder next to
  the source PNGs; originals are never modified.
#>
param(
    [string]$Folder = $PSScriptRoot,
    [int]$Tolerance = 16
)

Add-Type -AssemblyName System.Drawing

$source = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class PngBackgroundRemover
{
    public static void RemoveBackground(string inputPath, string outputPath, int tolerance)
    {
        using (var loaded = new Bitmap(inputPath))
        using (var bmp = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb))
        {
            using (var g = Graphics.FromImage(bmp))
            {
                g.DrawImage(loaded, 0, 0, loaded.Width, loaded.Height);
            }

            int w = bmp.Width;
            int h = bmp.Height;
            var rect = new Rectangle(0, 0, w, h);
            var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);

            try
            {
                int stride = data.Stride;
                int byteCount = stride * h;
                byte[] buffer = new byte[byteCount];
                Marshal.Copy(data.Scan0, buffer, 0, byteCount);

                // Format32bppArgb byte order in memory is B, G, R, A per pixel.
                byte refB = buffer[0];
                byte refG = buffer[1];
                byte refR = buffer[2];

                bool[] isBackground = new bool[w * h];
                var queue = new Queue<int>();

                Func<int, bool> closeToRef = (off) =>
                {
                    int db = buffer[off] - refB;
                    int dg = buffer[off + 1] - refG;
                    int dr = buffer[off + 2] - refR;
                    return Math.Abs(db) <= tolerance && Math.Abs(dg) <= tolerance && Math.Abs(dr) <= tolerance;
                };

                Action<int, int> trySeed = (x, y) =>
                {
                    int idx = y * w + x;
                    if (isBackground[idx]) return;
                    if (!closeToRef(y * stride + x * 4)) return;
                    isBackground[idx] = true;
                    queue.Enqueue(idx);
                };

                for (int x = 0; x < w; x++) { trySeed(x, 0); trySeed(x, h - 1); }
                for (int y = 0; y < h; y++) { trySeed(0, y); trySeed(w - 1, y); }

                // Pass 1: flood fill the core background region (strict tolerance).
                while (queue.Count > 0)
                {
                    int idx = queue.Dequeue();
                    int x = idx % w;
                    int y = idx / w;

                    if (x > 0) TrySeedNeighbor(x - 1, y, w, buffer, stride, tolerance, refB, refG, refR, isBackground, queue);
                    if (x < w - 1) TrySeedNeighbor(x + 1, y, w, buffer, stride, tolerance, refB, refG, refR, isBackground, queue);
                    if (y > 0) TrySeedNeighbor(x, y - 1, w, buffer, stride, tolerance, refB, refG, refR, isBackground, queue);
                    if (y < h - 1) TrySeedNeighbor(x, y + 1, w, buffer, stride, tolerance, refB, refG, refR, isBackground, queue);
                }

                // Pass 2: for every core-background pixel, unpremultiply its non-background
                // neighbors against the reference color (this is the anti-aliased edge ring).
                // Doing it from the background side outward keeps the effect confined to a
                // thin boundary instead of touching solid interior artwork.
                bool[] processed = new bool[w * h];

                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        int idx = y * w + x;
                        if (!isBackground[idx])
                        {
                            continue;
                        }

                        int off = y * stride + x * 4;
                        buffer[off + 3] = 0; // fully transparent core background

                        TryFeather(x - 1, y, w, h, buffer, stride, isBackground, processed, refR, refG, refB);
                        TryFeather(x + 1, y, w, h, buffer, stride, isBackground, processed, refR, refG, refB);
                        TryFeather(x, y - 1, w, h, buffer, stride, isBackground, processed, refR, refG, refB);
                        TryFeather(x, y + 1, w, h, buffer, stride, isBackground, processed, refR, refG, refB);
                    }
                }

                Marshal.Copy(buffer, 0, data.Scan0, byteCount);
            }
            finally
            {
                bmp.UnlockBits(data);
            }

            bmp.Save(outputPath, ImageFormat.Png);
        }
    }

    private static void TrySeedNeighbor(int x, int y, int w, byte[] buffer, int stride, int tolerance,
        byte refB, byte refG, byte refR, bool[] isBackground, Queue<int> queue)
    {
        int idx = y * w + x;
        if (isBackground[idx]) return;

        int off = y * stride + x * 4;
        int db = buffer[off] - refB;
        int dg = buffer[off + 1] - refG;
        int dr = buffer[off + 2] - refR;
        if (Math.Abs(db) > tolerance || Math.Abs(dg) > tolerance || Math.Abs(dr) > tolerance) return;

        isBackground[idx] = true;
        queue.Enqueue(idx);
    }

    private static void TryFeather(int x, int y, int w, int h, byte[] buffer, int stride,
        bool[] isBackground, bool[] processed, byte refR, byte refG, byte refB)
    {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        int idx = y * w + x;
        if (isBackground[idx] || processed[idx]) return;
        processed[idx] = true;

        int off = y * stride + x * 4;
        int b = buffer[off];
        int g = buffer[off + 1];
        int r = buffer[off + 2];

        // Distance each channel has moved *away* from the reference (background) color -
        // this approximates how much "real artwork" is mixed into this edge pixel versus
        // background bleed-through from anti-aliasing.
        int db = Math.Abs(b - refB);
        int dg = Math.Abs(g - refG);
        int dr = Math.Abs(r - refR);
        int spread = Math.Max(db, Math.Max(dg, dr));

        if (spread >= 40)
        {
            // Clearly real artwork already, not a blend pixel - leave fully opaque.
            return;
        }

        // t estimates how "opaque" (how much real artwork) is in this edge pixel: 0 right at
        // the reference color, up to 1 at the "clearly artwork" threshold. Given the standard
        // compositing model observed = trueColor*t + refColor*(1-t), solving for trueColor:
        //   trueColor = (observed - refColor*(1-t)) / t
        // This "unmixes" the background's contribution back out, instead of leaving it baked
        // into the kept color (which is what produces a dark halo around the artwork).
        double t = spread / 40.0;
        if (t <= 0) { buffer[off + 3] = 0; return; }

        double newB = (b - refB * (1 - t)) / t;
        double newG = (g - refG * (1 - t)) / t;
        double newR = (r - refR * (1 - t)) / t;

        buffer[off] = ClampByte(newB);
        buffer[off + 1] = ClampByte(newG);
        buffer[off + 2] = ClampByte(newR);
        buffer[off + 3] = (byte)Math.Round(255 * t);
    }

    private static byte ClampByte(double v)
    {
        if (v < 0) return 0;
        if (v > 255) return 255;
        return (byte)v;
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

$folderPath = (Resolve-Path $Folder).Path
$outputFolder = Join-Path $folderPath "transparent"
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

$pngFiles = Get-ChildItem -Path $folderPath -Filter "*.png" -File
if ($pngFiles.Count -eq 0) {
    Write-Output "No PNG files found in: $folderPath"
    exit 0
}

foreach ($file in $pngFiles) {
    $outputPath = Join-Path $outputFolder $file.Name
    try {
        [PngBackgroundRemover]::RemoveBackground($file.FullName, $outputPath, $Tolerance)
        Write-Output "OK    $($file.Name) -> transparent\$($file.Name)"
    }
    catch {
        Write-Output "FAIL  $($file.Name): $($_.Exception.Message)"
    }
}

Write-Output ""
Write-Output "Done. Originals untouched. Output folder: $outputFolder"
Write-Output "If some background pixels were left behind, rerun with a higher -Tolerance (e.g. 25-35)."
