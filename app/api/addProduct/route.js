import connectDb from '../../../middleware/mongoose';
import { Product } from '../../../models/Product';

export async function POST(req) {
  try {
    await connectDb();

    const formData = await req.json();

    console.log("=== API ROUTE: Received Data ===");
    console.log("Full formData:", formData);

    const {
      title, slug, disc, size, category, color, price, availability, images,
      flashPrice, flashStart, flashEnd, discountPercent, tags, videoUrl, sizeChartImage,
      // E-commerce fields
      trackingLink, weight, dimensionLength, dimensionWidth, dimensionHeight,
      brand, material, careInstructions, warranty, sku, condition,
      // Conversion fields
      benefits, reviews,
      // AIDA fields
      howItWorks, mainBenefitHeadline, mainBenefitText,
      detailedBenefits, howToUseHeadline, howToUseText,
      resultsHeadline, resultsText, statistics
    } = formData;

    console.log("=== API ROUTE: Extracted AIDA Fields ===");
    console.log({
      howItWorks,
      mainBenefitHeadline,
      mainBenefitText,
      detailedBenefits,
      howToUseHeadline,
      howToUseText,
      resultsHeadline,
      resultsText,
      statistics
    });

    // The original tagsRaw parsing logic is removed as 'tags' is now directly destructured.
    // Assuming 'tags' from formData is already in the desired format (e.g., an array or string to be handled by default).

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "At least 1 image is required!" }), {
        status: 400,
      });
    }

    // images is now an array of URLs from frontend (already uploaded)
    const imageUrls = images;

    const product = new Product({
      title,
      slug,
      disc,
      size,
      category,
      color,
      price,
      availability,
      images: imageUrls,
      flashPrice: isNaN(flashPrice) ? null : flashPrice,
      flashStart,
      flashEnd,
      discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
      tags: tags || [],
      videoUrl: videoUrl && videoUrl.trim() !== '' ? videoUrl.trim() : null,
      sizeChartImage: sizeChartImage || null,
      // E-commerce fields
      trackingLink: trackingLink || null,
      weight: weight ? Number(weight) : null,
      dimensions: {
        length: dimensionLength ? Number(dimensionLength) : null,
        width: dimensionWidth ? Number(dimensionWidth) : null,
        height: dimensionHeight ? Number(dimensionHeight) : null,
      },
      brand: brand || 'Ibnemukhtar',
      material: material || null,
      careInstructions: careInstructions || null,
      warranty: warranty || null,
      sku: sku || null,
      condition: condition || 'New',
      // Conversion fields
      benefits: benefits || [],
      reviews: reviews || [],
      // AIDA fields
      howItWorks: howItWorks || '',
      mainBenefitHeadline: mainBenefitHeadline || '',
      mainBenefitText: mainBenefitText || '',
      detailedBenefits: detailedBenefits || [],
      howToUseHeadline: howToUseHeadline || '',
      howToUseText: howToUseText || '',
      resultsHeadline: resultsHeadline || '',
      resultsText: resultsText || '',
      statistics: statistics || []
    });

    console.log("=== API ROUTE: Product Object Before Save ===");
    console.log("Product AIDA fields:", {
      howItWorks: product.howItWorks,
      mainBenefitHeadline: product.mainBenefitHeadline,
      detailedBenefits: product.detailedBenefits,
      statistics: product.statistics
    });

    await product.save();

    console.log("=== API ROUTE: Product Saved Successfully ===");

    return new Response(JSON.stringify({ message: "Product added!", imageUrls }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error uploading product:", error);
    return new Response(JSON.stringify({ error: "Upload failed!" }), {
      status: 500,
    });
  }
}
