# File Compressor

This JSR package is a utility for compressing PDF and image files using Ghostscript and ImageMagick.

## Features

- **PDF Compression** using Ghostscript
- Supports PDF files

- **Image Compression (Lossy & Lossless)** using ImageMagick
- Supports JPG, JPEG, and PNG formats

---

## Prerequisite Installation
Please install Ghostscript and ImageMagick on the intended machine that will be using the compression.

1. **Install Ghostscript and ImageMagick**  
   On macOS:
   ```sh
   brew install ghostscript imagemagick
   ```
   On Ubuntu/Linux:
   ```sh
   sudo apt-get update
   sudo apt-get install ghostscript imagemagick
   ```

   On Windows:  
   1. Download and install [Ghostscript](https://www.ghostscript.com/download/gsdnld.html)  
   2. Download and install [ImageMagick](https://imagemagick.org/script/download.php#windows)  
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

## Notes

- Make sure Ghostscript and ImageMagick are installed and available in your system's PATH.
- Only JPG, JPEG, and PNG formats are supported for image compression.
- Errors are thrown if the input file is not accessible or the output directory is not writable.

---

## License

MIT