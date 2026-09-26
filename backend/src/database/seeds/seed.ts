import 'dotenv/config';

import dataSource from '../data-source';

import { Brand } from '../../products/entities/brand.entity';
import { Category } from '../../products/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { ProductImage } from '../../products/entities/product-image.entity';

const brands = [
  'Nike',
  'Adidas',
  'Puma',
  'Levis',
  'Vans',
  'New Balance',
  'Reebok',
  'Carhartt',
  'Champion',
  'Urban Core',
];

const categories = [
  'Camisetas',
  'Sudaderas',
  'Pantalones',
  'Vaqueros',
  'Chaquetas',
  'Zapatillas',
  'Camisas',
  'Shorts',
  'Polos',
  'Accesorios',
];

const colors = [
  {
    name: 'Negro',
    hex: '#000000',
  },
  {
    name: 'Blanco',
    hex: '#FFFFFF',
  },
  {
    name: 'Azul',
    hex: '#2563EB',
  },
  {
    name: 'Verde',
    hex: '#16A34A',
  },
  {
    name: 'Rojo',
    hex: '#DC2626',
  },
  {
    name: 'Gris',
    hex: '#6B7280',
  },
  {
    name: 'Beige',
    hex: '#D6C2A1',
  },
  {
    name: 'Marrón',
    hex: '#78350F',
  },
];

const sizes = ['S', 'M', 'L', 'XL'];

const productImages: Record<string, string[]> = {
  'Camiseta Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790241898/Black-Essentials-T-Shirt-1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242034/32245964_62108060_1000-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790241970/esential_azul-removebg-preview.png',
  ],

  'Camiseta Oversize Street': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242083/camiseta-blanca-resertricted-world-tour-oversized-tee-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242146/p26-regards-r14000navy-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242218/11-removebg-preview.png',
  ],

  'Camiseta Logo Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242318/1d3460d43ff64952981289395b1acdac-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242362/74832b3fc77f44259a31feba84401242-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242442/DM0DM22545_C63_alternate4-removebg-preview.png',
  ],

  'Camiseta Premium Cotton': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242609/CMU12H132J-F-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242640/images-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242666/00773172485-o1-removebg-preview.png',
  ],

  'Camiseta Basic Fit': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790242919/21c979eae0a3406ab1a2ab9f9168ce23-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790243000/elykt00117_element_f_grh_frt1-removebg-preview_1.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790243037/out-fit-camiseta-basica-de-algodon-removebg-preview.png',
  ],

  'Sudadera Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790243789/i6609230635-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790243798/MECHOO50113V_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790243755/0bb9469b-1f80-4243-ab96-8d1e9bbd3a0a-removebg-preview.png',
  ],

  'Sudadera Oversize': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244107/05054314832-A6-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244074/17031278410b8c4a3469ff0e857be237fb847b4861_thumbnail_750x999-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244131/195824-2698-PECROPED_BROWNICE-WEB3-1-removebg-preview.png',
  ],

  'Sudadera Classic Hoodie': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244364/sudadera-con-capucha-the-north-face-evolution-simple-dome-regular-oscuro_887058a55e974d2cb6e76719ecd47fef_3369653601-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244399/MRSS24-602_sivasdescalzo-Martine_Rose-CLASSIC_HOODIE-1710423954-5-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790244430/OFF-WHITECLASSICHOODIE_44C00_1-removebg-preview.png',
  ],

  'Sudadera Urban Logo': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790412100/SU1087_55_2_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790412076/urban-white-hoodie_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790412046/CAPUCHA_NEGRA_LOGO_FRONTAL_URBANSOUL1-removebg-preview.png',
  ],

  'Sudadera Premium': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414710/white-premium-embroidered-hoodie_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414754/elPulpo_Videos_web_19-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414730/sudadera-de-felpa-ligera-azul-evb29_1_hd4-removebg-preview.png',
  ],

  'Pantalón Cargo Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414915/UM0UM03911_XNN_alternate4-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414933/picture-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414951/6088c1641ccd4b3484b48e9ab9c9f838-removebg-preview.png',
  ],

  'Pantalón Cargo Street': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790414951/6088c1641ccd4b3484b48e9ab9c9f838-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790415164/fc487399b86b4b7f8d10601d8d076706-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790415186/pantalon-gris-asimetrical-pocket-cargo-jogger-removebg-preview.png',
  ],

  'Pantalón Jogger Basic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420081/PA0097UOAY14_BG1_006-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420107/pantalon-de-jogging-rojo-aza41_25_hd2-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420124/pantalon-gris-basic-jogger-removebg-preview.png',
  ],

  'Pantalón Jogger Premium': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420365/pantalon-jogger-gris-perla-de-microfibra-360-gary-s-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420384/pantalon-jogger-deportivo-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790420405/9468-329-7-removebg-preview.png',
  ],

  'Pantalón Relaxed Fit': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422095/62PH602900293_06_1x1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422124/00127011706-o1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422134/1785844372_b7d7a1ce66713f480abea366cafefb80-removebg-preview.png',
  ],

  'Vaquero Straight Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422402/5ae910f8d8ae4634a9ca8d66d605b008-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422386/pantalones-pierna-ancha-ribcage-lightweight_123-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422359/www-001051111100353-s0-removebg-preview.png',
  ],

  'Vaquero Slim Fit': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422629/front-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422648/P_260023899FM-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790422600/jackjones-jjieddiejjbasicsq735noos-azul-removebg-preview.png',
  ],

  'Vaquero Relaxed': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423091/9f48f0ab726e45c5b75a2c2c7782a456-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423111/vaquero-relaxed-fit-azul-bfm18_2_hd1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423067/1-removebg-preview_1.png',
  ],

  'Vaquero Dark Denim': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423330/NP0A4G5RD1K-HERO-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423402/d7a0814d2abe4ae79a77b2d9a740d61f-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423410/8ba6a93fd11f46df9402d65018108924-removebg-preview.png',
  ],

  'Vaquero Vintage Wash': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423617/MECJEA49942V_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423592/4b64d9a192a94dd8afe44b877179dd0e-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790423578/MECJEA60009V_1-removebg-preview.png',
  ],

  'Chaqueta Denim Classic': [],

  'Chaqueta Bomber Urban': [],

  'Chaqueta Varsity': [],

  'Chaqueta Lightweight': [],

  'Chaqueta Essential': [],

  'Zapatillas Runner Classic': [],

  'Zapatillas Urban Pro': [],

  'Zapatillas Street Low': [],

  'Zapatillas Retro Runner': [],

  'Zapatillas Essential': [],

  'Camisa Oxford Classic': [],

  'Camisa Linen Summer': [],

  'Camisa Oversize Street': [],

  'Camisa Flannel Classic': [],

  'Camisa Premium Fit': [],

  'Short Essential': [],

  'Short Cargo': [],

  'Short Sport': [],

  'Short Denim': [],

  'Short Relaxed': [],

  'Polo Classic': [],

  'Polo Premium': [],

  'Polo Sport': [],

  'Polo Urban': [],

  'Polo Essential Fit': [],

  'Gorra Logo Classic': [],

  'Gorra Urban': [],

  'Mochila Essential': [],

  'Riñonera Street': [],

  'Bolso Crossbody Urban': [],
};

