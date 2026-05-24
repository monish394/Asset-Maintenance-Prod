import { useState, useEffect, useRef } from "react";
import logopng from "../assets/logo.png"
import axios from "../config/api";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlineCode,
  HiOutlineMail
} from "react-icons/hi";

const GsapHoverCard = ({ children, className, as: Component = motion.div, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.02,
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
      ease: "power2.out",
      duration: 0.4,
      boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.15)",
      zIndex: 50
    });

    const innerElements = cardRef.current.querySelectorAll('.hover-inner');
    if (innerElements.length) {
      gsap.to(innerElements, {
        z: 15,
        y: -2,
        x: ((x - centerX) / centerX) * -2,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "power3.out", // Changed to a smoother ease instead of elastic
      duration: 0.8,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10
    });

    const innerElements = cardRef.current.querySelectorAll('.hover-inner');
    if (innerElements.length) {
      gsap.to(innerElements, {
        z: 0,
        y: 0,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  };

  return (
    <Component
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  );
};

const PublicHome = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", email: "", message: "" });
  const [stats, setStats] = useState({ totalAssets: 0, activeRequests: 0, compliance: 100 });
  const [activeRoleTab, setActiveRoleTab] = useState("admin");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboardstats");
        const { totalAssets, undermaintance, pendingRequests, workingAssets } = res.data;
        const complianceRate = totalAssets > 0 ? Math.round((workingAssets / totalAssets) * 100) : 100;

        setStats({
          totalAssets: totalAssets,
          activeRequests: undermaintance + pendingRequests,
          compliance: complianceRate
        });
      } catch (err) {
        console.error("Failed to fetch home stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/enquiry", formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ firstName: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };


  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div id="top" className="min-h-screen premium-grid text-slate-800 selection:bg-indigo-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .premium-grid {
          background-color: #fafbfd;
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.025) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      `}</style>


      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between py-3.5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <a href="#top" className="hover:opacity-90 transition-opacity">
                <img src={logopng} alt="Logo" className="h-8 w-auto mix-blend-multiply" />
              </a>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold text-slate-500 tracking-wider uppercase">
              {["Features", "Workflow", "Docs", "Contact"].map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="relative group hover:text-indigo-600 transition-colors py-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                >
                  {link}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <a href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all">
                Sign In
              </a>
              <a href="/register" className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-all">
                Register
              </a>
            </motion.div>
          </nav>
        </div>
      </motion.header>


      <section className="relative pt-16 pb-24 border-b border-blue-100/50 bg-transparent overflow-hidden">


        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-6 border border-indigo-200/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
          >
            Enterprise Asset Management
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto leading-tight"
          >
            Streamline Your Organization's <span className="text-indigo-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">Assets & Maintenance</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            A unified platform for lifecycle tracking, preventive scheduling, and data-driven visibility for modern enterprises.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row justify-center gap-3 mb-20"
          >
            <a href="/register" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm z-10">
              Get Started <HiOutlineArrowRight />
            </a>
            <a href="#features" className="px-8 py-3.5 bg-white border border-slate-200 font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-sm z-10">
              Explore Features
            </a>
          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { label: "Total Assets", value: `${stats.totalAssets}+`, icon: HiOutlineCube },
              { label: "Active Requests", value: stats.activeRequests.toString(), icon: HiOutlineClipboardList },
              { label: "Compliance", value: `${stats.compliance}%`, icon: HiOutlineChartBar },
            ].map((stat, idx) => (
              <GsapHoverCard
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="bg-white border border-slate-200 p-6 rounded-xl transition-colors text-left flex items-center gap-5 cursor-default relative z-10"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 hover-inner shadow-sm bg-white">
                  <stat.icon size={20} />
                </div>
                <div className="hover-inner">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              </GsapHoverCard>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}

      <section id="features" className="py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Capabilities</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Built for Enterprise Scale</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { title: "Lifecycle Tracking", desc: "Monitor every asset from acquisition to disposal with full historical audit logs.", icon: HiOutlineCube },
              { title: "Preventive Maintenance", desc: "Automate scheduling to minimize equipment downtime and extend asset life.", icon: HiOutlineLightningBolt },
              { title: "Centralized Service Hub", desc: "Unified ticketing for staff and technicians with real-time status updates.", icon: HiOutlineClipboardList },
              { title: "Role-Based Access", desc: "Granular permissions for administrators, staff, and service technicians.", icon: HiOutlineUserGroup },
              { title: "Decision Analytics", desc: "Visual reports on utilization trends and maintenance performance metrics.", icon: HiOutlineChartBar },
              { title: "Governance & Security", desc: "Industry-standard data protection and full organizational compliance.", icon: HiOutlineShieldCheck },
            ].map((f, i) => (
              <GsapHoverCard
                key={i}
                className="group p-6 bg-white rounded-xl border border-transparent hover:border-slate-100 transition-colors cursor-default relative z-10"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all hover-inner shadow-sm">
                  <f.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight hover-inner group-hover:text-indigo-600 transition-colors">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed hover-inner">{f.desc}</p>
              </GsapHoverCard>
            ))}
          </div>
        </div>
      </section>


      <section id="workflow" className="py-24 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">How It Works</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">From Asset to Resolution in 3 Steps</h3>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">A seamless, end-to-end operations loop built for speed, visibility and accountability.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting arrow line (desktop only) */}
            <div className="hidden md:block absolute top-14 left-[33%] w-[34%] border-t-2 border-dashed border-indigo-200 z-0" />

            {[
              {
                step: "01",
                title: "Register Assets",
                desc: "Digitally onboard equipment with photo uploads, QR/barcode tags, and category metadata for immediate lifecycle tracking.",
                img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=70",
                gradient: "from-indigo-500 to-blue-500",
                tag: "Setup"
              },
              {
                step: "02",
                title: "Monitor & Schedule",
                desc: "Track real-time asset health, set automatic preventive maintenance reminders, and get instant fault alerts.",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=70",
                gradient: "from-violet-500 to-indigo-500",
                tag: "Operations"
              },
              {
                step: "03",
                title: "Resolve & Verify",
                desc: "Dispatch certified technicians, review completion evidence, and store auditable compliance history per asset.",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=70",
                gradient: "from-emerald-500 to-teal-500",
                tag: "Closure"
              },
            ].map((item, i) => (
              <GsapHoverCard
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden cursor-default relative z-10 hover:shadow-xl transition-all duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              >
                {/* Step image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover hover-inner" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60`} />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[9px] font-black text-white bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 rounded-full uppercase tracking-widest">{item.tag}</span>
                  </div>
                  <span className="absolute bottom-4 right-4 text-5xl font-black text-white/20 leading-none select-none">{item.step}</span>
                </div>
                {/* Step content */}
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}>Step {item.step}</span>
                  </div>
                  <h5 className="font-black text-slate-900 text-base mb-2 hover-inner">{item.title}</h5>
                  <p className="text-slate-500 text-xs leading-relaxed hover-inner">{item.desc}</p>
                </div>
              </GsapHoverCard>
            ))}
          </div>


        </div>
      </section>


      {/* Interactive Role Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-white via-indigo-50/15 to-white border-t border-slate-200/40 relative overflow-hidden">
        {/* Decorative background glow for the showcase */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none z-0" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Targeted Workspaces</h2>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Tailored Experience for Every Team Member</h3>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">Explore how AssetMaintenance delivers specialized features and real-time coordination for each role.</p>
          </motion.div>

          {/* Interactive Role Tabs */}
          <div className="flex justify-center gap-2 mb-12 bg-slate-100 p-1.5 rounded-xl max-w-lg mx-auto border border-slate-200">
            {[
              { id: "admin", label: "Administrators", color: "from-indigo-500 to-indigo-600" },
              { id: "technician", label: "Technicians", color: "from-violet-500 to-violet-600" },
              { id: "user", label: "Users", color: "from-emerald-500 to-emerald-600" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative ${
                  activeRoleTab === tab.id
                    ? "bg-white text-slate-900 shadow-md border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeRoleTab === tab.id && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role Detail Showcase Panel */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
            {activeRoleTab === "admin" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-12 items-center"
              >
                {/* Text Block */}
                <div className="md:col-span-6 space-y-6">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                    Control Center
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Supervise Assets, Assign Tasks & Audit Compliance
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Gain absolute oversight of physical inventory, manage maintenance teams, and review auditable operational health logs with an interface engineered for maximum density and clean visual hierarchy.
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "Automated technician scheduling & task routing rules",
                      "Visual compliance ratings with instant failover status pings",
                      "Deep statistics dashboards with real-time utilization graphs"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <span className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Inventory</p>
                      <p className="text-lg font-black text-slate-900">100% Tracking</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Success</p>
                      <p className="text-lg font-black text-slate-950">Instant Reports</p>
                    </div>
                  </div>
                </div>

                {/* Simulated UI Mockup Block */}
                <div className="md:col-span-6 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Admin Main Dashboard</span>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded uppercase tracking-wider">Live View</span>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Compliance", val: stats.compliance + "%", color: "text-emerald-400" },
                        { label: "Active Jobs", val: stats.activeRequests.toString(), color: "text-indigo-400" },
                        { label: "Assets Registered", val: stats.totalAssets + "+", color: "text-blue-400" }
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className={`text-base font-black ${item.color}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pinging Network Gateways</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 flex items-center gap-1.5 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Gateway: Central Node</span>
                        <span className="text-emerald-400 font-bold">ONLINE</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 flex items-center gap-1.5 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> AI Scheduler Engine</span>
                        <span className="text-emerald-400 font-bold">ONLINE</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>System OK</span>
                    <span className="font-mono text-indigo-400">Ver 1.4.2</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeRoleTab === "technician" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-12 items-center"
              >
                {/* Text Block */}
                <div className="md:col-span-6 space-y-6">
                  <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
                    Field Specialist
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Action Dispatched Tasks with Diagnostic Checklists
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Accept assigned maintenance tasks instantly from your personal panel. Follow step-by-step diagnostic checklists designed for individual machine categories, and log task progress (Accept to Finish) dynamically on site.
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "Real-time mobile-ready dispatches showing exact machine details",
                      "Checklist routines customized specifically per asset category",
                      "Direct field-to-base ticket progress relays (Accept & Finish states)"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <span className="w-4 h-4 rounded-full bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Work Order Routing</p>
                      <p className="text-lg font-black text-slate-900">Real-time Alerts</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnostic Precision</p>
                      <p className="text-lg font-black text-slate-955">Step Checklists</p>
                    </div>
                  </div>
                </div>

                {/* Simulated UI Mockup Block */}
                <div className="md:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Active Dispatch Order</span>
                    </div>
                    <span className="text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded uppercase tracking-wider">High Risk</span>
                  </div>

                  <div className="my-6 space-y-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-xs font-bold text-white">Central Router - Air Unit #2</h5>
                        <span className="text-[8px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">HVAC</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">Location: Server Room Alpha (2nd Floor)</p>
                      
                      <div className="space-y-2">
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Required Checklist</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-3.5 h-3.5 rounded bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/40 text-[8px] font-bold">✓</span>
                          <span>Audit wiring and connector integrity</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-3.5 h-3.5 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-[8px] font-bold"> </span>
                          <span className="text-slate-400">Perform cooling cycle fluid recharge</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Task Assigned: Just now</span>
                    <button className="px-3.5 py-1.5 bg-violet-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider hover:bg-violet-700">
                      Start Task
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeRoleTab === "user" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-12 items-center"
              >
                {/* Text Block */}
                <div className="md:col-span-6 space-y-6">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    End-User Workspace
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    On-Demand Maintenance Requests & AI Chatbot Support
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Equip general users and occupants to file maintenance requests in under 30 seconds. General users gain access to real-time status trackers, category-based request forms, and an advanced AI chatbot to assist with technical fault reports.
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "Quick category selectors (HVAC, Electrical, Mechanical, Plumbing, IT)",
                      "Interactive AI Chatbot assistant to draft detailed technical reports",
                      "Live ticket progression logs showing exactly when your ticket is solved"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Request Submission</p>
                      <p className="text-lg font-black text-slate-900">Under 30 Secs</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Diagnostics</p>
                      <p className="text-lg font-black text-slate-955">Smart Support</p>
                    </div>
                  </div>
                </div>

                {/* Simulated UI Mockup Block */}
                <div className="md:col-span-6 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI Troubleshooter Chatbot</span>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider">AI Live</span>
                  </div>

                  <div className="my-4 space-y-3 flex-1 flex flex-col justify-end">
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl text-[10px] max-w-[85%] text-slate-300">
                      <p className="font-bold text-[8px] text-emerald-400 mb-1">USER QUESTION</p>
                      How do I submit an emergency fluid repair ticket for the server room AC?
                    </div>

                    <div className="bg-indigo-950/40 border border-indigo-900 p-3 rounded-xl text-[10px] max-w-[85%] ml-auto text-slate-300">
                      <p className="font-bold text-[8px] text-indigo-400 mb-1">AI ASSISTANT</p>
                      Select <span className="text-white font-bold">HVAC / Server AC</span> category, set Priority to <span className="text-red-400 font-bold">Urgent</span>, and I will auto-generate your technical fault checklist!
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-slate-850 pt-3">
                    <input
                      type="text"
                      disabled
                      placeholder="Ask the AI Chatbot helper..."
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-400 outline-none flex-1"
                    />
                    <button className="px-3.5 py-2 bg-emerald-600 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider">
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      <section id="docs" className="py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Documentation</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Resources & Guides</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Getting Started", desc: "Quick setup guide to deploy and configure your platform.", icon: HiOutlineBookOpen },
              { title: "API Reference", desc: "Complete REST API documentation for integrations.", icon: HiOutlineCode },
              { title: "Best Practices", desc: "Industry standards for optimal asset management.", icon: HiOutlineDocumentText },
            ].map((doc, i) => (
              <GsapHoverCard
                key={i}
                as={motion.a}
                href="#"
                className="group bg-gray-50 p-6 rounded-xl border border-slate-200 transition-colors relative z-10 block h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all hover-inner shadow-sm">
                  <doc.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight transition-colors hover-inner">{doc.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 hover-inner grow">{doc.desc}</p>
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover-inner mt-auto">
                  Read More <HiOutlineArrowRight size={12} />
                </span>
              </GsapHoverCard>
            ))}
          </div>
        </div>
      </section>


      <section id="contact" className="py-24 bg-indigo-50/30 border-t border-blue-100/30">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Contact</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">Request a Professional Demo</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Learn how our platform can integrate with your existing infrastructure to optimize maintenance schedules.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <HiOutlineMail className="text-indigo-600" size={18} />
                <span className="text-sm font-semibold tracking-tight">enterprise@assetmaint.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white p-7 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Message</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest">
                  {loading ? "Processing..." : "Submit Inquiry"}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-green-50 p-10 rounded-xl text-center border border-green-100"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <HiOutlineShieldCheck size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Inquiry Received</h4>
                <p className="text-slate-500 text-xs font-medium">We'll contact you shortly.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>


      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-transparent py-12 border-t border-blue-100/50"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-[10px]">AM</div>
            <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">AssetMaintenance</span>
          </motion.div>

          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {["Terms", "Privacy", "Security", "Support"].map((l, i) => (
              <motion.a
                key={l}
                href="#"
                className="relative group hover:text-indigo-600 transition-colors py-1"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05, ease: "easeOut" }}
              >
                {l}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[11px] font-bold text-slate-400 tracking-wider"
          >
            © {new Date().getFullYear()} REFINED FOR ENTERPRISE
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
};

export default PublicHome;