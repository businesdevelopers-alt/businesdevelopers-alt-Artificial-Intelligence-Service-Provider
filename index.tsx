import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Translations ---
const translations = {
  en: {
    nav: { 
      services: 'Services', 
      packages: 'Packages', 
      ai_art: 'AI Art',
      about: 'About', 
      contact: 'Book Consultation' 
    },
    hero: { 
      badge: 'Next Gen AI', 
      title_start: 'Empowering Businesses with',
      title_end: 'Intelligent AI Solutions',
      desc: 'Your trusted AI provider. Automate operations, enhance customer experience, and unlock data-driven growth with our cutting-edge technology.',
      btn_contact: 'Book a Free Consultation',
      btn_learn: 'Learn More'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive AI solutions designed for modern enterprises.',
      items: [
        { title: 'AI Model Development', desc: 'Custom-built models tailored to your business needs—LLMs, classification models, prediction engines, and more.' },
        { title: 'Business Automation', desc: 'Intelligent bots, automated workflows, and smart systems that reduce manual work and increase efficiency.' },
        { title: 'Predictive Analytics', desc: 'Data-driven insights to help you make faster decisions—demand forecasting, customer behavior, churn prediction.' },
        { title: 'Conversational AI', desc: 'Smart virtual assistants and chatbots that offer real-time support and personalized interactions.' }
      ]
    },
    packages: {
      title: 'Ready-Made AI Solutions',
      subtitle: 'Select a package that fits your stage of growth.',
      popular: 'Most Popular',
      btn: 'Choose Plan',
      items: [
        { name: 'Startup AI Package', target: 'For Small Businesses', features: ['Basic chatbot', 'Data summary tools', 'Monthly insights dashboard'] },
        { name: 'Growth AI Package', target: 'For Scaling Companies', features: ['Advanced conversational agent', 'Automated workflows', 'Custom analytics dashboards'] },
        { name: 'Enterprise AI Suite', target: 'For Large Organizations', features: ['Fully customized AI models', 'System integrations', 'High-security & compliance'] }
      ]
    },
    ai_art: {
      title: 'AI Art Generator',
      desc: 'Unleash your creativity. Describe an image and let our AI bring it to life.',
      placeholder: 'A futuristic city on Mars made of crystal...',
      btn_generate: 'Generate Art',
      btn_regenerate: 'Regenerate',
      error: 'Failed to generate image. Please try again.',
      options: {
        style_label: 'Image Style',
        ratio_label: 'Aspect Ratio',
        styles: {
          none: 'No Style',
          photorealistic: 'Photorealistic',
          cartoon: 'Cartoon',
          abstract: 'Abstract',
          oil_painting: 'Oil Painting',
          cyberpunk: 'Cyberpunk'
        },
        ratios: {
          square: 'Square (1:1)',
          landscape: 'Landscape (16:9)',
          portrait: 'Portrait (9:16)'
        }
      }
    },
    about: {
      badge: 'About Us',
      title: 'We accelerate digital transformation.',
      desc: 'We are a Saudi AI provider specialized in building intelligent, easy-to-use solutions. Our mission is to make advanced AI accessible, practical, and impactful for businesses of all sizes.',
      features: ['Expert engineering team', 'Certified AI competencies', 'Proven industry use cases', 'Strategic partnerships'],
      case_title: 'Case Studies',
      cases: [
        { title: 'Customer Support Chatbot', res: 'Reduced response time by 80%' },
        { title: 'Automated Internal Workflow', res: 'Saved 200+ hours monthly' },
        { title: 'Predictive Business Model', res: 'Improved demand forecast by 35%' }
      ]
    },
    contact: {
      title: 'Start Your AI Journey Today',
      subtitle: 'Fill out the form to receive personalized recommendations and project guidance.',
      success_title: 'Thank You!',
      success_msg: 'We have received your request and will contact you shortly.',
      btn_again: 'Send another message',
      btn_submit: 'Get Started',
      labels: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        desc: 'Project Description'
      },
      placeholders: {
        name: 'John Doe',
        email: 'john@company.com',
        phone: '+1 (555) 000-0000',
        company: 'Your Company Ltd',
        desc: 'Tell us about your needs...'
      }
    },
    footer: {
      desc: 'Empowering businesses with intelligent, scalable, and secure AI technology.',
      company: 'Company',
      legal: 'Legal',
      links: {
        about: 'About Us',
        services: 'Services',
        cases: 'Case Studies',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      rights: 'All rights reserved.'
    }
  },
  ar: {
    nav: { 
      services: 'خدماتنا', 
      packages: 'الباقات', 
      ai_art: 'فنون الذكاء الاصطناعي',
      about: 'من نحن', 
      contact: 'احجز استشارة' 
    },
    hero: { 
      badge: 'الجيل القادم من الذكاء الاصطناعي', 
      title_start: 'تمكين الشركات بحلول',
      title_end: 'ذكاء اصطناعي ذكية',
      desc: 'شريكك الموثوق في الذكاء الاصطناعي. أتمتة العمليات، تحسين تجربة العملاء، وإطلاق العنان للنمو المعتمد على البيانات باستخدام تقنياتنا المتطورة.',
      btn_contact: 'احجز استشارة مجانية',
      btn_learn: 'اكتشف المزيد'
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'حلول ذكاء اصطناعي شاملة مصممة للمؤسسات الحديثة.',
      items: [
        { title: 'تطوير نماذج الذكاء الاصطناعي', desc: 'نماذج مخصصة حسب احتياجات عملك - نماذج لغوية ضخمة، نماذج تصنيف، ومحركات تنبؤ.' },
        { title: 'أتمتة الأعمال', desc: 'روبوتات ذكية، وسير عمل مؤتمت، وأنظمة ذكية تقلل من العمل اليدوي وتزيد الكفاءة.' },
        { title: 'التحليلات التنبؤية', desc: 'رؤى تعتمد على البيانات لمساعدتك في اتخاذ قرارات أسرع - التنبؤ بالطلب، سلوك العملاء، والتنبؤ بإلغاء الاشتراك.' },
        { title: 'الذكاء الاصطناعي المحادث', desc: 'مساعدون افتراضيون أذكياء وروبوتات دردشة تقدم دعمًا فوريًا وتفاعلات مخصصة.' }
      ]
    },
    packages: {
      title: 'حلول ذكاء اصطناعي جاهزة',
      subtitle: 'اختر الباقة التي تناسب مرحلة نمو شركتك.',
      popular: 'الأكثر طلباً',
      btn: 'اختر الباقة',
      items: [
        { name: 'باقة الشركات الناشئة', target: 'للشركات الصغيرة', features: ['روبوت دردشة أساسي', 'أدوات تلخيص البيانات', 'لوحة تحكم شهرية للرؤى'] },
        { name: 'باقة النمو', target: 'للشركات المتوسعة', features: ['وكيل محادثة متقدم', 'سير عمل مؤتمت', 'لوحات تحليلات مخصصة'] },
        { name: 'باقة المؤسسات', target: 'للمؤسسات الكبيرة', features: ['نماذج ذكاء اصطناعي مخصصة بالكامل', 'تكامل الأنظمة', 'أمان وامتثال عالي المستوى'] }
      ]
    },
    ai_art: {
      title: 'مولد الفنون بالذكاء الاصطناعي',
      desc: 'أطلق العنان لإبداعك. صف صورة ودع ذكاءنا الاصطناعي يحولها إلى واقع.',
      placeholder: 'مدينة مستقبلية على المريخ مصنوعة من الكريستال...',
      btn_generate: 'توليد الفن',
      btn_regenerate: 'إعادة التوليد',
      error: 'فشل في إنشاء الصورة. يرجى المحاولة مرة أخرى.',
      options: {
        style_label: 'نمط الصورة',
        ratio_label: 'نسبة الأبعاد',
        styles: {
          none: 'بدون نمط محدد',
          photorealistic: 'واقعي',
          cartoon: 'كرتوني',
          abstract: 'تجريدي',
          oil_painting: 'رسم زيتي',
          cyberpunk: 'سايبربانك'
        },
        ratios: {
          square: 'مربع (1:1)',
          landscape: 'أفقي (16:9)',
          portrait: 'عمودي (9:16)'
        }
      }
    },
    about: {
      badge: 'من نحن',
      title: 'نسرع التحول الرقمي.',
      desc: 'نحن مزود خدمات ذكاء اصطناعي سعودي متخصص في بناء حلول ذكية وسهلة الاستخدام. مهمتنا هي جعل الذكاء الاصطناعي المتقدم متاحًا وعمليًا ومؤثرًا للشركات بجميع الأحجام.',
      features: ['فريق هندسي خبير', 'كفاءات معتمدة في الذكاء الاصطناعي', 'حالات استخدام مثبتة في الصناعة', 'شراكات استراتيجية'],
      case_title: 'قصص نجاح',
      cases: [
        { title: 'روبوت دعم العملاء', res: 'تقليل وقت الاستجابة بنسبة 80%' },
        { title: 'أتمتة سير العمل الداخلي', res: 'توفير أكثر من 200 ساعة شهرياً' },
        { title: 'نموذج الأعمال التنبؤي', res: 'تحسين التنبؤ بالطلب بنسبة 35%' }
      ]
    },
    contact: {
      title: 'ابدأ رحلتك في الذكاء الاصطناعي اليوم',
      subtitle: 'املأ النموذج لتلقي توصيات مخصصة وتوجيهات لمشروعك.',
      success_title: 'شكراً لك!',
      success_msg: 'لقد استلمنا طلبك وسنتصل بك قريباً.',
      btn_again: 'إرسال رسالة أخرى',
      btn_submit: 'ابدأ الآن',
      labels: {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        company: 'اسم الشركة',
        desc: 'وصف المشروع'
      },
      placeholders: {
        name: 'محمد أحمد',
        email: 'mohamed@company.com',
        phone: '+966 55 000 0000',
        company: 'شركتك المحدودة',
        desc: 'أخبرنا عن احتياجاتك...'
      }
    },
    footer: {
      desc: 'تمكين الشركات بتقنيات ذكاء اصطناعي ذكية وقابلة للتوسع وآمنة.',
      company: 'الشركة',
      legal: 'قانوني',
      links: {
        about: 'من نحن',
        services: 'الخدمات',
        cases: 'قصص النجاح',
        contact: 'تواصل معنا',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة'
      },
      rights: 'جميع الحقوق محفوظة.'
    }
  }
};

