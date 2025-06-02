import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

/** COMPRESS PDF */
/**
 * Compresses a PDF file using Ghostscript and saves the compressed file to the specified output path.
 *
 * @param inputPath - The path to the input PDF file to be compressed.
 * @param outputPath - The path where the compressed PDF file will be saved.
 * @returns A promise that resolves to a {@link CompressResult} object containing the output path and compressed file size in KB.
 * @throws Will throw an error if the compression process fails.
 * @example
 * const result = await compressPDF('input.pdf', 'output.pdf');
 * console.log(result.outputPath, result.compressedSizeKB);
 */
export const compressPDF = async (
  inputPath: string,
  outputPath: string
): Promise<CompressResult> => {
  try {
    // Resolve paths to ensure cross-platform compatibility
    const resolvedInputPath = path.resolve(inputPath);
    const resolvedOutputPath = path.resolve(outputPath);

    // Ghostscript command for compression
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${resolvedOutputPath}" "${resolvedInputPath}"`;

    // Execute Ghostscript command
    await execPromise(gsCommand);

    // Get file sizes
    // const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    // console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    // console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    // console.log(
    //   `Reduction: ${(
    //     ((originalSize - compressedSize) / originalSize) *
    //     100
    //   ).toFixed(2)}%`
    // );

    // Return the output path and compressed size
    return {
      outputPath: resolvedOutputPath,
      compressedSizeKB: compressedSize
    };
  } catch (error) {
    console.error('Error compressing PDF with Ghostscript:', error);
    throw error;
  }
};

/** COMPRESS IMAGE (LOSSY) */
/**
 * Compresses an image file (JPG, JPEG, or PNG) using ImageMagick with lossy compression and saves the compressed file to the specified output path.
 *
 * @param inputPath - The path to the input image file to be compressed.
 * @param outputPath - The path where the compressed image file will be saved.
 * @param quality - The JPEG quality for compression (0-100). Defaults to 75.
 * @returns A promise that resolves to a {@link CompressResult} object containing the output path and compressed file size in KB.
 * @throws Will throw an error if the compression process fails or if the file format is unsupported.
 * @example
 * const result = await compressImageLossy('input.jpg', 'output.jpg', 60);
 * console.log(result.outputPath, result.compressedSizeKB);
 */
export const compressImageLossy = async (
  inputPath: string,
  outputPath: string,
  quality: number = 75 // Default JPEG quality (0-100)
): Promise<CompressResult> => {
  try {
    // Resolve paths
    const resolvedInputPath = path.resolve(inputPath);
    const resolvedOutputPath = path.resolve(outputPath);
    const outputDir = path.dirname(resolvedOutputPath);

    // Validate input file
    const supportedFormats = /\.(jpg|jpeg|png)$/i;
    if (!supportedFormats.test(resolvedInputPath)) {
      throw new Error('Unsupported file format. Use JPG, JPEG, or PNG.');
    }
    await fs.access(resolvedInputPath, fs.constants.R_OK); // Check read permissions
    await fs.access(outputDir, fs.constants.W_OK); // Check write permissions for output directory

    // ImageMagick command for image compression
    const magickCommand = `magick "${resolvedInputPath}" -quality ${quality} -strip "${resolvedOutputPath}"`;

    // Execute ImageMagick command
    try {
      await execPromise(magickCommand);
    } catch (magickError) {
      console.error('ImageMagick command failed:', magickError);
      throw new Error(
        `Failed to compress image: ${(magickError as Error).message}`
      );
    }

    // Get file sizes
    // const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    // console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    // console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    // console.log(
    //   `Reduction: ${(
    //     ((originalSize - compressedSize) / originalSize) *
    //     100
    //   ).toFixed(2)}%`
    // );

    return {
      outputPath: resolvedOutputPath,
      compressedSizeKB: compressedSize
    };
  } catch (error) {
    console.error('Error compressing image with ImageMagick:', error);
    throw error;
  }
};

/** COMPRESS IMAGE (LOSSLESS) */
/**
 * Compresses an image file (JPG, JPEG, or PNG) using ImageMagick with lossless compression and saves the compressed file to the specified output path.
 *
 * @param inputPath - The path to the input image file to be compressed.
 * @param outputPath - The path where the compressed image file will be saved.
 * @param compressionLevel - The PNG compression level (0-100). Defaults to 75.
 * @returns A promise that resolves to a {@link CompressResult} object containing the output path and compressed file size in KB.
 * @throws Will throw an error if the compression process fails or if the file format is unsupported.
 * @example
 * const result = await compressImageLossless('input.png', 'output.png', 90);
 * console.log(result.outputPath, result.compressedSizeKB);
 */

