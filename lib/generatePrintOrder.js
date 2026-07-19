function generatePrintOrder(photoIds, printOptions) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return reject(new Error('photoIds must be a non-empty array'));
    }
    if (!printOptions || typeof printOptions !== 'object') {
      return reject(new Error('printOptions must be an object'));
    }
    const validSizes = ['4x6', '5x7', '8x10'];
    if (!validSizes.includes(printOptions.size)) {
      return reject(new Error('size not supported'));
    }
    if (!Number.isInteger(printOptions.quantity) || printOptions.quantity <= 0) {
      return reject(new Error('quantity must be a positive integer'));
    }
    const validFinishes = ['glossy', 'matte'];
    if (!validFinishes.includes(printOptions.finish)) {
      return reject(new Error('finish must be glossy or matte'));
    }
    if (typeof printOptions.cropToFit !== 'boolean') {
      return reject(new Error('cropToFit must be a boolean'));
    }
    const userCreditLimit = 100.00;
    const basePrices = { '4x6': 0.39, '5x7': 0.79, '8x10': 1.49 };
    const unitPrice = basePrices[printOptions.size];
    const totalCost = Number((unitPrice * printOptions.quantity * photoIds.length).toFixed(2));
    if (totalCost > userCreditLimit) {
      return reject(new Error('totalCost exceeds user credit limit'));
    }
    const printJobs = [];
    for (const photoId of photoIds) {
      if (typeof photoId !== 'string' || photoId.trim() === '') {
        return reject(new Error('invalid photoId'));
      }
      const fileUrl = `https://cdn.example.com/photos/${encodeURIComponent(photoId)}.jpg`;
      const dimensions = printOptions.size;
      let warning = '';
      if (printOptions.cropToFit) {
        warning = 'Content loss warning: cropping may remove parts of the image';
      }
      printJobs.push({
        photoId,
        fileUrl,
        dimensions,
        ...(warning ? { warning } : {})
      });
    }
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    resolve({
      orderId,
      totalCost,
      currency: 'USD',
      printJobs,
      expiresAt
    });
  });
}

module.exports = { generatePrintOrder };
