/**
 * NEST Atelier Database Seeder
 * Populates categories, styles, collections, products, variants, images (with Cloudinary uploads),
 * product recommendations, delivery zones, coupons, and verified customer reviews.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sequelize = require('../src/config/db');
const cloudinary = require('../src/config/cloudinary');
const {
  Category,
  Style,
  Collection,
  Product,
  ProductVariant,
  ProductImage,
  ProductStyle,
  CollectionProduct,
  ProductRecommendation,
  DeliveryZone,
  Coupon,
  ProductReview,
  User,
} = require('../src/models');

const FRONTEND_PUBLIC = path.join(__dirname, '..', '..', '..', 'frontend', 'nest', 'public');

async function uploadToCloudinary(filePath, folder = 'nest/products') {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (err) {
    console.warn(`[Cloudinary] Upload fallback for ${filePath}: ${err.message}`);
    return null;
  }
}

async function seed() {
  console.log('🌿 Starting NEST Atelier Database Seed...');

  await sequelize.authenticate();
  console.log('✓ Database connected');

  // 1. Delivery Zones (City-level records)
  console.log('📍 Seeding Delivery Zones...');
  const zonesData = [
    { city: 'cairo', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'giza', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'new cairo', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'maadi', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'zamalek', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'heliopolis', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'sheikh zayed', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: '6th of october', name: 'Greater Cairo & Metropolitan', shippingFee: 0, estimatedDeliveryMinDays: 2, estimatedDeliveryMaxDays: 4, isActive: true },
    { city: 'alexandria', name: 'Alexandria & Mediterranean', shippingFee: 350, estimatedDeliveryMinDays: 3, estimatedDeliveryMaxDays: 6, isActive: true },
    { city: 'sahel', name: 'North Coast (Sahel)', shippingFee: 450, estimatedDeliveryMinDays: 3, estimatedDeliveryMaxDays: 6, isActive: true },
    { city: 'el gouna', name: 'Red Sea & El Gouna', shippingFee: 600, estimatedDeliveryMinDays: 5, estimatedDeliveryMaxDays: 8, isActive: true },
  ];

  for (const z of zonesData) {
    const existing = await DeliveryZone.findOne({ where: { city: z.city.toLowerCase() } });
    if (!existing) {
      await DeliveryZone.create(z);
    } else {
      await existing.update(z);
    }
  }

  // 2. Coupons
  console.log('🏷️ Seeding Coupons...');
  const couponsData = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minimumOrderAmount: 5000,
      maximumDiscountAmount: 1500,
      usageLimit: 100,
      perUserLimit: 1,
      isActive: true,
    },
    {
      code: 'ATELIER20',
      type: 'percentage',
      value: 20,
      minimumOrderAmount: 15000,
      maximumDiscountAmount: 4000,
      usageLimit: 50,
      perUserLimit: 1,
      isActive: true,
    },
    {
      code: 'CAIRO500',
      type: 'fixed',
      value: 500,
      minimumOrderAmount: 3000,
      usageLimit: 200,
      perUserLimit: 1,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    const existing = await Coupon.findOne({ where: { code: c.code } });
    if (!existing) {
      await Coupon.create(c);
    }
  }

  // 3. Styles
  console.log('🏛️ Seeding Architectural Styles...');
  const stylesData = [
    { name: 'Modern Minimalist', slug: 'modern-minimalist', description: 'Clean geometric lines, unornamented elegance, and structural purity.' },
    { name: 'Warm Organic', slug: 'warm-organic', description: 'Curved silhouettes, tactile natural textures, and earthy organic tones.' },
    { name: 'Heritage Egyptian', slug: 'heritage-egyptian', description: 'Bespoke interpretations of ancient Nile proportions and local woodworking heritage.' },
    { name: 'Scandinavian Modern', slug: 'scandinavian-modern', description: 'Functionality, warmth, and light-toned European hardwoods.' },
    { name: 'Sculptural Brutalist', slug: 'sculptural-brutalist', description: 'Bold monolithic volumes, raw exposed joinery, and grounded presence.' },
  ];

  const stylesMap = {};
  for (const s of stylesData) {
    let style = await Style.findOne({ where: { slug: s.slug } });
    if (!style) {
      style = await Style.create(s);
    }
    stylesMap[s.slug] = style;
  }

  // 4. Categories (Atmospheres)
  console.log('◇ Seeding Atmospheres (Categories)...');
  const categoriesData = [
    {
      name: 'Living Sanctuary',
      slug: 'living-sanctuary',
      description: 'Bespoke sculptural seating, monolithic lounge tables, and spatial centerpieces tailored for contemporary Cairo living.',
    },
    {
      name: 'Dining & Banquet',
      slug: 'dining-banquet',
      description: 'Solid white oak and smoked walnut dining tables, architectural chairs, and credenzas handcrafted for gathering.',
    },
    {
      name: 'Rest & Chamber',
      slug: 'rest-chamber',
      description: 'Serene solid timber platform beds, cantilevered nightstands, and tactile bedroom suites.',
    },
    {
      name: 'Study & Bureau',
      slug: 'study-bureau',
      description: 'Executive architectural desks, monolith bookshelves, and studio workstations.',
    },
    {
      name: 'Architectural Objects',
      slug: 'architectural-objects',
      description: 'Travertine luminaires, turned hardwood pedestals, and sculpted Egyptian alabaster vessels.',
    },
  ];

  const categoriesMap = {};
  for (const c of categoriesData) {
    let cat = await Category.findOne({ where: { slug: c.slug } });
    if (!cat) {
      cat = await Category.create(c);
    } else {
      await cat.update(c);
    }
    categoriesMap[c.slug] = cat;
  }

  // 5. Curated Collections
  console.log('🏛️ Seeding Collections...');
  const collectionsData = [
    {
      name: 'The Cairo Oak Monolith Series',
      slug: 'cairo-oak-monolith',
      description: 'Honoring traditional mortise and tenon joinery with solid Danish and Egyptian white oak, left with a matte organic oil finish.',
      imageUrl: '/products/soliman-dining-table.jpg',
    },
    {
      name: 'Sculptural Living 2026',
      slug: 'sculptural-living-2026',
      description: 'Fluid contours, bouclé upholstery, and sculptural timber bases tailored for elevated Cairo penthouses and villas.',
      imageUrl: '/products/nile-curve-chair.jpg',
    },
    {
      name: 'Heritage Raw Walnut Edit',
      slug: 'heritage-raw-walnut',
      description: 'Deep-toned smoked Egyptian walnut furniture showcasing exposed structural joinery and tactile grain details.',
      imageUrl: '/products/karnak-sofa.jpg',
    },
  ];

  const collectionsMap = {};
  for (const col of collectionsData) {
    let collection = await Collection.findOne({ where: { slug: col.slug } });
    if (!collection) {
      collection = await Collection.create(col);
    }
    collectionsMap[col.slug] = collection;
  }

  // 6. Upload Generated Images to Cloudinary
  console.log('📸 Uploading high-res product photos to Cloudinary...');
  const localImageMap = {
    soliman: path.join(FRONTEND_PUBLIC, 'products', 'soliman-dining-table.jpg'),
    nile_chair: path.join(FRONTEND_PUBLIC, 'products', 'nile-curve-chair.jpg'),
    karnak_sofa: path.join(FRONTEND_PUBLIC, 'products', 'karnak-sofa.jpg'),
    maadi_table: path.join(FRONTEND_PUBLIC, 'products', 'maadi-coffee-table.jpg'),
    zamalek_bed: path.join(FRONTEND_PUBLIC, 'products', 'zamalek-bed.jpg'),
    hero_product: path.join(FRONTEND_PUBLIC, 'hero-product.jpg'),
    bento_sculpture: path.join(FRONTEND_PUBLIC, 'bento-sculpture.jpg'),
    material_wood: path.join(FRONTEND_PUBLIC, 'material-wood.jpg'),
    hero_room: path.join(FRONTEND_PUBLIC, 'hero-room.jpg'),
  };

  const uploadedUrls = {};
  for (const [key, filePath] of Object.entries(localImageMap)) {
    console.log(`  Uploading ${key}...`);
    const cdnUrl = await uploadToCloudinary(filePath);
    uploadedUrls[key] = cdnUrl || `/products/${path.basename(filePath)}`;
    console.log(`  ✓ ${key}: ${uploadedUrls[key]}`);
  }

  // Update collection cover image URLs with Cloudinary CDN if available
  if (uploadedUrls.soliman) await collectionsMap['cairo-oak-monolith'].update({ imageUrl: uploadedUrls.soliman });
  if (uploadedUrls.nile_chair) await collectionsMap['sculptural-living-2026'].update({ imageUrl: uploadedUrls.nile_chair });
  if (uploadedUrls.karnak_sofa) await collectionsMap['heritage-raw-walnut'].update({ imageUrl: uploadedUrls.karnak_sofa });

  // 7. Products Specification Dataset
  console.log('◈ Seeding Products, Variants & Relations...');
  const productsData = [
    {
      name: 'Soliman Oak Dining Table',
      slug: 'soliman-oak-dining-table',
      categoryId: categoriesMap['dining-banquet'].id,
      categorySlug: 'dining-banquet',
      material: 'Solid White Oak',
      price: 18500,
      stockQuantity: 5,
      description: 'A monolithic architectural dining table crafted entirely from solid Danish white oak. Features exposed traditional mortise and tenon joinery with hand-finished chamfered edges, celebrating the organic grain of seasoned timber.',
      dimensions: { width: 240, height: 76, depth: 100 },
      images: [
        { url: uploadedUrls.soliman, altText: 'Soliman Oak Dining Table in Cairo Penthouse', sortOrder: 0 },
        { url: uploadedUrls.material_wood, altText: 'Soliman Table Solid Wood Joinery Detail', sortOrder: 1 },
      ],
      styles: ['modern-minimalist', 'scandinavian-modern'],
      collections: ['cairo-oak-monolith'],
      variants: [
        { name: 'Natural White Oak (Matte Oiled)', sku: 'SOL-OAK-NAT-240', price: 18500, stockQuantity: 3, color: '#D2B48C' },
        { name: 'Smoked Charcoal Oak', sku: 'SOL-OAK-SMK-240', price: 19800, stockQuantity: 2, color: '#2B2B2A' },
      ],
    },
    {
      name: 'Nile Curve Lounge Chair',
      slug: 'nile-curve-lounge-chair',
      categoryId: categoriesMap['living-sanctuary'].id,
      categorySlug: 'living-sanctuary',
      material: 'Italian Bouclé & Smoked Walnut',
      price: 14200,
      stockQuantity: 8,
      description: 'Sculptural low armchair with organic curving silhouettes inspired by Nile shoreline contours. Upholstered in tactile unbleached ivory bouclé wool, anchored by a precision hand-turned smoked walnut timber foundation.',
      dimensions: { width: 85, height: 78, depth: 82 },
      images: [
        { url: uploadedUrls.nile_chair, altText: 'Nile Curve Lounge Chair with Terrazzo Flooring', sortOrder: 0 },
        { url: uploadedUrls.hero_product, altText: 'Nile Curve Studio Detail', sortOrder: 1 },
      ],
      styles: ['warm-organic', 'sculptural-brutalist'],
      collections: ['sculptural-living-2026'],
      variants: [
        { name: 'Ivory Bouclé / Smoked Walnut', sku: 'NIL-CHR-BOU-WAL', price: 14200, stockQuantity: 5, color: '#F5F5DC' },
        { name: 'Earthy Sand Linen / Natural Oak', sku: 'NIL-CHR-LIN-OAK', price: 13800, stockQuantity: 3, color: '#C2B280' },
      ],
    },
    {
      name: 'Karnak Minimalist Linen Sofa',
      slug: 'karnak-minimalist-linen-sofa',
      categoryId: categoriesMap['living-sanctuary'].id,
      categorySlug: 'living-sanctuary',
      material: 'Heavy Egyptian Linen & Smoked Oak',
      price: 32000,
      stockQuantity: 4,
      description: 'A low-profile 3-seater architectural sofa with deep feather-down blend cushions upholstered in heavy textured oatmeal Egyptian linen. Supported by a recessed smoked oak plinth base that creates a gentle hovering effect.',
      dimensions: { width: 260, height: 82, depth: 95 },
      images: [
        { url: uploadedUrls.karnak_sofa, altText: 'Karnak Minimalist Sofa in Villa Living Room', sortOrder: 0 },
        { url: uploadedUrls.hero_room, altText: 'Karnak Sofa Living Room Perspective', sortOrder: 1 },
      ],
      styles: ['modern-minimalist', 'warm-organic'],
      collections: ['sculptural-living-2026', 'heritage-raw-walnut'],
      variants: [
        { name: 'Oatmeal Natural Linen', sku: 'KAR-SOF-OAT-260', price: 32000, stockQuantity: 2, color: '#E3DAC9' },
        { name: 'Warm Charcoal Canvas', sku: 'KAR-SOF-CHR-260', price: 33500, stockQuantity: 2, color: '#36454F' },
      ],
    },
    {
      name: 'Maadi Low Profile Coffee Table',
      slug: 'maadi-low-profile-coffee-table',
      categoryId: categoriesMap['living-sanctuary'].id,
      categorySlug: 'living-sanctuary',
      material: 'Solid European Beech',
      price: 9800,
      stockQuantity: 10,
      description: 'A grounded organic coffee table featuring soft rounded pill edges and four substantial cylindrical pillar legs. Built from kiln-dried solid beech with an open-pore natural matte oil finish.',
      dimensions: { width: 140, height: 38, depth: 80 },
      images: [
        { url: uploadedUrls.maadi_table, altText: 'Maadi Low Profile Coffee Table', sortOrder: 0 },
        { url: uploadedUrls.bento_sculpture, altText: 'Maadi Table Top Surface View', sortOrder: 1 },
      ],
      styles: ['warm-organic', 'scandinavian-modern'],
      collections: ['sculptural-living-2026'],
      variants: [
        { name: 'Natural Honey Beech', sku: 'MAA-TBL-BEE-140', price: 9800, stockQuantity: 6, color: '#E8A87C' },
        { name: 'Bleached Bone Beech', sku: 'MAA-TBL-BLC-140', price: 10400, stockQuantity: 4, color: '#F4F1EA' },
      ],
    },
    {
      name: 'Zamalek Floating Oak Bed',
      slug: 'zamalek-floating-oak-bed',
      categoryId: categoriesMap['rest-chamber'].id,
      categorySlug: 'rest-chamber',
      material: 'Solid White Oak & Raw Linen',
      price: 28000,
      stockQuantity: 3,
      description: 'An architectural platform bed engineered with recessed steel supports to create a weightless floating visual effect. Features integrated cantilevered side ledges and a cushioned unbleached linen headboard.',
      dimensions: { width: 210, height: 105, depth: 190 },
      images: [
        { url: uploadedUrls.zamalek_bed, altText: 'Zamalek Floating Bed in Sunlit Master Bedroom', sortOrder: 0 },
        { url: uploadedUrls.material_wood, altText: 'Zamalek Headboard and Cantilever Ledge', sortOrder: 1 },
      ],
      styles: ['modern-minimalist', 'scandinavian-modern'],
      collections: ['cairo-oak-monolith'],
      variants: [
        { name: 'King (190 × 200 cm) / Natural Oak', sku: 'ZAM-BED-KNG-OAK', price: 28000, stockQuantity: 2, color: '#D2B48C' },
        { name: 'Queen (160 × 200 cm) / Natural Oak', sku: 'ZAM-BED-QUN-OAK', price: 25500, stockQuantity: 1, color: '#D2B48C' },
      ],
    },
    {
      name: 'Bab El-Louk Sculptural Dining Chair',
      slug: 'bab-el-louk-sculptural-dining-chair',
      categoryId: categoriesMap['dining-banquet'].id,
      categorySlug: 'dining-banquet',
      material: 'Solid Egyptian Walnut & Full-Grain Leather',
      price: 6200,
      stockQuantity: 16,
      description: 'Ergonomic architectural dining chair sculpted with a curved backrest and tapered legs. Upholstered in full-grain cognac saddle leather with blind edge stitching.',
      dimensions: { width: 52, height: 84, depth: 56 },
      images: [
        { url: uploadedUrls.hero_product, altText: 'Bab El-Louk Dining Chair in Warm Timber', sortOrder: 0 },
      ],
      styles: ['heritage-egyptian', 'modern-minimalist'],
      collections: ['heritage-raw-walnut'],
      variants: [
        { name: 'Cognac Leather / Walnut', sku: 'BEL-CHR-COG-WAL', price: 6200, stockQuantity: 10, color: '#9E472A' },
        { name: 'Black Saddle Leather / Smoked Oak', sku: 'BEL-CHR-BLK-OAK', price: 6400, stockQuantity: 6, color: '#161716' },
      ],
    },
    {
      name: 'Nubia Sculptural Console Table',
      slug: 'nubia-sculptural-console-table',
      categoryId: categoriesMap['living-sanctuary'].id,
      categorySlug: 'living-sanctuary',
      material: 'Solid Ebonized Beech',
      price: 12500,
      stockQuantity: 6,
      description: 'A striking entryway or gallery console characterized by geometric brutalist arch supports and a slim, precisely bevelled top. Treated with a deep black Japanese sumi wash that preserves the natural wood pores.',
      dimensions: { width: 150, height: 85, depth: 38 },
      images: [
        { url: uploadedUrls.bento_sculpture, altText: 'Nubia Sculptural Console in Architectural Setting', sortOrder: 0 },
      ],
      styles: ['sculptural-brutalist', 'heritage-egyptian'],
      collections: ['sculptural-living-2026'],
      variants: [
        { name: 'Ebonized Black Sumi Wash', sku: 'NUB-CNS-EBN-150', price: 12500, stockQuantity: 4, color: '#1A1A1A' },
        { name: 'Natural Sand Oiled Oak', sku: 'NUB-CNS-OAK-150', price: 13200, stockQuantity: 2, color: '#D8C3A5' },
      ],
    },
    {
      name: 'Siwa Alabaster Table Luminaire',
      slug: 'siwa-alabaster-table-luminaire',
      categoryId: categoriesMap['architectural-objects'].id,
      categorySlug: 'architectural-objects',
      material: 'Honed Egyptian Alabaster & Antiqued Brass',
      price: 4600,
      stockQuantity: 12,
      description: 'Carved from a solid cylinder of translucent Luxor alabaster. When illuminated, warm internal veining creates a soft meditative glow. Complemented by solid turned brass fittings.',
      dimensions: { width: 22, height: 38, depth: 22 },
      images: [
        { url: uploadedUrls.material_wood, altText: 'Siwa Alabaster Table Luminaire with Ambient Glow', sortOrder: 0 },
      ],
      styles: ['warm-organic', 'heritage-egyptian'],
      collections: ['cairo-oak-monolith'],
      variants: [
        { name: 'Translucent White Alabaster', sku: 'SIW-LUM-ALB-WHT', price: 4600, stockQuantity: 8, color: '#FDFBF7' },
        { name: 'Honey Veined Travertine', sku: 'SIW-LUM-TRV-HNY', price: 4900, stockQuantity: 4, color: '#E6D7B9' },
      ],
    },
  ];

  const createdProducts = {};

  for (const item of productsData) {
    let product = await Product.findOne({ where: { slug: item.slug } });
    if (!product) {
      product = await Product.create({
        categoryId: item.categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        material: item.material,
        dimensions: item.dimensions,
        price: item.price,
        stockQuantity: item.stockQuantity,
        isActive: true,
      });
      console.log(`  ✓ Created Product: ${product.name}`);
    } else {
      await product.update({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        material: item.material,
        dimensions: item.dimensions,
        price: item.price,
        stockQuantity: item.stockQuantity,
        isActive: true,
      });
      console.log(`  ✓ Updated Product: ${product.name}`);
    }

    createdProducts[item.slug] = product;

    // Attach Images
    for (const img of item.images) {
      const existingImg = await ProductImage.findOne({
        where: { productId: product.id, url: img.url },
      });
      if (!existingImg) {
        await ProductImage.create({
          productId: product.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        });
      }
    }

    // Attach Variants
    for (const v of item.variants) {
      const existingVar = await ProductVariant.findOne({ where: { sku: v.sku } });
      if (!existingVar) {
        await ProductVariant.create({
          productId: product.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stockQuantity: v.stockQuantity,
          color: v.color,
          isActive: true,
        });
      }
    }

    // Attach Styles
    for (const styleSlug of item.styles) {
      const styleObj = stylesMap[styleSlug];
      if (styleObj) {
        const link = await ProductStyle.findOne({
          where: { productId: product.id, styleId: styleObj.id },
        });
        if (!link) {
          await ProductStyle.create({ productId: product.id, styleId: styleObj.id });
        }
      }
    }

    // Attach to Collections
    for (const colSlug of item.collections) {
      const colObj = collectionsMap[colSlug];
      if (colObj) {
        const colLink = await CollectionProduct.findOne({
          where: { collectionId: colObj.id, productId: product.id },
        });
        if (!colLink) {
          await CollectionProduct.create({
            collectionId: colObj.id,
            productId: product.id,
            sortOrder: 0,
          });
        }
      }
    }
  }

  // 8. Cross Recommendations
  console.log('🔗 Seeding Product Recommendations...');
  const recPairs = [
    { from: 'soliman-oak-dining-table', to: 'bab-el-louk-sculptural-dining-chair', type: 'complete_the_look', sortOrder: 0 },
    { from: 'soliman-oak-dining-table', to: 'siwa-alabaster-table-luminaire', type: 'frequently_bought_together', sortOrder: 1 },
    { from: 'nile-curve-lounge-chair', to: 'maadi-low-profile-coffee-table', type: 'complete_the_look', sortOrder: 0 },
    { from: 'nile-curve-lounge-chair', to: 'karnak-minimalist-linen-sofa', type: 'similar', sortOrder: 1 },
    { from: 'karnak-minimalist-linen-sofa', to: 'maadi-low-profile-coffee-table', type: 'frequently_bought_together', sortOrder: 0 },
    { from: 'karnak-minimalist-linen-sofa', to: 'nubia-sculptural-console-table', type: 'complete_the_look', sortOrder: 1 },
    { from: 'zamalek-floating-oak-bed', to: 'siwa-alabaster-table-luminaire', type: 'complete_the_look', sortOrder: 0 },
  ];

  for (const pair of recPairs) {
    const fromProd = createdProducts[pair.from];
    const toProd = createdProducts[pair.to];
    if (fromProd && toProd) {
      const existingRec = await ProductRecommendation.findOne({
        where: { productId: fromProd.id, recommendedProductId: toProd.id },
      });
      if (!existingRec) {
        await ProductRecommendation.create({
          productId: fromProd.id,
          recommendedProductId: toProd.id,
          type: pair.type,
          sortOrder: pair.sortOrder,
        });
      }
    }
  }

  // 9. Verified Customer Reviews
  console.log('★ Seeding Verified Reviews...');
  const firstUser = await User.findOne({ where: { role: 'customer' } }) || await User.findOne();
  if (firstUser) {
    const reviewsData = [
      {
        productSlug: 'soliman-oak-dining-table',
        rating: 5,
        title: 'Heirloom quality for our New Cairo residence',
        body: 'The table arrived with flawless white-glove assembly in our dining room. The natural Danish oak grain and mortise tenon joints are breathtaking in morning light.',
        status: 'approved',
      },
      {
        productSlug: 'nile-curve-lounge-chair',
        rating: 5,
        title: 'The bouclé texture is sublime and deeply comfortable',
        body: 'Exceeded all expectations. Sitting posture is relaxed yet supportive, and the smoked walnut frame smells wonderfully of natural beeswax oil.',
        status: 'approved',
      },
      {
        productSlug: 'karnak-minimalist-linen-sofa',
        rating: 5,
        title: 'Architectural proportion masterpiece',
        body: 'We searched months across Cairo for a genuine minimalist sofa with heavy linen fabric. The low hovering plinth completely transformed our living space.',
        status: 'approved',
      },
      {
        productSlug: 'maadi-low-profile-coffee-table',
        rating: 5,
        title: 'Solid beech with soft rounded pill edge',
        body: 'The cylindrical pillar legs give this piece an understated architectural anchor in our room. Zero veneer, purely solid hardwood.',
        status: 'approved',
      },
    ];

    for (const r of reviewsData) {
      const prod = createdProducts[r.productSlug];
      if (prod) {
        const existingRev = await ProductReview.findOne({
          where: { productId: prod.id, userId: firstUser.id },
        });
        if (!existingRev) {
          await ProductReview.create({
            productId: prod.id,
            userId: firstUser.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            status: r.status,
          });
        }
      }
    }
  }

  console.log('✨ NEST Atelier Database Seeding Completed Successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
