
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Home, User, Search, Play, Pause, X, Camera, MapPin, 
  LogOut, ShieldCheck, FileText, Share2, HelpCircle, 
  Plus, Loader2, Bookmark, Heart, Flag, Volume2, PictureInPicture,
  Cone, AtSign, Mail, Calendar, Sparkles, AlertCircle, Image as ImageIcon,
  Lock, Eye, EyeOff, TrendingUp, Hash, Layers, Flame, Video as VideoIcon, 
  Mic, Circle, Zap, ChevronRight, ChevronLeft, Check, Languages, Trash2, Send, Bell, BellOff,
  Wand2, Star, Crown
} from 'lucide-react';
import { User as UserType, Video } from './types';
import Support from './components/Support';
import Subscription, { PlanType } from './components/Subscription';
import { TRANSLATIONS, LANGUAGES, LanguageCode } from './languages';
import { getAIVideoIdeas, getAIVideoMetadata } from './services/geminiService';

// --- Global Storage Helpers ---
const STORAGE_KEY = 'videos_app_data_v2';
const saveLocalData = (data: { users: UserType[], videos: Video[] }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
const getLocalData = (): { users: UserType[], videos: Video[] } => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { users: [], videos: [] };
};

const PLATFORM_URL = 'https://aistudio.google.com/apps/drive/1WQAhtfSK-FTUJhy0_tqcgPIrvkP17IKB?fullscreenApplet=true&showPreview=true';

const INTEREST_OPTIONS = [
  { id: 'tech', label: 'Technology', icon: '💻', ar: 'تقنية' },
  { id: 'art', label: 'Art & Design', icon: '🎨', ar: 'فن وتصميم' },
  { id: 'travel', label: 'Travel', icon: '✈️', ar: 'سفر' },
  { id: 'health', label: 'Health', icon: '🍎', ar: 'صحة' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', ar: 'ألعاب' },
  { id: 'music', label: 'Music', icon: '🎵', ar: 'موسيقى' },
  { id: 'business', label: 'Business', icon: '📈', ar: 'أعمال' },
  { id: 'cooking', label: 'Cooking', icon: '🍳', ar: 'طبخ' },
];

const generateThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.currentTime = 0.5;
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve('');
      }
    };
    video.onerror = () => resolve('');
    video.load();
  });
};

const VLCPlayer: React.FC<{ src: string; poster?: string; shouldPlay?: boolean }> = ({ src, poster, shouldPlay }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!src) return;
    if (shouldPlay) videoRef.current?.play().catch(() => { if(videoRef.current) videoRef.current.muted = true; videoRef.current?.play().catch(() => {}); });
    else videoRef.current?.pause();
  }, [shouldPlay, src]);
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video ref={videoRef} src={src} poster={poster} className="w-full h-full object-contain" playsInline loop onTimeUpdate={() => { if (videoRef.current?.duration) setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100); }} />
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800 z-30"><div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} /></div>
    </div>
  );
};

const VideoModal: React.FC<{ video: Video; onClose: () => void; user?: UserType }> = ({ video, onClose, user }) => (
  <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in">
    <button onClick={onClose} className="absolute top-6 right-6 z-[210] p-4 bg-black/40 backdrop-blur-xl text-white rounded-full hover:bg-black/60 transition">
      <X size={24} />
    </button>
    <div className="flex-1 relative">
      <VLCPlayer src={video.url} poster={video.thumbnail} shouldPlay={true} />
      <div className="absolute left-6 bottom-10 max-w-[80%] text-white drop-shadow-xl p-4 bg-gradient-to-t from-black/60 to-transparent rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-black text-sm text-white/70">@{user?.username}</h4>
          {user?.isVerified && <Check size={12} className="bg-primary text-white rounded-full p-0.5" />}
        </div>
        <h3 className="font-black text-xl">{video.title}</h3>
        <p className="text-white/80 text-sm mt-2">{video.description}</p>
      </div>
    </div>
  </div>
);

