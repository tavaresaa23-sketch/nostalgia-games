// Versão: 1.0.5 - Ajuste de Imagens e Notificações
import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  ArrowRight, 
  Lock, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Tv, 
  Zap, 
  Save, 
  WifiOff, 
  ShieldCheck, 
  Star, 
  Quote, 
  ChevronDown,
  CheckCircle2,
  Clock,
  User,
  Mail,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import QRCode from 'react-qr-code';
import { cn } from './lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const notifications = [
  { name: "Ricardo S.", time: "há 2 minutos", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Ana Paula", time: "há 5 minutos", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Marcos Oliveira", time: "há 1 minuto", avatar: "https://randomuser.me/api/portraits/men/68.jpg" },
  { name: "Juliana Costa", time: "agora mesmo", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Felipe Almeida", time: "há 3 minutos", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Beatriz Santos", time: "há 4 minutos", avatar: "https://randomuser.me/api/portraits/women/33.jpg" }
];

export default function App() {
  const [promoDate, setPromoDate] = useState('');
  const [timer, setTimer] = useState(15 * 60);
  const [socialCount, setSocialCount] = useState(18);
  const [isPixLoading, setIsPixLoading] = useState(false);
  const [pixProgress, setPixProgress] = useState(0);
  const [showPix, setShowPix] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [currentNotification, setCurrentNotification] = useState<{ name: string; time: string; avatar: string } | null>(null);

  useEffect(() => {
    let index = 0;
    // Mostrar a primeira logo após 3 segundos para o usuário ver que funciona
    const initialDelay = setTimeout(() => {
      setCurrentNotification(notifications[index]);
      setTimeout(() => setCurrentNotification(null), 6000);
      index = (index + 1) % notifications.length;
    }, 3000);

    const interval = setInterval(() => {
      setCurrentNotification(notifications[index]);
      
      // Esconder após 6 segundos
      setTimeout(() => {
        setCurrentNotification(null);
      }, 6000);

      index = (index + 1) % notifications.length;
    }, 15000); // Mostrar a cada 15 segundos

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  // Refs for scrolling
  const checkoutRef = useRef<HTMLDivElement>(null);
  const pixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hoje = new Date();
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    setPromoDate(`${hoje.getDate()} de ${meses[hoje.getMonth()]}`);

    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const socialInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setSocialCount((prev) => prev + 1);
      }
    }, 8000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(socialInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartPix = async () => {
    if (formData.nome.length < 3) {
      alert("⚠️ Por favor, preencha seu Nome completo para continuar.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("⚠️ Por favor, digite um e-mail válido. É através dele que você receberá o acesso aos jogos!");
      return;
    }

    // Lead submission (simulated or real Formspree)
    try {
      await fetch("https://formspree.io/f/mqeyyngg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nome=${encodeURIComponent(formData.nome)}&email=${encodeURIComponent(formData.email)}`
      });
    } catch (e) {
      console.error("Lead submission failed", e);
    }

    setIsPixLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPixProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPixLoading(false);
        setShowPix(true);
        setTimeout(() => {
          pixRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }, 200);
  };

  const copyPix = () => {
    const pixCode = "00020101021126330014br.gov.bcb.pix011103452610977520400005303986540519.905802BR5925RETRO GAMAESCURITIBA PARA6008CURITIBA62070503***63047067";
    navigator.clipboard.writeText(pixCode);
    alert("PIX copiado com sucesso!");
  };

  const openWhatsApp = () => {
    const msg = `Olá, fiz o pagamento Retro Games\nNome: ${formData.nome}`;
    window.open(`https://wa.me/5546999186084?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="min-h-screen">
      {/* NOTIFICAÇÃO DE COMPRA */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-6 left-6 z-[100] bg-white text-slate-900 p-3 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3 max-w-[280px] md:max-w-sm"
          >
            <div className="relative flex-shrink-0">
              <img 
                src={currentNotification.avatar} 
                alt={currentNotification.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                <CheckCircle2 className="text-white w-3 h-3" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">
                {currentNotification.name} <span className="font-normal text-slate-600">acabou de adquirir o acesso!</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                {currentNotification.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. BARRA DE ALERTA */}
      <div className="bg-red-600 text-white text-center py-2 font-bold text-sm uppercase tracking-wider sticky top-0 z-50 shadow-lg">
        ⚠️ Desconto só Hoje - Promoção válida até <span id="data-promocao">{promoDate}</span>
      </div>

      {/* BALÃO FLUTUANTE DE DESCONTO */}
      <motion.a 
        href="#oferta"
        animate={{ y: [0, -10, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-14 right-4 md:right-8 z-[60] bg-gradient-to-br from-yellow-300 to-yellow-500 text-black px-4 py-2 rounded-2xl shadow-[0_10px_25px_rgba(250,204,21,0.6)] border-2 border-white/50 hover:scale-105 transition-transform flex flex-col items-center cursor-pointer"
      >
        <span className="text-[10px] font-bold uppercase text-red-700 line-through mb-[-4px]">De R$ 29,90</span>
        <span className="text-xl font-black tracking-tighter">R$ 19,90</span>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-yellow-500 rotate-45 border-b-2 border-r-2 border-white/50 rounded-sm"></div>
      </motion.a>

      {/* 2. HERO SECTION */}
      <header className="relative pt-16 pb-0 px-4 overflow-hidden isolate">
        <div className="absolute inset-0 w-full h-full bg-grid bg-[#020617] -z-30"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617] -z-20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Ryu GIF Background */}
          <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] opacity-70 -z-10 pointer-events-none">
            <img 
              src="https://i.ibb.co/ZRvDb8qr/ryu-hdstance.gif" 
              alt="Ryu" 
              className="w-full h-full object-contain" 
              style={{ imageRendering: 'pixelated' }}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 relative z-20 backdrop-blur-sm">
            <Gamepad2 className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold tracking-widest uppercase">Reviva a Nostalgia</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight uppercase italic relative z-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Transforme seu CELULAR e PC em um <span className="text-yellow-400">PS2 🎮 PS3</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Mais de 100.000 jogos clássicos direto no seu Android! Sem anúncios, sem mensalidade e sem necessidade de internet.
          </p>

          <h2 className="text-2xl md:text-4xl font-black mb-6 uppercase italic text-yellow-400">
            Veja funcionando na prática 👇
          </h2>

          {/* Videos */}
          <div className="space-y-10 mb-12">
            <div className="relative aspect-video max-w-3xl mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/jNUX3RbBRng" 
                title="Vídeo de Gameplay" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="relative aspect-video max-w-3xl mx-auto rounded-3xl overflow-hidden border-4 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/94rRuVqJ9LU" 
                title="Vídeo de Apresentação" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="relative aspect-video max-w-3xl mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/u8SkwaAuZuk" 
                title="Terceiro Vídeo" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Main Purchase Button */}
          <div className="flex flex-col items-center w-full max-w-2xl mx-auto mb-0">
            <button 
              onClick={() => checkoutRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-2xl md:text-3xl rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-tighter border-b-4 border-yellow-700 mb-4"
            >
              <Zap className="w-8 h-8 fill-current" />
              GERAR MEU ACESSO AGORA
            </button>
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
              <Lock className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px] md:text-xs">Compra Segura</span>
            </div>
            <img 
              src="https://i.ebayimg.com/images/g/LlEAAOSwIStnn4Hm/s-l1600.webp" 
              alt="Pagamento Seguro" 
              className="w-full object-contain opacity-90 hover:opacity-100 transition-opacity rounded-xl" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* 3. CARROSSEL DE JOGOS */}
      <section className="py-16 bg-slate-900 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10 text-3xl md:text-5xl font-black uppercase italic">
          ALGUNS DOS <span className="text-yellow-400">JOGOS DISPONÍVEIS</span>
        </div>
        
        <div className="container-fluid px-4 md:px-12 relative max-w-[1400px] mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={2}
            spaceBetween={15}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 30 },
              1280: { slidesPerView: 6, spaceBetween: 30 },
            }}
            className="pb-12"
          >
            {[
              { src: "https://i.ibb.co/yFhgYnCd/Portada-God-of-War-II.webp", alt: "God of War II" },
              { src: "https://i.ibb.co/tpLFQkNf/Bully-CAPA-1.webp", alt: "Bully" },
              { src: "https://i.ibb.co/h1CcPmg8/Red-Dead-Redemption-capa-1.webp", alt: "Red Dead Redemption" },
              { src: "https://i.ibb.co/pjM22M1S/quadro-decorativo-games-resident-evil-4-remake-games.jpg", alt: "Resident Evil 4" },
              { src: "https://i.ibb.co/hJf3MLB7/marvel-vs-capcom-2-sony-playstation-2-ps2-013388260119-cover-art.webp", alt: "Marvel vs Capcom 2" },
              { src: "https://i.ibb.co/DfR0hWJv/12202-need-for-speed-high-stakes-playstation-capa-1-1.webp", alt: "Need for Speed High Stakes" },
            ].map((game, idx) => (
              <SwiperSlide key={idx}>
                <img 
                  src={game.src} 
                  alt={game.alt} 
                  className="w-full h-auto aspect-[3/4] object-cover rounded-2xl border-2 border-white/10 hover:border-yellow-400 transition-all hover:scale-105 shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="mt-8 flex flex-col items-center gap-8 max-w-3xl mx-auto">
            <img 
              src="https://i.postimg.cc/CK66tVCJ/cetalouco-(2).gif" 
              alt="Cetalouco GIF" 
              className="w-full h-auto rounded-2xl border-2 border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <img 
              src="https://i.postimg.cc/ZRr9DpX8/goku.gif" 
              alt="Goku GIF" 
              className="w-full h-auto rounded-2xl border-2 border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 4. PROVA SOCIAL */}
      <section className="py-12 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clientes Satisfeitos", value: "11.000+" },
            { label: "Seguro & Aprovado", value: "100%" },
            { label: "Garantia Total", value: "7 Dias" },
            { label: "Suporte Vitalício", value: "24/7" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-1">{item.value}</div>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONSOLES */}
      <section className="py-24 px-4 bg-grid">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic">Por onde posso jogar?</h2>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-16">Compatibilidade total com seus dispositivos</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Monitor, label: "Computador", color: "bg-red-500" },
              { icon: Laptop, label: "Notebook", color: "bg-purple-500" },
              { icon: Smartphone, label: "Celular", color: "bg-blue-500" },
              { icon: Tv, label: "TV BOX", color: "bg-orange-500" },
              { icon: Gamepad2, label: "PlayStation", color: "bg-indigo-600" },
              { icon: Tv, label: "TV ANDROID", color: "bg-emerald-500" },
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/5 p-8 md:p-10 rounded-[2rem] border border-white/10 flex flex-col items-center gap-4 transition-all hover:translate-y-[-5px] hover:bg-white/10 cursor-default">
                <div className={cn(item.color, "p-4 rounded-2xl shadow-lg")}>
                  <item.icon className="w-10 h-10 md:w-14 md:h-14" />
                </div>
                <span className="font-black text-lg md:text-xl uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VANTAGENS EXCLUSIVAS */}
      <section className="py-24 px-4 bg-slate-900 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-16 text-center uppercase italic">Vantagens Exclusivas</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                icon: Zap, 
                title: "Acesso Imediato", 
                desc: "Não precisa esperar! Assim que o pagamento for aprovado, você recebe todo o material, links e tutoriais diretamente no seu e-mail na mesma hora." 
              },
              { 
                icon: Save, 
                title: "Save State (Salvar Jogo)", 
                desc: "A mãe chamou para jantar? O chefe chegou? Salve o jogo exatamente onde você está com um clique e continue depois, sem precisar de Memory Card." 
              },
              { 
                icon: WifiOff, 
                title: "100% Offline", 
                desc: "Depois de baixar os jogos para o seu aparelho, você não precisa mais de internet. Jogue no ônibus, no avião ou na fazenda sem gastar seus dados." 
              },
              { 
                icon: ShieldCheck, 
                title: "Suporte & Atualizações", 
                desc: "Você terá acesso a um grupo exclusivo de clientes. Lá tiramos dúvidas, ajudamos na instalação e enviamos jogos novos todos os meses." 
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 p-8 rounded-3xl border border-white/5 hover:border-yellow-400/30 transition-colors">
                <div className="bg-yellow-400 text-black p-4 rounded-2xl inline-block mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-black text-2xl text-white uppercase mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DEPOIMENTOS */}
      <section className="py-24 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic">O que nossos <span className="text-yellow-400">clientes dizem</span></h2>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Baseado em mais de 5.000 avaliações</p>
          </div>

          <div className="relative aspect-video max-w-3xl mx-auto mb-16 rounded-3xl overflow-hidden border-4 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)] bg-black">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/tUgFOO5nGsI?rel=0&modestbranding=1&showinfo=0" 
              title="Depoimento Cliente"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { 
                name: "Ricardo Silva", 
                role: "Gamer desde os 90s", 
                text: "Sensacional! Voltei no tempo jogando Black e Resident Evil 4. A instalação foi super simples e o suporte me ajudou rápido com uma dúvida no controle.",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
                color: "border-emerald-500/50"
              },
              { 
                name: "Mariana Costa", 
                role: "Entusiasta Retro", 
                text: "O fato de poder baixar os jogos individualmente salvou meu HD. A nuvem é rápida e os jogos rodam perfeitamente no meu celular Android.",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
                color: "border-blue-500/50"
              },
              { 
                name: "Bruno Oliveira", 
                role: "Colecionador", 
                text: "Melhor custo benefício que já vi. Paguei menos que um lanche e tenho acesso a todos os jogos que marcaram minha infância. Recomendo muito!",
                img: "https://randomuser.me/api/portraits/men/68.jpg",
                color: "border-yellow-500/50"
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 relative z-10">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.name} className={cn("w-12 h-12 rounded-full object-cover border-2", item.color)} />
                  <div>
                    <h4 className="font-black text-white">{item.name}</h4>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center">
            <h3 className="text-2xl font-black uppercase italic text-center mb-4 text-slate-300">Mais avaliações reais</h3>
            {[
              "https://i.ibb.co/8gDRBSkv/Captura-de-tela-2026-02-20-162358.png",
              "https://i.ibb.co/hR8jYRgM/Captura-de-tela-2026-02-20-162427.png",
              "https://i.ibb.co/Ndj80bLr/Captura-de-tela-2026-02-20-162319.png"
            ].map((src, idx) => (
              <div key={idx} className="w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-white">
                <img src={src} alt={`Depoimento ${idx + 1}`} className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7.5 BONUS SECTION */}
      <section className="py-24 px-4 bg-slate-950 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(37,99,235,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] -z-10"></div>
            
            <div className="relative z-10 mb-12">
              <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(37,99,235,0.3)] border-b-8 border-blue-800 text-center transform -rotate-1">
                <div className="inline-block bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 shadow-lg">
                  Oferta Especial
                </div>
                <h2 className="text-3xl md:text-6xl font-black mb-4 uppercase italic text-white leading-tight">
                  BONUS pack <br/>
                  <span className="text-yellow-400 drop-shadow-lg">+ 90 Mil hqs :</span>
                </h2>
                <p className="text-blue-100 font-bold tracking-widest uppercase text-xs md:text-sm mt-4">
                  Exclusivo para quem adquirir o acesso hoje
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-12 !overflow-visible"
              >
                {[
                  "https://hqflix.com.br/assets/62qfoh8l-BOMzwSxp.jpeg",
                  "https://hqflix.com.br/assets/7m4OhsQl-DosaG9fO.jpeg",
                  "https://hqflix.com.br/assets/5j01ylml-CmL9U4zd.jpeg",
                  "https://hqflix.com.br/assets/vFYDdPgl-BDRnBjow.jpeg",
                  "https://hqflix.com.br/assets/VpBgznGl-DfwuiczO.jpeg",
                  "https://hqflix.com.br/assets/oAvrrQWl-DZj4Fcnu.jpeg",
                  "https://hqflix.com.br/assets/PcK5vXnl-ggADHpFK.jpeg",
                  "https://hqflix.com.br/assets/RQxjHl8l-ClQr0cai.jpeg",
                  "https://hqflix.com.br/assets/ARxNmB9l-DpuyWbdn.jpeg",
                  "https://hqflix.com.br/assets/TUHhId7l-BdmR6Fi1.jpeg",
                  "https://hqflix.com.br/assets/HWXAQUMl-CUIlvEJa.jpeg",
                  "https://img.olx.com.br/images/89/891347709120598.jpg",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbbFWLVCZntDHcoefM2JgwjQCAQYI5Um-0qg&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Y9MGv2ioTvb4HsKHdKqmkW99cFd5yxqqwg&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRONomPEA4DjcMjgRwLoyPomcocPj_yRTBueg&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3THzteTVVNfLr6eNvywttt4vtQrkk2Ks1zAEupUG_Gw&s",
                  "https://www.sweetlicious.net/wp-content/uploads/2025/10/turma-do-chaves-porno-5.jpg"
                ].map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-slate-800 aspect-[4/5] group relative"
                    >
                      <img 
                        src={src} 
                        alt={`Bonus HQ ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white font-bold text-sm uppercase tracking-wider">Visualizar Conteúdo</span>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* 7.6 LIVRO DE OURO BONUS */}
      <section className="py-24 px-4 bg-slate-900 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(250,204,21,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-1 rounded-[2.5rem] shadow-[0_30px_60px_rgba(250,204,21,0.3)]">
                    <div className="bg-slate-900 rounded-[2.3rem] overflow-hidden">
                      <img 
                        src="https://i.ibb.co/WvGfX1SD/Captura-de-tela-2026-03-09-005954.png" 
                        alt="Livro de Ouro" 
                        className="w-full h-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 backdrop-blur-sm">
                        <BookOpen className="w-20 h-20 text-yellow-400 mb-6" />
                        <h3 className="text-3xl font-black text-white uppercase italic leading-tight">
                          O LIVRO DE OURO <br/>
                          <span className="text-yellow-400">DOS CÓDIGOS</span>
                        </h3>
                        <div className="mt-6 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          PDF EXCLUSIVO
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full"></div>
              </div>

              <div className="order-1 md:order-2">
                <div className="inline-block bg-yellow-400/10 text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border border-yellow-400/20">
                  Bônus #2 Liberado
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic text-white leading-tight">
                  CHEGA DE <span className="text-yellow-400">MORRER!</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed mb-8">
                  Leve de graça o nosso <strong className="text-white">E-book Digital</strong> com os códigos secretos, macetes e truques dos <strong className="text-yellow-400">100 jogos mais populares</strong> do pack.
                </p>
                <ul className="space-y-4">
                  {[
                    "Vida e Munição Infinita",
                    "Personagens Desbloqueados",
                    "Fases e Carros Secretos",
                    "Dinheiro Infinito nos Games"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-black fill-current" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 px-4 bg-slate-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center uppercase italic">Dúvidas Frequentes</h2>
          
          <div className="space-y-2">
            {[
              { q: "Preciso de internet para jogar?", a: "Não! Após baixar os jogos para o seu dispositivo, você pode jogar 100% offline em qualquer lugar, sem consumir seus dados móveis." },
              { q: "Funciona no meu celular?", a: "Sim! O sistema é compatível com praticamente todos os celulares Android atuais. Recomendamos ter pelo menos 2GB de memória RAM para rodar os jogos mais pesados de PS2 com fluidez." },
              { q: "Funciona no PC e TV Box?", a: "Com certeza! Você pode jogar no seu Computador, Notebook ou TV Box Android. O acesso inclui tutoriais passo a passo ensinando como instalar e configurar em cada um desses aparelhos de forma bem simples." },
              { q: "Como vou receber o acesso?", a: "Assim que o pagamento for confirmado, você receberá automaticamente um e-mail com o link de acesso à plataforma, tutoriais passo a passo e o link para baixar todos os jogos." },
            ].map((item, idx) => (
              <FaqItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 GARANTIA */}
      <section className="py-16 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-400/30 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_40px_rgba(250,204,21,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent pointer-events-none"></div>
          <ShieldCheck className="w-20 h-20 text-yellow-400 mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase italic text-white relative z-10">Risco Zero! <br className="md:hidden"/><span className="text-yellow-400">7 Dias de Garantia</span></h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto relative z-10">
            Temos tanta confiança na qualidade do nosso material que oferecemos uma garantia incondicional de 7 dias. Se você se arrepender, devolvemos <strong>100% do seu dinheiro</strong>. Sem burocracia e sem letras miúdas!
          </p>
        </div>
      </section>

      {/* 9. CHECKOUT SECTION */}
      <section id="oferta" ref={checkoutRef} className="py-24 px-4 bg-grid border-t border-white/5 flex justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Container com Borda Amarela Brilhante */}
        <div className="w-full max-w-[450px] relative group">
          {/* Efeito de Brilho Externo (Aura) */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-[2.7rem] blur-md opacity-40 animate-pulse"></div>
          
          {/* O Bloco de Checkout */}
          <div className="relative w-full bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] p-8 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Oferta por Tempo Limitado
            </div>

          <h1 className="text-center font-orbitron text-2xl font-black tracking-widest mb-8 text-white uppercase mt-4">
            RETRO <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">GAMES</span>
          </h1>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 group">
            <img 
              src="https://i.ibb.co/WvGfX1SD/Captura-de-tela-2026-03-09-005954.png" 
              alt="Retro Games" 
              className="w-full h-[200px] object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acesso Vitalício</p>
                <p className="text-white font-black uppercase italic">Pack Premium</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                <span className="text-yellow-400 font-black text-sm">9K+ JOGOS</span>
              </div>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Pagamento 100% Seguro via PIX",
              "Acesso imediato no seu E-mail",
              "BÔNUS: 90 Mil HQs Digitais",
              "BÔNUS: Livro de Ouro dos Códigos",
              "Suporte VIP via WhatsApp"
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Monitor className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">{socialCount} comprando agora</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Clock className="w-4 h-4" />
                <span className="font-orbitron font-bold text-sm">{formatTime(timer)}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] block mb-1">De R$ 49,90 por apenas</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">R$ 19,90</span>
                <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded uppercase">60% OFF</div>
              </div>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-yellow-400 ml-1">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Como quer ser chamado?"
                  className="w-full bg-slate-800 border-2 border-white/10 rounded-xl pl-12 pr-5 py-4 text-sm text-white outline-none focus:border-yellow-400 focus:bg-slate-800/80 transition-all placeholder:text-slate-600 shadow-inner"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-yellow-400 ml-1">Seu Melhor E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="Onde enviaremos seu acesso"
                  className="w-full bg-slate-800 border-2 border-white/10 rounded-xl pl-12 pr-5 py-4 text-sm text-white outline-none focus:border-yellow-400 focus:bg-slate-800/80 transition-all placeholder:text-slate-600 shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartPix}
            className="w-full py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-tighter border-b-4 border-yellow-700"
          >
            <Zap className="w-6 h-6 fill-current" />
            GERAR MEU ACESSO AGORA
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Ambiente 100% Seguro</span>
          </div>

          {/* PIX Loading State */}
          <AnimatePresence>
            {isPixLoading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-yellow-400 font-bold mb-2">Gerando pagamento...</p>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${pixProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIX Result */}
          <AnimatePresence>
            {showPix && (
              <motion.div 
                ref={pixRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center text-center"
              >
                <h3 className="text-yellow-400 font-bold mb-4">Pague via PIX</h3>
                <div className="bg-white p-3 rounded-xl mb-4 shadow-2xl border border-white/10">
                  <QRCode 
                    value="00020101021126330014br.gov.bcb.pix011103452610977520400005303986540519.905802BR5925RETRO GAMAESCURITIBA PARA6008CURITIBA62070503***63047067" 
                    size={200}
                  />
                </div>
                <div className="w-full bg-slate-800 p-3 rounded-lg text-[10px] break-all text-slate-400 border border-white/5 mb-4">
                  00020101021126330014br.gov.bcb.pix011103452610977520400005303986540519.905802BR5925RETRO GAMAESCURITIBA PARA6008CURITIBA62070503***63047067
                </div>
                <button 
                  onClick={copyPix}
                  className="w-full py-3 border border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400/10 transition-colors mb-2"
                >
                  Copiar código PIX
                </button>
                <button 
                  onClick={openWhatsApp}
                  className="w-full py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors"
                >
                  Enviar comprovante WhatsApp
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-10 flex flex-col items-center text-center text-slate-500 text-xs md:text-sm border-t border-white/5 bg-slate-950">
        <div className="w-full max-w-4xl px-8 md:px-16 mx-auto flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-2 text-yellow-400">
            <Lock className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[11px] md:text-xs">Compra Segura</span>
          </div>
          <img 
            src="https://i.ibb.co/mr1Z5NYJ/fb-mercado-pago-v2-2x.webp" 
            alt="Pagamento Seguro Mercado Pago" 
            className="w-full object-contain opacity-90 hover:opacity-100 transition-opacity rounded-xl" 
            referrerPolicy="no-referrer"
          />
        </div>

        <p className="font-bold uppercase tracking-widest mb-2">Nostalgia Games</p>
        <p>&copy; 2024. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
  key?: React.Key;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button 
        className="w-full py-6 flex justify-between items-center text-left hover:text-yellow-400 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-lg">{question}</span>
        <ChevronDown className={cn("w-6 h-6 transition-transform duration-300", isOpen && "rotate-180 text-yellow-400")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 leading-relaxed pb-6">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
