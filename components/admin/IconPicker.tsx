'use client'

import { useState } from 'react'
import {
  FaChurch,
  FaCamera,
  FaUtensils,
  FaMusic,
  FaGlassCheers,
  FaHeart,
  FaRing,
  FaCar,
  FaGift,
  FaClock,
  FaStar,
  FaSun,
  FaMoon,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWineGlass,
  FaCocktail,
  FaBirthdayCake,
  FaHotel,
  FaPlane,
  FaBus,
  FaTaxi,
  FaTree,
  FaUmbrella,
  FaGlassWhiskey,
  FaDrumstickBite,
  FaIceCream,
  FaCoffee,
  FaPizzaSlice,
  FaHamburger,
  FaBreadSlice,
  FaCheese,
  FaAppleAlt,
  FaCarrot,
  FaLeaf,
  FaFireAlt,
  FaSnowflake,
  FaCloudSun,
  FaCloudMoon,
  FaBolt,
  FaRainbow,
  FaFeather,
  FaPaw,
  FaDove,
  FaButterfly,
  FaFlask,
  FaTheaterMasks,
  FaMicrophone,
  FaGuitar,
  FaDrum,
  FaCompactDisc,
  FaHeadphones,
  FaFilm,
  FaGamepad,
  FaDice,
  FaChessKnight,
  FaPuzzlePiece,
  FaBicycle,
  FaMotorcycle,
  FaShip,
  FaAnchor,
  FaUmbrellaBeach,
  FaMountain,
  FaCampground,
  FaLandmark,
  FaUniversity,
  FaMonument,
  FaGem,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaAward,
  FaBell,
  FaBullhorn,
  FaFlag,
  FaMapPin,
  FaCompass,
  FaGlobe,
  FaHome,
  FaBed,
  FaCouch,
  FaDoorOpen,
  FaKey,
  FaEnvelope,
  FaEnvelopeOpen,
  FaBook,
  FaBookOpen,
  FaPen,
  FaPencilAlt,
  FaPalette,
  FaPaintBrush,
  FaMagic,
} from 'react-icons/fa'
import {
  FaChampagneGlasses,
  FaBellConcierge,
  FaCakeCandles,
  FaMartiniGlass,
  FaMugSaucer,
  FaPersonWalking,
  FaPeopleGroup,
  FaPersonDress,
  FaUserTie,
  FaFaceSmile,
  FaFaceGrin,
  FaFaceLaugh,
  FaHandHoldingHeart,
  FaHandshake,
  FaBuildingColumns,
  FaCircleCheck,
  FaCircleHeart,
  FaCommentHeart,
  FaHouseChimney,
  FaMasksTheater,
  FaFireFlameCurved,
} from 'react-icons/fa6'
import {
  GiHighHeel,
  GiDress,
  GiBowTie,
  GiRose,
  GiDiamondRing,
  GiLargeDress,
  GiThreeLeaves,
  GiFlowerEmblem,
  GiFlowerPot,
  GiTulip,
  GiButterflyFlower,
  GiSunflower,
  GiMoonClaws,
  GiHearts,
  GiBalloons,
  GiPartyPopper,
  GiSparkles,
  GiCandleFlame,
  GiChurch,
  GiWineBottle,
  GiWineGlass,
  GiChampagneBottle,
  GiForkKnifeSpoon,
  GiKnifeFork,
  GiCakeSlice,
  GiChocolateBar,
  GiDonut,
  GiCupcake,
  GiCherry,
  GiStrawberry,
  GiGrapes,
  GiPeach,
  GiMusicSpell,
  GiLoveSong,
  GiCrystalBall,
  GiFeather,
  GiBigDiamondRing,
  GiHeartNecklace,
  GiDiamondHard,
  GiCrownOfThorns,
  GiQueenCrown,
  GiTiara,
  GiElegantChameleon,
  GiStarFormation,
  GiNightSky,
  GiFireplace,
  GiCampfire,
  GiForestCamp,
  GiBeachBall,
  GiIsland,
  GiPalmTree,
  GiMountains,
  GiMountaintop,
  GiHills,
  GiCaravan,
  GiVillage,
  GiCastle,
  GiTowerBridge,
  GiGate,
  GiArchiveRegister,
  GiScrollUnfurled,
  GiQuillInk,
  GiBookCover,
  GiOpenBook,
  GiLoveLetter,
  GiLoveHowl,
} from 'react-icons/gi'