const PolicyModal: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in" onClick={onClose}>
    <div className="bg-white dark:bg-card w-full max-w-md rounded-3xl overflow-hidden flex flex-col shadow-2xl border dark:border-gray-800" onClick={e => e.stopPropagation()}>
      <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-primary/5">
        <h3 className="font-black text-lg text-primary tracking-tighter uppercase">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"><X size={20}/></button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[50vh] text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
        {content}
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <button onClick={onClose} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-tight">Accept & Close</button>
      </div>
    </div>
  </div>
);

const StudioView: React.FC<{ onSave: (v: Video) => void, lang: LanguageCode, user: UserType }> = ({ onSave, lang, user }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatingMetadata, setGeneratingMetadata] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function initCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        currentStream = s;
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) { console.error("Camera access error:", err); }
    }
    if (!previewUrl) initCamera();
    return () => currentStream?.getTracks().forEach(track => track.stop());
  }, [previewUrl]);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };
    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerateMetadata = async () => {
    setGeneratingMetadata(true);
    const meta = await getAIVideoMetadata(lang === 'ar' ? 'Arabic' : 'English', user.interests);
    setTitle(meta.title);
    setDescription(meta.description);
    setGeneratingMetadata(false);
  };

  const handleFinalSave = async () => {
    if (!previewUrl) return;
    setGeneratingMetadata(true); 
    const realThumbnail = await generateThumbnail(previewUrl);
    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      url: previewUrl, 
      thumbnail: realThumbnail || '',
      type: 'short',
      title: title.trim() || (lang === 'ar' ? 'فيديو جديد' : 'New Video'),
      description: description.trim() || '',
      views: 0, likes: 0, shares: 0, commentsCount: 0,
      tags: user.interests.length > 0 ? user.interests : ['daily'],
      createdAt: new Date().toISOString()
    };
    onSave(newVideo);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setGeneratingMetadata(false);
  };

  if (previewUrl) {
    return (
      <div className="h-full bg-black flex flex-col p-6 overflow-y-auto no-scrollbar animate-fade-in">
        <div className="aspect-[9/16] w-full max-w-[300px] mx-auto rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl mb-6">
          <video src={previewUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 w-full max-w-md mx-auto">
           <div className="relative">
             <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.videoTitle} className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-primary transition" />
             <button onClick={handleGenerateMetadata} disabled={generatingMetadata} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/40 transition">
               {generatingMetadata ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
             </button>
           </div>
           <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t.videoDescription} rows={3} className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-primary transition resize-none" />
           <button onClick={handleGenerateMetadata} disabled={generatingMetadata} className="w-full flex items-center justify-center gap-2 py-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              {generatingMetadata ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Generate AI Title & Description
           </button>
           <div className="flex gap-4 pt-4">
              <button onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }} className="flex-1 py-4 bg-gray-800 text-white font-black rounded-2xl uppercase tracking-widest text-xs">{t.discard}</button>
              <button onClick={handleFinalSave} disabled={generatingMetadata} className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                {generatingMetadata ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> {t.savePost}</>}
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col p-4">
      <div className="flex-1 rounded-[2.5rem] overflow-hidden bg-gray-900 relative shadow-2xl border-4 border-white/5">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
           <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
           <span className="text-white text-[10px] font-black uppercase tracking-widest">{isRecording ? 'Recording' : 'Ready'}</span>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
          {!isRecording ? (
            <button onClick={startRecording} className="w-20 h-20 bg-white rounded-full p-1 border-4 border-primary shadow-2xl active:scale-90 transition">
               <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center"><Circle size={32} fill="white" className="text-white" /></div>
            </button>
          ) : (
            <button onClick={stopRecording} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition border-4 border-white/20"><div className="w-8 h-8 bg-white rounded-lg" /></button>
          )}
        </div>
      </div>
    </div>
  );
};