export const compressImageLossless = async (
  inputPath: string,
  outputPath: string,
  compressionLevel: number = 75 // Default JPEG quality (0-100)
): Promise<CompressResult> => {
  try {
    // Resolve paths
    const resolvedInputPath = path.resolve(inputPath);
    const resolvedOutputPath = path.resolve(outputPath);
    const outputDir = path.dirname(resolvedOutputPath);

    // Validate input file
    const supportedFormats = /\.(jpg|jpeg|png)$/i;
    if (!supportedFormats.test(resolvedInputPath)) {
      throw new Error('Unsupported file format. Use JPG, JPEG, or PNG.');
    }
    await fs.access(resolvedInputPath, fs.constants.R_OK); // Check read permissions
    await fs.access(outputDir, fs.constants.W_OK); // Check write permissions for output directory

    // ImageMagick command for image compression
    const magickCommand = `magick "${resolvedInputPath}" -strip -define png:compression-level=${compressionLevel} "${resolvedOutputPath}"`;

    // Execute ImageMagick command
    try {
      await execPromise(magickCommand);
    } catch (magickError) {
      console.error('ImageMagick command failed:', magickError);
      throw new Error(
        `Failed to compress image: ${(magickError as Error).message}`
      );
    }

    // Get file sizes
    // const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    // console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    // console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    // console.log(
    //   `Reduction: ${(
    //     ((originalSize - compressedSize) / originalSize) *
    //     100
    //   ).toFixed(2)}%`
    // );

    return {
      outputPath: resolvedOutputPath,
      compressedSizeKB: compressedSize
    };
  } catch (error) {
    console.error('Error compressing image with ImageMagick:', error);
    throw error;
  }
};

//Create symbol documentation for compressVideo function
/**
 * Compresses a video file using FFmpeg and saves the compressed file to the specified output path.
 *
 * @param inputPath - The path to the input video file to be compressed.
 * @param outputPath - The path where the compressed video file will be saved.
 * @param options - Optional parameters for compression:
 *   - codec: The video codec to use (default is libx264).
 *   - crf: The Constant Rate Factor for quality (0-51, lower = better quality, default is 28 for H.264).
 *   - preset: The encoding preset to use (default is medium).
 *   - fps: The target frame rate (optional).
 *   - scale: The target resolution (optional).
 */
