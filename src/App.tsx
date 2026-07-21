import React, { useState, useEffect, Component, useRef } from 'react';
import { 
  Phone, 
  Wrench, 
  Droplets, 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText,
  Menu, 
  X, 
  ChevronRight, 
  Star,
  AlertCircle,
  ArrowRight,
  Smartphone,
  Info,
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
  Timer,
  Shield,
  BookOpen,
  User,
  DollarSign,
  Zap,
  Download,
  HeartPulse,
  Cpu,
  Youtube,
  Instagram,
  MessageCircle,
  Globe,
  Lock,
  Unlock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// --- Types & Constants ---
type Page = 'home' | 'service' | 'membership' | 'about' | 'booking' | 'notices';
type ServiceType = 'sink' | 'toilet' | 'drain' | 'jetting' | 'endoscopy' | 'odor' | 'leak' | 'repair' | 'appliances';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

const SERVICES: Record<ServiceType, { title: string; desc: string; icon: any; bgImage: string; symptoms: string[] }> = {
  sink: { 
    title: '싱크대막힘', 
    desc: '음식물, 기름때로 꽉 막힌 싱크대 해결', 
    icon: Droplets, 
    bgImage: '/images/service_sink.jpeg',
    symptoms: ['물이 내려가는 속도가 눈에 띄게 느려짐', '배수구 주변에서 꿀렁거리는 소리가 남', '역류 현상이 발생하여 바닥이 젖음', '심한 악취가 올라와 일상생활이 불편함']
  },
  toilet: { 
    title: '변기막힘', 
    desc: '휴지, 이물질로 역류하는 변기 즉시 뚫음', 
    icon: AlertCircle, 
    bgImage: '/images/service_toilet.jpeg',
    symptoms: ['변기 물을 내려도 시원하게 내려가지 않음', '이물질이 들어가서 물이 전혀 내려가지 않음', '변기 하단부에서 물이 새어 나옴', '사용하지 않아도 물 소리가 계속 들림']
  },
  drain: { 
    title: '하수구막힘', 
    desc: '욕실, 베란다 하수구 물 고임 해결', 
    icon: Droplets, 
    bgImage: '/images/service_drain.jpeg',
    symptoms: ['욕실 바닥에 물이 한참 동안 고여 있음', '세탁기 배수 시 물이 역류하여 넘침', '하수구 주변에 찌꺼기가 많이 쌓임', '배수구에서 나방파리 등 벌레가 생김']
  },
  jetting: { 
    title: '고압세척', 
    desc: '강력한 물살로 배관 속 유지방 완전 제거', 
    icon: Wrench, 
    bgImage: '/images/service_jetting.jpg',
    symptoms: ['반복적으로 하수구가 막히는 경우', '배관 속에 딱딱한 기름 덩어리가 가득 찬 경우', '식당 등 대량의 배수가 필요한 영업장', '오래된 건물의 메인 배관 청소가 필요한 경우']
  },
  endoscopy: { 
    title: '배관내시경', 
    desc: '첨단 장비로 배관 속 원인 정밀 진단', 
    icon: Search, 
    bgImage: '/images/service_endoscopy.jpeg',
    symptoms: ['막힘의 원인을 정확히 알고 싶은 경우', '배관 파손이나 이탈이 의심되는 경우', '공사 전 배관의 경로를 파악해야 할 때', '작업 후 배관 내부 청결도를 확인하고 싶을 때']
  },
  odor: { 
    title: '악취제거', 
    desc: '올라오는 하수구 냄새 완벽 차단 트랩', 
    icon: Info, 
    bgImage: '/images/service_odor.jpeg',
    symptoms: ['화장실이나 싱크대에서 쾌쾌한 냄새가 남', '날씨가 흐리거나 비가 오면 냄새가 심해짐', '배수구를 통해 벌레가 자꾸 올라옴', '환풍기를 틀어도 냄새가 가시지 않음']
  },
  leak: { 
    title: '누수탐지', 
    desc: '미세한 누수 지점까지 정확하게 포착', 
    icon: Search, 
    bgImage: '/images/service_leak.jpeg',
    symptoms: ['수도 요금이 평소보다 갑자기 많이 나옴', '아래층 천장이나 벽이 젖어 들어감', '보일러 에러 코드가 자주 발생함', '장판 밑에 습기가 차거나 곰팡이가 생김']
  },
  repair: { 
    title: '기본수리', 
    desc: '수전 교체부터 배관 부속 수리까지', 
    icon: Wrench, 
    bgImage: '/images/service_repair.jpg',
    symptoms: ['수전에서 물이 뚝뚝 떨어지는 경우', '세면대나 팝업이 고장 나 작동하지 않음', '배관 연결 부위에서 미세하게 물이 샘', '노후된 부속을 새것으로 교체하고 싶을 때']
  },
  appliances: { 
    title: '3대가전케어', 
    desc: '세탁기, 냉장고, 에어컨 분해 정밀 세척', 
    icon: Zap, 
    bgImage: '/images/service_appliances.jpg',
    symptoms: ['에어컨 가동 시 쉰내나 곰팡이 냄새가 남', '세탁기 세탁 후 빨래에 이물질이 묻어 나옴', '냉장고 뒷면에서 소음이 심하게 발생함', '가전제품의 효율이 떨어져 전기료가 많이 나옴']
  },
};

// --- Utilities ---

const Counter = ({ value, duration = 1.5, suffix = "", isLive = false }: { value: number, duration?: number, suffix?: string, isLive?: boolean }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * value);
      setCount(currentCount);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, hasAnimated]);

  // Live increment effect
  useEffect(() => {
    if (!isLive || !hasAnimated) return;
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive, hasAnimated]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
};

/**
 * Optimizes an image by resizing and compressing it.
 */
const optimizeImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // For very high quality (>= 0.95), use PNG to preserve transparency and sharpness (ideal for logos)
          if (quality >= 0.95) {
            resolve(canvas.toDataURL('image/png'));
          } else {
            // Try webp first, fallback to jpeg
            const dataUrl = canvas.toDataURL('image/webp', quality);
            if (dataUrl.startsWith('data:image/webp')) {
              resolve(dataUrl);
            } else {
              resolve(canvas.toDataURL('image/jpeg', quality));
            }
          }
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// --- Components ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl max-w-md border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black mb-3">문제가 발생했습니다</h2>
            <p className="text-gray-600 font-bold mb-8 leading-relaxed">
              이미지 용량이 너무 크거나 시스템 오류가 발생했습니다.<br />
              브라우저의 저장 공간이 부족할 수 있습니다.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-black text-white font-black px-8 py-4 rounded-2xl w-full hover:bg-gray-800 transition-all"
            >
              초기화 후 새로고침
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const DownloadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-8 sm:p-10 text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
                <Smartphone className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-4 break-keep">AI 배관 진단은 <br /><span className="text-blue-600">전용 앱</span>에서 가능합니다</h2>
              <p className="text-gray-500 font-bold mb-8 leading-relaxed break-keep">
                정밀한 AI 비전 분석을 위해 <br />
                달수배관케어 공식 어플리케이션을 설치해주세요.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="https://apps.apple.com/kr/app/%EB%8B%AC%EC%88%98%EB%B0%B0%EA%B4%80%EC%BC%80%EC%96%B4/id6788634887" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all"
                >
                  <Smartphone className="w-5 h-5" /> App Store 다운로드
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.dalsu.plumbing&pcampaignid=web_share" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gray-100 text-black py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all"
                >
                  <Smartphone className="w-5 h-5" /> Google Play 다운로드
                </a>
              </div>
              
              <button 
                onClick={onClose}
                className="mt-6 text-gray-400 font-bold text-sm hover:text-black transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ 
  setPage, 
  logoImage, 
  onLogoUpload,
  isShared,
  logoScale,
  onLogoScaleChange,
  isAdmin,
  onAdminClick
}: { 
  setPage: (p: Page) => void,
  logoImage: string | null,
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isShared: boolean,
  logoScale: number,
  onLogoScaleChange: (scale: number) => void,
  isAdmin: boolean,
  onAdminClick: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between relative">
        {/* Mobile Menu Button - Left aligned on mobile */}
        <button className="md:hidden p-2 -ml-2 z-50 bg-zinc-100 rounded-xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo Container - Centered on mobile, Left aligned on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex items-center gap-4">
          <div className="relative group">
            <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <label className={`${logoImage ? 'bg-transparent' : 'bg-yellow-400 rounded-xl'} ${!isShared ? 'cursor-pointer' : ''} relative overflow-hidden w-32 sm:w-56 h-16 sm:h-20 flex items-center justify-center transition-all p-2`}>
                {logoImage ? (
                  <img 
                    src={logoImage} 
                    alt="Logo" 
                    className="w-full h-full object-contain pointer-events-none" 
                    style={{ transform: `scale(${logoScale})`, transformOrigin: 'center' }}
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3">
                    <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                    <span className="text-lg sm:text-2xl font-black tracking-tighter text-black">달수배관케어</span>
                  </div>
                )}
                {!isShared && (
                  <>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
                  </>
                )}
              </label>
            </div>
            
            {!isShared && logoImage && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 bg-white shadow-2xl p-3 rounded-2xl border border-gray-100 flex items-center gap-3 z-[60] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Logo Scale</span>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3.0" 
                      step="0.05" 
                      value={logoScale} 
                      onChange={(e) => onLogoScaleChange(parseFloat(e.target.value))}
                      className="w-32 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded-md min-w-[40px] text-center">
                      {Math.round(logoScale * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 font-bold text-sm">
          <div className="flex items-center gap-6 mr-4">
            <button onClick={() => setPage('home')} className="hover:text-yellow-600 transition-colors">홈</button>
            <button onClick={() => setPage('membership')} className="hover:text-yellow-600 transition-colors">멤버십</button>
            <button onClick={() => setPage('notices')} className="hover:text-yellow-600 transition-colors">공지사항</button>
            <button onClick={() => setPage('about')} className="hover:text-yellow-600 transition-colors">회사소개</button>
          </div>
          
          <div className="flex items-center gap-2 mr-4">
            {/* Phone Style */}
            <a href="tel:1577-1197" className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-white fill-white" />
            </a>
            {/* KakaoTalk Style */}
            <a href="http://pf.kakao.com/_EdXzX" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
              <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-lg">
                <rect width="40" height="40" rx="10" fill="#FEE500"/>
                <path d="M20 8c-7.7 0-14 4.8-14 10.7 0 3.9 2.6 7.3 6.4 9.1l-1.6 5.9c-.1.5.4.9.8.7l7-4.7c.5.1 1 .1 1.4.1 7.7 0 14-4.8 14-10.7S27.7 8 20 8z" fill="#3C1E1E"/>
                <text x="20" y="21.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="7" fill="#FEE500" textAnchor="middle">TALK</text>
              </svg>
            </a>
            {/* Blog Style */}
            <a href="https://blog.naver.com/dalsu2018" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
              <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-lg">
                <rect width="40" height="40" rx="10" fill="#03C75A"/>
                <path d="M8 12c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4h-10l-4 4v-4H12c-2.2 0-4-1.8-4-4V12z" fill="white"/>
                <text x="20" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="8" fill="#03C75A" textAnchor="middle">blog</text>
              </svg>
            </a>
            {/* YouTube Style */}
            <a href="https://www.youtube.com/@dalsu2018" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
              <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-lg">
                <rect width="40" height="40" rx="10" fill="#CD201F"/>
                <path d="M28 12H12c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4z" fill="white"/>
                <path d="M18 16v8l7-4-7-4z" fill="#CD201F"/>
              </svg>
            </a>
            {/* Instagram Style */}
            <a href="https://www.instagram.com/dalsu2018?igsh=dWQwbHB4amVvZTlh" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] rounded-lg flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5 text-white" />
            </a>
          </div>

          <button onClick={() => setPage('booking')} className="bg-yellow-400 text-black px-5 py-2.5 rounded-full hover:bg-yellow-500 transition-all font-black text-sm shadow-lg shadow-yellow-400/20">상담신청</button>
          
          {/* Admin Login Button */}
          <button 
            onClick={onAdminClick}
            className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${isAdmin ? 'text-yellow-600' : 'text-gray-300 hover:text-gray-500'}`}
          >
            {isAdmin ? '로그아웃' : '로그인'}
          </button>
        </div>

        {/* Placeholder for balance on mobile right side */}
        <div className="md:hidden w-10" />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl p-8 flex flex-col gap-6 font-black text-xl"
          >
            <button onClick={() => { setPage('home'); setIsOpen(false); }} className="text-left hover:text-blue-600 transition-colors">홈</button>
            <button onClick={() => { setPage('membership'); setIsOpen(false); }} className="text-left hover:text-blue-600 transition-colors">멤버십 소개</button>
            <button onClick={() => { setPage('notices'); setIsOpen(false); }} className="text-left hover:text-blue-600 transition-colors">공지사항</button>
            <button onClick={() => { setPage('about'); setIsOpen(false); }} className="text-left hover:text-blue-600 transition-colors">회사소개</button>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setPage('booking'); setIsOpen(false); }} className="bg-yellow-400 text-black p-5 rounded-2xl shadow-lg shadow-yellow-400/20 text-center">상담신청하기</button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onAdminClick();
                }} 
                className={`text-center py-2 text-xs font-bold transition-colors ${isAdmin ? 'text-yellow-600' : 'text-gray-400'}`}
              >
                {isAdmin ? '로그아웃' : '로그인'}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-100">
              <a href="tel:1577-1197" className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm">
                <Phone className="w-6 h-6 text-white fill-white" />
              </a>
              <a href="#" className="w-10 h-10">
                <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-xl">
                  <rect width="40" height="40" rx="10" fill="#FEE500"/>
                  <path d="M20 8c-7.7 0-14 4.8-14 10.7 0 3.9 2.6 7.3 6.4 9.1l-1.6 5.9c-.1.5.4.9.8.7l7-4.7c.5.1 1 .1 1.4.1 7.7 0 14-4.8 14-10.7S27.7 8 20 8z" fill="#3C1E1E"/>
                  <text x="20" y="21.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="7" fill="#FEE500" textAnchor="middle">TALK</text>
                </svg>
              </a>
              <a href="#" className="w-10 h-10">
                <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-xl">
                  <rect width="40" height="40" rx="10" fill="#03C75A"/>
                  <path d="M8 12c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4h-10l-4 4v-4H12c-2.2 0-4-1.8-4-4V12z" fill="white"/>
                  <text x="20" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="8" fill="#03C75A" textAnchor="middle">blog</text>
                </svg>
              </a>
              <a href="https://www.youtube.com/@dalsu2018" target="_blank" rel="noopener noreferrer" className="w-10 h-10">
                <svg viewBox="0 0 40 40" className="w-full h-full shadow-sm rounded-xl">
                  <rect width="40" height="40" rx="10" fill="#CD201F"/>
                  <path d="M28 12H12c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4z" fill="white"/>
                  <path d="M18 16v8l7-4-7-4z" fill="#CD201F"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/dalsu2018?igsh=dWQwbHB4amVvZTlh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] rounded-xl flex items-center justify-center shadow-sm">
                <Instagram className="w-6 h-6 text-white" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatusTicker = () => {
  const statuses = [
    "서울 강남구 싱크대 막힘 해결 완료 (3분 전)",
    "서울 송파구 배관 내시경 정밀 진단 완료 (8분 전)",
    "경기 수원시 변기 역류 긴급 출동 중 (방금)",
    "인천 미추홀구 하수구 고압세척 진행 중 (12분 전)",
    "서울 마포구 하수구 악취 트랩 설치 완료 (20분 전)",
    "경기 성남시 미세 누수 탐지 및 수리 완료 (10분 전)",
    "대구 달서구 싱크대 수전 교체 완료 (15분 전)",
    "부산 해운대구 변기 막힘 즉시 해결 (5분 전)"
  ];

  return (
    <div className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-md rounded-[24px] border border-yellow-200/50 overflow-hidden shadow-sm shadow-yellow-900/5">
      <div className="px-5 py-2.5 border-b border-yellow-100/50 flex items-center justify-between bg-yellow-50/30">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse">
            <div className="w-1 h-1 bg-white rounded-full" />
            LIVE
          </div>
          <h2 className="text-[11px] font-black text-black tracking-tight uppercase">실시간 서비스 현황</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 tracking-tight">Active Connection</span>
        </div>
      </div>

      <div className="py-3.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-4 items-center">
          {[...statuses, ...statuses, ...statuses, ...statuses].map((status, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-gray-800 tracking-tight">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
              {status}
              <span className="ml-4 text-gray-200 font-light">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Premium Medal Badge Component ---
const PremiumMedal = ({ 
  title, 
  subtitle, 
  year = "2025", 
  className = "",
  isCenter = false
}: { 
  title: string; 
  subtitle: React.ReactNode; 
  year?: string; 
  className?: string;
  isCenter?: boolean;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: -20, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
      scale: 1 
    }}
    transition={{ 
      opacity: { duration: 0.8 },
      y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
      scale: { duration: 0.8, type: "spring" }
    }}
    className={`relative flex flex-col items-center ${className}`}
  >
    {/* Ribbons with Stripes */}
    <div className="absolute -bottom-10 flex gap-3 z-0">
      <div className="w-8 h-20 bg-red-700 relative shadow-xl rotate-[18deg] origin-top overflow-hidden border-x border-red-800">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-white/40" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-red-700 [clip-path:polygon(0%_0%,100%_0%,50%_100%)]" />
      </div>
      <div className="w-8 h-20 bg-red-700 relative shadow-xl -rotate-[18deg] origin-top overflow-hidden border-x border-red-800">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-white/40" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-red-700 [clip-path:polygon(0%_0%,100%_0%,50%_100%)]" />
      </div>
    </div>

    {/* Double Sawtooth Outer Edge */}
    <div className={`absolute ${isCenter ? 'w-40 h-40 sm:w-64 sm:h-64' : 'w-36 h-36 sm:w-56 sm:h-56'} bg-gradient-to-br from-yellow-100 via-yellow-500 to-amber-800 [clip-path:polygon(50%_0%,54%_10%,65%_5%,66%_16%,78%_14%,75%_25%,86%_28%,81%_38%,90%_45%,83%_53%,88%_64%,79%_68%,81%_79%,70%_81%,68%_92%,57%_90%,50%_100%,43%_90%,32%_92%,30%_81%,19%_79%,21%_68%,12%_64%,17%_53%,10%_45%,19%_38%,14%_28%,25%_25%,22%_14%,34%_16%,35%_5%,46%_10%)] opacity-90 shadow-2xl`} />
    <div className={`absolute ${isCenter ? 'w-36 h-36 sm:w-60 sm:h-60' : 'w-32 h-32 sm:w-52 sm:h-52'} bg-gradient-to-tr from-amber-700 via-yellow-400 to-yellow-100 [clip-path:polygon(50%_0%,54%_10%,65%_5%,66%_16%,78%_14%,75%_25%,86%_28%,81%_38%,90%_45%,83%_53%,88%_64%,79%_68%,81%_79%,70%_81%,68%_92%,57%_90%,50%_100%,43%_90%,32%_92%,30%_81%,19%_79%,21%_68%,12%_64%,17%_53%,10%_45%,19%_38%,14%_28%,25%_25%,22%_14%,34%_16%,35%_5%,46%_10%)] rotate-[15deg] opacity-60`} />

    {/* Medal Body */}
    <div className={`relative ${isCenter ? 'w-32 h-32 sm:w-56 sm:h-56' : 'w-28 h-28 sm:w-48 sm:h-48'} rounded-full p-2 bg-gradient-to-br from-yellow-50 via-yellow-400 to-amber-900 shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-10`}>
      <div className="w-full h-full rounded-full bg-[#2d1208] p-1.5 flex items-center justify-center relative overflow-hidden border-4 border-yellow-600/60">
        {/* Sunburst Pattern */}
        <div className="absolute inset-0 opacity-50 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_5deg,rgba(255,215,0,0.15)_5deg,rgba(255,215,0,0.15)_10deg)]" />
        
        {/* Decorative Inner Rings */}
        <div className="absolute inset-1 border-2 border-yellow-400/40 rounded-full" />
        <div className="absolute inset-3 border border-yellow-500/20 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-2">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[8px] sm:text-[14px] font-black text-yellow-400 leading-none tracking-[0.2em] uppercase drop-shadow-md">{year}</span>
            <Star className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 fill-yellow-400 text-yellow-400" />
          </div>
          
          <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-2" />
          
          <span className="text-[10px] sm:text-[18px] font-black text-white leading-tight break-keep drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1">{title}</span>
          
          <div className="relative">
            <div className={`font-black bg-gradient-to-b from-yellow-50 via-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex flex-col items-center leading-none`}>
              {typeof subtitle === 'string' ? (
                <span className={isCenter ? 'text-xl sm:text-5xl' : 'text-lg sm:text-4xl'}>
                  {subtitle}
                </span>
              ) : (
                subtitle
              )}
            </div>
          </div>
          
          {/* Laurel Wreath Visual */}
          <div className="flex gap-6 mt-2 opacity-80">
            <div className="w-1.5 h-4 bg-yellow-500/40 rounded-full rotate-[40deg] blur-[0.5px]" />
            <div className="w-1.5 h-4 bg-yellow-500/40 rounded-full -rotate-[40deg] blur-[0.5px]" />
          </div>
        </div>
      </div>

      {/* Metallic Shine */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-25 z-20"
      />
    </div>
  </motion.div>
);

const AITechBanner = () => (
  <section className="relative overflow-hidden w-full bg-white">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full"
    >
      <a 
        href="https://play.google.com/store/apps/details?id=com.dalsu.plumbing&pcampaignid=web_share" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block cursor-pointer transition-all duration-300 hover:scale-[1.005] hover:opacity-95"
      >
        <img 
          src="/images/Generated Image April 15, 2026 - 4_11PM.jpg" 
          alt="AI Technology Visual" 
          className="w-full h-auto block"
          referrerPolicy="no-referrer"
        />
      </a>
    </motion.div>
  </section>
);

const Hero = ({ 
  onBooking, 
  heroImage,
  onHeroUpload,
  isShared,
  setPage,
  setBookingType
}: { 
  onBooking: () => void,
  heroImage: string,
  onHeroUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isShared?: boolean,
  setPage: (p: Page) => void,
  setBookingType: (t: string) => void
}) => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[75vh] w-full overflow-hidden flex items-center bg-white">
      {/* AI Plumbing Visual Background */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <img 
          src={heroImage || "https://picsum.photos/seed/ai-plumbing-tech/1920/1080"} 
          alt="AI Plumbing Diagnosis" 
          className="h-full w-full object-cover object-[75%_center]"
          referrerPolicy="no-referrer"
        />
        {/* Innovative Gradient Overlay: Opaque White on left, Transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-20 pt-16 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-3xl">
          {/* Left Content: Text & Buttons (Matching Image) */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-8"
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#1a1f2c] leading-[1.1] tracking-tight mb-2">
                막힌 배관, <br />
                <span className="text-[#4a86f7]">데이터</span>로 <br />
                뚫습니다
              </h1>
              {/* Decorative Swash/Underline */}
              <div className="w-64 h-2 bg-[#d1e3ff] rounded-full absolute -bottom-4 left-0 -z-10 opacity-80" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-[#1a1f2c] text-xl sm:text-2xl font-bold leading-snug break-keep">
                국내 최초 AI 비전 기술을 활용한 배관 진단 시스템. <br />
                불투명한 견적과 반복되는 막힘, 이제 과학적으로 해결하세요. <br />
                <span className="text-pink-500 font-black">여성 고객님도 안심하고 이용하는 1:1 전담 케어 서비스</span>
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full mt-8">
              <motion.button
                onClick={onBooking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#0f172a] text-white rounded-full px-6 py-4 sm:py-5 text-base sm:text-lg font-black flex items-center justify-center gap-2 shadow-xl shadow-black/10 transition-all w-full md:flex-1 whitespace-nowrap"
              >
                <Zap className="w-5 h-5 fill-white" />
                AI 무료 진단 시작
              </motion.button>

              <motion.button
                onClick={() => {
                  const el = document.getElementById('services');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0f172a] border-2 border-[#0f172a] rounded-full px-6 py-4 sm:py-5 text-base sm:text-lg font-black flex items-center justify-center shadow-lg transition-all w-full md:flex-1 whitespace-nowrap"
              >
                서비스 상세 보기
              </motion.button>

              <motion.button
                onClick={() => {
                  setBookingType('여성안심 서비스');
                  setPage('booking');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 text-white rounded-full px-6 py-4 sm:py-5 text-base sm:text-lg font-black flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 transition-all w-full md:flex-1 whitespace-nowrap"
              >
                <HeartPulse className="w-5 h-5 fill-white" />
                여성안심 서비스 신청
              </motion.button>
            </div>

            {/* Statistics Bar (Enhanced) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 sm:mt-16 flex flex-wrap items-center gap-3 sm:gap-6 p-2 sm:p-4 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 w-full sm:w-auto"
            >
              <div className="flex-1 min-w-[140px] flex items-center gap-3 px-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-900 text-xl sm:text-2xl font-black leading-none">
                    <Counter value={12482} suffix="+" isLive={true} />
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">AI 진단 횟수</span>
                </div>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-3 px-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-900 text-xl sm:text-2xl font-black leading-none">
                    <Counter value={100} suffix="%" />
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">고객 만족도</span>
                </div>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-3 px-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-900 text-xl sm:text-2xl font-black leading-none">
                    <Counter value={15200} suffix="+" isLive={true} />
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">누적 해결건</span>
                </div>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-3 px-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-900 text-xl sm:text-2xl font-black leading-none">
                    <Counter value={24} suffix="h" />
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">24시 대기</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Image Upload Overlay */}
      {!isShared && (
        <label className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 shadow-xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-40 flex items-center gap-3">
          <Camera className="w-6 h-6 text-zinc-600" />
          <span className="text-zinc-600 font-black text-sm">배경 이미지 변경</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={onHeroUpload} 
          />
        </label>
      )}
    </section>
  );
};

const Filmstrip = ({ 
  images, 
  onUpload, 
  isShared 
}: { 
  images: string[], 
  onUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void,
  isShared?: boolean 
}) => {
  // Limit to exactly 5 images as requested
  const displayImages = images.slice(0, 5);
  // Duplicate images for seamless loop
  const duplicatedImages = [...displayImages, ...displayImages];

  return (
    <section className="bg-white overflow-hidden relative">
      {/* Filmstrip Top Edge - Light Version */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-50 flex justify-around items-center px-4 z-20 border-b border-zinc-100">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="w-4 h-2 bg-white rounded-sm border border-zinc-200" />
        ))}
      </div>

      <div className="flex py-4">
        <motion.div 
          className="flex gap-4 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedImages.map((src, i) => (
            <div 
              key={i} 
              className="flex-none w-[220px] sm:w-[320px] aspect-[4/3] relative rounded-sm overflow-hidden border-[10px] border-zinc-50 shadow-xl group"
            >
              {/* Internal Sprocket Visuals - Light Version */}
              <div className="absolute top-2 left-0 right-0 flex justify-between px-3 z-20">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="w-3 h-3 bg-white rounded-sm border border-zinc-200 opacity-80" />
                ))}
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-3 z-20">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="w-3 h-3 bg-white rounded-sm border border-zinc-200 opacity-80" />
                ))}
              </div>

              <img 
                src={src} 
                alt={`Film ${i + 1}`} 
                className="w-full h-full object-contain transition-all duration-700 bg-white"
                referrerPolicy="no-referrer"
              />
              
              {!isShared && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-30">
                  <Camera className="w-10 h-10 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => onUpload(i % displayImages.length, e)} 
                  />
                </label>
              )}
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

const AwardBar = () => (
  <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 py-6 sm:py-10 relative overflow-hidden">
    {/* Decorative Background */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/20" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-yellow-400" />
          <h2 className="text-white text-xl sm:text-3xl font-black tracking-tighter uppercase">Awards & Recognition</h2>
          <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-yellow-400" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-12">
          <AwardMedal title="고객감동" subtitle="서비스대상 1위" />
          <AwardMedal title="AI 배관진단" subtitle="기술혁신 대상" year="AI TECH" />
          <AwardMedal title="대한민국" subtitle="브랜드대상 1위" />
          <AwardMedal title="소비자만족" subtitle="고객신뢰 1위" />
          <AwardMedal title="품질경영" subtitle="혁신기업 대상" />
        </div>
      </div>
    </div>
  </div>
);

const AwardMedal = ({ title, subtitle, year = "2025" }: { title: string, subtitle: string, year?: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.05 }}
    className="flex flex-col items-center gap-2"
  >
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-700 shadow-xl relative group">
      <div className="w-full h-full rounded-full bg-[#2d1208] flex flex-col items-center justify-center text-center p-2 border-2 border-yellow-500/50">
        <span className="text-[9px] sm:text-[10px] font-black text-yellow-400 tracking-widest mb-1">{year}</span>
        <span className="text-[11px] sm:text-[14px] font-black text-white leading-tight mb-0.5">{title}</span>
        <span className="text-[11px] sm:text-[16px] font-black text-yellow-400 leading-tight">{subtitle}</span>
      </div>
      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

const ServiceCard = ({ 
  serviceKey, 
  service, 
  idx, 
  onSelect, 
  serviceImages, 
  isShared, 
  onImageUpload 
}: { 
  serviceKey: ServiceType, 
  service: any, 
  idx: number, 
  onSelect: (s: ServiceType) => void, 
  serviceImages: Record<ServiceType, string>, 
  isShared?: boolean, 
  onImageUpload: (type: ServiceType, e: React.ChangeEvent<HTMLInputElement>) => void,
  key?: any
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Folding effect: as it moves up, it scales down and rotates slightly
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0.4]);
  const rotateX = useTransform(scrollYProgress, [0.5, 0.9], [0, -15]);
  const y = useTransform(scrollYProgress, [0.5, 0.9], [0, -50]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ 
        scale, 
        opacity, 
        rotateX, 
        y,
        perspective: 1000 
      }}
      className="relative group cursor-pointer"
      onClick={() => onSelect(serviceKey)}
    >
      {/* Service Badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-[#ff00ff] text-white text-[8px] sm:text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap border border-white/50 uppercase tracking-tighter">
          SERVICE 0{idx + 1}
        </div>
      </div>

      <div className="aspect-[4/5] sm:aspect-square rounded-[20px] sm:rounded-[32px] overflow-hidden relative shadow-xl border border-gray-100 bg-white">
        <img 
          src={serviceImages[serviceKey] || service.bgImage} 
          alt={service.title} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Dark Overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        {/* Title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
          <h3 className="text-white font-black text-base sm:text-xl md:text-2xl tracking-tight drop-shadow-md">
            {service.title}
          </h3>
        </div>

        {/* Image Upload Trigger */}
        {!isShared && (
          <label 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 z-20 border border-white/30"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => onImageUpload(serviceKey, e)} 
            />
          </label>
        )}
      </div>
    </motion.div>
  );
};

const ServiceGrid = ({ 
  onSelect, 
  serviceImages, 
  onImageUpload,
  isShared
}: { 
  onSelect: (s: ServiceType) => void,
  serviceImages: Record<ServiceType, string>,
  onImageUpload: (type: ServiceType, e: React.ChangeEvent<HTMLInputElement>) => void,
  isShared?: boolean
}) => {
  return (
    <section id="services" className="py-12 sm:py-20 px-4 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-50 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Service Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {(Object.entries(SERVICES) as [ServiceType, typeof SERVICES.sink][]).map(([key, service], idx) => (
            <div key={key} className={idx === 7 ? "hidden sm:block" : ""}>
              <ServiceCard 
                serviceKey={key}
                service={service}
                idx={idx}
                onSelect={onSelect}
                serviceImages={serviceImages}
                isShared={isShared}
                onImageUpload={onImageUpload}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MembershipPromo = ({ onGo }: { onGo: () => void }) => (
  <section className="relative overflow-hidden w-full bg-black">
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative w-full"
    >
      <img 
        src="/images/Generated Image April 15, 2026 - 4_19PM.jpg" 
        alt="Membership Promo" 
        className="w-full h-auto block"
        referrerPolicy="no-referrer"
      />

      {/* Clickable Areas for Buttons in the Image */}
      <div className="absolute inset-0 z-10">
        {/* 멤버십 가입하기 Button Area - Overlaying the visual buttons in the image */}
        <button 
          onClick={onGo}
          className="absolute bottom-[12%] left-[8%] w-[40%] h-[18%] cursor-pointer bg-transparent border-none outline-none z-20"
          aria-label="멤버십 가입하기"
        />
        {/* 혜택 자세히 보기 Button Area */}
        <button 
          className="absolute bottom-[12%] left-[52%] w-[40%] h-[18%] cursor-pointer bg-transparent border-none outline-none z-20"
          aria-label="혜택 자세히 보기"
        />
      </div>
    </motion.div>
  </section>
);

const ServiceDetail = ({ type, onBack, onBooking }: { type: ServiceType, onBack: () => void, onBooking: () => void }) => {
  const service = SERVICES[type];
  return (
    <div className="pt-16 pb-12 px-4 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-1 font-bold text-gray-400 hover:text-black">
          <ChevronRight className="w-4 h-4 rotate-180" /> 뒤로가기
        </button>
        
          <div className="bg-yellow-50 p-8 rounded-[40px] mb-12">
            <h1 className="text-4xl font-black mb-4">{service.title}</h1>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              {service.desc.replace('\n', ' ')}. 원인을 완벽하게 제거합니다.
            </p>
          </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <AlertCircle className="text-yellow-500" /> 이런 증상이 있으신가요?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {service.symptoms.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-5 rounded-2xl font-bold flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6">달수만의 작업 프로세스</h2>
            <div className="space-y-6">
              {[
                { step: '01', title: '정밀 진단', desc: '배관 내시경을 통해 막힘의 정확한 위치와 원인을 파악합니다.' },
                { step: '02', title: '상세 설명', desc: '고객님께 현재 상태를 영상으로 보여드리고 작업 범위를 설명합니다.' },
                { step: '03', title: '동의 후 작업', desc: '정찰제 비용 안내 후 동의를 얻어 전문 장비로 작업을 시작합니다.' },
                { step: '04', title: '완료 확인', desc: '작업 후 다시 내시경으로 깨끗해진 배관을 직접 확인시켜 드립니다.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="text-3xl font-black text-yellow-400 opacity-50">{item.step}</div>
                  <div>
                    <h3 className="text-lg font-black mb-1">{item.title}</h3>
                    <p className="text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-black text-white p-8 rounded-[40px] text-center">
            <h3 className="text-2xl font-black mb-4">지금 바로 해결이 필요하신가요?</h3>
            <p className="text-gray-400 mb-8 font-bold">전화 한 통이면 30분 내외로 출동합니다.</p>
            <div className="flex flex-col gap-3">
              <a href="tel:1577-1197" className="bg-yellow-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xl">
                <Phone className="w-6 h-6" /> 1577-1197
              </a>
              <button onClick={onBooking} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all">
                온라인 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingForm = ({ initialType }: { initialType?: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialType || '싱크대막힘',
    content: ''
  });
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      try {
        const optimizedImages = await Promise.all(
          newFiles.map(async (file) => {
            const optimized = await optimizeImage(file, 800, 800, 0.6);
            return { file, preview: optimized };
          })
        );
        setImages(prev => [...prev, ...optimizedImages]);
      } catch (err) {
        console.error("Image optimization failed", err);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for SMS
    const message = `[달수배관케어 상담신청]\n성함: ${formData.name}\n연락처: ${formData.phone}\n서비스: ${formData.service}\n내용: ${formData.content || '없음'}\n첨부사진: ${images.length}장`;
    
    // Open SMS app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    const smsUrl = `sms:01044993866${separator}body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
    
    setSubmitted(true);
  };

  if (submitted) {
    const message = `[달수배관케어 상담신청]\n성함: ${formData.name}\n연락처: ${formData.phone}\n서비스: ${formData.service}\n내용: ${formData.content || '없음'}`;
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    const smsUrl = `sms:01044993866${separator}body=${encodeURIComponent(message)}`;

    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-yellow-50 p-8 sm:p-12 rounded-[40px] shadow-xl border border-yellow-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black mb-4">접수 완료!</h2>
          <p className="text-gray-700 font-bold mb-4 break-keep">
            상담 내용이 <span className="text-blue-600 font-black underline underline-offset-4 decoration-2">010-4499-3866</span> 번호로 접수 진행 중입니다.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-8 break-keep leading-relaxed">
            문자 전송 창이 자동으로 열리지 않았거나, PC 환경 등에서 수동 접수를 원하시면 아래 버튼을 이용해 주세요.
          </p>
          
          <div className="flex flex-col gap-3 mb-8">
            <a 
              href={smsUrl}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-yellow-400/20"
            >
              <MessageCircle className="w-5 h-5" /> 문자 메시지로 접수하기
            </a>
            <a 
              href="tel:01044993866" 
              className="bg-white hover:bg-gray-50 text-black border border-gray-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Phone className="w-5 h-5 text-green-600" /> 010-4499-3866 전화상담
            </a>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 sm:pt-16 pb-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[40px] shadow-xl border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-black mb-2 break-keep">빠른 상담 신청</h1>
        <p className="text-sm sm:text-base text-gray-500 font-bold mb-8 break-keep">정보를 남겨주시면 즉시 연락드립니다.</p>
        
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs sm:text-sm font-black mb-2">성함</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-4 font-bold focus:ring-2 focus:ring-yellow-400 transition-all text-sm sm:text-base" 
              placeholder="홍길동" 
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black mb-2">연락처</label>
            <input 
              type="tel" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-4 font-bold focus:ring-2 focus:ring-yellow-400 transition-all text-sm sm:text-base" 
              placeholder="010-0000-0000" 
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black mb-2">서비스 유형</label>
            <select 
              value={formData.service}
              onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
              className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-4 font-bold focus:ring-2 focus:ring-yellow-400 transition-all text-sm sm:text-base"
            >
              {Object.values(SERVICES).map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              <option value="여성안심 서비스">여성안심 서비스</option>
              <option value="기타 문의">기타 문의</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black mb-2">문의 내용 (선택)</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl p-3.5 sm:p-4 font-bold focus:ring-2 focus:ring-yellow-400 transition-all h-28 sm:h-32 text-sm sm:text-base" 
              placeholder="증상을 간단히 적어주세요."
            ></textarea>
          </div>

          {/* Image Attachment Section */}
          <div>
            <label className="block text-xs sm:text-sm font-black mb-2">현장 사진 첨부 (선택)</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100">
                  <img src={img.preview} alt="첨부 사진" className="w-full h-full object-contain bg-zinc-100" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="aspect-square rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-yellow-500 mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 group-hover:text-black">사진 추가</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium break-keep">
              * 최대 6장까지 첨부 가능합니다. 현장 사진을 보내주시면 더 정확한 견적이 가능합니다.
            </p>
          </div>
          
          <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 sm:py-6 rounded-xl sm:rounded-[24px] text-lg sm:text-xl shadow-2xl shadow-yellow-400/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            상담 신청하기
          </button>
          
          <p className="text-center text-[10px] sm:text-xs text-gray-400 font-medium break-keep">
            개인정보는 상담 목적으로만 사용되며 안전하게 보호됩니다.
          </p>
        </form>
      </div>
    </div>
  );
};

const AppDownloadBanner = ({ 
  appMockupImage, 
  onAppMockupUpload,
  onClearStorage,
  onDownload,
  isShared,
  id
}: { 
  appMockupImage: string, 
  onAppMockupUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClearStorage?: () => void,
  onDownload?: () => void,
  isShared?: boolean,
  id?: string
}) => (
  <section id={id} className="py-8 px-4 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#0052CC] to-[#0066CC] rounded-[40px] flex flex-col lg:flex-row items-center justify-between relative overflow-hidden group shadow-2xl shadow-blue-200 min-h-[320px]">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 p-8 md:p-12 lg:w-1/2 text-center lg:text-left">
          <div className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-lg text-[10px] font-black mb-4 uppercase tracking-widest">Limited Offer</div>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-6 break-keep leading-tight">
            어플 다운받고 <span className="text-yellow-300">1만원 할인</span> 받으세요! <br />
            <span className="text-white/80 text-xl md:text-2xl">AI로 3초만에 진단하기</span>
          </h3>
          <p className="text-blue-100 font-bold mb-8 break-keep text-sm md:text-base">
            지금 바로 앱 설치하고 직접 정밀진단을 무료로 체험해 보세요. <br className="hidden md:block" />
            복잡한 예약 없이 사진 한 장으로 즉시 진단이 가능합니다.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
            <a 
              href="https://apps.apple.com/kr/app/%EB%8B%AC%EC%88%98%EB%B0%B0%EA%B4%80%EC%BC%80%EC%96%B4/id6788634887" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0066CC] px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1"
            >
              <Smartphone className="w-5 h-5" /> App Store
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.dalsu.plumbing&pcampaignid=web_share" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0066CC] px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1"
            >
              <Smartphone className="w-5 h-5" /> Google Play
            </a>
          </div>

          {onClearStorage && (
            <button 
              onClick={onClearStorage}
              className="text-white/40 hover:text-white text-[10px] font-bold underline underline-offset-4 transition-colors"
            >
              이미지 용량 부족 시 저장소 초기화
            </button>
          )}
        </div>

        {/* App Mockup Image Area */}
        <div className="relative lg:w-1/2 h-full flex items-end justify-center lg:justify-end pr-0 lg:pr-12 mt-8 lg:mt-0">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-full max-w-[280px] lg:max-w-[320px] group/mockup"
          >
            <div className="relative">
              <img 
                src={appMockupImage} 
                alt="App Mockup" 
                className="w-full h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)]"
                referrerPolicy="no-referrer"
              />
              {/* Image Upload Overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/mockup:opacity-100 transition-opacity cursor-pointer rounded-[40px]">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 shadow-2xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onAppMockupUpload} 
                />
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const PartnersSection = () => {
  const partners = [
    { name: 'HYUNDAI', fullName: '현대건설', color: 'text-[#005aab]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'SAMSUNG', fullName: '삼성생명', color: 'text-[#074c91]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'KB', fullName: 'KB국민은행', color: 'text-[#6c594c]', bg: 'bg-[#ffbc00]', border: 'border-yellow-200' },
    { name: 'SK hynix', fullName: 'SK하이닉스', color: 'text-[#f05023]', bg: 'bg-white', border: 'border-red-100' },
    { name: 'LG', fullName: 'LG전자', color: 'text-[#a50034]', bg: 'bg-white', border: 'border-pink-100' },
    { name: 'Shinhan', fullName: '신한금융그룹', color: 'text-white', bg: 'bg-[#004282]', border: 'border-blue-800' },
    { name: 'Hanwha', fullName: '한화솔루션', color: 'text-[#f37321]', bg: 'bg-white', border: 'border-orange-100' },
    { name: 'POSCO', fullName: '포스코건설', color: 'text-[#004a91]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'CJ', fullName: 'CJ제일제당', color: 'text-[#e50012]', bg: 'bg-white', border: 'border-red-100' },
    { name: 'KT', fullName: 'KT', color: 'text-black', bg: 'bg-white', border: 'border-gray-200' },
    { name: 'LH', fullName: '한국토지주택공사', color: 'text-[#69b139]', bg: 'bg-white', border: 'border-green-100' },
    { name: 'Gyeonggi', fullName: '경기도청', color: 'text-[#244293]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'ICN', fullName: '인천국제공항', color: 'text-[#005596]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'EX', fullName: '한국도로공사', color: 'text-white', bg: 'bg-[#004a91]', border: 'border-blue-800' },
    { name: 'GEPS', fullName: '공무원연금공단', color: 'text-[#007dba]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'KEPCO', fullName: '한국전력공사', color: 'text-[#00529b]', bg: 'bg-white', border: 'border-blue-100' },
    { name: 'MND', fullName: '대한민국 국방부', color: 'text-gray-800', bg: 'bg-white', border: 'border-gray-200' },
    { name: 'SHINSEGAE', fullName: '신세계', color: 'text-black', bg: 'bg-white', border: 'border-gray-200' },
    { name: 'STARBUCKS', fullName: '스타벅스', color: 'text-white', bg: 'bg-[#007042]', border: 'border-green-800' },
    { name: 'LOTTE Mart', fullName: '롯데마트', color: 'text-[#ed1c24]', bg: 'bg-white', border: 'border-red-100' }
  ];

  return (
    <section className="py-12 sm:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black mb-6 uppercase tracking-widest"
          >
            TRUSTED PARTNERS
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black mb-6 leading-tight"
          >
            대기업 및 공무원 거주단지가 <br />
            <span className="text-blue-600 underline underline-offset-8">먼저 선택한</span> 배관 케어
          </motion.h2>
          <p className="text-gray-500 font-bold text-base sm:text-lg">대한민국 대표 기업과 기관들이 달수배관케어의 정직한 기술력을 신뢰합니다.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {partners.map((partner, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 5) * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${partner.bg} aspect-[2/1] rounded-xl sm:rounded-2xl border ${partner.border} flex flex-col items-center justify-center p-4 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden`}
            >
              <span className={`font-black text-sm sm:text-base md:text-lg lg:text-xl tracking-tighter text-center leading-none ${partner.color}`}>
                {partner.name}
              </span>
              <span className="absolute bottom-2 text-[8px] sm:text-[9px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {partner.fullName}
              </span>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 font-bold text-sm tracking-tight italic">
            * 상기 로고와 기업명은 달수배관케어의 실제 서비스 실적 및 협력 이력을 바탕으로 구성되었습니다.
          </p>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 mb-10 sm:mb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm border border-gray-100">
              <img 
                src="/images/로고어플용2.png" 
                alt="달수캐릭터" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <span className="text-white text-xl font-black tracking-tighter">달수배관케어</span>
          </div>
          <div className="font-bold text-xs sm:text-sm leading-relaxed mb-4 space-y-1.5 break-keep">
            <p>달수배관케어 | 대표이사: 김주찬</p>
            <p className="pt-1">사업자번호: 846-19-02240</p>
            <p>본사: 경기도 김포시 김포한강10로133번길127. 디원시티507호</p>
            <p>고객센터: <a href="tel:1577-1197" className="hover:text-white transition-colors">1577-1197</a> (24시간 긴급출동 대기)</p>
          </div>
          <div className="flex gap-4 text-[10px] sm:text-xs font-bold underline underline-offset-4">
            <button>이용약관</button>
            <button>개인정보처리방침</button>
          </div>
        </div>
        <div className="bg-white/5 p-6 sm:p-8 rounded-[28px] sm:rounded-3xl border border-white/10">
          <h4 className="text-white font-black mb-2 break-keep">전국 서비스 가능 지역</h4>
          <p className="text-xs sm:text-sm font-medium leading-relaxed break-keep">
            수도권 전 지역 포함, 부산, 대구, 광주, 대전, 울산 등 전국 주요 도시 30분 내 출동 가능
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-[10px] sm:text-xs font-medium">
        © 2026 DALSU PIPE CARE. ALL RIGHTS RESERVED.
      </div>
    </div>
  </footer>
);

// --- Main App ---

// --- Admin Login Modal ---
const AdminLoginModal = ({ 
  isOpen, 
  onClose, 
  onLogin 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onLogin: (password: string) => void 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[40px] p-8 sm:p-12 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">관리자 인증</h2>
          <p className="text-gray-500 font-bold">공지사항 작성을 위해 비밀번호를 입력하세요.</p>
        </div>

        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="비밀번호" 
            className={`w-full bg-gray-50 border-2 ${error ? 'border-red-400' : 'border-transparent'} rounded-2xl p-5 font-bold focus:bg-white focus:border-yellow-400 outline-none transition-all text-center text-xl`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (password === 'dalsu1234') {
                  onLogin(password);
                  onClose();
                } else {
                  setError(true);
                }
              }
            }}
          />
          {error && <p className="text-red-500 text-sm font-bold text-center">비밀번호가 일치하지 않습니다.</p>}
          
          <button 
            onClick={() => {
              if (password === 'dalsu1234') {
                onLogin(password);
                onClose();
              } else {
                setError(true);
              }
            }}
            className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-gray-800 transition-all shadow-xl"
          >
            인증하기
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 text-gray-400 font-bold text-sm hover:text-black transition-colors"
        >
          닫기
        </button>
      </motion.div>
    </div>
  );
};

// --- Notices Component ---
const Notices = ({ 
  notices, 
  isShared, 
  onAdd, 
  onDelete 
}: { 
  notices: Notice[], 
  isShared: boolean, 
  onAdd: (notice: Omit<Notice, 'id' | 'date'>) => void,
  onDelete: (id: number) => void
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isImportant: false });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="pt-12 sm:pt-16 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">공지사항</h1>
            <p className="text-gray-500 font-bold">달수배관케어의 새로운 소식을 전해드립니다.</p>
          </div>
          {!isShared && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> 글쓰기
            </button>
          )}
        </div>

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-6 sm:p-8 rounded-[32px] mb-12 border border-gray-100"
          >
            <h2 className="text-xl font-black mb-6">새 공지사항 작성</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="제목을 입력하세요" 
                className="w-full bg-white border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-yellow-400 outline-none"
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
              />
              <textarea 
                placeholder="내용을 입력하세요" 
                className="w-full bg-white border-none rounded-2xl p-4 font-medium h-40 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                value={newNotice.content}
                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newNotice.isImportant}
                  onChange={(e) => setNewNotice({...newNotice, isImportant: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="font-bold text-sm">중요 공지로 설정</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => {
                    if (!newNotice.title || !newNotice.content) return;
                    onAdd(newNotice);
                    setIsAdding(false);
                    setNewNotice({ title: '', content: '', isImportant: false });
                  }}
                  className="flex-1 bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all"
                >
                  등록하기
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-gray-200 text-gray-600 font-black py-4 rounded-2xl hover:bg-gray-300 transition-all"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`bg-white rounded-[32px] border transition-all overflow-hidden ${expandedId === notice.id ? 'border-yellow-400 shadow-xl shadow-yellow-400/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <button 
                  onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.isImportant && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">중요</span>
                      )}
                      <span className="text-gray-400 text-xs font-bold">{notice.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black break-keep">{notice.title}</h3>
                  </div>
                  <ChevronRight className={`w-6 h-6 text-gray-300 transition-transform ${expandedId === notice.id ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedId === notice.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-gray-50">
                        <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 font-medium whitespace-pre-wrap leading-relaxed">
                          {notice.content}
                        </div>
                        {!isShared && (
                          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notice.id);
                              }}
                              className="text-red-400 hover:text-red-600 font-bold text-sm flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> 삭제하기
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const AppDownloadStickyBar = ({ onDownload }: { onDownload: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md text-white py-1.5 px-4 flex items-center justify-between text-xs sm:text-sm font-bold z-50 border-t border-white/5 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-400 p-1.5 rounded-lg shadow-lg shadow-yellow-400/20">
          <Smartphone className="w-4 h-4 text-black" />
        </div>
        <span className="tracking-tight font-black whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] sm:max-w-none">
          어플 다운받고 <span className="text-yellow-400 underline underline-offset-4 decoration-2">1만원 할인</span> 받기! 
          <span className="hidden sm:inline mx-3 opacity-20">|</span> 
          <span className="text-white/70 font-bold">AI로 3초만에 진단하기</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onDownload}
          className="group relative bg-yellow-400 text-black px-4 py-1.5 rounded-[14px] text-[10px] sm:text-xs font-black shadow-xl hover:scale-105 active:scale-95 transition-all border-[2.5px] border-zinc-800 overflow-hidden flex items-center justify-center whitespace-nowrap"
        >
          {/* Smartphone Notch Visual */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-800 rounded-b-lg z-10" />
          
          {/* Smartphone Home Bar Visual */}
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black/20 rounded-full" />

          <span className="flex items-center gap-1.5 relative z-0 pt-0.5">
            앱 다운로드
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
        <button onClick={() => setIsVisible(false)} className="text-white/40 hover:text-white transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const isShared = typeof window !== 'undefined' && !window.location.href.includes('ais-dev-');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [bookingType, setBookingType] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/images/커피숍배수구막힘일괄편집_20250214_214534.jpg',
    '/images/KakaoTalk_20260202_214803690_05.jpg',
    '/images/KakaoTalk_20260224_113836708.jpg',
    '/images/KakaoTalk_20260224_113836708_17.jpg',
    '/images/욕실악취.jpg'
  ]);

  const galleryScrollRef = React.useRef<HTMLDivElement>(null);

  const galleryScroll = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const { scrollLeft, clientWidth } = galleryScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      galleryScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.title = "달수배관케어 | 대한민국 AI 배관 솔루션";
  }, []);

  const [heroImage, setHeroImage] = useState('/images/Generated Image April 15, 2026 - 3_50PM.jpg');
  const [heroCharacterImage, setHeroCharacterImage] = useState('/images/character.png');
  const [heroImage2, setHeroImage2] = useState('/images/00.jpeg');
  const [heroImage3, setHeroImage3] = useState('/images/hero_3.jpeg');
  const [heroSideImage1, setHeroSideImage1] = useState('/images/Generated Image February 10, 2026 - 1_07PM.jpeg');
  const [heroSideImage2, setHeroSideImage2] = useState('/images/Generated Image February 10, 2026 - 1_08PM-1.jpeg');
  const [heroSideImage3, setHeroSideImage3] = useState('/images/Generated Image February 10, 2026 - 1_10PM.jpeg');
  const [heroSideImage4, setHeroSideImage4] = useState('/images/Generated Image February 10, 2026 - 1_12PM.jpeg');
  const [heroSideImage5, setHeroSideImage5] = useState('/images/Generated Image February 10, 2026 - 1_14PM.jpeg');
  const [profileImage, setProfileImage] = useState('/images/profile.jpg');
  const [logoImage, setLogoImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('logoImage') || '/images/홈로고.png';
    }
    return '/images/홈로고.png';
  });

  const [logoScale, setLogoScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('logoScale');
      return saved ? parseFloat(saved) : 1.2;
    }
    return 1.2;
  });

  useEffect(() => {
    if (logoImage) localStorage.setItem('logoImage', logoImage);
  }, [logoImage]);

  useEffect(() => {
    localStorage.setItem('logoScale', logoScale.toString());
  }, [logoScale]);
  const [aboutImage, setAboutImage] = useState('/images/Generated Image February 11, 2026 - 12_13PM.jpeg');
  const [membershipImage, setMembershipImage] = useState('/images/Generated Image April 15, 2026 - 4_19PM.jpg');
  const [fullWidthImage, setFullWidthImage] = useState('/images/Generated Image February 11, 2026 - 12_21PM.jpeg');
  const [appMockupImage, setAppMockupImage] = useState('/images/app_mockup.jpg');
  const [reviewsBgImage, setReviewsBgImage] = useState('/images/reviews_bg.jpg');
  const [reviewImages, setReviewImages] = useState<string[]>([
    '/images/KakaoTalk_20250905_170454607_07.jpg',
    '/images/006..jpg',
    '/images/배수구냄새.jpg'
  ]);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({
    sink: '/images/90.png',
    toilet: '/images/generated_image_3 (1).png',
    drain: '/images/Generated Image February 11, 2026 - 11_52AM.jpeg',
    jetting: '/images/Generated Image February 10, 2026 - 11_53AM.jpeg',
    endoscopy: '/images/Generated Image February 10, 2026 - 1_03PM.jpeg',
    odor: '/images/Generated Image February 10, 2026 - 1_08PM.jpeg',
    leak: '/images/Generated Image February 10, 2026 - 11_54AM.jpeg',
    repair: '/images/Generated Image February 10, 2026 - 11_37AM.jpeg',
    appliances: '/images/Generated Image March 27, 2026 - 6_26PM.jpg'
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [notices, setNotices] = useState<Notice[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dalsu_notices');
      return saved ? JSON.parse(saved) : [
        { 
          id: 1, 
          title: '달수배관케어 홈페이지 리뉴얼 안내', 
          content: '안녕하세요, 달수배관케어입니다.\n고객님들께 더 나은 서비스를 제공하기 위해 홈페이지를 새롭게 단장하였습니다.\n앞으로도 많은 이용 부탁드립니다.', 
          date: '2024.04.16', 
          isImportant: true 
        }
      ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('dalsu_notices', JSON.stringify(notices));
  }, [notices]);

  const handleAddNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
    const date = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
    setNotices([{ ...notice, id: newId, date }, ...notices]);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const handleImageUpload = (setter: (val: string) => void, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const optimized = await optimizeImage(e.target.files[0], maxWidth, maxHeight, quality);
        setter(optimized);
      } catch (err) {
        console.error("Image optimization failed", err);
      }
    }
  };

  const handleServiceImageUpload = async (type: ServiceType, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const optimized = await optimizeImage(e.target.files[0], 1200, 800, 0.85);
        setServiceImages(prev => ({
          ...prev,
          [type]: optimized
        }));
      } catch (err) {
        console.error("Image optimization failed", err);
      }
    }
  };

  const handleReviewImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const optimized = await optimizeImage(e.target.files[0], 800, 600, 0.85);
        setReviewImages(prev => {
          const next = [...prev];
          next[index] = optimized;
          return next;
        });
      } catch (err) {
        console.error("Image optimization failed", err);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      try {
        const optimizedImages = await Promise.all(
          files.map(file => optimizeImage(file, 1200, 1200, 0.8))
        );
        setGalleryImages(prev => [...optimizedImages, ...prev].slice(0, 12));
      } catch (err) {
        console.error("Image optimization failed", err);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, selectedService]);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const renderContent = () => {
    if (selectedService) {
      return (
        <ServiceDetail 
          type={selectedService} 
          onBack={() => setSelectedService(null)} 
          onBooking={() => setPage('booking')}
        />
      );
    }

    switch (page) {
      case 'home':
        return (
          <>
            <Hero 
              onBooking={() => setIsDownloadModalOpen(true)} 
              heroImage={heroImage}
              onHeroUpload={handleImageUpload(setHeroImage, 1920, 1080, 0.85)}
              isShared={isShared || !isAdmin}
              setPage={setPage}
              setBookingType={setBookingType}
            />
            <Filmstrip 
              images={[heroSideImage1, heroSideImage2, heroSideImage3, heroSideImage4, heroSideImage5]}
              onUpload={(index, e) => {
                const setters = [setHeroSideImage1, setHeroSideImage2, setHeroSideImage3, setHeroSideImage4, setHeroSideImage5];
                if (index < 5) {
                  handleImageUpload(setters[index], 1600, 1200, 0.95)(e);
                }
              }}
              isShared={isShared || !isAdmin}
            />
            <AITechBanner />

            {/* Service Grid Section (Moved below Emergency CTA) */}
            <ServiceGrid 
              onSelect={(s) => setSelectedService(s)} 
              serviceImages={serviceImages as Record<ServiceType, string>}
              onImageUpload={handleServiceImageUpload}
              isShared={isShared || !isAdmin}
            />

            <MembershipPromo 
              onGo={() => setPage('membership')} 
            />

            {/* Work Gallery Section (시공사례) */}
            <section className="py-12 sm:py-20 px-4 bg-white relative overflow-hidden group/gallery">
              {/* Background Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-50/30 rounded-full blur-[120px] opacity-60" />
                <div className="absolute top-0 -left-20 w-80 h-80 bg-gray-50/50 rounded-full blur-[100px] opacity-40" />
              </div>
              
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
                  <div className="max-w-xl">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4"
                    >
                      Work Gallery
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] break-keep"
                    >
                      시공<span className="text-blue-600">사례</span>
                    </motion.h2>
                    <p className="text-gray-500 font-bold text-sm sm:text-base mt-4 leading-relaxed break-keep">
                      믿고 맡길 수 있는 완벽한 시공을 약속 드립니다.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <a 
                      href="https://blog.naver.com/dalsu2018" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-blue-200"
                    >
                      블로그에서 시공사례 더보기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {!isShared && isAdmin && (
                      <label className="bg-black text-white px-6 py-3.5 rounded-2xl font-black text-xs cursor-pointer hover:bg-gray-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                        <Upload className="w-4 h-4" /> 사진 직접 첨부하기
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleGalleryUpload} 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="relative overflow-hidden -mx-4 px-4">
                  <div className="flex animate-marquee-fast gap-6 hover:[animation-play-state:paused]">
                    {[...Array(3)].flatMap(() => galleryImages).map((url, idx) => (
                      <a 
                        key={idx}
                        href="https://blog.naver.com/dalsu2018"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <motion.div 
                          className="bg-white rounded-[32px] shadow-lg shadow-black/5 overflow-hidden flex flex-col group relative border border-gray-50 min-w-[240px] sm:min-w-[300px] max-w-[240px] sm:max-w-[300px]"
                        >
                          <div className="h-48 sm:h-60 overflow-hidden relative">
                            <img 
                              src={url} 
                              alt={`작업 현장 ${idx + 1}`} 
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 bg-white" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                            
                            {!isShared && isAdmin && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setGalleryImages(prev => prev.filter((_, i) => i !== (idx % galleryImages.length)));
                                }}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 border border-white/30 z-30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                            <div className="absolute bottom-4 left-6 right-6 text-white">
                              <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-blue-400">Case Study 0{(idx % galleryImages.length) + 1}</div>
                              <h4 className="font-black text-lg tracking-tight">현장 작업 완료</h4>
                            </div>
                          </div>
                        </motion.div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50 relative overflow-hidden group/reviews">
              {/* Background Image */}
              {reviewsBgImage && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={reviewsBgImage} 
                    alt="Reviews Background" 
                    className="w-full h-full object-cover opacity-70" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Image Upload Overlay */}
              {!isShared && isAdmin && (
                <label className="absolute top-8 right-8 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-xl cursor-pointer opacity-0 group-hover/reviews:opacity-100 transition-opacity z-30">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload(setReviewsBgImage, 1920, 1080, 0.4)} 
                  />
                </label>
              )}

              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 -left-20 w-96 h-96 bg-yellow-100/30 rounded-full blur-[120px] opacity-60" />
                <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px] opacity-40" />
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
                  <div className="max-w-xl">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4"
                    >
                      Real Stories
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] break-keep"
                    >
                      실제 고객님들의 <br />
                      <span className="text-gray-400">생생한 후기</span>
                    </motion.h2>
                  </div>
                </div>

                <div className="relative overflow-hidden -mx-4 px-4">
                  <div className="flex animate-marquee-fast gap-6 hover:[animation-play-state:paused]">
                    {[...Array(3)].flatMap(() => [
                      { id: 0, name: '이*정 고객님', service: '싱크대막힘', text: '기름때문에 꽉 막혀서 고생했는데, 내시경으로 직접 보면서 뚫어주시니 속이 다 시원하네요. 정말 친절하십니다!', img: reviewImages[0], date: '2024.03.15' },
                      { id: 1, name: '박*훈 고객님', service: '변기막힘', text: '밤 11시에 변기가 막혀서 멘붕이었는데 20분 만에 오셔서 해결해주셨어요. 가격도 정찰제라 믿음이 갑니다.', img: reviewImages[1], date: '2024.03.12' },
                      { id: 2, name: '최*숙 고객님', service: '악취제거', text: '화장실 냄새 때문에 스트레스였는데 트랩 설치하고 나서 냄새가 싹 사라졌어요. 진작 부를 걸 그랬네요.', img: reviewImages[2], date: '2024.03.10' },
                    ]).map((review, idx) => (
                      <a 
                        key={idx}
                        href="https://blog.naver.com/dalsu2018"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group flex-shrink-0"
                      >
                        <motion.div 
                          className="bg-white rounded-[32px] shadow-lg shadow-black/5 overflow-hidden flex flex-col h-full relative border border-gray-50 min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px]"
                        >
                          <div className="h-40 sm:h-48 overflow-hidden relative">
                            <img 
                              src={review.img} 
                              alt={review.service} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 bg-white" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                            
                            {!isShared && isAdmin && (
                              <label 
                                onClick={(e) => e.stopPropagation()} 
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-30"
                              >
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                                  <Camera className="w-6 h-6 text-white" />
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleReviewImageUpload(review.id, e)} 
                                />
                              </label>
                            )}

                            <div className="absolute bottom-3 left-4">
                              <span className="text-[9px] font-black bg-yellow-400 text-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">{review.service}</span>
                            </div>
                          </div>
                          <div className="p-5 sm:p-6 flex-1 flex flex-col bg-white">
                            <div className="flex gap-1 mb-3 sm:mb-4">
                              {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-6 leading-snug flex-1 italic break-keep">"{review.text}"</p>
                            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="font-black text-xs text-black">{review.name}</p>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Verified Customer</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-gray-300 font-bold">{review.date}</span>
                            </div>
                          </div>
                        </motion.div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <AppDownloadBanner 
              id="download-section"
              appMockupImage={appMockupImage}
              onAppMockupUpload={handleImageUpload(setAppMockupImage, 1200, 1200, 0.85)}
              onClearStorage={!isShared && isAdmin ? () => { localStorage.clear(); window.location.reload(); } : undefined}
              onDownload={() => setIsDownloadModalOpen(true)}
              isShared={isShared || !isAdmin}
            />

            <PartnersSection />

            {/* Full Width Image Section */}
            <section className="w-full h-[60vh] sm:h-[80vh] md:h-[100vh] relative group overflow-hidden">
              <div className="w-full h-full bg-gray-100 relative">
                <img 
                  src={fullWidthImage} 
                  alt="Full Width Banner" 
                  className="w-full h-full object-contain bg-white"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Upload Overlay */}
                {!isShared && isAdmin && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-30">
                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/30 shadow-2xl">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload(setFullWidthImage, 1920, 1080, 0.9)} 
                    />
                  </label>
                )}
              </div>
            </section>
          </>
        );
      case 'membership':
        return (
          <div className="pt-12 sm:pt-16 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <span className="bg-black text-yellow-400 px-4 py-1 rounded-full text-[10px] sm:text-xs font-black mb-4 inline-block">PREMIUM CARE</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 break-keep">배관도 관리가 필요합니다</h1>
                <p className="text-lg sm:text-xl text-gray-500 font-bold break-keep">월 29,900원으로 누리는 1% 배관 케어 서비스</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-12 sm:mb-16">
                {[
                  { title: '연 4회 배관 건강검진', desc: '내시경 장비로 배관 속을 정기 점검하여 큰 사고를 미리 예방합니다.' },
                  { title: '막힘 응급보험 지원', desc: '갑작스러운 막힘 발생 시 작업비 최대 10만원을 연 1회 지원해드립니다.' },
                  { title: '작업비 상시 10% 할인', desc: '멤버십 회원님은 모든 유상 서비스 이용 시 10% 할인이 자동 적용됩니다.' },
                  { title: 'AI 자가진단 리포트', desc: '앱을 통해 우리 집 배관 상태를 데이터로 관리하고 진단받을 수 있습니다.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] flex items-start gap-4 sm:gap-6">
                    <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                      <CheckCircle2 className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black mb-2 break-keep">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed break-keep">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-400 p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] text-center mb-12 shadow-2xl shadow-yellow-400/20">
                <p className="font-black text-base sm:text-lg mb-2">출장 한 번이면 1년치 본전!</p>
                <h2 className="text-3xl sm:text-4xl font-black mb-6 sm:mb-8">월 29,900원</h2>
                <button className="w-full bg-black text-white font-black py-5 sm:py-6 rounded-2xl sm:rounded-[28px] text-xl sm:text-2xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all">
                  지금 바로 가입하기
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 font-bold mb-4">전용 앱에서 더 편리하게 관리하세요</p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://apps.apple.com/kr/app/%EB%8B%AC%EC%88%98%EB%B0%B0%EA%B4%80%EC%BC%80%EC%96%B4/id6788634887" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gray-100 hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-colors"
                  >
                    <Smartphone className="w-4 h-4" /> App Store
                  </a>
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.dalsu.plumbing&pcampaignid=web_share" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gray-100 hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-colors"
                  >
                    <Smartphone className="w-4 h-4" /> Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="pt-12 sm:pt-16 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-black mb-6 sm:mb-8 break-keep">배관은 집의 혈관입니다</h1>
              <div className="aspect-video bg-gray-100 rounded-[32px] sm:rounded-[40px] mb-10 sm:mb-12 overflow-hidden relative group">
                <img src={aboutImage} alt="우리 팀" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                {/* Image Upload Overlay */}
                {!isShared && isAdmin && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-30">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload(setAboutImage, 1200, 800, 0.9)} />
                  </label>
                )}
              </div>
              <div className="prose prose-sm sm:prose-lg font-medium text-gray-600 leading-relaxed space-y-6 sm:space-y-8 break-keep">
                <p>
                  우리는 스스로를 '배관 전문의'라고 부릅니다. 단순히 막힌 곳을 뚫는 기술자를 넘어, 
                  집이라는 유기체가 건강하게 순환할 수 있도록 진단하고 처방하는 전문가 집단입니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 not-prose">
                  {[
                    { title: '정직한 진단', desc: '과잉 시공 없이 꼭 필요한 작업만 제안합니다.' },
                    { title: '투명한 가격', desc: '정찰제 운영으로 바가지 요금 걱정을 없앴습니다.' },
                    { title: '사회적 가치', desc: '취약계층 배관 점검 지원 등 사회적 책임을 다합니다.' },
                    { title: '기술의 혁신', desc: '첨단 장비와 AI 데이터를 활용해 정확도를 높입니다.' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100">
                      <h4 className="text-black font-black mb-2 break-keep">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed break-keep">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p>
                  달수배관케어는 고객님의 신뢰를 가장 큰 자산으로 여깁니다. 
                  한 번의 인연이 평생의 안심이 될 수 있도록 오늘도 정직하게 현장으로 달려갑니다.
                </p>
              </div>
            </div>
          </div>
        );
      case 'booking':
        return <BookingForm initialType={bookingType} />;
      case 'notices':
        return (
          <Notices 
            notices={notices} 
            isShared={isShared || !isAdmin} 
            onAdd={handleAddNotice} 
            onDelete={handleDeleteNotice} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-black selection:bg-yellow-200">
        <Navbar 
          setPage={(p) => { 
            setPage(p); 
            setSelectedService(null); 
            setBookingType(undefined);
          }} 
          logoImage={logoImage}
          onLogoUpload={handleImageUpload(setLogoImage, 1200, 600, 0.95)}
          isShared={isShared || !isAdmin}
          logoScale={logoScale}
          onLogoScaleChange={setLogoScale}
          isAdmin={isAdmin}
          onAdminClick={() => {
            if (isAdmin) {
              setIsAdmin(false);
            } else {
              setIsAdminModalOpen(true);
            }
          }}
        />
        
        <div className="pt-20 sm:pt-24">
          <main>
            {renderContent()}
          </main>
        </div>

        <Footer />

        <DownloadModal 
          isOpen={isDownloadModalOpen} 
          onClose={() => setIsDownloadModalOpen(false)} 
        />

        <AdminLoginModal 
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onLogin={() => setIsAdmin(true)}
        />

        {/* Error Toast */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-red-600 text-white p-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm font-bold leading-tight">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Quick Dock - Individual floating buttons moved to bottom */}
        <div className="fixed bottom-6 left-0 right-0 md:hidden z-40 pointer-events-none px-4">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-3 pointer-events-auto"
          >
            {/* Phone */}
            <a href="tel:1577-1197" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(220,38,38,0.4)] border-2 border-white">
                <Phone className="w-7 h-7 text-white fill-white" />
              </div>
              <span className="text-[10px] font-black text-gray-800 drop-shadow-sm">전화</span>
            </a>

            {/* KakaoTalk */}
            <a href="http://pf.kakao.com/_EdXzX" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 shadow-[0_10px_25px_rgba(254,229,0,0.4)] border-2 border-white rounded-2xl overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <rect width="40" height="40" rx="10" fill="#FEE500"/>
                  <path d="M20 8c-7.7 0-14 4.8-14 10.7 0 3.9 2.6 7.3 6.4 9.1l-1.6 5.9c-.1.5.4.9.8.7l7-4.7c.5.1 1 .1 1.4.1 7.7 0 14-4.8 14-10.7S27.7 8 20 8z" fill="#3C1E1E"/>
                  <text x="20" y="21.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="7" fill="#FEE500" textAnchor="middle">TALK</text>
                </svg>
              </div>
              <span className="text-[10px] font-black text-gray-800 drop-shadow-sm">카톡</span>
            </a>

            {/* Blog */}
            <a href="https://blog.naver.com/dalsu2018" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 shadow-[0_10px_25px_rgba(3,199,90,0.4)] border-2 border-white rounded-2xl overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <rect width="40" height="40" rx="10" fill="#03C75A"/>
                  <path d="M8 12c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4h-10l-4 4v-4H12c-2.2 0-4-1.8-4-4V12z" fill="white"/>
                  <text x="20" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="8" fill="#03C75A" textAnchor="middle">blog</text>
                </svg>
              </div>
              <span className="text-[10px] font-black text-gray-800 drop-shadow-sm">블로그</span>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@dalsu2018" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 shadow-[0_10px_25px_rgba(205,32,31,0.4)] border-2 border-white rounded-2xl overflow-hidden">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <rect width="40" height="40" rx="10" fill="#CD201F"/>
                  <path d="M28 12H12c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4z" fill="white"/>
                  <path d="M18 16v8l7-4-7-4z" fill="#CD201F"/>
                </svg>
              </div>
              <span className="text-[10px] font-black text-gray-800 drop-shadow-sm">유튜브</span>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/dalsu2018/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(225,48,108,0.4)] border-2 border-white">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              <span className="text-[10px] font-black text-gray-800 drop-shadow-sm">인스타</span>
            </a>
          </motion.div>
        </div>
    </div>
    </ErrorBoundary>
  );
}
