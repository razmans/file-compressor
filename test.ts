import {
  compressImageLossless,
  compressImageLossy,
  compressPDF
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

// testCompressPDF();
// testCompressImage();
