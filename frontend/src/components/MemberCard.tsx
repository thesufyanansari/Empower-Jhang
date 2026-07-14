import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Button } from './ui/Button';
import logo from '../assets/empower-jhang-logo.png';
import { Download, FileDown, RotateCw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface MemberCardProps {
  profile: {
    member_id: string;
    full_name: string;
    district: string;
    joined_at: string;
    profile_photo: string | null;
    occupation: string;
    is_verified: boolean;
    role?: any;
  };
}

export const MemberCard: React.FC<MemberCardProps> = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const profileUrl = `${window.location.origin}/member/${profile.member_id}`;
  const formattedDate = new Date(profile.joined_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const downloadPNG = async () => {
    const element = isFlipped ? backRef.current : frontRef.current;
    if (!element) return;

    setDownloading(true);
    const loadToast = toast.loading('Generating high-quality image...');
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 3,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `EJ_MemberCard_${profile.member_id}_${isFlipped ? 'back' : 'front'}.png`;
      link.click();
      toast.success('Image downloaded successfully!', { id: loadToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate image.', { id: loadToast });
    } finally {
      setDownloading(false);
    }
  };

  const downloadPDF = () => {
    const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/member/${profile.member_id}/card/pdf`;
    window.open(backendUrl, '_blank');
    toast.success('Downloading vector-sharp PDF...');
  };

  const role = profile.role;
  const theme = role?.theme;
  const accentColor = theme?.accent_color || '#3b82f6';
  const gradientClass = theme?.gradient_css ? `bg-gradient-to-tr ${theme.gradient_css}` : 'bg-slate-900';
  const borderStyle = theme?.border_style ? `border-2 ${theme.border_style}` : 'border border-white/10';
  const badgeLabel = (role?.badge?.badge_name || role?.name || 'MEMBER').toUpperCase();

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 3D Flip Card Container */}
      <div className="w-[320px] h-[508px] member-card-3d relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full duration-700 ease-out transition-transform`} style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
          
          {/* FRONT OF MEMBER CARD */}
          <div 
            ref={frontRef} 
            className={`absolute inset-0 w-full h-full rounded-[24px] p-6 text-white flex flex-col justify-between shadow-2xl backface-hidden ${gradientClass} ${borderStyle}`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderColor: role ? theme?.accent_color : undefined }}
          >
            {/* Background blur effects (only if not custom role gradient) */}
            {!theme?.gradient_css && (
              <>
                <div className="absolute top-0 right-0 h-44 w-44 bg-primary-green/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-44 w-44 bg-primary-blue/25 rounded-full blur-3xl pointer-events-none" />
              </>
            )}

            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center p-1">
                  <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black font-poppins tracking-wider leading-none">EMPOWER JHANG</h4>
                  <p className="text-[7px] text-white/50 font-poppins mt-0.5">Learn • Connect • Grow</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-bold border font-poppins uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${accentColor}22`, 
                  color: accentColor, 
                  borderColor: `${accentColor}44` 
                }}
              >
                {profile.is_verified && <ShieldCheck className="h-3 w-3 fill-current/10" />}
                {badgeLabel}
              </div>
            </div>

            {/* Avatar & Info */}
            <div className="flex flex-col items-center space-y-3.5 z-10">
              <div className="relative">
                <div 
                  className="h-28 w-28 rounded-full p-1 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  {profile.profile_photo ? (
                    <img 
                      src={profile.profile_photo.startsWith('http') ? profile.profile_photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.profile_photo}`} 
                      alt={profile.full_name} 
                      className="h-full w-full rounded-full object-cover border-2 border-slate-900"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-900 font-poppins font-black text-2xl uppercase">
                      {profile.full_name?.[0]}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-1 h-7 w-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs shadow-md">
                  🇵🇰
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold font-poppins tracking-tight leading-none">{profile.full_name}</h3>
                <p 
                  className="text-[10px] font-bold uppercase tracking-wider font-poppins mt-1"
                  style={{ color: accentColor }}
                >
                  {profile.occupation}
                </p>
                <p className="text-[9px] text-white/60 font-poppins">{profile.district}, Punjab</p>
              </div>
            </div>

            {/* Footer barcode/details */}
            <div className="flex items-end justify-between border-t border-white/10 pt-4 z-10">
              <div className="space-y-1">
                <p className="text-[7px] text-white/40 leading-none">MEMBER ID</p>
                <p 
                  className="text-sm font-black font-poppins tracking-tight leading-none"
                  style={{ color: accentColor }}
                >{profile.member_id}</p>
                <p className="text-[7px] text-white/40 leading-none pt-1">JOINED DATE</p>
                <p className="text-[9px] font-semibold text-white/80 leading-none">{formattedDate}</p>
              </div>
              <div className="h-14 w-14 bg-white p-1 rounded-lg flex items-center justify-center shadow-md">
                <QRCode value={profileUrl} size={48} fgColor="#0F172A" />
              </div>
            </div>
          </div>

          {/* BACK OF MEMBER CARD */}
          <div 
            ref={backRef} 
            className="absolute inset-0 w-full h-full rounded-[24px] bg-slate-950 border border-white/10 p-6 text-white flex flex-col justify-between shadow-2xl backface-hidden"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {/* Background lighting */}
            <div className="absolute top-0 left-0 h-44 w-44 bg-primary-blue/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 h-44 w-44 bg-primary-green/10 rounded-full blur-3xl pointer-events-none" />

            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
                <span className="font-poppins text-xs font-bold tracking-tight text-white">
                  Empower <span style={{ color: accentColor }}>Jhang</span>
                </span>
              </div>
              <span className="text-[8px] font-semibold text-white/60 font-poppins">CARD BACK</span>
            </div>

            {/* Card Content Back */}
            <div className="space-y-4 my-auto z-10 text-center px-2">
              <div className="space-y-1.5">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider font-poppins"
                  style={{ color: accentColor }}
                >Our Mission</h4>
                <p className="text-[9px] text-white/70 leading-relaxed max-w-[240px] mx-auto">
                  To connect youth, teach them digital skills for free, build careers, create networking opportunities, and build Pakistan's strongest local digital community.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider font-poppins"
                  style={{ color: accentColor }}
                >Member Verification</h4>
                <p className="text-[8px] text-white/60 leading-normal">
                  Scan the QR code on the front to verify this profile on our official member database.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-white font-poppins">www.empowerjhang.org</p>
              </div>
            </div>

            {/* Back Footer */}
            <div className="border-t border-white/10 pt-3 text-center z-10">
              <p className="text-[7px] text-white/35 leading-tight">
                This digital card is property of the Empower Jhang Community. For details, contact info@empowerjhang.org.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[320px]">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => setIsFlipped(!isFlipped)}
          leftIcon={<RotateCw className="h-4 w-4" />}
        >
          Flip Card
        </Button>
        <div className="flex items-center gap-2 w-full">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1" 
            onClick={downloadPNG} 
            disabled={downloading}
            leftIcon={<Download className="h-4 w-4" />}
          >
            PNG
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1" 
            onClick={downloadPDF} 
            disabled={downloading}
            leftIcon={<FileDown className="h-4 w-4" />}
          >
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