// --- Context ---
const LanguageContext = createContext({
  lang: 'en',
  setLang: (lang: string) => {},
  t: translations.en
});

function useLanguage() {
  return useContext(LanguageContext);
}

// --- Icons ---
const Icons = {
  Brain: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 16 18"/></svg>
  ),
  Cpu: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
  LineChart: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  MessageSquare: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Check: () => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ChevronRight: () => (
    <svg aria-hidden="true" className="flip-rtl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Menu: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  ShieldCheck: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Rocket: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1"/><path d="M12 15v5s3.03-.55 4-2c1.1-1.62 1-4 1-4"/></svg>
  ),
  Globe: () => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Image: () => (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  ),
  RefreshCw: () => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
  )
};

// --- Components ---

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--gray-200)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
          <div style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <span style={{ fontSize: '1.25rem' }}>A</span>
          </div>
          <span>AISolutions</span>
        </div>

        {/* Desktop Nav */}
        <nav role="navigation" aria-label="Main Navigation" style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500 }} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSection('services')}>{t.nav.services}</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500 }} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSection('packages')}>{t.nav.packages}</a>
          <a onClick={() => scrollToSection('ai-art')} style={{ cursor: 'pointer', fontWeight: 500 }} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSection('ai-art')}>{t.nav.ai_art}</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500 }} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSection('about')}>{t.nav.about}</a>
          <button onClick={toggleLang} aria-label={lang === 'en' ? "Switch to Arabic" : "Switch to English"} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
             <Icons.Globe /> {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSection('contact')}>{t.nav.contact}</a>
        </nav>

        {/* Mobile Nav Button */}
        <div style={{ display: window.innerWidth > 768 ? 'none' : 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleLang} aria-label={lang === 'en' ? "Switch to Arabic" : "Switch to English"} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
             {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--dark)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" role="navigation" aria-label="Mobile Navigation" style={{ 
          position: 'absolute', 
          top: '80px', 
          left: 0, 
          right: 0, 
          background: 'white', 
          padding: '2rem', 
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500 }}>{t.nav.services}</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500 }}>{t.nav.packages}</a>
          <a onClick={() => scrollToSection('ai-art')} style={{ cursor: 'pointer', fontWeight: 500 }}>{t.nav.ai_art}</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500 }}>{t.nav.about}</a>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary" style={{ justifyContent: 'center' }}>{t.nav.contact}</a>
        </div>
      )}
    </header>
  );
}

