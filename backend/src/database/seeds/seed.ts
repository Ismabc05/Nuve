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

  'Chaqueta Denim Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499412/4d7ea7fa44fc43bc80f41b4e4ddca897-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499435/8998d4bd43b940339752738d0ed4863d-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499459/d9aa11308bdd4211be81541f30251f8f-removebg-preview.png',
  ],

  'Chaqueta Bomber Urban': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499630/0be3fd5eb6974680bcec18d766378cfc-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499665/08ab7b970e9742ec8921eccf84e30b23-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790499659/7925fff54fb04fe0b01ecdd0ce8c77cc-removebg-preview.png',
  ],

  'Chaqueta Varsity': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790519705/a70fdef02b69444fadea87ebaeda7cee-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790519732/03456ca965f7456cb8586b663cc269b6-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790519748/7fe065214c074f068342b130f2a2d13d-removebg-preview.png',
  ],

  'Chaqueta Lightweight': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520060/chaqueta-de-running-under-armour-launch-lightweight-hombre-blanco-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520102/9a741e6c135945879c4c9c30bd6ac1f6-removebg-preview_1.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520122/8b614dd27a10425aa8a2f6255fbd771e-removebg-preview.png',
  ],

  'Chaqueta Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520444/KS0KS00584_C1G_alternate8-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520406/chaqueta-abullonada-aislante-essentials-highloft-adidas_7a85741b8c414edfa15d8bb50f8fe7ec_1507188631-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520436/KB0KB09852_BDS_alternate4-removebg-preview.png',
  ],

  'Zapatillas Runner Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520661/4f73dd51b7ef7080606397ac0810660f-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520678/9f251f0794ae4142851bbe8c360acbb6-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790520683/32e6fc52313f422e9c53d790a22c743e-removebg-preview.png',
  ],

  'Zapatillas Urban Pro': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521124/09e723c1dd9e961bcb9395754ee73b13-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521163/P_152475427D1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521144/1255-03_1-removebg-preview.png',
  ],

  'Zapatillas Street Low': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521337/timberland-womens-emerson-street-low-lace-up-sneaker-zapatillas-deportivas-detail-3-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521298/luna-trend-m5070-rojo-deportivo-casual-suela-plana-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790521345/zapatillas-tommy-hilfiger-vulc-street-low-fm0fm05458-verde-0000304424083-removebg-preview.png',
  ],

  'Zapatillas Retro Runner': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587278/sneakers-casual-teddy-smith-azul-marino-hombre-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587261/zapatillas-tommy-hilfiger-th-retro-runner-fw0fw09690-gris-claro-0000306194847-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587310/zapatillas-new-balance-530-removebg-preview.png',
  ],

  'Zapatillas Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587683/ax_armani_exchange-sneaker-xw002797af17465u6223-3325533-b-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587705/morrison-essential-grey-445116-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790587666/862226s2-removebg-preview.png',
  ],

  'Camisa Oxford Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790938835/34494380_67860954_600-removebg-preview_1.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790938802/9522799290174c43adfc5dd8c30ef1ec-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790938787/camisa-oxford-workwear-hombre-classic-fit-removebg-preview.png',
  ],

  'Camisa Linen Summer': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939038/5896577ea4bd464b9293ebfff1ad0ada-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939055/jack_-_-jones-camisa-de-manga-corta-summer-linen-blend-resort-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939077/29089911r-removebg-preview.png',
  ],

  'Camisa Oversize Street': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939289/camiseta-blanca-los-angeles-oversized-tee-5369768-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939305/camiseta-royal-falling-stars-oversized-tee-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939312/oversized-street-letter-print-t-shirt-8-01KM5GQBRP1DDTBD0CVCXMT910-removebg-preview.png',
  ],

  'Camisa Flannel Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939512/VN000TAJKIG_SXY_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939505/elywt00134_element_f_ktp2_bck1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939470/39e9728ce2654432ba379418bcab4a5d-removebg-preview.png',
  ],

  'Camisa Premium Fit': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939692/C66_1B_BC_2LI0336UNR000-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939717/d75b2f1f4962400c8f4ff30e5731ae2a-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939735/H92350s7-removebg-preview.png',
  ],

  'Short Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790940090/picture-removebg-preview_1.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790940074/ec995aa4ee5d409f93cf7362a73a811f-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790939959/adidas-essentials-solid-short-green-1-removebg-preview.png',
  ],

  'Short Cargo': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790940577/31582011r-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790940588/ec9b5f43d12f4e4c8e89468b74d6bda0-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1790940609/D262WHP210-W.CargoShorts-Red-03-removebg-preview_1.png',
  ],

  'Short Sport': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791019798/florence-marinex-all-purpose-cordura-short-dark-brown-bck-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791019815/d27cfc5c67de4cb2aa09ccb0416d25eb-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791019840/9f5ef40378184fa69c2069877891e129-removebg-preview.png',
  ],

  'Short Denim': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020006/85d0f236a5dc4aee9e34e0ed9d78039a-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020007/eljds00105_element_f_crb0_frt1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020007/d60935070da04c078aba39d1dabd9570-removebg-preview.png',
  ],

  'Short Relaxed': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020163/1771947052_7bd6bb7316b79f81b3fc37749c0cc6d5-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020163/P_779323201D8-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020163/hbeu50557421_118_100-removebg-preview.png',
  ],

  'Polo Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020418/polo-classic-fit-lavable-hasta-60degc-800x800-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020419/1140367_BLAC_1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020419/26884511r_1-removebg-preview.png',
  ],

  'Polo Premium': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020724/polo-premium-hombre-removebg-preview_1.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020772/picture-removebg-preview_2.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020783/polo-premium-personalizado-removebg-preview_2.png',
  ],

  'Polo Sport': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020947/710750444025_sivasdescalzo-Polo_Ralph_Lauren-26_1_JERSEY-SSL-TSH-1691503881-1-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020946/d50a8668eec0433fbf9f682d4008afd5-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791020946/fbe1aa2c35f242b09de176a6fa5c6b6d-removebg-preview.png',
  ],

  'Polo Urban': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021210/0412200720684_004_a2-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021210/0417621551145_030_b-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021209/d25609f51f2b4cef85c45fed1b9fccc2-removebg-preview.png',
  ],

  'Polo Essential Fit': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021369/cd53e39fb2f04bcdaebcba502df402e5-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021370/4aa309ee02b1d7ec9f49b2711065-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021369/polo-ralph-lauren-camiseta-710671438527-marron-claro-regular-fit-0000306061385-removebg-preview.png',
  ],

  'Gorra Logo Classic': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021678/5d390cbe8f2d46e8a40ab96aef1c635d-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021570/Gorra-gris-oscuro-Trucker-logo-nombre-blanco-classic-lateral-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021561/CASQUETTE_MARRON_BEURRE_LAURENE_1-removebg-preview.png',
  ],

  'Gorra Urban': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021961/nik1006_nik-1002-mm-jpg-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021961/ba-sh-gorra-henri-denim-marron-2e26henr-3324557-a-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791021963/55bb2dd534714ff7bd4db00f2b73e015-removebg-preview.png',
  ],

  'Mochila Essential': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022158/hyirwdYXzQD8bBLxE9bJwJY-7L52oUPalvNcajoQ0_Q-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022159/MOCHILA_ESSENTIALS_Tenth_MOCHILA_SIERRA_MOUNT_HOMBRE_6526153702-802-1_14092026101501-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022160/MOCHILA_ESSENTIALS_Tenth_SIERRA_ZIPPER_12L_WN_MUJER_5726140704-810-1_16042026124038-removebg-preview.png',
  ],

  'Riñonera Street': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022291/P_722083101FM-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022292/D75740001-alt1-pdp-lse-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022293/83a2bb79982c4d8795121816d6fa8a34-removebg-preview.png',
  ],

  'Bolso Crossbody Urban': [
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022459/72ba9333109b43f3a26da5278d21214d-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022460/0279212b14dd4a759718afb89dcbe402-removebg-preview.png',
    'https://res.cloudinary.com/nefbv7lf/image/upload/v1791022462/johnny_urban_lou_medium_blue_accessorie_crossbodyb_john01525_4070402003455_6-removebg-preview.png',
  ],
};

