# File Compressor

This JSR package is a utility for compressing PDF, image, video and mp3 files using FFMpeg Ghostscript and ImageMagick.

## Features

- **PDF Compression** using Ghostscript
- Supports PDF files

- **Image Compression (Lossy & Lossless)** using ImageMagick
- Supports JPG, JPEG, and PNG formats

--**Video & MP3 Compression** using FFMPEG
- Supports mp4 and mp3
---

## Prerequisite Installation
Please install FFMpeg, Ghostscript and ImageMagick on the intended machine that will be using the compression.

1. **Install Ghostscript and ImageMagick**  
   On macOS:
   ```sh
   brew install ghostscript imagemagick ffmpeg
   ```
   On Ubuntu/Linux:
   ```sh
   sudo apt-get update
   sudo apt-get install ghostscript imagemagick ffmpeg
   ```

   On Windows:  
   1. Download and install [Ghostscript](https://www.ghostscript.com/download/gsdnld.html)  
   2. Download and install [ImageMagick](https://imagemagick.org/script/download.
   php#windows)  
   3. Download and install [FFMpeg](https://ffmpeg.org/download.html)
   3. During ImageMagick installation, check the box to "Install legacy utilities (e.g., convert)" and ensure both are added to your PATH.

---

## Installation 
``` bash
//For deno
deno add jsr:@razmans/file-compressor

//For pnpm
pnpm i jsr:@razmans/file-compressor

//For yarn
yarn add jsr:@razmans/file-compressor

//For npm
npm jsr add @razmans/file-compressor

//For bun
bunx jsr add @razmans/file-compressor
```


## Usage

Import the functions in your TypeScript or JavaScript project:

```typescript
import {
  compressPDF,
  compressImageLossy,
  compressImageLossless
  compressVideo
  compressMP3
} from '@razmans/file-compressor';
```

### 1. Compress PDF

Compress a PDF file and save the result to a new file.

```typescript
const result = await compressPDF('input.pdf', 'output.pdf');
console.log(result.outputPath, result.compressedSizeKB);
```

**Parameters:**
- `inputPath`: Path to the input PDF file.
- `outputPath`: Path to save the compressed PDF.

**Returns:**  
`Promise<{ outputPath: string; compressedSizeKB: number; }>`

---

### 2. Compress Image (Lossy)

Compress a JPG, JPEG, or PNG image with lossy compression.

```typescript
const result = await compressImageLossy('input.jpg', 'output.jpg', 60);
console.log(result.outputPath, result.compressedSizeKB);
```

**Parameters:**
- `inputPath`: Path to the input image file.
- `outputPath`: Path to save the compressed image.
- `quality` (optional): JPEG quality (0-100, default: 75).

**Returns:**  
`Promise<{ outputPath: string; compressedSizeKB: number; }>`

---

### 3. Compress Image (Lossless)

Compress a JPG, JPEG, or PNG image with lossless compression.

```typescript
const result = await compressImageLossless('input.png', 'output.png', 90);
console.log(result.outputPath, result.compressedSizeKB);
```

**Parameters:**
- `inputPath`: Path to the input image file.
- `outputPath`: Path to save the compressed image.
- `compressionLevel` (optional): PNG compression level (0-100, default: 75).

**Returns:**  
`Promise<{ outputPath: string; compressedSizeKB: number; }>`

---
### 4. Compress Video

Compress an MP4 video file with customizable options.

```typescript
const result = await compressVideo('input.mp4', 'output.mp4', {
  codec: 'libx264', // optional: e.g., 'libx264', 'libx265'
  crf: 23,          // optional: Constant Rate Factor (0-51, lower = better quality, default: 23)
  preset: 'medium', // optional: e.g., 'ultrafast', 'fast', 'medium', 'slow'
  fps: 30,          // optional: Frames per second
  scale: { width: 1280, height: 720 } // optional: Resize video
});
console.log(result.outputPath, result.compressedSizeKB);
```

**Parameters:**
- `inputPath`: Path to the input video file.
- `outputPath`: Path to save the compressed video.
- `options` (optional):  
  - `codec` (optional): Video codec to use (e.g., `'libx264'`, `'libx265'`).
  - `crf` (optional): Quality (0-51, lower is better quality, default: 23).
  - `preset` (optional): Compression speed/efficiency preset (e.g., `'ultrafast'`, `'fast'`, `'medium'`, `'slow'`).
  - `fps` (optional): Output frame rate.
  - `scale` (optional): Object with `width` and/or `height` to resize the video.

**Returns:**  
`Promise<{ outputPath: string; compressedSizeKB: number; }>`

---
### 5. Compress MP3

Compress an MP3 audio file using FFmpeg with customizable options for bitrate, quality, and mono conversion.

```typescript
const result = await compressMP3('input.mp3', 'output.mp3', {
  bitrate: SoundBitRate.HIGH, // optional: e.g., '128k', '192k', '320k'
  quality: 5,                 // optional: VBR quality (0-9, 0=best, 9=worst, default: 4)
  mono: true                  // optional: convert to mono (halves size, default: false)
});
console.log(result.outputPath, result.compressedSizeKB);
```

**Parameters:**
- `inputPath`: Path to the input MP3 file.
- `outputPath`: Path to save the compressed MP3 file.
- `options` (optional):  
  - `bitrate`: Target bitrate for compression (e.g., `'128k'`, `'192k'`, `'320k'`). Defaults to `'128k'`.
  - `quality`: VBR quality level (0-9, where 0 is best and 9 is worst). Defaults to `4`.
  - `mono`: Whether to convert the audio to mono (halves size). Defaults to `false`.

**Returns:**  
`Promise<{ outputPath: string; compressedSizeKB: number; }>`

**Example:**
```typescript
const result = await compressMP3('song.mp3', 'song_compressed.mp3', { bitrate: SoundBitRate.HIGH, mono: true });
console.log(result.outputPath, result.compressedSizeKB);
```

**Notes:**
- The input file must be an MP3.
- Throws an error if the compression process fails or if the input file is not an MP3.

---
## Notes

- Make sure Ghostscript and ImageMagick are installed and available in your system's PATH.
- Only JPG, JPEG, and PNG formats are supported for image compression.
- Errors are thrown if the input file is not accessible or the output directory is not writable.

---

## Types & Enums

### `CompressResult` Interface

Represents the result of a compression operation.

```typescript
interface CompressResult {
  outputPath: string;        // The absolute path to the compressed file.
  compressedSizeKB: number;  // The size of the compressed file in kilobytes (KB).
}
```

Returned by all compression functions, providing the output file path and the compressed file size in KB.

---

### `SupportedCodecs` Enum

Enum representing supported video codecs for compression (used in `compressVideo`).

```typescript
enum SupportedCodecs {
  LIBX264 = 'libx264', // H.264 codec, widely supported and efficient.
  LIBX265 = 'libx265', // H.265 codec, offers better compression than H.264.
  VP9 = 'vp9',         // VP9 codec, open-source and efficient for web streaming.
  GIF = 'gif'          // GIF format, suitable for short animations.
}
```

---

### `VideoPresets` Enum

Enum representing video encoding presets for FFmpeg (used in `compressVideo`).

```typescript
enum VideoPresets {
  ULTRAFAST = 'ultrafast',   // Fastest encoding, lowest compression.
  SUPERFAST = 'superfast',   // Very fast encoding, low compression.
  VERYFAST = 'veryfast',     // Fast encoding, moderate compression.
  FASTER = 'faster',         // Faster encoding, good balance.
  FAST = 'fast',             // Fast encoding, good quality.
  MEDIUM = 'medium',         // Default preset, good balance of speed and quality.
  SLOW = 'slow',             // Slower encoding, better quality.
  SLOWER = 'slower',         // Slower encoding, higher quality.
  VERYSLOW = 'veryslow'      // Slowest encoding, best quality.
}
```

Use these enums to specify codec and preset options when calling the `compressVideo` function.

### `SoundBitRate` Enum

Enum representing common sound bitrates for MP3 compression. Use these values to specify the desired bitrate when calling `compressMP3`.

```typescript
enum SoundBitRate {
  LOW = '64k',        // Low bitrate (smaller file, lower quality)
  MEDIUM = '128k',    // Medium bitrate (good balance of size and quality)
  HIGH = '192k',      // High bitrate (higher quality, larger file)
  VERY_HIGH = '320k'  // Very high bitrate (best quality, largest file)
}
```

**Usage Example:**
```typescript
const result = await compressMP3('input.mp3', 'output.mp3', {
  bitrate: SoundBitRate.HIGH
});
```

---

## License

MIT