function LottiePlayer({ src, style, speed = 1 }: { src: string, style?: React.CSSProperties, speed?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: src
    });

    anim.setSpeed(speed);

    return () => anim.destroy();
  }, [src, speed]);

  return <div ref={container} style={style} aria-hidden="true" />;
}

function Hero() {
  const { t } = useLanguage();
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" style={{ padding: '6rem 0', background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Animated Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.03, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
         <LottiePlayer 
            src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json"
            style={{ width: '120%', height: '120%', transform: 'translate(-10%, -10%)', filter: 'blur(8px) hue-rotate(45deg)' }}
            speed={0.2}
         />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'start' }}>
            <span className="badge">{t.hero.badge}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {t.hero.title_start} <br/>
              <span className="text-gradient">{t.hero.title_end}</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', maxWidth: '600px', margin: '0 0 2.5rem' }}>
              {t.hero.desc}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={scrollToContact} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                {t.hero.btn_contact}
              </button>
              <button onClick={scrollToServices} className="btn btn-outline learn-more-btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t.hero.btn_learn} <Icons.ChevronRight />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', animation: 'float 6s ease-in-out infinite' }} aria-hidden="true">
            {/* Main Hero Animation */}
            <LottiePlayer 
              src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json" 
              style={{ width: '100%', maxWidth: '500px', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(79, 70, 229, 0.15))' }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useLanguage();
  const services = [
    {
      icon: <Icons.Brain />,
      title: t.services.items[0].title,
      desc: t.services.items[0].desc
    },
    {
      icon: <Icons.Cpu />,
      title: t.services.items[1].title,
      desc: t.services.items[1].desc
    },
    {
      icon: <Icons.LineChart />,
      title: t.services.items[2].title,
      desc: t.services.items[2].desc
    },
    {
      icon: <Icons.MessageSquare />,
      title: t.services.items[3].title,
      desc: t.services.items[3].desc
    }
  ];

  return (
    <section id="services" className="section bg-light" aria-labelledby="services-title">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 id="services-title" style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{t.services.title}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t.services.subtitle}</p>
        </div>
        <div className="grid grid-4">
          {services.map((s, i) => (
            <div key={i} className="card">
              <div className="service-icon" style={{ color: 'var(--primary)', marginBottom: '1.5rem', background: 'var(--gray-100)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages() {
  const { t } = useLanguage();
  const packages = [
    {
      name: t.packages.items[0].name,
      target: t.packages.items[0].target,
      features: t.packages.items[0].features,
      color: '#4f46e5'
    },
    {
      name: t.packages.items[1].name,
      target: t.packages.items[1].target,
      features: t.packages.items[1].features,
      featured: true,
      color: '#7c3aed'
    },
    {
      name: t.packages.items[2].name,
      target: t.packages.items[2].target,
      features: t.packages.items[2].features,
      color: '#2563eb'
    }
  ];

  return (
    <section id="packages" className="section" aria-labelledby="packages-title">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 id="packages-title" style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{t.packages.title}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t.packages.subtitle}</p>
        </div>
        <div className="grid grid-3">
          {packages.map((p, i) => (
            <div key={i} className="card" style={{ 
              position: 'relative', 
              borderColor: p.featured ? 'var(--primary)' : 'var(--gray-200)',
              borderWidth: p.featured ? '2px' : '1px',
              transform: p.featured ? 'scale(1.05)' : 'none',
              zIndex: p.featured ? 10 : 1
            }}>
              {p.featured && (
                <div style={{ 
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', 
                  background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', 
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  {t.packages.popular}
                </div>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{p.target}</p>
              </div>
              <ul className="feature-list" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {p.features.map((f, fi) => (
                  <li key={fi}>
                    <Icons.Check />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>
                {t.packages.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIArtGenerator() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('none');
  const [ratio, setRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = [
    { id: 'none', label: t.ai_art.options.styles.none, value: '' },
    { id: 'photorealistic', label: t.ai_art.options.styles.photorealistic, value: 'photorealistic' },
    { id: 'cartoon', label: t.ai_art.options.styles.cartoon, value: 'cartoon' },
    { id: 'abstract', label: t.ai_art.options.styles.abstract, value: 'abstract' },
    { id: 'oil_painting', label: t.ai_art.options.styles.oil_painting, value: 'oil painting' },
    { id: 'cyberpunk', label: t.ai_art.options.styles.cyberpunk, value: 'cyberpunk' }
  ];

  const ratios = [
    { id: '1:1', label: t.ai_art.options.ratios.square },
    { id: '16:9', label: t.ai_art.options.ratios.landscape },
    { id: '9:16', label: t.ai_art.options.ratios.portrait }
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    // Not clearing imageUrl here so the old image stays visible (dimmed) during regeneration

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const selectedStyle = styles.find(s => s.id === style);
      const promptText = selectedStyle?.value 
        ? `${selectedStyle.value} style: ${prompt}` 
        : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: promptText }]
        },
        config: {
          imageConfig: {
            aspectRatio: ratio
          }
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
        setError(t.ai_art.error);
      }

    } catch (e) {
      console.error(e);
      setError(t.ai_art.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-art" className="section bg-light" aria-labelledby="ai-art-title">
      <div className="container">
         <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 id="ai-art-title" style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{t.ai_art.title}</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t.ai_art.desc}</p>
         </div>
         <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1rem' }}>
                <div className="grid grid-2" style={{ gap: '1rem', textAlign: 'start' }}>
                   <div>
                      <label htmlFor="style-select" style={{ marginBottom: '0.5rem', display: 'block' }}>{t.ai_art.options.style_label}</label>
                      <select 
                        id="style-select"
                        className="input-field"
                        value={style} 
                        onChange={(e) => setStyle(e.target.value)}
                      >
                        {styles.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label htmlFor="ratio-select" style={{ marginBottom: '0.5rem', display: 'block' }}>{t.ai_art.options.ratio_label}</label>
                      <select 
                        id="ratio-select"
                        className="input-field"
                        value={ratio} 
                        onChange={(e) => setRatio(e.target.value)}
                      >
                        {ratios.map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                   </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <input 
                    className="input-field" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder={t.ai_art.placeholder}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <button 
                    className="btn btn-primary" 
                    onClick={handleGenerate} 
                    disabled={loading || !prompt}
                    style={{ minWidth: '150px', alignSelf: 'center' }}
                  >
                     {loading ? <div className="spinner" aria-hidden="true"></div> : t.ai_art.btn_generate}
                  </button>
                </div>
            </div>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            {imageUrl && (
                <div className="fade-in" style={{ marginTop: '2rem', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src={imageUrl} 
                            alt="Generated AI Art" 
                            style={{ width: '100%', display: 'block', opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }} 
                        />
                         {loading && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className="spinner" style={{ borderTopColor: 'var(--primary)', width: '40px', height: '40px', borderWidth: '4px' }}></div>
                            </div>
                         )}
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'center' }}>
                       <button 
                         className="btn btn-outline" 
                         onClick={handleGenerate}
                         disabled={loading}
                         style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                       >
                         <Icons.RefreshCw /> {t.ai_art.btn_regenerate}
                       </button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </section>
  );
}

function AboutAndCases() {
  const { t } = useLanguage();
  return (
    <div id="about">
      {/* About Section */}
      <section className="section" aria-labelledby="about-title">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span className="badge">{t.about.badge}</span>
              <h2 id="about-title" style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>{t.about.title}</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', marginBottom: '2rem' }}>
                {t.about.desc}
              </p>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {t.about.features.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <div style={{ color: 'var(--primary)' }}><Icons.ShieldCheck /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius)', 
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t.about.case_title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {t.about.cases.map((c, i) => (
                  <div key={i} style={{ paddingBottom: i !== 2 ? '1.5rem' : 0, borderBottom: i !== 2 ? '1px solid var(--gray-100)' : 'none' }}>
                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{c.title}</h4>
                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>{c.res}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Contact() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '', email: '', phone: '', company: '', description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay for visual feedback
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 id="contact-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t.contact.title}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>
            {t.contact.subtitle}
          </p>
        </div>
        
        {submitted ? (
          <div className="card text-center fade-in" style={{ padding: '4rem 2rem' }} role="alert" aria-live="polite">
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
               <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t.contact.success_title}</h3>
            <p style={{ color: 'var(--gray-500)' }}>{t.contact.success_msg}</p>
            <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>{t.contact.btn_again}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="name">{t.contact.labels.name}</label>
                <input id="name" required name="name" className="input-field" type="text" placeholder={t.contact.placeholders.name} value={formState.name} onChange={handleChange} aria-required="true" />
              </div>
              <div>
                <label htmlFor="email">{t.contact.labels.email}</label>
                <input id="email" required name="email" className="input-field" type="email" placeholder={t.contact.placeholders.email} value={formState.email} onChange={handleChange} aria-required="true" />
              </div>
            </div>
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="phone">{t.contact.labels.phone}</label>
                <input id="phone" name="phone" className="input-field" type="tel" placeholder={t.contact.placeholders.phone} value={formState.phone} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="company">{t.contact.labels.company}</label>
                <input id="company" name="company" className="input-field" type="text" placeholder={t.contact.placeholders.company} value={formState.company} onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="description">{t.contact.labels.desc}</label>
              <textarea id="description" required name="description" className="input-field" rows={4} placeholder={t.contact.placeholders.desc} value={formState.description} onChange={handleChange} aria-required="true"></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', fontSize: '1.125rem', minHeight: '3.5rem' }}>
              {isSubmitting ? (
                 <div className="spinner" aria-hidden="true"></div>
              ) : (
                <>
                  {t.contact.btn_submit} <span style={{ marginInlineStart: '0.5rem' }}><Icons.ChevronRight /></span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={{ background: 'var(--dark)', color: 'white', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          <div style={{ gridColumn: 'span 1' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <span style={{ fontSize: '1.25rem' }}>A</span>
              </div>
              <span>AISolutions</span>
            </div>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.6 }}>{t.footer.desc}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>{t.footer.company}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <li><a href="#about">{t.footer.links.about}</a></li>
              <li><a href="#services">{t.footer.links.services}</a></li>
              <li><a href="#contact">{t.footer.links.contact}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>{t.footer.legal}</h4>
             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <li><a href="#">{t.footer.links.privacy}</a></li>
              <li><a href="#">{t.footer.links.terms}</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '2rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang as keyof typeof translations]
  };

  return (
    <LanguageContext.Provider value={value}>
      <Header />
      <main>
        <Hero />
        <Services />
        <Packages />
        <AIArtGenerator />
        <AboutAndCases />
        <Contact />
      </main>
      <Footer />
    </LanguageContext.Provider>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);