const ExplorePage: React.FC<{ lang: LanguageCode, videos: Video[], onVideoClick: (v: Video) => void }> = ({ lang, videos, onVideoClick }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const cats = useMemo(() => {
    const uniqueTags = new Set<string>(['All']);
    videos.forEach(v => v.tags.forEach(tag => uniqueTags.add(tag)));
    return Array.from(uniqueTags);
  }, [videos]);
  const filtered = videos.filter(v => (activeCat === 'All' || v.tags.includes(activeCat)) && (v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black animate-fade-in">
      <div className="px-6 pt-6 pb-4 space-y-4">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">explore</h1>
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm shadow-sm" /></div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">{cats.map(c => (<button key={c} onClick={() => setActiveCat(c)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCat === c ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{c}</button>))}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
         {filtered.length === 0 ? (
           <div className="py-20 text-center text-gray-400 uppercase font-black text-[10px] tracking-widest">{t.noVideos}</div>
         ) : (
           <div className="grid grid-cols-2 gap-4">
              {filtered.map(v => (
                <div key={v.id} onClick={() => onVideoClick(v)} className="relative aspect-[3/4] rounded-3xl overflow-hidden group shadow-md active:scale-95 transition cursor-pointer">
                  {v.thumbnail ? <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={v.title} /> : <div className="w-full h-full bg-gray-900 flex items-center justify-center"><VideoIcon className="text-gray-700" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                     <p className="text-white text-[10px] font-black leading-tight line-clamp-2">{v.title}</p>
                  </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

const AuthScreen: React.FC<{ onLogin: (u: UserType) => void, lang: LanguageCode, setLang: (l: LanguageCode) => void, onShowPolicy: (type: 'privacy' | 'terms') => void }> = ({ onLogin, lang, setLang, onShowPolicy }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', avatar: '', password: '', interests: [] as string[] });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };
  const toggleInterest = (id: string) => { setForm(prev => ({ ...prev, interests: prev.interests.includes(id) ? prev.interests.filter(i => i !== id) : [...prev.interests, id] })); };
  const handleFinish = () => {
    if (form.interests.length === 0) { setError(t.selectAtLeastOne); return; }
    const user: UserType = { id: Math.random().toString(36).substr(2, 9), ...form, gender: 'Other', dob: '', location: '', points: 100, isVerified: false, videoCount: 0, isPremium: false, bookmarks: [] };
    const data = getLocalData(); data.users.push(user); saveLocalData(data); onLogin(user);
  };
  return (
    <div className="h-full flex flex-col items-center bg-white dark:bg-black overflow-y-auto px-8 py-10 no-scrollbar relative">
      <div className="absolute top-6 right-6 flex gap-2">{LANGUAGES.map(l => (<button key={l.code} onClick={() => setLang(l.code as LanguageCode)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${lang === l.code ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>{l.code}</button>))}</div>
      <div className="text-center mb-8 animate-fade-in mt-10"><h1 className="text-3xl font-black text-primary mb-1 tracking-tighter italic lowercase">videos</h1><p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">{t.createAccount} - Step {step} of 3</p></div>
      <div className="w-full max-w-sm">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col items-center"><div onClick={() => fileInputRef.current?.click()} className={`w-32 h-32 rounded-full border-4 cursor-pointer flex items-center justify-center overflow-hidden transition-all relative ${form.avatar ? 'border-primary' : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50'}`}>{form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-400" />}</div><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} /><p className="text-[8px] font-black text-primary uppercase mt-2">{t.uploadPhoto} *</p></div>
            <div className="space-y-3">
              <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder={t.fullName} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm" />
              <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder={t.username} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t.email} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm" />
            </div>
            <button onClick={() => setStep(2)} className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition">{t.next}</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative"><input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={t.password} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{t.agreeTo} <button onClick={() => onShowPolicy('privacy')} className="text-primary hover:underline">{t.privacyPolicy}</button> {t.and} <button onClick={() => onShowPolicy('terms')} className="text-primary hover:underline">{t.termsOfUse}</button></p>
            <div className="flex gap-3"><button onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-sm">{t.back}</button><button onClick={() => setStep(3)} className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition">{t.next}</button></div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in text-center">
            <h2 className="font-black text-xl italic uppercase text-gray-800 dark:text-gray-200">{t.selectInterests} *</h2>
            <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto no-scrollbar">{INTEREST_OPTIONS.map(opt => (<button key={opt.id} onClick={() => toggleInterest(opt.id)} className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${form.interests.includes(opt.id) ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-transparent text-gray-400'}`}><span className="text-2xl">{opt.icon}</span><span className="text-[10px] font-black uppercase">{lang === 'ar' ? opt.ar : opt.label}</span></button>))}</div>
            <div className="flex gap-3"><button onClick={() => setStep(2)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-sm">{t.back}</button><button onClick={handleFinish} className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition">{t.finish}</button></div>
          </div>
        )}
        {error && <p className="mt-6 text-red-500 text-[10px] font-black text-center uppercase animate-pulse">{error}</p>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | undefined>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : undefined;
  });
  const [lang, setLang] = useState<LanguageCode>(() => (localStorage.getItem('app_lang') as LanguageCode) || 'en');
  const [activeTab, setActiveTab] = useState('home');
  const [videos, setVideos] = useState<Video[]>(() => getLocalData().videos);
  const [showPolicy, setShowPolicy] = useState<{ title: string; content: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [viewingVideo, setViewingVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleShowPolicy = (type: 'privacy' | 'terms') => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    setShowPolicy({ title: type === 'privacy' ? t.privacyPolicy : t.termsOfUse, content: type === 'privacy' ? t.privacyContent : t.termsContent });
  };

  const handleSaveVideo = (v: Video) => {
    const data = getLocalData();
    data.videos.unshift(v);
    saveLocalData(data);
    setVideos([...data.videos]); 
    setActiveTab('home');
  };

  const handleDeleteVideo = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    if (window.confirm(t.confirmDelete)) {
      const data = getLocalData();
      const updatedVideos = data.videos.filter(v => v.id !== videoId);
      data.videos = updatedVideos;
      saveLocalData(data);
      setVideos([...updatedVideos]); 
      if (viewingVideo?.id === videoId) setViewingVideo(null);
    }
  };

  const handleShare = async (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: video.title, 
          text: `${t.shareMessage}\n\n${video.title}`, 
          url: PLATFORM_URL 
        });
      } else {
        alert(`${t.shareMessage}\n\nTitle: ${video.title}\nLink: ${PLATFORM_URL}`);
      }
    } catch (err) { alert(`${t.shareMessage}\n\nTitle: ${video.title}`); }
  };

  const handleAppShare = async () => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'videos',
          text: t.shareMessage,
          url: PLATFORM_URL
        });
      } else {
        alert(t.shareMessage + "\n" + PLATFORM_URL);
      }
    } catch (err) { alert(t.shareMessage); }
  };

  const handleSubscribe = (plan: PlanType) => {
    if (!currentUser) return;
    const updatedUser: UserType = {
      ...currentUser,
      isPremium: true,
      isVerified: true,
      points: currentUser.points + (plan === 'elite' ? 500 : plan === 'pro' ? 200 : 50)
    };
    setCurrentUser(updatedUser);
    setShowSubscription(false);
    
    // Update stored data
    const data = getLocalData();
    const userIdx = data.users.findIndex(u => u.id === currentUser.id);
    if (userIdx !== -1) {
      data.users[userIdx] = updatedUser;
      saveLocalData(data);
    }
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedVideoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  if (!currentUser) return (<div className="h-screen w-screen overflow-hidden"><AuthScreen onLogin={setCurrentUser} lang={lang} setLang={setLang} onShowPolicy={handleShowPolicy} />{showPolicy && <PolicyModal {...showPolicy} onClose={() => setShowPolicy(null)} />}</div>);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
      <header className="h-16 px-6 flex items-center justify-between border-b dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-primary">videos</h1>
        <div className="flex items-center gap-1">
          <button onClick={handleAppShare} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl text-gray-400 transition active:scale-95">
            <Share2 size={22} />
          </button>
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl relative">
            <Bell size={22} className={showNotifications ? 'text-primary' : 'text-gray-400'} />
            {showNotifications && (
              <div className={`absolute top-14 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 bg-white dark:bg-card border dark:border-gray-800 rounded-[2rem] shadow-2xl p-6 animate-fade-in`}>
                <div className="flex flex-col items-center text-center gap-2"><div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"><BellOff size={18} className="text-gray-300" /></div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t.noNotifications}</p></div>
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && (
           <div className="h-full w-full snap-y-mandatory overflow-y-scroll no-scrollbar">
              {videos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 gap-8">
                  <h3 className="font-black text-3xl uppercase tracking-tighter text-gray-900 dark:text-white italic">no topics yet</h3>
                  <button onClick={() => setActiveTab('studio')} className="px-12 py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition">start recording</button>
                </div>
              ) : (
                videos.map(v => (
                  <div key={v.id} className="h-full w-full snap-center relative">
                    <VLCPlayer src={v.url} poster={v.thumbnail} shouldPlay={activeTab === 'home'} />
                    <div className="absolute left-6 bottom-28 max-w-[70%] text-white drop-shadow-xl p-4 bg-gradient-to-t from-black/40 to-transparent rounded-2xl">
                       <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-black text-lg">@{currentUser.username}</h4>
                         {currentUser.isVerified && <Check size={14} className="bg-primary text-white rounded-full p-0.5 border border-white/20" />}
                       </div>
                       <p className="text-white/95 text-sm font-black mt-1">{v.title}</p>
                       <p className="text-white/80 text-[10px] font-bold mt-1 line-clamp-2">{v.description}</p>
                    </div>
                    <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center">
                       {v.userId === currentUser.id && (<button onClick={(e) => handleDeleteVideo(v.id, e)} className="p-4 bg-red-600/20 backdrop-blur-2xl rounded-3xl text-red-500 border border-red-500/20 shadow-2xl transition active:scale-90"><Trash2 size={28}/></button>)}
                       <div className="flex flex-col items-center gap-1"><button onClick={(e) => toggleLike(v.id, e)} className={`p-4 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl transition active:scale-90 ${likedVideoIds.has(v.id) ? 'bg-red-600 text-white' : 'bg-black/40 text-white'}`}><Heart size={28} fill={likedVideoIds.has(v.id) ? "currentColor" : "none"} /></button><span className="text-white text-[10px] font-black">{v.likes + (likedVideoIds.has(v.id) ? 1 : 0)}</span></div>
                       <button onClick={(e) => handleShare(v, e)} className="p-4 bg-black/40 backdrop-blur-2xl rounded-3xl text-white border border-white/20 shadow-2xl active:scale-90 transition"><Share2 size={28}/></button>
                    </div>
                  </div>
                ))
              )}
           </div>
        )}
        
        {activeTab === 'explore' && <ExplorePage lang={lang} videos={videos} onVideoClick={setViewingVideo} />}
        {activeTab === 'studio' && <StudioView user={currentUser} onSave={handleSaveVideo} lang={lang} />}
        {activeTab === 'support' && <Support userName={currentUser.username} />}
        {activeTab === 'profile' && (
          <div className="h-full overflow-y-auto pb-24 px-6 animate-fade-in">
             <div className="flex flex-col items-center pt-8">
                <div className="relative">
                  <img src={currentUser.avatar} className="w-28 h-28 rounded-[2.5rem] border-4 border-primary shadow-2xl rotate-2" />
                  {currentUser.isPremium && <Crown className="absolute -top-4 -right-4 w-10 h-10 text-yellow-500 drop-shadow-lg -rotate-12" />}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h2 className="font-black text-2xl uppercase italic">@{currentUser.username}</h2>
                  {currentUser.isVerified && <Check size={20} className="bg-primary text-white rounded-full p-1 shadow-lg" />}
                </div>
                <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar w-full justify-center">{currentUser.interests.map(id => (<span key={id} className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20">{INTEREST_OPTIONS.find(o => o.id === id)?.label}</span>))}</div>
                <div className="flex gap-10 mt-6 bg-gray-50 dark:bg-gray-900 px-8 py-4 rounded-3xl border dark:border-gray-800"><div className="text-center font-black"><div>{videos.filter(v => v.userId === currentUser.id).length}</div><div className="text-[9px] text-gray-400 uppercase">topics</div></div><div className="text-center font-black"><div>{currentUser.points}</div><div className="text-[9px] text-gray-400 uppercase">points</div></div></div>
             </div>
             
             {!currentUser.isPremium && (
               <div onClick={() => setShowSubscription(true)} className="mt-8 p-6 bg-gradient-to-r from-primary to-blue-800 rounded-[2.5rem] shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between border-2 border-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white"><Zap size={24} fill="currentColor" /></div>
                    <div><h3 className="text-white font-black uppercase italic tracking-tighter text-lg">Go Premium</h3><p className="text-white/60 text-[10px] font-bold">Unlock AI suggestions & verify your profile</p></div>
                  </div>
                  <ChevronRight className="text-white/40 group-hover:text-white transition" />
               </div>
             )}

             <div className="mt-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">{t.myVideos}</h3>
                <div className="grid grid-cols-2 gap-3">
                   {videos.filter(v => v.userId === currentUser.id).map(v => (
                     <div key={v.id} onClick={() => setViewingVideo(v)} className="relative aspect-[3/4] rounded-3xl overflow-hidden group shadow-md cursor-pointer border border-gray-100 dark:border-gray-800">
                        {v.thumbnail ? <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title} /> : <div className="w-full h-full bg-gray-900 flex items-center justify-center"><VideoIcon className="text-gray-700" /></div>}
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteVideo(v.id, e); }} className="absolute top-2 right-2 p-2 bg-red-600/80 backdrop-blur-lg text-white rounded-2xl shadow-xl active:scale-75 transition-all z-10 hover:bg-red-600"><Trash2 size={16} /></button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end"><p className="text-white text-[9px] font-black leading-tight line-clamp-1">{v.title}</p></div>
                     </div>
                   ))}
                   {videos.filter(v => v.userId === currentUser.id).length === 0 && (<div className="col-span-2 p-10 bg-gray-50 dark:bg-gray-900 rounded-3xl text-center border-2 border-dashed border-gray-200 dark:border-gray-800"><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.noVideos}</p></div>)}
                </div>
             </div>
             <div className="mt-10 space-y-3 pb-8">
                <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl hover:bg-primary/5 transition-all"><div className="flex items-center gap-3"><Languages size={20} className="text-primary" /><span className="text-sm font-black uppercase tracking-tighter">{t.changeLanguage} ({lang.toUpperCase()})</span></div><ChevronRight size={16} className={`text-gray-400 ${lang === 'ar' ? 'rotate-180' : ''}`} /></button>
                <button onClick={() => setCurrentUser(undefined)} className="w-full mt-6 p-5 bg-red-600/10 text-red-600 rounded-3xl font-black uppercase tracking-widest text-xs border border-red-600/20 flex items-center justify-center gap-2 active:scale-95 transition"><LogOut size={16}/> Sign Out</button>
             </div>
          </div>
        )}
      </main>

      <nav className="h-24 bg-white dark:bg-black border-t-2 dark:border-gray-900 flex justify-around items-center px-4 pb-6 z-50">
        <NavBtn icon={Home} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={Search} label={t.search} active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
        <div className="relative -top-8"><button onClick={() => setActiveTab('studio')} className="w-20 h-20 bg-primary text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-[15deg] transition-all active:scale-90 border-4 border-white dark:border-black"><Plus size={40} /></button></div>
        <NavBtn icon={HelpCircle} label={t.support} active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
        <NavBtn icon={User} label={t.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      {showPolicy && <PolicyModal {...showPolicy} onClose={() => setShowPolicy(null)} />}
      {viewingVideo && <VideoModal video={viewingVideo} onClose={() => setViewingVideo(null)} user={currentUser} />}
      {showSubscription && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl p-4 overflow-y-auto animate-fade-in">
           <div className="max-w-xl mx-auto py-10 relative">
             <button onClick={() => setShowSubscription(false)} className="absolute top-2 right-2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition"><X size={20}/></button>
             <Subscription onSubscribe={handleSubscribe} lang={lang} />
           </div>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}><Icon size={26} strokeWidth={active ? 3 : 2} /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span></button>
);

export default App;
