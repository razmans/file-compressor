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
    const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    console.log(
      `Reduction: ${(
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2)}%`
    );

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
    const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    console.log(
      `Reduction: ${(
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2)}%`
    );

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
    const originalSize = (await fs.stat(resolvedInputPath)).size / 1024;
    const compressedSize = (await fs.stat(resolvedOutputPath)).size / 1024;

    // Log file sizes
    console.log(`Original size: ${originalSize.toFixed(2)} KB`);
    console.log(`Compressed size: ${compressedSize.toFixed(2)} KB`);
    console.log(
      `Reduction: ${(
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2)}%`
    );

    return {
      outputPath: resolvedOutputPath,
      compressedSizeKB: compressedSize
    };
  } catch (error) {
    console.error('Error compressing image with ImageMagick:', error);
    throw error;
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