const productsData = [
  {
    name: 'Camiseta Essential',
    type: 'Camiseta',
    price: 19.99,
    description:
      'Camiseta básica de algodón con corte cómodo y diseño minimalista.',
  },
  {
    name: 'Camiseta Oversize Street',
    type: 'Camiseta',
    price: 24.99,
    description:
      'Camiseta oversize de inspiración urbana con tejido suave y resistente.',
  },
  {
    name: 'Camiseta Logo Classic',
    type: 'Camiseta',
    price: 29.99,
    description:
      'Camiseta de corte clásico con logo frontal y acabado premium.',
  },
  {
    name: 'Camiseta Premium Cotton',
    type: 'Camiseta',
    price: 34.99,
    description:
      'Camiseta confeccionada en algodón premium para un uso diario.',
  },
  {
    name: 'Camiseta Basic Fit',
    type: 'Camiseta',
    price: 17.99,
    description: 'Camiseta de corte regular pensada para combinar fácilmente.',
  },
  {
    name: 'Sudadera Essential',
    type: 'Sudadera',
    price: 39.99,
    description: 'Sudadera de algodón con interior suave y diseño atemporal.',
  },
  {
    name: 'Sudadera Oversize',
    type: 'Sudadera',
    price: 49.99,
    description: 'Sudadera oversize con capucha y estilo urbano.',
  },
  {
    name: 'Sudadera Classic Hoodie',
    type: 'Sudadera',
    price: 44.99,
    description: 'Sudadera con capucha, bolsillo frontal y ajuste cómodo.',
  },
  {
    name: 'Sudadera Urban Logo',
    type: 'Sudadera',
    price: 54.99,
    description:
      'Sudadera urbana con estampado frontal y tejido de gran calidad.',
  },
  {
    name: 'Sudadera Premium',
    type: 'Sudadera',
    price: 59.99,
    description: 'Sudadera premium con tejido grueso y acabados reforzados.',
  },
  {
    name: 'Pantalón Cargo Essential',
    type: 'Pantalón',
    price: 49.99,
    description: 'Pantalón cargo con bolsillos laterales y corte cómodo.',
  },
  {
    name: 'Pantalón Cargo Street',
    type: 'Pantalón',
    price: 54.99,
    description: 'Pantalón cargo inspirado en la moda urbana contemporánea.',
  },
  {
    name: 'Pantalón Jogger Basic',
    type: 'Pantalón',
    price: 39.99,
    description: 'Jogger cómodo con cintura elástica y tejido suave.',
  },
  {
    name: 'Pantalón Jogger Premium',
    type: 'Pantalón',
    price: 49.99,
    description:
      'Jogger premium diseñado para ofrecer comodidad durante todo el día.',
  },
  {
    name: 'Pantalón Relaxed Fit',
    type: 'Pantalón',
    price: 44.99,
    description: 'Pantalón de corte relajado con diseño moderno.',
  },
  {
    name: 'Vaquero Straight Classic',
    type: 'Vaquero',
    price: 59.99,
    description: 'Vaquero de corte recto con acabado clásico.',
  },
  {
    name: 'Vaquero Slim Fit',
    type: 'Vaquero',
    price: 64.99,
    description: 'Vaquero slim fit con tejido ligeramente elástico.',
  },
  {
    name: 'Vaquero Relaxed',
    type: 'Vaquero',
    price: 69.99,
    description: 'Vaquero de corte relajado inspirado en el estilo vintage.',
  },
  {
    name: 'Vaquero Dark Denim',
    type: 'Vaquero',
    price: 64.99,
    description: 'Vaquero de denim oscuro con acabado elegante.',
  },
  {
    name: 'Vaquero Vintage Wash',
    type: 'Vaquero',
    price: 69.99,
    description: 'Vaquero con lavado vintage y estética urbana.',
  },
  {
    name: 'Chaqueta Denim Classic',
    type: 'Chaqueta',
    price: 79.99,
    description: 'Chaqueta vaquera clásica perfecta para entretiempo.',
  },
  {
    name: 'Chaqueta Bomber Urban',
    type: 'Chaqueta',
    price: 89.99,
    description: 'Chaqueta bomber de inspiración urbana con diseño moderno.',
  },
  {
    name: 'Chaqueta Varsity',
    type: 'Chaqueta',
    price: 99.99,
    description: 'Chaqueta varsity con detalles deportivos y acabado premium.',
  },
  {
    name: 'Chaqueta Lightweight',
    type: 'Chaqueta',
    price: 74.99,
    description: 'Chaqueta ligera ideal para días de entretiempo.',
  },
  {
    name: 'Chaqueta Essential',
    type: 'Chaqueta',
    price: 84.99,
    description: 'Chaqueta básica con diseño minimalista y versátil.',
  },
  {
    name: 'Zapatillas Runner Classic',
    type: 'Zapatillas',
    price: 89.99,
    description: 'Zapatillas deportivas ligeras para uso diario.',
  },
  {
    name: 'Zapatillas Urban Pro',
    type: 'Zapatillas',
    price: 99.99,
    description: 'Zapatillas urbanas con diseño moderno y suela resistente.',
  },
  {
    name: 'Zapatillas Street Low',
    type: 'Zapatillas',
    price: 79.99,
    description: 'Zapatillas de perfil bajo inspiradas en la moda streetwear.',
  },
  {
    name: 'Zapatillas Retro Runner',
    type: 'Zapatillas',
    price: 109.99,
    description: 'Zapatillas retro con estética deportiva y acabados premium.',
  },
  {
    name: 'Zapatillas Essential',
    type: 'Zapatillas',
    price: 69.99,
    description: 'Zapatillas básicas y versátiles para el día a día.',
  },
  {
    name: 'Camisa Oxford Classic',
    type: 'Camisa',
    price: 44.99,
    description:
      'Camisa Oxford clásica con corte cómodo y cuello estructurado.',
  },
  {
    name: 'Camisa Linen Summer',
    type: 'Camisa',
    price: 49.99,
    description: 'Camisa ligera de inspiración veraniega con tejido fresco.',
  },
  {
    name: 'Camisa Oversize Street',
    type: 'Camisa',
    price: 54.99,
    description: 'Camisa oversize con diseño urbano y corte contemporáneo.',
  },
  {
    name: 'Camisa Flannel Classic',
    type: 'Camisa',
    price: 59.99,
    description: 'Camisa de franela cómoda y versátil para looks informales.',
  },
  {
    name: 'Camisa Premium Fit',
    type: 'Camisa',
    price: 64.99,
    description: 'Camisa premium con corte elegante y tejido de alta calidad.',
  },
  {
    name: 'Short Essential',
    type: 'Shorts',
    price: 29.99,
    description: 'Short básico y cómodo para los días más cálidos.',
  },
  {
    name: 'Short Cargo',
    type: 'Shorts',
    price: 34.99,
    description: 'Short cargo con bolsillos laterales y estilo urbano.',
  },
  {
    name: 'Short Sport',
    type: 'Shorts',
    price: 27.99,
    description: 'Short deportivo ligero pensado para máxima comodidad.',
  },
  {
    name: 'Short Denim',
    type: 'Shorts',
    price: 39.99,
    description: 'Short vaquero clásico con acabado lavado.',
  },
  {
    name: 'Short Relaxed',
    type: 'Shorts',
    price: 32.99,
    description: 'Short de corte relajado y diseño minimalista.',
  },
  {
    name: 'Polo Classic',
    type: 'Polo',
    price: 39.99,
    description: 'Polo clásico de algodón con cuello estructurado.',
  },
  {
    name: 'Polo Premium',
    type: 'Polo',
    price: 49.99,
    description: 'Polo premium confeccionado con algodón de alta calidad.',
  },
  {
    name: 'Polo Sport',
    type: 'Polo',
    price: 44.99,
    description: 'Polo deportivo ligero y cómodo para uso diario.',
  },
  {
    name: 'Polo Urban',
    type: 'Polo',
    price: 42.99,
    description: 'Polo de inspiración urbana con corte contemporáneo.',
  },
  {
    name: 'Polo Essential Fit',
    type: 'Polo',
    price: 34.99,
    description: 'Polo básico de corte regular y diseño versátil.',
  },
  {
    name: 'Gorra Logo Classic',
    type: 'Accesorio',
    price: 24.99,
    description: 'Gorra clásica con logo frontal y cierre ajustable.',
  },
  {
    name: 'Gorra Urban',
    type: 'Accesorio',
    price: 27.99,
    description: 'Gorra urbana con diseño minimalista y ajuste trasero.',
  },
  {
    name: 'Mochila Essential',
    type: 'Accesorio',
    price: 49.99,
    description: 'Mochila urbana con varios compartimentos y diseño funcional.',
  },
  {
    name: 'Riñonera Street',
    type: 'Accesorio',
    price: 29.99,
    description: 'Riñonera compacta para llevar tus objetos esenciales.',
  },
  {
    name: 'Bolso Crossbody Urban',
    type: 'Accesorio',
    price: 39.99,
    description: 'Bolso bandolera compacto con diseño urbano y funcional.',
  },
];