export const compressVideo = async (
  inputPath: string,
  outputPath: string,
  options: {
    codec?: SupportedCodecs; // Video codec
    crf?: number; // Quality (0-51, lower = better quality)
    preset?: VideoPresets; // Speed/compression tradeoff
    fps?: number; // Reduce frame rate (optional)
    scale?: { width?: number; height?: number }; // Resize (optional)
  } = {}
): Promise<{ outputPath: string; compressedSizeKB: number }> => {
  const resolvedInputPath = path.resolve(inputPath);
  const resolvedOutputPath = path.resolve(outputPath);

  // Check if input exists
  await fs.access(resolvedInputPath);

  // Default options
  const codec = options.codec || SupportedCodecs.LIBX264; // Default codec
  const crf = options.crf ?? (codec === SupportedCodecs.VP9 ? 30 : 28); // Default CRF (lower = better quality)
  const preset = options.preset || VideoPresets.MEDIUM; // Balance between speed & compression
  const fps = options.fps ? `-r ${options.fps}` : ''; // Optional FPS reduction
  const scale = options.scale
    ? `-vf scale=${options.scale.width || -1}:${options.scale.height || -1}`
    : ''; // Optional resizing

  try {
    let ffmpegCommand: string;

    // --- MP4 (H.264/H.265) ---
    if (
      codec === SupportedCodecs.LIBX264 ||
      codec === SupportedCodecs.LIBX265
    ) {
      ffmpegCommand = `
        ffmpeg -i "${resolvedInputPath}" \
        -c:v ${codec} -crf ${crf} -preset ${preset} \
        -c:a aac -b:a 128k \
        ${fps} ${scale} \
        -movflags +faststart \
        "${resolvedOutputPath}"
      `;
    }
    // --- WebM (VP9) ---
    else if (codec === SupportedCodecs.VP9) {
      ffmpegCommand = `
        ffmpeg -i "${resolvedInputPath}" \
        -c:v libvpx-vp9 -crf ${crf} -b:v 0 \
        -c:a libopus -b:a 128k \
        ${fps} ${scale} \
        "${resolvedOutputPath}"
      `;
    }
    // --- GIF (Not recommended for large files) ---
    else if (codec === SupportedCodecs.GIF) {
      ffmpegCommand = `
        ffmpeg -i "${resolvedInputPath}" \
        -vf "fps=15,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
        -loop 0 \
        "${resolvedOutputPath}"
      `;
    } else {
      throw new Error('Unsupported codec');
    }

    await execPromise(ffmpegCommand);

    // Get compressed size
    const stats = await fs.stat(resolvedOutputPath);
    const compressedSizeKB = stats.size / 1024;

    return { outputPath: resolvedOutputPath, compressedSizeKB };
  } catch (error) {
    throw new Error(
      `Video compression failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

/** COMPRESS MP3 */
/**
 * Compresses an MP3 audio file using FFmpeg and saves the compressed file to the specified output path.
 *
 * @param inputPath - The path to the input MP3 file to be compressed.
 * @param outputPath - The path where the compressed MP3 file will be saved.
 * @param options - Optional parameters for compression:
 *   - bitrate: The target bitrate for compression (e.g., "128k", "192k"). Defaults to "128k".
 *  - quality: The VBR quality level (0-9, where 0 is best and 9 is worst). Defaults to 4.
 *  - mono: Whether to convert the audio to mono (halves size). Defaults to false.
 * @return A promise that resolves to an object containing the output path and compressed file size in KB.
 * @throws Will throw an error if the compression process fails or if the input file is not an MP3.
 * @example
 * const result = await compressMP3('input.mp3', 'output.mp3', { bitrate: '192k', quality: 5, mono: true });
 * console.log(result.outputPath, result.compressedSizeKB);
 */
export const compressMP3 = async (
  inputPath: string,
  outputPath: string,
  options: {
    bitrate?: SoundBitRate; // e.g., "128k", "192k" (CBR)
    quality?: number; // 0 (best) to 9 (worst) for VBR
    mono?: boolean; // Convert to mono (halves size)
  } = {}
): Promise<{ outputPath: string; compressedSizeKB: number }> => {
  const resolvedInputPath = path.resolve(inputPath);
  const resolvedOutputPath = path.resolve(outputPath);

  // Validate input
  await fs.access(resolvedInputPath);
  if (!resolvedInputPath.toLowerCase().endsWith('.mp3')) {
    throw new Error('Input file must be an MP3.');
  }

  // Default options
  const bitrate = options.bitrate || '128k'; // Constant Bitrate (CBR)
  const quality = options.quality ?? 4; // Variable Bitrate (VBR) quality (0-9)
  const mono = options.mono ? '-ac 1' : ''; // Convert to mono if enabled

  try {
    // FFmpeg command (uses libmp3lame)
    const ffmpegCommand = `ffmpeg -i "${resolvedInputPath}" -c:a libmp3lame ${
      options.bitrate ? `-b:a ${bitrate}` : `-q:a ${quality}`
    } ${mono} -y "${resolvedOutputPath}"`;

    await execPromise(ffmpegCommand);

    // Get compressed size
    const stats = await fs.stat(resolvedOutputPath);
    const compressedSizeKB = stats.size / 1024;

    return {
      outputPath: resolvedOutputPath,
      compressedSizeKB
    };
  } catch (error) {
    throw new Error(
      `MP3 compression failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Define a return type for the function
/**
 * Represents the result of a compression operation.
 *
 * @property outputPath - The absolute path to the compressed file.
 * @property compressedSizeKB - The size of the compressed file in kilobytes (KB).
 */
export interface CompressResult {
  outputPath: string;
  compressedSizeKB: number;
}

//Symbol documentation for SupportedCodecs enums
/**
 * Enum representing supported video codecs for compression.
 * @enum {string}
 * @property {string} LIBX264 - H.264 codec, widely supported and efficient.
 * @property {string} LIBX265 - H.265 codec, offers better compression than H.264.
 * @property {string} VP9 - VP9 codec, open-source and efficient for web streaming.
 * @property {string} GIF - GIF format, suitable for short animations but not recommended for large files.
 */
//create enum for supported codecs
export enum SupportedCodecs {
  LIBX264 = 'libx264',
  LIBX265 = 'libx265',
  VP9 = 'vp9',
  GIF = 'gif'
}

//Symbol documentation for SoundBitRate enum
/**
 * Enum representing sound bitrates for MP3 compression.
 * @enum {string}
 * @property {string} LOW - Low bitrate (64k).
 * @property {string} MEDIUM - Medium bitrate (128k).
 * @property {string} HIGH - High bitrate (192k).
 * @property {string} VERY_HIGH - Very high bitrate (320k).
 */
export enum SoundBitRate {
  LOW = '64k',
  MEDIUM = '128k',
  HIGH = '192k',
  VERY_HIGH = '320k'
}

//Symbol documentation for VideoPresets enum
/**
 * Enum representing video encoding presets for FFmpeg.
 * @enum {string}
 * @property {string} ULTRAFAST - Fastest encoding, lowest compression.
 * @property {string} SUPERFAST - Very fast encoding, low compression.
 * @property {string} VERYFAST - Fast encoding, moderate compression.
 * @property {string} FASTER - Faster encoding, good balance.
 * @property {string} FAST - Fast encoding, good quality.
 * @property {string} MEDIUM - Default preset, good balance of speed and quality.
 * @property {string} SLOW - Slower encoding, better quality.
 * @property {string} SLOWER - Slower encoding, higher quality.
 * @property {string} VERYSLOW - Slowest encoding, best quality.
 */
export enum VideoPresets {
  ULTRAFAST = 'ultrafast',
  SUPERFAST = 'superfast',
  VERYFAST = 'veryfast',
  FASTER = 'faster',
  FAST = 'fast',
  MEDIUM = 'medium',
  SLOW = 'slow',
  SLOWER = 'slower',
  VERYSLOW = 'veryslow'
}
