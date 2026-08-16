const { Jimp } = require('jimp');

async function removeBackground() {
  try {
    const image = await Jimp.read('public/bridal-cutout.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // The background color is approximately rgb(108, 29, 50)
      // We use a tolerance to catch slight gradients/compression artifacts
      if (Math.abs(r - 108) < 30 && Math.abs(g - 29) < 30 && Math.abs(b - 50) < 30) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      }
    });
    
    await image.write('public/bridal-cutout-transparent.png');
    console.log('Successfully created transparent cutout!');
  } catch (error) {
    console.error('Error:', error);
  }
}

removeBackground();