const reviewComments = [
  'Muy buena calidad, estoy bastante contento con la compra.',
  'El producto es tal y como aparece en las imágenes.',
  'Buena relación calidad-precio.',
  'Me ha gustado mucho el acabado y el diseño.',
  'La talla queda perfecta y el material es cómodo.',
  'Producto recomendado, volvería a comprarlo.',
];

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('🌱 Iniciando seed...');

  await dataSource.initialize();

  const brandRepository = dataSource.getRepository(Brand);
  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);
  const variantRepository = dataSource.getRepository(ProductVariant);
  const imageRepository = dataSource.getRepository(ProductImage);

  try {
    // ============================================================
    // MARCAS
    // ============================================================

    const brandEntities: Brand[] = [];

    for (const brandName of brands) {
      let brand = await brandRepository.findOne({
        where: {
          name: brandName,
        },
      });

      if (!brand) {
        brand = brandRepository.create({
          name: brandName,
        });

        brand = await brandRepository.save(brand);

        console.log(`✅ Marca creada: ${brand.name}`);
      } else {
        console.log(`↪️ Marca existente: ${brand.name}`);
      }

      brandEntities.push(brand);
    }

    // ============================================================
    // CATEGORÍAS
    // ============================================================

    const categoryEntities: Category[] = [];

    for (const categoryName of categories) {
      let category = await categoryRepository.findOne({
        where: {
          name: categoryName,
        },
      });

      if (!category) {
        category = categoryRepository.create({
          name: categoryName,
        });

        category = await categoryRepository.save(category);

        console.log(`✅ Categoría creada: ${category.name}`);
      } else {
        console.log(`↪️ Categoría existente: ${category.name}`);
      }

      categoryEntities.push(category);
    }

    // ============================================================
    // PRODUCTOS
    // ============================================================

    for (let index = 0; index < productsData.length; index++) {
      const productData = productsData[index];

      // ----------------------------------------------------------
      // MARCA
      // ----------------------------------------------------------

      const brand = brandEntities[index % brandEntities.length];

      // ----------------------------------------------------------
      // CATEGORÍA
      // ----------------------------------------------------------

      const category =
        categoryEntities.find(
          (categoryEntity) =>
            categoryEntity.name.toLowerCase() ===
            productData.type.toLowerCase(),
        ) ?? getRandomItem(categoryEntities);

      const productCategories = [category];

      // Los vaqueros también pertenecen a Pantalones
      if (
        productData.type === 'Vaquero' &&
        !productCategories.some((item) => item.name === 'Pantalones')
      ) {
        const pantalones = categoryEntities.find(
          (item) => item.name === 'Pantalones',
        );

        if (pantalones) {
          productCategories.push(pantalones);
        }
      }

      // ----------------------------------------------------------
      // PRODUCTO
      // ----------------------------------------------------------

      let product = await productRepository.findOne({
        where: {
          name: productData.name,
        },
      });

      if (!product) {
        const reviews = [
          {
            id: 1,
            userId: getRandomNumber(1, 5),
            rating: getRandomNumber(4, 5),
            comment: getRandomItem(reviewComments),
          },
          {
            id: 2,
            userId: getRandomNumber(1, 5),
            rating: getRandomNumber(3, 5),
            comment: getRandomItem(reviewComments),
          },
        ];

        product = productRepository.create({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          brand,
          categories: productCategories,
          reviews,
        });

        product = await productRepository.save(product);

        console.log(`🛍️ Producto creado: ${product.name}`);
      } else {
        console.log(`↪️ Producto existente: ${product.name}`);
      }

      // ============================================================
      // IMÁGENES DE CLOUDINARY
      // ============================================================

      const urls = productImages[productData.name] ?? [];

      for (const url of urls) {
        if (!url) {
          continue;
        }

        const existingImage = await imageRepository.findOne({
          where: {
            url,
            product: {
              id: product.id,
            },
          },
        });

        if (existingImage) {
          console.log(`   ↪️ Imagen existente`);
          continue;
        }

        const image = imageRepository.create({
          url,
          product,
        });

        await imageRepository.save(image);

        console.log(`   🖼️ Imagen añadida`);
      }

      // ============================================================
      // VARIANTES
      // ============================================================

      /*
       * Cada producto tendrá 3 colores y 4 tallas.
       *
       * Gracias al @Unique(['product', 'size', 'color'])
       * de ProductVariant, cada combinación es única.
       */

      const startColorIndex = index % colors.length;

      const productColors = [
        colors[startColorIndex],
        colors[(startColorIndex + 1) % colors.length],
        colors[(startColorIndex + 2) % colors.length],
      ];

      let variantsCreated = 0;

      for (const color of productColors) {
        for (const size of sizes) {
          const existingVariant = await variantRepository.findOne({
            where: {
              product: {
                id: product.id,
              },
              size,
              color: color.name,
            },
          });

          if (existingVariant) {
            continue;
          }

          const variant = variantRepository.create({
            product,
            size,
            color: color.name,
            colorHex: color.hex,
            stock: getRandomNumber(0, 25),
          });

          await variantRepository.save(variant);

          variantsCreated++;
        }
      }

      if (variantsCreated > 0) {
        console.log(`   🎨 ${variantsCreated} variantes creadas`);
      } else {
        console.log(`   ↪️ Variantes existentes`);
      }
    }

    console.log('');
    console.log('==========================================');
    console.log('🎉 SEED COMPLETADO');
    console.log('==========================================');
    console.log(`Productos procesados: ${productsData.length}`);
    console.log(`Marcas: ${brandEntities.length}`);
    console.log(`Categorías: ${categoryEntities.length}`);
    console.log('==========================================');
  } catch (error) {
    console.error('❌ Error ejecutando el seed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => {
    console.log('✅ Seed finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