const productsData = [
  {
    name: 'Camiseta Essential',
    type: 'Camisetas',
    price: 19.99,
    description:
      'Camiseta básica de algodón con corte cómodo y diseño minimalista.',
  },
  {
    name: 'Camiseta Oversize Street',
    type: 'Camisetas',
    price: 24.99,
    description:
      'Camiseta oversize de inspiración urbana con tejido suave y resistente.',
  },
  {
    name: 'Camiseta Logo Classic',
    type: 'Camisetas',
    price: 29.99,
    description:
      'Camiseta de corte clásico con logo frontal y acabado premium.',
  },
  {
    name: 'Camiseta Premium Cotton',
    type: 'Camisetas',
    price: 34.99,
    description:
      'Camiseta confeccionada en algodón premium para un uso diario.',
  },
  {
    name: 'Camiseta Basic Fit',
    type: 'Camisetas',
    price: 17.99,
    description: 'Camiseta de corte regular pensada para combinar fácilmente.',
  },
  {
    name: 'Sudadera Essential',
    type: 'Sudaderas',
    price: 39.99,
    description: 'Sudadera de algodón con interior suave y diseño atemporal.',
  },
  {
    name: 'Sudadera Oversize',
    type: 'Sudaderas',
    price: 49.99,
    description: 'Sudadera oversize con capucha y estilo urbano.',
  },
  {
    name: 'Sudadera Classic Hoodie',
    type: 'Sudaderas',
    price: 44.99,
    description: 'Sudadera con capucha, bolsillo frontal y ajuste cómodo.',
  },
  {
    name: 'Sudadera Urban Logo',
    type: 'Sudaderas',
    price: 54.99,
    description:
      'Sudadera urbana con estampado frontal y tejido de gran calidad.',
  },
  {
    name: 'Sudadera Premium',
    type: 'Sudaderas',
    price: 59.99,
    description: 'Sudadera premium con tejido grueso y acabados reforzados.',
  },
  {
    name: 'Pantalón Cargo Essential',
    type: 'Pantalónes',
    price: 49.99,
    description: 'Pantalón cargo con bolsillos laterales y corte cómodo.',
  },
  {
    name: 'Pantalón Cargo Street',
    type: 'Pantalones',
    price: 54.99,
    description: 'Pantalón cargo inspirado en la moda urbana contemporánea.',
  },
  {
    name: 'Pantalón Jogger Basic',
    type: 'Pantalones',
    price: 39.99,
    description: 'Jogger cómodo con cintura elástica y tejido suave.',
  },
  {
    name: 'Pantalón Jogger Premium',
    type: 'Pantalones',
    price: 49.99,
    description:
      'Jogger premium diseñado para ofrecer comodidad durante todo el día.',
  },
  {
    name: 'Pantalón Relaxed Fit',
    type: 'Pantalones',
    price: 44.99,
    description: 'Pantalón de corte relajado con diseño moderno.',
  },
  {
    name: 'Vaquero Straight Classic',
    type: 'Vaqueros',
    price: 59.99,
    description: 'Vaquero de corte recto con acabado clásico.',
  },
  {
    name: 'Vaquero Slim Fit',
    type: 'Vaqueros',
    price: 64.99,
    description: 'Vaquero slim fit con tejido ligeramente elástico.',
  },
  {
    name: 'Vaquero Relaxed',
    type: 'Vaqueros',
    price: 69.99,
    description: 'Vaquero de corte relajado inspirado en el estilo vintage.',
  },
  {
    name: 'Vaquero Dark Denim',
    type: 'Vaqueros',
    price: 64.99,
    description: 'Vaquero de denim oscuro con acabado elegante.',
  },
  {
    name: 'Vaquero Vintage Wash',
    type: 'Vaqueros',
    price: 69.99,
    description: 'Vaquero con lavado vintage y estética urbana.',
  },
  {
    name: 'Chaqueta Denim Classic',
    type: 'Chaquetas',
    price: 79.99,
    description: 'Chaqueta vaquera clásica perfecta para entretiempo.',
  },
  {
    name: 'Chaqueta Bomber Urban',
    type: 'Chaquetas',
    price: 89.99,
    description: 'Chaqueta bomber de inspiración urbana con diseño moderno.',
  },
  {
    name: 'Chaqueta Varsity',
    type: 'Chaquetas',
    price: 99.99,
    description: 'Chaqueta varsity con detalles deportivos y acabado premium.',
  },
  {
    name: 'Chaqueta Lightweight',
    type: 'Chaquetas',
    price: 74.99,
    description: 'Chaqueta ligera ideal para días de entretiempo.',
  },
  {
    name: 'Chaqueta Essential',
    type: 'Chaquetas',
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
    type: 'Camisas',
    price: 44.99,
    description:
      'Camisa Oxford clásica con corte cómodo y cuello estructurado.',
  },
  {
    name: 'Camisa Linen Summer',
    type: 'Camisas',
    price: 49.99,
    description: 'Camisa ligera de inspiración veraniega con tejido fresco.',
  },
  {
    name: 'Camisa Oversize Street',
    type: 'Camisas',
    price: 54.99,
    description: 'Camisa oversize con diseño urbano y corte contemporáneo.',
  },
  {
    name: 'Camisa Flannel Classic',
    type: 'Camisas',
    price: 59.99,
    description: 'Camisa de franela cómoda y versátil para looks informales.',
  },
  {
    name: 'Camisa Premium Fit',
    type: 'Camisas',
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
    type: 'Polos',
    price: 39.99,
    description: 'Polo clásico de algodón con cuello estructurado.',
  },
  {
    name: 'Polo Premium',
    type: 'Polos',
    price: 49.99,
    description: 'Polo premium confeccionado con algodón de alta calidad.',
  },
  {
    name: 'Polo Sport',
    type: 'Polos',
    price: 44.99,
    description: 'Polo deportivo ligero y cómodo para uso diario.',
  },
  {
    name: 'Polo Urban',
    type: 'Polos',
    price: 42.99,
    description: 'Polo de inspiración urbana con corte contemporáneo.',
  },
  {
    name: 'Polo Essential Fit',
    type: 'Polos',
    price: 34.99,
    description: 'Polo básico de corte regular y diseño versátil.',
  },
  {
    name: 'Gorra Logo Classic',
    type: 'Accesorios',
    price: 24.99,
    description: 'Gorra clásica con logo frontal y cierre ajustable.',
  },
  {
    name: 'Gorra Urban',
    type: 'Accesorios',
    price: 27.99,
    description: 'Gorra urbana con diseño minimalista y ajuste trasero.',
  },
  {
    name: 'Mochila Essential',
    type: 'Accesorios',
    price: 49.99,
    description: 'Mochila urbana con varios compartimentos y diseño funcional.',
  },
  {
    name: 'Riñonera Street',
    type: 'Accesorios',
    price: 29.99,
    description: 'Riñonera compacta para llevar tus objetos esenciales.',
  },
  {
    name: 'Bolso Crossbody Urban',
    type: 'Accesorios',
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
