import {
  compressImageLossless,
  compressImageLossy,
  compressPDF,
  compressVideo,
  SupportedCodecs,
  VideoPresets
} from './index.js';

async function testCompressPDF() {
  const inputPath = 'input.pdf'; // Replace with your input PDF path
  const outputPath = 'output.pdf'; // Replace with your desired output PDF path

  try {
    const result = await compressPDF(inputPath, outputPath);
    console.log('Compression successful:', result);
  } catch (error) {
    console.error('Compression failed:', error);
  }
}

async function testCompressImage() {
  const inputPath = 'input.png'; // Replace with your input PDF path
  const outputPath = 'output.jpg'; // Replace with your desired output PDF path

  try {
    const result = await compressImageLossy(inputPath, outputPath, 30);
    console.log('Compression successful:', result);
  } catch (error) {
    console.error('Compression failed:', error);
  }
}

async function testCompressImageLossless() {
  const inputPath = 'input.png'; // Replace with your input image path
  const outputPath = 'output.png'; // Replace with your desired output image path
  try {
    const result = await compressImageLossless(inputPath, outputPath, 5);
    console.log('Lossless compression successful:', result);
  } catch (error) {
    console.error('Lossless compression failed:', error);
  }
}

async function testCompressVideo() {
  const inputPath = 'input.mp4'; // Replace with your input video path
  const outputPath = 'output.mp4'; // Replace with your desired output video path

  try {
    const result = await compressVideo(inputPath, outputPath, {
      codec: SupportedCodecs.LIBX264,
      preset: VideoPresets.MEDIUM,
      crf: 23
    });
    console.log('Video compression successful:', result);
  } catch (error) {
    console.error('Video compression failed:', error);
  }
}

// testCompressPDF();
// testCompressImage();
testCompressVideo();
