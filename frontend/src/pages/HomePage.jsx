import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Heart, Brain, Scale, Landmark, User, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function HomePage({ lang, t, accessibilityMode }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-blue-900/20 isolate">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-3xl mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl mix-blend-screen" />

        <div className="relative z-10 p-8 md:p-16 lg:p-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 text-sm font-semibold text-blue-200">
              <Zap size={16} className="text-yellow-400 fill-yellow-400" />
              <span>AI-Powered Medical Assistant</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-blue-200">
              {t.welcome || 'Healthcare for Everyone.'}
            </h1>

            <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mb-10 leading-relaxed font-light">
              Experience the future of medical diagnosis with our
              <span className="font-semibold text-white"> Explainable Multi-Modal AI</span>.
              Upload X-rays, lab reports, and get instant, fair, and accurate insights in 9 languages.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/diagnosis"
                className="group relative px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Diagnosis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition duration-300" />
              </Link>

              <Link
                to="/register"
                className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition flex items-center gap-2 justify-center"
              >
                Patient Register
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Diagnostic Accuracy', value: '98%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Fairness Score', value: '0.97', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Indian Languages', value: '9+', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Loan Eligibility', value: '₹50K', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className={`p-6 rounded-2xl ${stat.bg} border border-white shadow-sm text-center transform hover:scale-105 transition duration-300`}>
            <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm font-bold text-slate-600 uppercase tracking-wide opacity-80">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Core Capabilities</h2>
          <div className="h-1 flex-1 bg-slate-100 ml-6 rounded-full" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Brain, title: 'Explainable AI', desc: 'Understand why the AI made its diagnosis with interactive heatmaps.', color: 'bg-purple-500' },
            { icon: Scale, title: 'Bias & Fairness', desc: 'Demographic parity checks ensuring equal healthcare for all.', color: 'bg-emerald-500' },
            { icon: Landmark, title: 'Financial Aid', desc: 'Automatic eligibility check for government health schemes.', color: 'bg-blue-500' },
            { icon: Activity, title: 'Multi-Modal Analysis', desc: 'Fusion of X-rays, Lab Reports, and Vitals for better accuracy.', color: 'bg-orange-500' },
            { icon: Heart, title: 'Holistic Treatment', desc: 'Personalized care plans including lifestyle and medication.', color: 'bg-red-500' },
            { icon: User, title: 'Secure Profile', desc: 'HIPAA-compliant patient data management and ABHA ID integration.', color: 'bg-slate-800' }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="group p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-${feature.color}/30 transform group-hover:rotate-12 transition`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  {feature.desc}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                  Learn more <ArrowRight size={14} className="ml-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