const AVAILABLE_ICONS = [
  // Religiosos y Ceremoniales
  { name: 'FaChurch', icon: FaChurch, label: 'Iglesia', category: 'Religioso' },
  { name: 'GiChurch', icon: GiChurch, label: 'Iglesia 2', category: 'Religioso' },
  { name: 'FaBuildingColumns', icon: FaBuildingColumns, label: 'Templo', category: 'Religioso' },
  { name: 'FaLandmark', icon: FaLandmark, label: 'Monumento', category: 'Religioso' },
  { name: 'FaUniversity', icon: FaUniversity, label: 'Universidad', category: 'Religioso' },
  { name: 'GiCastle', icon: GiCastle, label: 'Castillo', category: 'Lugar' },
  { name: 'GiGate', icon: GiGate, label: 'Portal', category: 'Lugar' },
  
  // Amor y Romance
  { name: 'FaHeart', icon: FaHeart, label: 'Corazón', category: 'Amor' },
  { name: 'FaCircleHeart', icon: FaCircleHeart, label: 'Corazón circular', category: 'Amor' },
  { name: 'FaHandHoldingHeart', icon: FaHandHoldingHeart, label: 'Mano con corazón', category: 'Amor' },
  { name: 'GiHearts', icon: GiHearts, label: 'Corazones', category: 'Amor' },
  { name: 'GiLoveHowl', icon: GiLoveHowl, label: 'Amor', category: 'Amor' },
  { name: 'GiLoveLetter', icon: GiLoveLetter, label: 'Carta de amor', category: 'Amor' },
  { name: 'GiLoveSong', icon: GiLoveSong, label: 'Canción de amor', category: 'Amor' },
  
  // Anillos y Joyas
  { name: 'FaRing', icon: FaRing, label: 'Anillo', category: 'Joyería' },
  { name: 'GiDiamondRing', icon: GiDiamondRing, label: 'Anillo de diamante', category: 'Joyería' },
  { name: 'GiBigDiamondRing', icon: GiBigDiamondRing, label: 'Anillo grande', category: 'Joyería' },
  { name: 'GiHeartNecklace', icon: GiHeartNecklace, label: 'Collar de corazón', category: 'Joyería' },
  { name: 'FaGem', icon: FaGem, label: 'Gema', category: 'Joyería' },
  { name: 'GiDiamondHard', icon: GiDiamondHard, label: 'Diamante', category: 'Joyería' },
  { name: 'FaCrown', icon: FaCrown, label: 'Corona', category: 'Joyería' },
  { name: 'GiQueenCrown', icon: GiQueenCrown, label: 'Corona de reina', category: 'Joyería' },
  { name: 'GiTiara', icon: GiTiara, label: 'Tiara', category: 'Joyería' },
  
  // Vestimenta
  { name: 'GiBowTie', icon: GiBowTie, label: 'Corbatín', category: 'Vestimenta' },
  { name: 'GiDress', icon: GiDress, label: 'Vestido', category: 'Vestimenta' },
  { name: 'GiLargeDress', icon: GiLargeDress, label: 'Vestido de novia', category: 'Vestimenta' },
  { name: 'GiHighHeel', icon: GiHighHeel, label: 'Tacón', category: 'Vestimenta' },
  { name: 'FaPersonDress', icon: FaPersonDress, label: 'Persona con vestido', category: 'Vestimenta' },
  { name: 'FaUserTie', icon: FaUserTie, label: 'Persona de traje', category: 'Vestimenta' },
  
  // Comida y Bebida
  { name: 'FaUtensils', icon: FaUtensils, label: 'Cubiertos', category: 'Comida' },
  { name: 'GiForkKnifeSpoon', icon: GiForkKnifeSpoon, label: 'Cubiertos completos', category: 'Comida' },
  { name: 'GiKnifeFork', icon: GiKnifeFork, label: 'Cuchillo y tenedor', category: 'Comida' },
  { name: 'FaGlassCheers', icon: FaGlassCheers, label: 'Brindis', category: 'Bebidas' },
  { name: 'FaChampagneGlasses', icon: FaChampagneGlasses, label: 'Copas de champagne', category: 'Bebidas' },
  { name: 'FaWineGlass', icon: FaWineGlass, label: 'Copa de vino', category: 'Bebidas' },
  { name: 'GiWineGlass', icon: GiWineGlass, label: 'Copa de vino 2', category: 'Bebidas' },
  { name: 'GiWineBottle', icon: GiWineBottle, label: 'Botella de vino', category: 'Bebidas' },
  { name: 'GiChampagneBottle', icon: GiChampagneBottle, label: 'Botella de champagne', category: 'Bebidas' },
  { name: 'FaCocktail', icon: FaCocktail, label: 'Cóctel', category: 'Bebidas' },
  { name: 'FaMartiniGlass', icon: FaMartiniGlass, label: 'Copa Martini', category: 'Bebidas' },
  { name: 'FaGlassWhiskey', icon: FaGlassWhiskey, label: 'Whiskey', category: 'Bebidas' },
  { name: 'FaCoffee', icon: FaCoffee, label: 'Café', category: 'Bebidas' },
  { name: 'FaMugSaucer', icon: FaMugSaucer, label: 'Taza de café', category: 'Bebidas' },
  
  // Pasteles y Postres
  { name: 'FaBirthdayCake', icon: FaBirthdayCake, label: 'Pastel', category: 'Postres' },
  { name: 'FaCakeCandles', icon: FaCakeCandles, label: 'Pastel con velas', category: 'Postres' },
  { name: 'GiCakeSlice', icon: GiCakeSlice, label: 'Rebanada de pastel', category: 'Postres' },
  { name: 'GiCupcake', icon: GiCupcake, label: 'Cupcake', category: 'Postres' },
  { name: 'GiDonut', icon: GiDonut, label: 'Dona', category: 'Postres' },
  { name: 'FaIceCream', icon: FaIceCream, label: 'Helado', category: 'Postres' },
  { name: 'GiChocolateBar', icon: GiChocolateBar, label: 'Chocolate', category: 'Postres' },
  
  // Música y Entretenimiento
  { name: 'FaMusic', icon: FaMusic, label: 'Música', category: 'Entretenimiento' },
  { name: 'GiMusicSpell', icon: GiMusicSpell, label: 'Música mágica', category: 'Entretenimiento' },
  { name: 'FaMicrophone', icon: FaMicrophone, label: 'Micrófono', category: 'Entretenimiento' },
  { name: 'FaGuitar', icon: FaGuitar, label: 'Guitarra', category: 'Entretenimiento' },
  { name: 'FaDrum', icon: FaDrum, label: 'Tambor', category: 'Entretenimiento' },
  { name: 'FaHeadphones', icon: FaHeadphones, label: 'Audífonos', category: 'Entretenimiento' },
  { name: 'FaCompactDisc', icon: FaCompactDisc, label: 'Disco', category: 'Entretenimiento' },
  { name: 'FaTheaterMasks', icon: FaTheaterMasks, label: 'Máscaras de teatro', category: 'Entretenimiento' },
  { name: 'FaMasksTheater', icon: FaMasksTheater, label: 'Teatro', category: 'Entretenimiento' },
  
  // Fotografía
  { name: 'FaCamera', icon: FaCamera, label: 'Cámara', category: 'Fotografía' },
  { name: 'FaFilm', icon: FaFilm, label: 'Película', category: 'Fotografía' },
  
  // Celebración y Decoración
  { name: 'GiBalloons', icon: GiBalloons, label: 'Globos', category: 'Celebración' },
  { name: 'GiPartyPopper', icon: GiPartyPopper, label: 'Confeti', category: 'Celebración' },
  { name: 'GiSparkles', icon: GiSparkles, label: 'Destellos', category: 'Celebración' },
  { name: 'FaStar', icon: FaStar, label: 'Estrella', category: 'Celebración' },
  { name: 'GiStarFormation', icon: GiStarFormation, label: 'Estrellas', category: 'Celebración' },
  { name: 'FaBell', icon: FaBell, label: 'Campana', category: 'Celebración' },
  { name: 'FaBellConcierge', icon: FaBellConcierge, label: 'Campana de servicio', category: 'Celebración' },
  { name: 'FaFlag', icon: FaFlag, label: 'Bandera', category: 'Celebración' },
  { name: 'FaBullhorn', icon: FaBullhorn, label: 'Megáfono', category: 'Celebración' },
  { name: 'GiCandleFlame', icon: GiCandleFlame, label: 'Vela', category: 'Decoración' },
  { name: 'FaFireAlt', icon: FaFireAlt, label: 'Fuego', category: 'Decoración' },
  { name: 'FaFireFlameCurved', icon: FaFireFlameCurved, label: 'Llama', category: 'Decoración' },
  
  // Flores y Naturaleza
  { name: 'GiRose', icon: GiRose, label: 'Rosa', category: 'Flores' },
  { name: 'GiFlowerEmblem', icon: GiFlowerEmblem, label: 'Flor', category: 'Flores' },
  { name: 'GiFlowerPot', icon: GiFlowerPot, label: 'Maceta', category: 'Flores' },
  { name: 'GiTulip', icon: GiTulip, label: 'Tulipán', category: 'Flores' },
  { name: 'GiButterflyFlower', icon: GiButterflyFlower, label: 'Flor con mariposa', category: 'Flores' },
  { name: 'GiSunflower', icon: GiSunflower, label: 'Girasol', category: 'Flores' },
  { name: 'GiThreeLeaves', icon: GiThreeLeaves, label: 'Hojas', category: 'Naturaleza' },
  { name: 'FaLeaf', icon: FaLeaf, label: 'Hoja', category: 'Naturaleza' },
  { name: 'FaTree', icon: FaTree, label: 'Árbol', category: 'Naturaleza' },
  { name: 'GiPalmTree', icon: GiPalmTree, label: 'Palmera', category: 'Naturaleza' },
  { name: 'FaButterfly', icon: FaButterfly, label: 'Mariposa', category: 'Naturaleza' },
  { name: 'FaDove', icon: FaDove, label: 'Paloma', category: 'Naturaleza' },
  { name: 'FaFeather', icon: FaFeather, label: 'Pluma', category: 'Naturaleza' },
  { name: 'GiFeather', icon: GiFeather, label: 'Pluma 2', category: 'Naturaleza' },
  
  // Tiempo y Clima
  { name: 'FaClock', icon: FaClock, label: 'Reloj', category: 'Tiempo' },
  { name: 'FaCalendarAlt', icon: FaCalendarAlt, label: 'Calendario', category: 'Tiempo' },
  { name: 'FaSun', icon: FaSun, label: 'Sol', category: 'Clima' },
  { name: 'FaMoon', icon: FaMoon, label: 'Luna', category: 'Clima' },
  { name: 'GiMoonClaws', icon: GiMoonClaws, label: 'Luna creciente', category: 'Clima' },
  { name: 'GiNightSky', icon: GiNightSky, label: 'Cielo nocturno', category: 'Clima' },
  { name: 'FaCloudSun', icon: FaCloudSun, label: 'Nublado con sol', category: 'Clima' },
  { name: 'FaCloudMoon', icon: FaCloudMoon, label: 'Nublado con luna', category: 'Clima' },
  { name: 'FaSnowflake', icon: FaSnowflake, label: 'Copo de nieve', category: 'Clima' },
  { name: 'FaBolt', icon: FaBolt, label: 'Rayo', category: 'Clima' },
  { name: 'FaRainbow', icon: FaRainbow, label: 'Arcoíris', category: 'Clima' },
  
  // Transporte
  { name: 'FaCar', icon: FaCar, label: 'Auto', category: 'Transporte' },
  { name: 'FaTaxi', icon: FaTaxi, label: 'Taxi', category: 'Transporte' },
  { name: 'FaBus', icon: FaBus, label: 'Autobús', category: 'Transporte' },
  { name: 'FaBicycle', icon: FaBicycle, label: 'Bicicleta', category: 'Transporte' },
  { name: 'FaMotorcycle', icon: FaMotorcycle, label: 'Motocicleta', category: 'Transporte' },
  { name: 'FaPlane', icon: FaPlane, label: 'Avión', category: 'Transporte' },
  { name: 'FaShip', icon: FaShip, label: 'Barco', category: 'Transporte' },
  { name: 'FaAnchor', icon: FaAnchor, label: 'Ancla', category: 'Transporte' },
  { name: 'GiCaravan', icon: GiCaravan, label: 'Caravana', category: 'Transporte' },
  
  // Ubicación
  { name: 'FaMapMarkerAlt', icon: FaMapMarkerAlt, label: 'Ubicación', category: 'Ubicación' },
  { name: 'FaMapPin', icon: FaMapPin, label: 'Pin de mapa', category: 'Ubicación' },
  { name: 'FaCompass', icon: FaCompass, label: 'Brújula', category: 'Ubicación' },
  { name: 'FaGlobe', icon: FaGlobe, label: 'Globo terráqueo', category: 'Ubicación' },
  
  // Hospedaje
  { name: 'FaHotel', icon: FaHotel, label: 'Hotel', category: 'Hospedaje' },
  { name: 'FaHome', icon: FaHome, label: 'Casa', category: 'Hospedaje' },
  { name: 'FaHouseChimney', icon: FaHouseChimney, label: 'Casa con chimenea', category: 'Hospedaje' },
  { name: 'FaBed', icon: FaBed, label: 'Cama', category: 'Hospedaje' },
  { name: 'FaCouch', icon: FaCouch, label: 'Sofá', category: 'Hospedaje' },
  { name: 'FaDoorOpen', icon: FaDoorOpen, label: 'Puerta abierta', category: 'Hospedaje' },
  { name: 'FaKey', icon: FaKey, label: 'Llave', category: 'Hospedaje' },
  { name: 'GiVillage', icon: GiVillage, label: 'Villa', category: 'Hospedaje' },
  
  // Lugares y Paisajes
  { name: 'FaUmbrellaBeach', icon: FaUmbrellaBeach, label: 'Playa', category: 'Paisajes' },
  { name: 'GiBeachBall', icon: GiBeachBall, label: 'Pelota de playa', category: 'Paisajes' },
  { name: 'GiIsland', icon: GiIsland, label: 'Isla', category: 'Paisajes' },
  { name: 'FaMountain', icon: FaMountain, label: 'Montaña', category: 'Paisajes' },
  { name: 'GiMountains', icon: GiMountains, label: 'Montañas', category: 'Paisajes' },
  { name: 'GiMountaintop', icon: GiMountaintop, label: 'Cima de montaña', category: 'Paisajes' },
  { name: 'GiHills', icon: GiHills, label: 'Colinas', category: 'Paisajes' },
  { name: 'FaCampground', icon: FaCampground, label: 'Campamento', category: 'Paisajes' },
  { name: 'GiForestCamp', icon: GiForestCamp, label: 'Campamento en bosque', category: 'Paisajes' },
  { name: 'GiCampfire', icon: GiCampfire, label: 'Fogata', category: 'Paisajes' },
  { name: 'GiFireplace', icon: GiFireplace, label: 'Chimenea', category: 'Paisajes' },
  { name: 'GiTowerBridge', icon: GiTowerBridge, label: 'Puente', category: 'Paisajes' },
  
  // Regalos y Premios
  { name: 'FaGift', icon: FaGift, label: 'Regalo', category: 'Regalos' },
  { name: 'FaTrophy', icon: FaTrophy, label: 'Trofeo', category: 'Premios' },
  { name: 'FaMedal', icon: FaMedal, label: 'Medalla', category: 'Premios' },
  { name: 'FaAward', icon: FaAward, label: 'Premio', category: 'Premios' },
  
  // Personas y Gestos
  { name: 'FaPeopleGroup', icon: FaPeopleGroup, label: 'Grupo de personas', category: 'Personas' },
  { name: 'FaPersonWalking', icon: FaPersonWalking, label: 'Persona caminando', category: 'Personas' },
  { name: 'FaHandshake', icon: FaHandshake, label: 'Apretón de manos', category: 'Gestos' },
  { name: 'FaFaceSmile', icon: FaFaceSmile, label: 'Sonrisa', category: 'Emociones' },
  { name: 'FaFaceGrin', icon: FaFaceGrin, label: 'Sonrisa amplia', category: 'Emociones' },
  { name: 'FaFaceLaugh', icon: FaFaceLaugh, label: 'Risa', category: 'Emociones' },
  
  // Papelería y Documentos
  { name: 'FaEnvelope', icon: FaEnvelope, label: 'Sobre', category: 'Papelería' },
  { name: 'FaEnvelopeOpen', icon: FaEnvelopeOpen, label: 'Sobre abierto', category: 'Papelería' },
  { name: 'FaBook', icon: FaBook, label: 'Libro', category: 'Papelería' },
  { name: 'FaBookOpen', icon: FaBookOpen, label: 'Libro abierto', category: 'Papelería' },
  { name: 'GiBookCover', icon: GiBookCover, label: 'Portada de libro', category: 'Papelería' },
  { name: 'GiOpenBook', icon: GiOpenBook, label: 'Libro abierto 2', category: 'Papelería' },
  { name: 'FaPen', icon: FaPen, label: 'Pluma', category: 'Papelería' },
  { name: 'FaPencilAlt', icon: FaPencilAlt, label: 'Lápiz', category: 'Papelería' },
  { name: 'GiQuillInk', icon: GiQuillInk, label: 'Pluma de tinta', category: 'Papelería' },
  { name: 'GiScrollUnfurled', icon: GiScrollUnfurled, label: 'Pergamino', category: 'Papelería' },
  { name: 'GiArchiveRegister', icon: GiArchiveRegister, label: 'Registro', category: 'Papelería' },
  
  // Arte y Magia
  { name: 'FaPalette', icon: FaPalette, label: 'Paleta', category: 'Arte' },
  { name: 'FaPaintBrush', icon: FaPaintBrush, label: 'Pincel', category: 'Arte' },
  { name: 'FaMagic', icon: FaMagic, label: 'Varita mágica', category: 'Magia' },
  { name: 'GiCrystalBall', icon: GiCrystalBall, label: 'Bola de cristal', category: 'Magia' },
  
  // Otros
  { name: 'FaUmbrella', icon: FaUmbrella, label: 'Paraguas', category: 'Otros' },
  { name: 'FaCircleCheck', icon: FaCircleCheck, label: 'Verificación', category: 'Otros' },
  { name: 'FaPaw', icon: FaPaw, label: 'Huella', category: 'Animales' },
]

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  const selectedIcon = AVAILABLE_ICONS.find((i) => i.name === value)
  const SelectedIconComponent = selectedIcon?.icon || FaHeart

  // Get unique categories
  const categories = ['Todos', ...Array.from(new Set(AVAILABLE_ICONS.map(i => i.category)))]

  // Filter icons
  const filteredIcons = AVAILABLE_ICONS.filter(icon => {
    const matchesSearch = icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Icono
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 focus:border-primary-500 focus:outline-none transition-colors bg-white"
      >
        {SelectedIconComponent && <SelectedIconComponent className="text-primary-700" size={24} />}
        <span className="flex-1 text-left text-gray-700">
          {selectedIcon?.label || 'Seleccionar icono'}
        </span>
        <svg
          className={`w-5 h-5 transition-transform text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-[500px] overflow-hidden flex flex-col">
            {/* Search and Filter Bar */}
            <div className="p-3 border-b border-gray-200 space-y-2">
              <input
                type="text"
                placeholder="Buscar icono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-1 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCategory(category)
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Icons Grid */}
            <div className="p-3 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {filteredIcons.map((iconData) => {
                    const IconComponent = iconData.icon
                    const isSelected = value === iconData.name
                    
                    if (!IconComponent) return null
                    
                    return (
                      <button
                        key={iconData.name}
                        type="button"
                        onClick={() => {
                          onChange(iconData.name)
                          setIsOpen(false)
                          setSearchTerm('')
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-primary-100 border-2 border-primary-500 text-primary-700'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300 text-gray-600'
                        }`}
                        title={iconData.label}
                      >
                        <IconComponent size={28} className="mb-1" />
                        <span className="text-xs text-center leading-tight">
                          {iconData.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron iconos
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Export icon component getter for rendering in the actual page
export function getIconComponent(iconName: string) {
  const iconData = AVAILABLE_ICONS.find((i) => i.name === iconName)
  return iconData?.icon || FaHeart
}
