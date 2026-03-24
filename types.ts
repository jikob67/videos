
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  avatar: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  location: string;
  points: number;
  isVerified: boolean;
  videoCount: number;
  isPremium: boolean;
  bio?: string;
  bookmarks: string[];
  interests: string[]; // الحقل الجديد لتخزين الاهتمامات المختارة
}

export interface TextLayer {
  id: string;
  text: string;
  color: string;
  backgroundColor: string;
  fontSize: number;
  x: number; 
  y: number; 
}

export interface AudioLayer {
  id: string;
  url: string; // Blob URL
  name: string;
  type: 'sfx' | 'tts' | 'music';
  volume: number;
}

export interface VideoAdjustments {
  brightness: number; 
  contrast: number;   
  saturation: number; 
  hue: number;        
}

export interface VideoTransform {
  rotate: number; 
  flipH: boolean;
  flipV: boolean;
}

export interface VideoEditingMetadata {
  filter: string; 
  adjustments: VideoAdjustments;
  textLayers: TextLayer[];
  audioLayers?: AudioLayer[]; 
  transform: VideoTransform;
  speed: number;
  trim: {
    start: number;
    end: number;
  };
  isAIGenerated?: boolean; 
}

export interface Video {
  id: string;
  userId: string;
  url: string; 
  thumbnail: string;
  type: 'short' | 'long';
  title: string;
  description: string;
  views: number;
  likes: number;
  shares: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
  editData?: VideoEditingMetadata;
  hasWatermark?: boolean; 
  isLive?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export enum WalletType {
  SOLANA = 'Solana',
  ETHEREUM = 'Ethereum',
  MONAD = 'Monad',
  BASE = 'Base',
  POLYGON = 'Polygon',
  SUI = 'Sui',
  BITCOIN = 'Bitcoin'
}

export interface WalletInfo {
  network: WalletType;
  address: string;
}
