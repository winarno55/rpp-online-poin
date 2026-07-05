var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name4 in all)
    __defProp(target, name4, { get: all[name4], enumerable: true });
};

// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var AuthContext, AuthProvider;
var init_AuthContext = __esm({
  "src/contexts/AuthContext.tsx"() {
    "use strict";
    AuthContext = createContext(void 0);
    AuthProvider = ({ children }) => {
      const [authData, setAuthData] = useState({
        token: null,
        user: null
      });
      useEffect(() => {
        try {
          const storedToken = localStorage.getItem("authToken");
          const storedUser = localStorage.getItem("authUser");
          if (storedToken && storedUser) {
            setAuthData({ token: storedToken, user: JSON.parse(storedUser) });
          }
        } catch (error) {
          console.error("Failed to parse auth data from localStorage", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        }
      }, []);
      const login = (token, user) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
        setAuthData({ token, user });
      };
      const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setAuthData({ token: null, user: null });
      };
      const updatePoints = (newPoints) => {
        setAuthData((prev) => {
          if (!prev.user) return prev;
          const updatedUser = { ...prev.user, points: newPoints };
          localStorage.setItem("authUser", JSON.stringify(updatedUser));
          return { ...prev, user: updatedUser };
        });
      };
      const isAuthenticated = !!authData.token && !!authData.user;
      const isAdmin = authData.user?.role === "admin";
      const value = useMemo(() => ({ authData, login, logout, updatePoints, isAuthenticated, isAdmin }), [authData]);
      return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
    };
  }
});

// src/hooks/useAuth.ts
import { useContext } from "react";
var useAuth;
var init_useAuth = __esm({
  "src/hooks/useAuth.ts"() {
    "use strict";
    init_AuthContext();
    useAuth = () => {
      const context = useContext(AuthContext);
      if (context === void 0) {
        throw new Error("useAuth must be used within an AuthProvider");
      }
      return context;
    };
  }
});

// src/components/LoadingSpinner.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var LoadingSpinner;
var init_LoadingSpinner = __esm({
  "src/components/LoadingSpinner.tsx"() {
    "use strict";
    LoadingSpinner = () => {
      return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [
        /* @__PURE__ */ jsxs3("svg", { className: "animate-spin h-12 w-12 text-sky-400 mb-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx4("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsx4("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        /* @__PURE__ */ jsx4("p", { className: "text-xl font-semibold text-slate-300", children: "Mempersiapkan RPP/Modul Ajar Anda..." }),
        /* @__PURE__ */ jsx4("p", { className: "text-slate-400", children: "Mohon tunggu sebentar." })
      ] });
    };
  }
});

// src/pages/LandingPage.tsx
var LandingPage_exports = {};
__export(LandingPage_exports, {
  default: () => LandingPage_default
});
import { useEffect as useEffect2 } from "react";
import { Link as Link3, Navigate as Navigate2, useLocation as useLocation3 } from "react-router-dom";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var NeuralNetworkIcon, TutorialStep, FeatureCard, LandingPage, LandingPage_default;
var init_LandingPage = __esm({
  "src/pages/LandingPage.tsx"() {
    "use strict";
    init_useAuth();
    NeuralNetworkIcon = () => /* @__PURE__ */ jsxs4("svg", { viewBox: "0 0 200 200", xmlns: "http://www.w3.org/2000/svg", className: "w-full h-full opacity-70", children: [
      /* @__PURE__ */ jsxs4("defs", { children: [
        /* @__PURE__ */ jsxs4("linearGradient", { id: "grad1", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
          /* @__PURE__ */ jsx6("stop", { offset: "0%", style: { stopColor: "rgb(56, 189, 248)", stopOpacity: 1 } }),
          /* @__PURE__ */ jsx6("stop", { offset: "100%", style: { stopColor: "rgb(16, 185, 129)", stopOpacity: 1 } })
        ] }),
        /* @__PURE__ */ jsxs4("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
          /* @__PURE__ */ jsx6("feGaussianBlur", { stdDeviation: "3.5", result: "coloredBlur" }),
          /* @__PURE__ */ jsxs4("feMerge", { children: [
            /* @__PURE__ */ jsx6("feMergeNode", { in: "coloredBlur" }),
            /* @__PURE__ */ jsx6("feMergeNode", { in: "SourceGraphic" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "50", x2: "100", y2: "30", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "50", x2: "100", y2: "70", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "50", x2: "100", y2: "110", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "50", x2: "100", y2: "150", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "120", x2: "100", y2: "30", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "120", x2: "100", y2: "70", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "120", x2: "100", y2: "110", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "30", y1: "120", x2: "100", y2: "150", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "100", y1: "30", x2: "170", y2: "90", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "100", y1: "70", x2: "170", y2: "90", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "100", y1: "110", x2: "170", y2: "90", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("line", { x1: "100", y1: "150", x2: "170", y2: "90", stroke: "url(#grad1)", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsx6("circle", { cx: "30", cy: "50", r: "10", fill: "#1e293b", stroke: "rgb(56, 189, 248)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "30", cy: "120", r: "10", fill: "#1e293b", stroke: "rgb(56, 189, 248)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "100", cy: "30", r: "8", fill: "#1e293b", stroke: "rgb(56, 189, 248)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "100", cy: "70", r: "8", fill: "#1e293b", stroke: "rgb(56, 189, 248)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "100", cy: "110", r: "8", fill: "#1e293b", stroke: "rgb(16, 185, 129)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "100", cy: "150", r: "8", fill: "#1e293b", stroke: "rgb(16, 185, 129)", strokeWidth: "2", filter: "url(#glow)" }),
      /* @__PURE__ */ jsx6("circle", { cx: "170", cy: "90", r: "12", fill: "#1e293b", stroke: "rgb(16, 185, 129)", strokeWidth: "2", filter: "url(#glow)" })
    ] });
    TutorialStep = ({ icon, title, description }) => /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsx6("div", { className: "bg-sky-100 text-sky-600 rounded-full p-4 mb-4 ring-8 ring-sky-50", children: icon }),
      /* @__PURE__ */ jsx6("h3", { className: "text-xl font-semibold text-slate-800 mb-2", children: title }),
      /* @__PURE__ */ jsx6("p", { className: "text-slate-600 px-2", children: description })
    ] });
    FeatureCard = ({ icon, title, description }) => /* @__PURE__ */ jsxs4("div", { className: "bg-white p-6 rounded-lg shadow-md border border-slate-200 text-left transform hover:-translate-y-2 transition-transform duration-300", children: [
      /* @__PURE__ */ jsx6("div", { className: "text-sky-500 mb-4", children: icon }),
      /* @__PURE__ */ jsx6("h3", { className: "text-xl font-semibold text-slate-800 mb-2", children: title }),
      /* @__PURE__ */ jsx6("p", { className: "text-slate-600", children: description })
    ] });
    LandingPage = () => {
      const { isAuthenticated } = useAuth();
      const location2 = useLocation3();
      useEffect2(() => {
        if (location2.hash) {
          const id = location2.hash.substring(1);
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      }, [location2]);
      if (isAuthenticated) {
        return /* @__PURE__ */ jsx6(Navigate2, { to: "/app", replace: true });
      }
      return /* @__PURE__ */ jsxs4("div", { className: "space-y-20 sm:space-y-28 py-10", children: [
        /* @__PURE__ */ jsxs4("section", { className: "grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12", children: [
          /* @__PURE__ */ jsxs4("div", { className: "text-center md:text-left", children: [
            /* @__PURE__ */ jsx6("h1", { className: "text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500 leading-tight", children: "Evolusi Perencanaan Mengajar. Ditenagai oleh AI Deep Learning." }),
            /* @__PURE__ */ jsx6("p", { className: "mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0", children: "Bukan sekadar generator. Platform kami belajar dan beradaptasi untuk menyusun Modul Ajar (RPP) yang dipersonalisasi, relevan, dan benar-benar berdampak." }),
            /* @__PURE__ */ jsxs4("div", { className: "mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4", children: [
              /* @__PURE__ */ jsx6(Link3, { to: "/register", className: "bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-lg text-center", children: "Mulai Evolusi Anda" }),
              /* @__PURE__ */ jsx6(Link3, { to: "/#tutorial", className: "bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 px-8 rounded-lg shadow-md border border-slate-300 transition-all text-center", children: "Pelajari Cara Kerja" })
            ] })
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg", children: /* @__PURE__ */ jsx6(NeuralNetworkIcon, {}) })
        ] }),
        /* @__PURE__ */ jsxs4("section", { id: "tutorial", className: "text-center bg-slate-50 py-16 rounded-2xl shadow-lg border border-slate-200", children: [
          /* @__PURE__ */ jsx6("h2", { className: "text-3xl font-bold text-slate-800", children: "Cara Kerja dalam 4 Langkah Mudah" }),
          /* @__PURE__ */ jsx6("p", { className: "mt-2 text-slate-500 max-w-3xl mx-auto", children: "Dari ide menjadi Modul Ajar siap pakai dalam beberapa menit." }),
          /* @__PURE__ */ jsxs4("div", { className: "mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6", children: [
            /* @__PURE__ */ jsx6(
              TutorialStep,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
                title: "1. Isi Formulir",
                description: "Daftar akun gratis, lalu isi formulir cerdas kami dengan ide-ide dasar pembelajaran Anda."
              }
            ),
            /* @__PURE__ */ jsx6(
              TutorialStep,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }),
                title: "2. Biarkan AI Bekerja",
                description: "Sistem AI deep learning kami akan menganalisis input Anda dan menyusun draf Modul Ajar secara real-time."
              }
            ),
            /* @__PURE__ */ jsx6(
              TutorialStep,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }) }),
                title: "3. Tinjau & Sempurnakan",
                description: "Lihat hasil yang digenerate AI. Gunakan langsung atau salin teksnya untuk disesuaikan lebih lanjut."
              }
            ),
            /* @__PURE__ */ jsx6(
              TutorialStep,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" }) }),
                title: "4. Unduh & Gunakan",
                description: "Unduh Modul Ajar dalam format DOCX atau TXT. Siap untuk dicetak dan digunakan di kelas Anda!"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("section", { id: "fitur", className: "text-center", children: [
          /* @__PURE__ */ jsx6("h2", { className: "text-3xl font-bold text-slate-800", children: "Platform yang Dibangun untuk Masa Depan Pendidikan" }),
          /* @__PURE__ */ jsx6("p", { className: "mt-2 text-slate-500 max-w-3xl mx-auto", children: "Tiga pilar teknologi yang mengubah cara Anda merancang pengalaman belajar." }),
          /* @__PURE__ */ jsxs4("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsx6(
              FeatureCard,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }),
                title: "Inti Kognitif (Cognitive Core)",
                description: "Menggunakan model deep learning canggih yang dilatih secara ekstensif pada data pedagogis untuk memahami konteks dan menghasilkan konten pembelajaran yang relevan secara mendalam."
              }
            ),
            /* @__PURE__ */ jsx6(
              FeatureCard,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
                title: "Adaptasi Kurikulum Cerdas",
                description: "AI kami tidak hanya mengikuti template, tetapi 'memahami' nuansa Kurikulum Merdeka, memastikan setiap komponen selaras dengan prinsip dan tujuan pembelajaran terkini."
              }
            ),
            /* @__PURE__ */ jsx6(
              FeatureCard,
              {
                icon: /* @__PURE__ */ jsx6("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx6("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }),
                title: "Personalisasi & Kontrol Penuh",
                description: "Dapatkan kerangka cerdas yang solid dari AI, lalu sempurnakan setiap detailnya. Anda memegang kendali penuh untuk menciptakan Modul Ajar yang otentik sesuai gaya mengajar Anda."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("section", { className: "text-center bg-slate-800 text-white p-10 rounded-2xl shadow-2xl", children: [
          /* @__PURE__ */ jsx6("h2", { className: "text-3xl font-bold", children: "Siap Mengalami Masa Depan Perencanaan?" }),
          /* @__PURE__ */ jsx6("p", { className: "mt-3 text-slate-300 max-w-2xl mx-auto", children: "Bergabunglah dengan para pendidik visioner yang memanfaatkan kekuatan deep learning untuk menciptakan dampak nyata di ruang kelas." }),
          /* @__PURE__ */ jsx6("div", { className: "mt-8", children: /* @__PURE__ */ jsx6(Link3, { to: "/register", className: "bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105 inline-block", children: "Mulai Evolusi Mengajar Anda" }) })
        ] })
      ] });
    };
    LandingPage_default = LandingPage;
  }
});

// src/pages/AboutPage.tsx
var AboutPage_exports = {};
__export(AboutPage_exports, {
  default: () => AboutPage_default
});
import { Link as Link4 } from "react-router-dom";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var AboutPage, AboutPage_default;
var init_AboutPage = __esm({
  "src/pages/AboutPage.tsx"() {
    "use strict";
    AboutPage = () => {
      return /* @__PURE__ */ jsxs5("div", { className: "w-full max-w-4xl mx-auto py-10 space-y-8", children: [
        /* @__PURE__ */ jsxs5("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx7("h1", { className: "text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600", children: "Tentang Modul Ajar AI Cerdas" }),
          /* @__PURE__ */ jsx7("p", { className: "text-slate-600 mt-2 text-lg", children: "Memberdayakan Guru, Menginspirasi Siswa." })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "prose prose-lg max-w-none text-slate-700", children: [
          /* @__PURE__ */ jsxs5("p", { children: [
            /* @__PURE__ */ jsx7("strong", { children: "Modul Ajar AI Cerdas" }),
            " lahir dari sebuah pemahaman mendalam akan tantangan yang dihadapi para guru di Indonesia setiap harinya. Kami menciptakan platform ",
            /* @__PURE__ */ jsx7("strong", { children: "Modul Ajar berbasis AI" }),
            " ini karena kami menyadari bahwa tugas seorang guru tidak hanya sebatas mengajar di depan kelas, tetapi juga mencakup beban administrasi yang signifikan, terutama dalam penyusunan Rencana Pelaksanaan Pembelajaran (RPP) yang sesuai dengan tuntutan kurikulum modern seperti Kurikulum Merdeka."
          ] }),
          /* @__PURE__ */ jsx7("p", { children: "Waktu dan energi yang seharusnya bisa lebih banyak dicurahkan untuk berinovasi di dalam kelas, berinteraksi dengan siswa, dan mengembangkan metode pengajaran yang kreatif, seringkali terkuras untuk memenuhi tuntutan administrasi tersebut." }),
          /* @__PURE__ */ jsx7("h2", { className: "text-slate-800", children: "Misi Kami" }),
          /* @__PURE__ */ jsx7("p", { children: "Misi kami sederhana: **mengembalikan waktu berharga para guru**. Kami percaya bahwa teknologi, khususnya kecerdasan buatan (AI), dapat menjadi asisten yang andal bagi para pendidik. Dengan Modul Ajar Cerdas, kami bertujuan untuk:" }),
          /* @__PURE__ */ jsxs5("ul", { children: [
            /* @__PURE__ */ jsxs5("li", { children: [
              /* @__PURE__ */ jsx7("strong", { children: "Menyederhanakan Proses:" }),
              " Mengubah proses pembuatan Modul Ajar yang rumit menjadi beberapa klik sederhana."
            ] }),
            /* @__PURE__ */ jsxs5("li", { children: [
              /* @__PURE__ */ jsx7("strong", { children: "Meningkatkan Kualitas:" }),
              " Menyediakan kerangka kerja Modul Ajar yang tidak hanya lengkap secara administratif, tetapi juga kaya akan ide-ide pembelajaran yang bermakna, penuh kesadaran (mindful), dan menyenangkan (joyful)."
            ] }),
            /* @__PURE__ */ jsxs5("li", { children: [
              /* @__PURE__ */ jsx7("strong", { children: "Mendukung Inovasi:" }),
              " Memberikan guru titik awal yang kuat sehingga mereka bisa lebih fokus pada penyesuaian dan implementasi kreatif di kelas masing-masing."
            ] })
          ] }),
          /* @__PURE__ */ jsx7("h2", { className: "text-slate-800", children: "Bagaimana Cara Kerjanya?" }),
          /* @__PURE__ */ jsx7("p", { children: "Kami mengintegrasikan model AI canggih dengan pemahaman mendalam tentang prinsip-prinsip pedagogi dan struktur Kurikulum Merdeka. Anda hanya perlu memasukkan beberapa informasi kunci mengenai materi yang akan diajarkan, dan sistem kami akan menyusun draf Modul Ajar yang komprehensif, mulai dari informasi umum, tujuan pembelajaran, asesmen, hingga lampiran seperti LKPD dan rubrik penilaian." }),
          /* @__PURE__ */ jsx7("p", { children: "Kami bukan pengganti kreativitas guru, melainkan mitra dalam proses perencanaan. Kami adalah alat untuk memantik ide dan mempercepat pekerjaan, sehingga Anda bisa menjadi versi terbaik dari diri Anda sebagai seorang pendidik." }),
          /* @__PURE__ */ jsxs5("div", { className: "text-center mt-12 bg-slate-100 p-6 rounded-lg", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xl font-semibold text-slate-800", children: "Siap untuk memulai?" }),
            /* @__PURE__ */ jsx7(Link4, { to: "/register", className: "mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all", children: "Daftar Gratis Sekarang" })
          ] })
        ] })
      ] });
    };
    AboutPage_default = AboutPage;
  }
});

// src/pages/PrivacyPolicyPage.tsx
var PrivacyPolicyPage_exports = {};
__export(PrivacyPolicyPage_exports, {
  default: () => PrivacyPolicyPage_default
});
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var PrivacyPolicyPage, PrivacyPolicyPage_default;
var init_PrivacyPolicyPage = __esm({
  "src/pages/PrivacyPolicyPage.tsx"() {
    "use strict";
    PrivacyPolicyPage = () => {
      return /* @__PURE__ */ jsxs6("div", { className: "w-full max-w-4xl mx-auto py-10 space-y-8", children: [
        /* @__PURE__ */ jsxs6("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx8("h1", { className: "text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600", children: "Kebijakan Privasi" }),
          /* @__PURE__ */ jsx8("p", { className: "text-slate-600 mt-2 text-lg", children: "Terakhir diperbarui: 28 Juni 2024" })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "prose prose-lg max-w-none text-slate-700", children: [
          /* @__PURE__ */ jsx8("p", { children: 'Terima kasih telah menggunakan Modul Ajar Cerdas ("kami", "situs", "layanan"). Kami berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.' }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "1. Informasi yang Kami Kumpulkan" }),
          /* @__PURE__ */ jsx8("p", { children: "Kami mengumpulkan jenis informasi berikut:" }),
          /* @__PURE__ */ jsxs6("ul", { children: [
            /* @__PURE__ */ jsxs6("li", { children: [
              /* @__PURE__ */ jsx8("strong", { children: "Informasi yang Anda Berikan:" }),
              " Saat Anda mendaftar, kami mengumpulkan alamat email dan password yang telah di-hash (terenkripsi). Saat Anda menggunakan layanan, kami mengumpulkan data yang Anda masukkan ke dalam formulir pembuatan Modul Ajar (seperti mata pelajaran, materi, dll.)."
            ] }),
            /* @__PURE__ */ jsxs6("li", { children: [
              /* @__PURE__ */ jsx8("strong", { children: "Informasi Penggunaan:" }),
              " Kami menyimpan catatan tentang jumlah poin yang Anda miliki dan kapan Anda menggunakannya untuk membuat Modul Ajar."
            ] })
          ] }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "2. Bagaimana Kami Menggunakan Informasi Anda" }),
          /* @__PURE__ */ jsx8("p", { children: "Informasi yang kami kumpulkan digunakan untuk:" }),
          /* @__PURE__ */ jsxs6("ul", { children: [
            /* @__PURE__ */ jsx8("li", { children: "Menyediakan, mengoperasikan, dan memelihara layanan kami." }),
            /* @__PURE__ */ jsx8("li", { children: "Memproses transaksi dan mengelola akun Anda, termasuk penambahan dan pengurangan poin." }),
            /* @__PURE__ */ jsx8("li", { children: "Mengirimkan informasi penting terkait akun, seperti email untuk reset password." }),
            /* @__PURE__ */ jsx8("li", { children: "Menganalisis dan meningkatkan layanan kami. Data prompt yang Anda masukkan dapat kami gunakan secara anonim untuk melatih dan meningkatkan kualitas model AI kami." })
          ] }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "3. Keamanan Data" }),
          /* @__PURE__ */ jsx8("p", { children: "Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda. Password Anda disimpan dalam bentuk hash yang aman menggunakan enkripsi bcrypt, yang berarti kami sendiri tidak dapat melihat password asli Anda. Komunikasi dengan server kami dilindungi oleh enkripsi SSL/TLS." }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "4. Penyimpanan Riwayat Modul Ajar" }),
          /* @__PURE__ */ jsx8("p", { children: 'Fitur "Riwayat Modul Ajar" menyimpan data RPP yang telah Anda generate secara lokal di perangkat Anda menggunakan teknologi IndexedDB pada browser Anda. Data ini **tidak disimpan di server kami**. Ini berarti riwayat Anda bersifat pribadi dan hanya dapat diakses dari browser tempat Anda membuatnya. Menghapus data browser (cache/cookies) dapat menghapus riwayat ini secara permanen.' }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "5. Berbagi Informasi" }),
          /* @__PURE__ */ jsx8("p", { children: "Kami **tidak akan** menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali sebagaimana diwajibkan oleh hukum." }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "6. Perubahan pada Kebijakan Privasi Ini" }),
          /* @__PURE__ */ jsx8("p", { children: "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan." }),
          /* @__PURE__ */ jsx8("h2", { className: "text-slate-800", children: "7. Hubungi Kami" }),
          /* @__PURE__ */ jsx8("p", { children: "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui informasi kontak yang tersedia di situs ini." })
        ] })
      ] });
    };
    PrivacyPolicyPage_default = PrivacyPolicyPage;
  }
});

// src/pages/PricingPage.tsx
var PricingPage_exports = {};
__export(PricingPage_exports, {
  default: () => PricingPage_default
});
import { useState as useState2, useEffect as useEffect3 } from "react";
import { Link as Link5 } from "react-router-dom";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var PricingPage, PricingPage_default;
var init_PricingPage = __esm({
  "src/pages/PricingPage.tsx"() {
    "use strict";
    init_LoadingSpinner();
    init_useAuth();
    PricingPage = () => {
      const { isAuthenticated } = useAuth();
      const [config, setConfig] = useState2(null);
      const [loading, setLoading] = useState2(true);
      const [error, setError] = useState2(null);
      const [copied, setCopied] = useState2(null);
      useEffect3(() => {
        const fetchConfig = async () => {
          setLoading(true);
          try {
            const response = await fetch("/api/pricing/config");
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.message || "Gagal memuat informasi harga.");
            }
            setConfig(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.");
          } finally {
            setLoading(false);
          }
        };
        fetchConfig();
      }, []);
      const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2e3);
      };
      if (loading) {
        return /* @__PURE__ */ jsx9("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx9(LoadingSpinner, {}) });
      }
      if (error) {
        return /* @__PURE__ */ jsx9("div", { className: "text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200", children: error });
      }
      if (!config || config.pointPackages.length === 0 && config.paymentMethods.length === 0) {
        return /* @__PURE__ */ jsx9("div", { className: "text-center text-slate-500 p-4 rounded-lg bg-slate-100", children: "Admin belum mengatur informasi harga dan pembayaran. Silakan hubungi admin secara langsung." });
      }
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
        }).format(amount);
      };
      return /* @__PURE__ */ jsxs7("div", { className: "w-full max-w-4xl mx-auto space-y-16 py-10", children: [
        /* @__PURE__ */ jsxs7("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx9("h1", { className: "text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600", children: "Harga Poin" }),
          /* @__PURE__ */ jsx9("p", { className: "text-slate-600 mt-2 text-lg max-w-2xl mx-auto", children: "Pilih paket yang sesuai dengan kebutuhan Anda untuk terus membuat Modul Ajar berkualitas." })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "bg-white shadow-xl rounded-xl p-8 border border-slate-200", children: [
          /* @__PURE__ */ jsx9("h2", { className: "text-3xl font-bold text-slate-800 text-center mb-8", children: "Pilih Paket" }),
          /* @__PURE__ */ jsx9("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: (config.pointPackages || []).map((pkg, index) => /* @__PURE__ */ jsxs7("div", { className: "border border-slate-200 rounded-lg p-6 text-center flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300 bg-slate-50", children: [
            /* @__PURE__ */ jsx9("p", { className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500", children: pkg.points }),
            /* @__PURE__ */ jsx9("p", { className: "text-xl text-sky-700 mb-4 font-semibold", children: "Poin" }),
            /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-slate-800", children: formatCurrency(pkg.price) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "bg-white shadow-xl rounded-xl p-8 border border-slate-200", children: [
          /* @__PURE__ */ jsx9("h2", { className: "text-3xl font-bold text-slate-800 text-center mb-8", children: "Cara Pembayaran" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-4 max-w-lg mx-auto", children: (config.paymentMethods || []).map((pm, index) => /* @__PURE__ */ jsxs7("div", { className: "bg-slate-100 rounded-lg p-4 flex items-center justify-between shadow-sm border border-slate-200", children: [
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx9("p", { className: "font-semibold text-sky-700 text-lg", children: pm.method }),
              /* @__PURE__ */ jsx9("p", { className: "text-slate-800 text-xl font-mono", children: pm.details })
            ] }),
            /* @__PURE__ */ jsx9("button", { onClick: () => handleCopy(pm.details), className: "bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-3 rounded-md text-sm transition-colors border border-slate-300", children: copied === pm.details ? "Tersalin!" : "Salin" })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "bg-gradient-to-r from-sky-500 to-emerald-500 shadow-2xl rounded-xl p-8 text-center text-white", children: [
          /* @__PURE__ */ jsx9("h2", { className: "text-3xl font-bold mb-4", children: "Langkah Terakhir" }),
          /* @__PURE__ */ jsx9("p", { className: "text-lg mb-6 max-w-2xl mx-auto", children: "Setelah melakukan pembayaran, kirim bukti transfer Anda untuk konfirmasi. Poin akan ditambahkan ke akun Anda oleh admin." }),
          /* @__PURE__ */ jsx9(
            "a",
            {
              href: "https://wa.me/6282232835976?text=Halo%20Admin%20Modul%20Ajar%20Cerdas,%20saya%20sudah%20melakukan%20pembayaran%20untuk%20isi%20ulang%20poin.",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-block bg-white text-emerald-600 font-bold py-4 px-8 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105",
              children: "Konfirmasi via WhatsApp"
            }
          ),
          !isAuthenticated && /* @__PURE__ */ jsxs7("p", { className: "mt-8", children: [
            "Belum punya akun?",
            " ",
            /* @__PURE__ */ jsx9(Link5, { to: "/register", className: "font-bold underline hover:text-yellow-300", children: "Daftar gratis di sini untuk memulai!" })
          ] })
        ] })
      ] });
    };
    PricingPage_default = PricingPage;
  }
});

// src/pages/LoginPage.tsx
var LoginPage_exports = {};
__export(LoginPage_exports, {
  default: () => LoginPage_default
});
import { useState as useState3 } from "react";
import { useNavigate as useNavigate2, Link as Link6, useLocation as useLocation4 } from "react-router-dom";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var LoginPage, LoginPage_default;
var init_LoginPage = __esm({
  "src/pages/LoginPage.tsx"() {
    "use strict";
    init_useAuth();
    LoginPage = () => {
      const [email, setEmail] = useState3("");
      const [password, setPassword] = useState3("");
      const [error, setError] = useState3(null);
      const [isLoading, setIsLoading] = useState3(false);
      const { login } = useAuth();
      const navigate = useNavigate2();
      const location2 = useLocation4();
      const from = location2.state?.from?.pathname || "/app";
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Login gagal");
          }
          login(data.token, data.user);
          navigate(from, { replace: true });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
          setIsLoading(false);
        }
      };
      const inputClass = "w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-800";
      const labelClass = "block mb-2 text-sm font-medium text-slate-600";
      return /* @__PURE__ */ jsx10("div", { className: "flex justify-center items-center py-12", children: /* @__PURE__ */ jsxs8("div", { className: "w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-slate-200", children: [
        /* @__PURE__ */ jsx10("h2", { className: "text-3xl font-bold text-center text-slate-800 mb-6", children: "Login" }),
        /* @__PURE__ */ jsxs8("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          error && /* @__PURE__ */ jsx10("p", { className: "text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200", children: error }),
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx10("label", { htmlFor: "login-identity", className: labelClass, children: "Email atau Username Admin" }),
            /* @__PURE__ */ jsx10(
              "input",
              {
                type: "text",
                id: "login-identity",
                value: email,
                onChange: (e) => setEmail(e.target.value.toLowerCase()),
                required: true,
                className: inputClass,
                placeholder: "Masukkan email Anda atau 'admin'",
                autoCapitalize: "none",
                autoCorrect: "off"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx10("label", { htmlFor: "password", className: labelClass, children: "Password" }),
            /* @__PURE__ */ jsx10("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: inputClass })
          ] }),
          /* @__PURE__ */ jsx10("button", { type: "submit", disabled: isLoading, className: "w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg", children: isLoading ? "Loading..." : "Login" })
        ] }),
        /* @__PURE__ */ jsxs8("p", { className: "text-center text-slate-500 mt-6", children: [
          "Belum punya akun? ",
          /* @__PURE__ */ jsx10(Link6, { to: "/register", className: "font-medium text-sky-600 hover:underline", children: "Register di sini" })
        ] }),
        /* @__PURE__ */ jsx10("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx10(Link6, { to: "/forgot-password", className: "text-sm text-slate-500 hover:text-sky-600 transition-colors", children: "Lupa Password?" }) })
      ] }) });
    };
    LoginPage_default = LoginPage;
  }
});

// src/pages/RegisterPage.tsx
var RegisterPage_exports = {};
__export(RegisterPage_exports, {
  default: () => RegisterPage_default
});
import { useState as useState4 } from "react";
import { useNavigate as useNavigate3, Link as Link7 } from "react-router-dom";
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var RegisterPage, RegisterPage_default;
var init_RegisterPage = __esm({
  "src/pages/RegisterPage.tsx"() {
    "use strict";
    RegisterPage = () => {
      const [email, setEmail] = useState4("");
      const [password, setPassword] = useState4("");
      const [error, setError] = useState4(null);
      const [success, setSuccess] = useState4(null);
      const [isLoading, setIsLoading] = useState4(false);
      const navigate = useNavigate3();
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Registrasi gagal");
          }
          setSuccess("Registrasi berhasil! Anda akan diarahkan ke halaman login...");
          setTimeout(() => navigate("/login"), 2e3);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
          setIsLoading(false);
        }
      };
      const inputClass = "w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-800";
      const labelClass = "block mb-2 text-sm font-medium text-slate-600";
      return /* @__PURE__ */ jsx11("div", { className: "flex justify-center items-center py-12", children: /* @__PURE__ */ jsxs9("div", { className: "w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-slate-200", children: [
        /* @__PURE__ */ jsx11("h2", { className: "text-3xl font-bold text-center text-slate-800 mb-6", children: "Register Gratis" }),
        /* @__PURE__ */ jsxs9("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          error && /* @__PURE__ */ jsx11("p", { className: "text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200", children: error }),
          success && /* @__PURE__ */ jsx11("p", { className: "text-green-600 bg-green-100 p-3 rounded-lg text-center border border-green-200", children: success }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "email", className: labelClass, children: "Email" }),
            /* @__PURE__ */ jsx11(
              "input",
              {
                type: "email",
                id: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value.toLowerCase()),
                required: true,
                className: inputClass,
                autoCapitalize: "none",
                autoCorrect: "off"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "password", className: labelClass, children: "Password" }),
            /* @__PURE__ */ jsx11("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: inputClass })
          ] }),
          /* @__PURE__ */ jsx11("button", { type: "submit", disabled: isLoading || !!success, className: "w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg", children: isLoading ? "Loading..." : "Register" })
        ] }),
        /* @__PURE__ */ jsxs9("p", { className: "text-center text-slate-500 mt-6", children: [
          "Sudah punya akun? ",
          /* @__PURE__ */ jsx11(Link7, { to: "/login", className: "font-medium text-sky-600 hover:underline", children: "Login di sini" })
        ] })
      ] }) });
    };
    RegisterPage_default = RegisterPage;
  }
});

// src/pages/ForgotPasswordPage.tsx
var ForgotPasswordPage_exports = {};
__export(ForgotPasswordPage_exports, {
  default: () => ForgotPasswordPage_default
});
import { useState as useState5 } from "react";
import { Link as Link8 } from "react-router-dom";
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
var ForgotPasswordPage, ForgotPasswordPage_default;
var init_ForgotPasswordPage = __esm({
  "src/pages/ForgotPasswordPage.tsx"() {
    "use strict";
    ForgotPasswordPage = () => {
      const [email, setEmail] = useState5("");
      const [message, setMessage] = useState5(null);
      const [isLoading, setIsLoading] = useState5(false);
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
          const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Gagal mengirim email reset.");
          }
          setMessage({ type: "success", text: "Jika email Anda terdaftar, Anda akan menerima tautan untuk mereset password. Silakan cek inbox (dan folder spam) Anda." });
        } catch (err) {
          setMessage({ type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" });
        } finally {
          setIsLoading(false);
        }
      };
      const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100";
      const labelClass = "block mb-2 text-sm font-medium text-sky-300";
      return /* @__PURE__ */ jsx12("div", { className: "flex justify-center items-center", children: /* @__PURE__ */ jsxs10("div", { className: "w-full max-w-md bg-slate-800 shadow-2xl rounded-xl p-8", children: [
        /* @__PURE__ */ jsx12("h2", { className: "text-3xl font-bold text-center text-white mb-6", children: "Lupa Password" }),
        /* @__PURE__ */ jsx12("p", { className: "text-center text-slate-400 mb-6", children: "Masukkan email Anda untuk menerima tautan reset password." }),
        /* @__PURE__ */ jsxs10("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          message && /* @__PURE__ */ jsx12("p", { className: `${message.type === "success" ? "text-green-400 bg-green-900/50" : "text-red-400 bg-red-900/50"} p-3 rounded-lg text-center`, children: message.text }),
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx12("label", { htmlFor: "email", className: labelClass, children: "Email" }),
            /* @__PURE__ */ jsx12(
              "input",
              {
                type: "email",
                id: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value.toLowerCase()),
                required: true,
                className: inputClass,
                placeholder: "email.terdaftar@contoh.com",
                autoCapitalize: "none",
                autoCorrect: "off"
              }
            )
          ] }),
          /* @__PURE__ */ jsx12("button", { type: "submit", disabled: isLoading || message?.type === "success", className: "w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg", children: isLoading ? "Mengirim..." : "Kirim Tautan Reset" })
        ] }),
        /* @__PURE__ */ jsxs10("p", { className: "text-center text-slate-400 mt-6", children: [
          "Ingat password Anda? ",
          /* @__PURE__ */ jsx12(Link8, { to: "/login", className: "font-medium text-sky-400 hover:underline", children: "Login di sini" })
        ] })
      ] }) });
    };
    ForgotPasswordPage_default = ForgotPasswordPage;
  }
});

// src/pages/ResetPasswordPage.tsx
var ResetPasswordPage_exports = {};
__export(ResetPasswordPage_exports, {
  default: () => ResetPasswordPage_default
});
import { useState as useState6 } from "react";
import { useParams, useNavigate as useNavigate4, Link as Link9 } from "react-router-dom";
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
var ResetPasswordPage, ResetPasswordPage_default;
var init_ResetPasswordPage = __esm({
  "src/pages/ResetPasswordPage.tsx"() {
    "use strict";
    ResetPasswordPage = () => {
      const { token } = useParams();
      const navigate = useNavigate4();
      const [password, setPassword] = useState6("");
      const [confirmPassword, setConfirmPassword] = useState6("");
      const [message, setMessage] = useState6(null);
      const [isLoading, setIsLoading] = useState6(false);
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setMessage({ type: "error", text: "Password tidak cocok." });
          return;
        }
        if (password.length < 6) {
          setMessage({ type: "error", text: "Password minimal harus 6 karakter." });
          return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
          const response = await fetch(`/api/auth/reset-password?token=${token}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Gagal mereset password.");
          }
          setMessage({ type: "success", text: data.message });
          setTimeout(() => navigate("/login"), 3e3);
        } catch (err) {
          setMessage({ type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" });
        } finally {
          setIsLoading(false);
        }
      };
      const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100";
      const labelClass = "block mb-2 text-sm font-medium text-sky-300";
      return /* @__PURE__ */ jsx13("div", { className: "flex justify-center items-center", children: /* @__PURE__ */ jsxs11("div", { className: "w-full max-w-md bg-slate-800 shadow-2xl rounded-xl p-8", children: [
        /* @__PURE__ */ jsx13("h2", { className: "text-3xl font-bold text-center text-white mb-6", children: "Reset Password Baru" }),
        /* @__PURE__ */ jsxs11("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          message && /* @__PURE__ */ jsx13("p", { className: `${message.type === "success" ? "text-green-400 bg-green-900/50" : "text-red-400 bg-red-900/50"} p-3 rounded-lg text-center`, children: message.text }),
          /* @__PURE__ */ jsxs11("div", { children: [
            /* @__PURE__ */ jsx13("label", { htmlFor: "password", className: labelClass, children: "Password Baru" }),
            /* @__PURE__ */ jsx13("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs11("div", { children: [
            /* @__PURE__ */ jsx13("label", { htmlFor: "confirmPassword", className: labelClass, children: "Konfirmasi Password Baru" }),
            /* @__PURE__ */ jsx13("input", { type: "password", id: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, className: inputClass })
          ] }),
          /* @__PURE__ */ jsx13("button", { type: "submit", disabled: isLoading || message?.type === "success", className: "w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg", children: isLoading ? "Menyimpan..." : "Simpan Password Baru" })
        ] }),
        message?.type === "success" && /* @__PURE__ */ jsxs11("p", { className: "text-center text-slate-400 mt-6", children: [
          "Anda akan diarahkan ke halaman ",
          /* @__PURE__ */ jsx13(Link9, { to: "/login", className: "font-medium text-sky-400 hover:underline", children: "Login" }),
          "."
        ] })
      ] }) });
    };
    ResetPasswordPage_default = ResetPasswordPage;
  }
});

// src/utils/fetchWithRetry.ts
async function fetchWithRetry(url, options, maxRetries = 5) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 || response.status === 503) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      return response;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      const delay = Math.pow(2, retries - 1) * 1e3;
      console.warn(`Fetch failed. Retrying in ${delay}ms... (Attempt ${retries}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}
var init_fetchWithRetry = __esm({
  "src/utils/fetchWithRetry.ts"() {
    "use strict";
  }
});

// src/types.ts
var db, initDB, addRppToHistory, getAllRpps, getRppById, deleteRppById;
var init_types = __esm({
  "src/types.ts"() {
    "use strict";
    initDB = () => {
      return new Promise((resolve, reject) => {
        if (db) {
          return resolve(true);
        }
        const request = indexedDB.open("RPP_HistoryDB", 1);
        request.onerror = () => {
          console.error("Database error:", request.error);
          reject("Error membuka database riwayat.");
        };
        request.onsuccess = () => {
          db = request.result;
          resolve(true);
        };
        request.onupgradeneeded = () => {
          const db2 = request.result;
          if (!db2.objectStoreNames.contains("rpp_history")) {
            const store = db2.createObjectStore("rpp_history", { keyPath: "id", autoIncrement: true });
            store.createIndex("createdAt", "createdAt", { unique: false });
          }
        };
      });
    };
    addRppToHistory = (input, generatedPlan) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["rpp_history"], "readwrite");
        const store = transaction.objectStore("rpp_history");
        const newItem = {
          ...input,
          generatedPlan,
          createdAt: /* @__PURE__ */ new Date()
        };
        const request = store.add(newItem);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          console.error("Error adding item:", request.error);
          reject("Gagal menambahkan item ke riwayat.");
        };
      });
    };
    getAllRpps = () => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["rpp_history"], "readonly");
        const store = transaction.objectStore("rpp_history");
        const index = store.index("createdAt");
        const request = index.openCursor(null, "prev");
        const items = [];
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const item = cursor.value;
            item.id = cursor.primaryKey;
            items.push(item);
            cursor.continue();
          } else {
            resolve(items);
          }
        };
        request.onerror = () => {
          console.error("Error fetching all items with cursor:", request.error);
          reject("Gagal memuat riwayat.");
        };
      });
    };
    getRppById = (id) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["rpp_history"], "readonly");
        const store = transaction.objectStore("rpp_history");
        const request = store.get(id);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          console.error("Error fetching item by id:", request.error);
          reject("Gagal memuat RPP yang dipilih.");
        };
      });
    };
    deleteRppById = (id) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["rpp_history"], "readwrite");
        const store = transaction.objectStore("rpp_history");
        const request = store.delete(id);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          console.error("Error deleting item:", request.error);
          reject("Gagal menghapus RPP yang dipilih.");
        };
      });
    };
  }
});

// src/constants.ts
var JUMLAH_PERTEMUAN_OPTIONS, KELAS_OPTIONS, getFaseForKelas, DIMENSI_PROFIL_LULUSAN, PRAKTIK_PEDAGOGIS_LAINNYA, PRAKTIK_PEDAGOGIS_OPTIONS;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    JUMLAH_PERTEMUAN_OPTIONS = [
      "1 Kali Pertemuan",
      "2 Kali Pertemuan",
      "3 Kali Pertemuan",
      "4 Kali Pertemuan",
      "5 Kali Pertemuan"
    ];
    KELAS_OPTIONS = [
      "Kelas I",
      "Kelas II",
      "Kelas III",
      "Kelas IV",
      "Kelas V",
      "Kelas VI",
      "Kelas VII",
      "Kelas VIII",
      "Kelas IX",
      "Kelas X",
      "Kelas XI",
      "Kelas XII"
    ];
    getFaseForKelas = (kelas) => {
      if (["Kelas I", "Kelas II"].includes(kelas)) return "Fase A";
      if (["Kelas III", "Kelas IV"].includes(kelas)) return "Fase B";
      if (["Kelas V", "Kelas VI"].includes(kelas)) return "Fase C";
      if (["Kelas VII", "Kelas VIII", "Kelas IX"].includes(kelas)) return "Fase D";
      if (kelas === "Kelas X") return "Fase E";
      if (["Kelas XI", "Kelas XII"].includes(kelas)) return "Fase F";
      return "";
    };
    DIMENSI_PROFIL_LULUSAN = [
      "Keimanan dan Ketakwaan terhadap Tuhan YME",
      "Kewargaan",
      "Kreativitas",
      "Penalaran Kritis",
      "Kemandirian",
      "Kolaborasi",
      "Komunikasi",
      "Kesehatan"
    ];
    PRAKTIK_PEDAGOGIS_LAINNYA = "Lainnya... (Tuliskan di bawah)";
    PRAKTIK_PEDAGOGIS_OPTIONS = [
      "Pembelajaran Berbasis Masalah (Problem-Based Learning)",
      "Pembelajaran Berbasis Proyek (Project-Based Learning)",
      "Pembelajaran Inkuiri (Inquiry-Based Learning)",
      "Pembelajaran Kontekstual (Contextual Teaching and Learning)",
      "Pembelajaran Kooperatif (Cooperative Learning)",
      "Pembelajaran Berdiferensiasi (Differentiated Learning)",
      PRAKTIK_PEDAGOGIS_LAINNYA
    ];
  }
});

// src/components/IdentityForm.tsx
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
var IdentityForm;
var init_IdentityForm = __esm({
  "src/components/IdentityForm.tsx"() {
    "use strict";
    init_constants();
    IdentityForm = ({ formData, handleChange, onSubmit, isLoading, bundleCost }) => {
      const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all";
      return /* @__PURE__ */ jsxs12("div", { className: "bg-white p-6 rounded-xl shadow-lg border border-slate-100", children: [
        /* @__PURE__ */ jsx14("h2", { className: "text-2xl font-bold text-slate-800 mb-6 border-b pb-4", children: "Data Identitas & Kurikulum" }),
        /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx14("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Satuan Pendidikan" }),
            /* @__PURE__ */ jsx14("input", { type: "text", name: "satuanPendidikan", value: formData.satuanPendidikan, onChange: handleChange, className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx14("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Mata Pelajaran" }),
            /* @__PURE__ */ jsx14("input", { type: "text", name: "mataPelajaran", value: formData.mataPelajaran, onChange: handleChange, className: inputClass, placeholder: "Contoh: Matematika" })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx14("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Singkatan Mapel" }),
            /* @__PURE__ */ jsx14("input", { type: "text", name: "singkatan", value: formData.singkatan, onChange: handleChange, className: inputClass, placeholder: "Contoh: MAT" })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsxs12("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: [
              "Kelas ",
              /* @__PURE__ */ jsxs12("span", { className: "text-slate-500 font-normal ml-1", children: [
                "(",
                getFaseForKelas(formData.kelasFase),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx14("select", { name: "kelasFase", value: formData.kelasFase, onChange: handleChange, className: inputClass, children: KELAS_OPTIONS.map((opt) => /* @__PURE__ */ jsx14("option", { value: opt, children: opt }, opt)) })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx14("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Alokasi Waktu" }),
            /* @__PURE__ */ jsx14("input", { type: "text", name: "alokasiWaktu", value: formData.alokasiWaktu, onChange: handleChange, className: inputClass })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx14("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "CP Umum" }),
            /* @__PURE__ */ jsx14("textarea", { name: "cpUmum", value: formData.cpUmum, onChange: handleChange, className: inputClass, rows: 3 })
          ] })
        ] }),
        /* @__PURE__ */ jsx14("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx14(
          "button",
          {
            onClick: onSubmit,
            disabled: isLoading,
            className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2",
            children: isLoading ? "Sedang Memproses..." : `Generate Dokumen 1-6 (${bundleCost} Poin)`
          }
        ) })
      ] });
    };
  }
});

// src/components/LessonPlanForm.tsx
import { useState as useState7, useEffect as useEffect4 } from "react";
import { Fragment as Fragment2, jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
var emptyForm, LessonPlanForm;
var init_LessonPlanForm = __esm({
  "src/components/LessonPlanForm.tsx"() {
    "use strict";
    init_constants();
    emptyForm = {
      provinsiKota: "",
      dinasPendidikan: "",
      satuanPendidikan: "SMP Negeri 3 Kerinci",
      alamatSekolah: "Jl. Lempur Tengah, Kec. Gunung Raya, Kab. Kerinci",
      singkatan: "",
      tahunPelajaran: "",
      alokasiWaktu: "",
      jpPerMinggu: "",
      durasiPertemuan: "",
      namaGuru: "",
      nipGuru: "",
      namaKepalaSekolah: "",
      nipKepalaSekolah: "",
      kotaTanggalTtd: "",
      elemenKode: "",
      cpUmum: "",
      cpPerElemen: "",
      kalenderPendidikan: "",
      rentangNilaiKktp: "",
      mataPelajaran: "",
      kelasFase: KELAS_OPTIONS[0],
      materi: "",
      jumlahPertemuan: JUMLAH_PERTEMUAN_OPTIONS[0],
      jamPelajaran: "",
      pesertaDidik: "",
      dimensiProfilLulusan: [],
      capaianPembelajaran: "",
      lintasDisiplinIlmu: "",
      tujuanPembelajaran: "",
      praktikPedagogis: PRAKTIK_PEDAGOGIS_OPTIONS[0],
      lingkunganPembelajaran: "",
      pemanfaatanDigital: "",
      kemitraanPembelajaran: ""
    };
    LessonPlanForm = ({ onSubmit, isLoading, points, sessionCosts, initialData, token, updatePoints }) => {
      const [step, setStep] = useState7(1);
      const [formData, setFormData] = useState7(emptyForm);
      const [customPraktik, setCustomPraktik] = useState7("");
      const [dynamicCost, setDynamicCost] = useState7(0);
      const [errors, setErrors] = useState7({});
      const [suggestions, setSuggestions] = useState7([]);
      const [selectedSuggestions, setSelectedSuggestions] = useState7([]);
      const [isSuggesting, setIsSuggesting] = useState7(false);
      const [suggestionError, setSuggestionError] = useState7(null);
      useEffect4(() => {
        const dataToSet = initialData || emptyForm;
        setFormData(dataToSet);
        const isCustom = !PRAKTIK_PEDAGOGIS_OPTIONS.includes(dataToSet.praktikPedagogis);
        if (isCustom) {
          setCustomPraktik(dataToSet.praktikPedagogis);
          setFormData((prev) => ({ ...prev, praktikPedagogis: PRAKTIK_PEDAGOGIS_LAINNYA }));
        } else {
          setCustomPraktik("");
        }
        setStep(1);
        setErrors({});
        setSuggestions([]);
        setSelectedSuggestions([]);
        setSuggestionError(null);
      }, [initialData]);
      useEffect4(() => {
        const numSessions = parseInt(formData.jumlahPertemuan) || 1;
        const costConfig = sessionCosts.find((sc) => sc.sessions === numSessions);
        const calculatedCost = costConfig ? costConfig.cost : 0;
        setDynamicCost(calculatedCost);
      }, [formData.jumlahPertemuan, sessionCosts]);
      const hasEnoughPoints = points >= dynamicCost;
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[e.target.name];
            return newErrors;
          });
        }
      };
      const handleCustomPraktikChange = (e) => {
        setCustomPraktik(e.target.value);
        if (errors.customPraktik) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.customPraktik;
            return newErrors;
          });
        }
      };
      const handleDimensionChange = (dimension) => {
        setFormData((prev) => {
          const newDimensions = prev.dimensiProfilLulusan.includes(dimension) ? prev.dimensiProfilLulusan.filter((d) => d !== dimension) : [...prev.dimensiProfilLulusan, dimension];
          return { ...prev, dimensiProfilLulusan: newDimensions };
        });
      };
      const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
      const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
      const validateStep = (stepToValidate) => {
        const newErrors = {};
        let isValid = true;
        if (stepToValidate === 1) {
          if (!formData.mataPelajaran.trim()) {
            newErrors.mataPelajaran = "Mata Pelajaran wajib diisi.";
            isValid = false;
          }
          if (!formData.materi.trim()) {
            newErrors.materi = "Materi wajib diisi.";
            isValid = false;
          }
          if (!formData.jamPelajaran.trim() || Number(formData.jamPelajaran) <= 0) {
            newErrors.jamPelajaran = "JP harus berupa angka positif.";
            isValid = false;
          }
        } else if (stepToValidate === 2) {
          if (!formData.tujuanPembelajaran.trim()) {
            newErrors.tujuanPembelajaran = "Tujuan Pembelajaran wajib diisi.";
            isValid = false;
          }
          if (formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA && !customPraktik.trim()) {
            newErrors.customPraktik = "Praktik Pedagogis kustom wajib diisi.";
            isValid = false;
          }
        }
        setErrors(newErrors);
        return isValid;
      };
      const handleNextClick = () => {
        if (validateStep(step)) {
          nextStep();
        }
      };
      const handleGetSuggestions = async () => {
        if (!formData.materi.trim() || !formData.mataPelajaran.trim()) {
          setSuggestionError("Mata Pelajaran dan Materi wajib diisi untuk mendapatkan saran.");
          return;
        }
        const SUGGESTION_COST = 5;
        if (points < SUGGESTION_COST) {
          setSuggestionError(`Poin tidak cukup. Fitur ini membutuhkan ${SUGGESTION_COST} poin.`);
          return;
        }
        if (!token) {
          setSuggestionError("Sesi tidak valid. Silakan muat ulang halaman.");
          return;
        }
        setIsSuggesting(true);
        setSuggestionError(null);
        setSuggestions([]);
        setSelectedSuggestions([]);
        try {
          const response = await fetch("/api/suggest/objectives", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              mataPelajaran: formData.mataPelajaran,
              kelasFase: formData.kelasFase,
              materi: formData.materi
            })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Gagal mengambil saran.");
          }
          if (data.newPoints !== void 0) {
            updatePoints(data.newPoints);
          }
          if (!data.suggestions || data.suggestions.length === 0) {
            setSuggestionError("AI tidak dapat memberikan saran untuk topik ini. Coba ubah input materi Anda.");
            return;
          }
          setSuggestions(data.suggestions);
        } catch (err) {
          setSuggestionError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.");
        } finally {
          setIsSuggesting(false);
        }
      };
      const handleSuggestionSelectionChange = (suggestion) => {
        setSelectedSuggestions(
          (prev) => prev.includes(suggestion) ? prev.filter((s) => s !== suggestion) : [...prev, suggestion]
        );
      };
      const handleAddSelectedSuggestions = () => {
        if (selectedSuggestions.length === 0) return;
        const newObjectives = selectedSuggestions.map((s) => s.trim()).join("\n");
        const existingText = formData.tujuanPembelajaran.trim();
        const newText = existingText ? `${existingText}
${newObjectives}` : newObjectives;
        setFormData((prev) => ({
          ...prev,
          tujuanPembelajaran: newText
        }));
        setSelectedSuggestions([]);
        setSuggestions([]);
        if (errors.tujuanPembelajaran) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.tujuanPembelajaran;
            return newErrors;
          });
        }
      };
      const handleFinalSubmit = () => {
        const isStep1Valid = validateStep(1);
        const isStep2Valid = validateStep(2);
        if (!isStep1Valid || !isStep2Valid) {
          if (!isStep1Valid) setStep(1);
          else if (!isStep2Valid) setStep(2);
          return;
        }
        if (!hasEnoughPoints) return;
        const dataToSubmit = { ...formData };
        if (formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA) {
          dataToSubmit.praktikPedagogis = customPraktik;
        }
        onSubmit(dataToSubmit);
      };
      const inputClass = "w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-800 disabled:opacity-50";
      const labelClass = "block mb-2 text-sm font-bold text-slate-800";
      const fieldSetClass = "space-y-4";
      const stepTitles = ["Identitas Dasar", "Desain Pembelajaran", "Detail Tambahan (Opsional)"];
      const errorTextClass = "text-red-600 text-sm mt-1 font-semibold";
      return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsx15("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxs13("h2", { className: "text-xl font-bold text-slate-800 mb-3", children: [
            "Langkah ",
            step,
            " dari 3: ",
            stepTitles[step - 1]
          ] }),
          /* @__PURE__ */ jsx15("div", { className: "flex w-full h-2 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx15("div", { style: { width: `${step / 3 * 100}%` }, className: "bg-gradient-to-r from-sky-600 to-emerald-600 transition-all duration-500 ease-in-out rounded-full" }) })
        ] }) }),
        /* @__PURE__ */ jsxs13("div", { className: "flex-grow overflow-y-auto pr-2", children: [
          step === 1 && /* @__PURE__ */ jsxs13("fieldset", { className: fieldSetClass, children: [
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx15("label", { htmlFor: "mataPelajaran", className: labelClass, children: "Mata Pelajaran" }),
              /* @__PURE__ */ jsx15("input", { type: "text", name: "mataPelajaran", id: "mataPelajaran", value: formData.mataPelajaran, onChange: handleChange, className: inputClass, placeholder: "cth: Bahasa Indonesia, Matematika" }),
              errors.mataPelajaran && /* @__PURE__ */ jsx15("p", { className: errorTextClass, children: errors.mataPelajaran })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx15("label", { htmlFor: "kelasFase", className: labelClass, children: "Kelas" }),
              /* @__PURE__ */ jsx15("select", { name: "kelasFase", id: "kelasFase", value: formData.kelasFase, onChange: handleChange, className: inputClass, children: KELAS_OPTIONS.map((opt) => /* @__PURE__ */ jsx15("option", { value: opt, children: opt }, opt)) })
            ] }),
            /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs13("div", { children: [
                /* @__PURE__ */ jsx15("label", { htmlFor: "jumlahPertemuan", className: labelClass, children: "Jumlah Pertemuan" }),
                /* @__PURE__ */ jsx15("select", { name: "jumlahPertemuan", id: "jumlahPertemuan", value: formData.jumlahPertemuan, onChange: handleChange, className: inputClass, children: JUMLAH_PERTEMUAN_OPTIONS.map((s) => /* @__PURE__ */ jsx15("option", { value: s, children: s }, s)) })
              ] }),
              /* @__PURE__ */ jsxs13("div", { children: [
                /* @__PURE__ */ jsx15("label", { htmlFor: "jamPelajaran", className: labelClass, children: "JP per Pertemuan" }),
                /* @__PURE__ */ jsx15("input", { type: "number", name: "jamPelajaran", id: "jamPelajaran", value: formData.jamPelajaran, onChange: handleChange, className: inputClass, placeholder: "cth: 2", min: "1" }),
                errors.jamPelajaran && /* @__PURE__ */ jsx15("p", { className: errorTextClass, children: errors.jamPelajaran })
              ] })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx15("label", { htmlFor: "materi", className: labelClass, children: "Materi Pembelajaran" }),
              /* @__PURE__ */ jsx15("input", { type: "text", name: "materi", id: "materi", value: formData.materi, onChange: handleChange, className: inputClass, placeholder: "Contoh: Bilangan Bulat (Materi bisa diambil dari TP)" }),
              /* @__PURE__ */ jsx15("p", { className: "text-xs text-slate-500 mt-1", children: "Topik spesifik yang akan diajarkan, biasanya berkaitan dengan Tujuan Pembelajaran." }),
              errors.materi && /* @__PURE__ */ jsx15("p", { className: errorTextClass, children: errors.materi })
            ] })
          ] }),
          step === 2 && /* @__PURE__ */ jsxs13("fieldset", { className: fieldSetClass, children: [
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx15("label", { className: labelClass, children: "Dimensi Profil Lulusan" }),
              /* @__PURE__ */ jsx15("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2", children: DIMENSI_PROFIL_LULUSAN.map((dim) => /* @__PURE__ */ jsxs13("label", { className: "flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-sky-700 transition-colors", children: [
                /* @__PURE__ */ jsx15(
                  "input",
                  {
                    type: "checkbox",
                    className: "h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500",
                    value: dim,
                    checked: formData.dimensiProfilLulusan.includes(dim),
                    onChange: () => handleDimensionChange(dim)
                  }
                ),
                /* @__PURE__ */ jsx15("span", { className: "text-sm font-medium", children: dim })
              ] }, dim)) })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "capaianPembelajaran", className: labelClass, children: [
                "Capaian Pembelajaran ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "capaianPembelajaran", id: "capaianPembelajaran", value: formData.capaianPembelajaran, onChange: handleChange, rows: 3, className: inputClass, placeholder: "Tuliskan capaian pembelajaran sesuai fase..." })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("div", { className: "flex justify-between items-center mb-2", children: [
                /* @__PURE__ */ jsx15("label", { htmlFor: "tujuanPembelajaran", className: labelClass, children: "Tujuan Pembelajaran" }),
                /* @__PURE__ */ jsx15(
                  "button",
                  {
                    type: "button",
                    onClick: handleGetSuggestions,
                    disabled: !formData.materi.trim() || !formData.mataPelajaran.trim() || isSuggesting,
                    className: "text-xs flex items-center gap-1 text-sky-400 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    "aria-label": "Dapatkan saran Tujuan Pembelajaran dari AI",
                    children: isSuggesting ? /* @__PURE__ */ jsxs13(Fragment2, { children: [
                      /* @__PURE__ */ jsxs13("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                        /* @__PURE__ */ jsx15("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx15("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                      ] }),
                      "Meminta..."
                    ] }) : /* @__PURE__ */ jsx15(Fragment2, { children: "\u2728 Dapatkan Saran AI (-5 Poin)" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "tujuanPembelajaran", id: "tujuanPembelajaran", value: formData.tujuanPembelajaran, onChange: handleChange, rows: 4, className: inputClass, placeholder: "Tuliskan tujuan pembelajaran atau klik dapatkan saran AI di atas..." }),
              errors.tujuanPembelajaran && /* @__PURE__ */ jsx15("p", { className: errorTextClass, children: errors.tujuanPembelajaran }),
              suggestionError && /* @__PURE__ */ jsx15("p", { className: `${errorTextClass} mt-2`, children: suggestionError }),
              suggestions.length > 0 && !isSuggesting && /* @__PURE__ */ jsxs13("div", { className: "mt-2 space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-lg", children: [
                /* @__PURE__ */ jsx15("p", { className: "text-sm font-semibold text-slate-800 mb-2", children: "Pilih satu atau lebih saran untuk ditambahkan:" }),
                /* @__PURE__ */ jsx15("div", { className: "space-y-2", children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsxs13("label", { className: "flex items-start p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-md text-slate-700 text-sm transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ jsx15(
                    "input",
                    {
                      type: "checkbox",
                      className: "h-4 w-4 rounded bg-white border-slate-300 text-sky-600 focus:ring-sky-500 mt-1 mr-3 flex-shrink-0",
                      checked: selectedSuggestions.includes(suggestion),
                      onChange: () => handleSuggestionSelectionChange(suggestion)
                    }
                  ),
                  /* @__PURE__ */ jsx15("span", { children: suggestion })
                ] }, index)) }),
                selectedSuggestions.length > 0 && /* @__PURE__ */ jsxs13(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddSelectedSuggestions,
                    className: "mt-3 w-full text-center p-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white font-semibold transition-colors",
                    children: [
                      "Tambahkan ",
                      selectedSuggestions.length,
                      " Tujuan Terpilih"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsx15("label", { htmlFor: "praktikPedagogis", className: labelClass, children: "Praktik Pedagogis" }),
              /* @__PURE__ */ jsx15("select", { name: "praktikPedagogis", id: "praktikPedagogis", value: formData.praktikPedagogis, onChange: handleChange, className: inputClass, children: PRAKTIK_PEDAGOGIS_OPTIONS.map((p) => /* @__PURE__ */ jsx15("option", { value: p, children: p }, p)) }),
              formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA && /* @__PURE__ */ jsxs13("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx15("label", { htmlFor: "customPraktik", className: labelClass, children: "Tuliskan Praktik Pedagogis Pilihan Anda" }),
                /* @__PURE__ */ jsx15(
                  "textarea",
                  {
                    id: "customPraktik",
                    name: "customPraktik",
                    value: customPraktik,
                    onChange: handleCustomPraktikChange,
                    className: inputClass,
                    rows: 2,
                    placeholder: "cth: Pembelajaran berbasis permainan (game-based learning)"
                  }
                ),
                errors.customPraktik && /* @__PURE__ */ jsx15("p", { className: errorTextClass, children: errors.customPraktik })
              ] })
            ] })
          ] }),
          step === 3 && /* @__PURE__ */ jsxs13("fieldset", { className: fieldSetClass, children: [
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "pesertaDidik", className: labelClass, children: [
                "Peserta Didik ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "pesertaDidik", id: "pesertaDidik", value: formData.pesertaDidik, onChange: handleChange, rows: 3, className: inputClass, placeholder: "Identifikasi kesiapan, minat, atau kebutuhan belajar peserta didik..." })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "lintasDisiplinIlmu", className: labelClass, children: [
                "Lintas Disiplin Ilmu ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("input", { type: "text", name: "lintasDisiplinIlmu", id: "lintasDisiplinIlmu", value: formData.lintasDisiplinIlmu, onChange: handleChange, className: inputClass, placeholder: "cth: Sosiologi, Ekonomi" })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "lingkunganPembelajaran", className: labelClass, children: [
                "Lingkungan Pembelajaran ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "lingkunganPembelajaran", id: "lingkunganPembelajaran", value: formData.lingkunganPembelajaran, onChange: handleChange, rows: 3, className: inputClass, placeholder: "Jelaskan budaya belajar atau ruang fisik/virtual yang diinginkan..." })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "pemanfaatanDigital", className: labelClass, children: [
                "Pemanfaatan Digital ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "pemanfaatanDigital", id: "pemanfaatanDigital", value: formData.pemanfaatanDigital, onChange: handleChange, rows: 3, className: inputClass, placeholder: "cth: Video pembelajaran, platform, perpustakaan digital..." })
            ] }),
            /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("label", { htmlFor: "kemitraanPembelajaran", className: labelClass, children: [
                "Kemitraan Pembelajaran ",
                /* @__PURE__ */ jsx15("span", { className: "text-slate-500 font-normal", children: "(Opsional)" })
              ] }),
              /* @__PURE__ */ jsx15("textarea", { name: "kemitraanPembelajaran", id: "kemitraanPembelajaran", value: formData.kemitraanPembelajaran, onChange: handleChange, rows: 3, className: inputClass, placeholder: "cth: Kolaborasi dengan guru mapel lain, orang tua, komunitas..." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "flex-shrink-0 mt-auto pt-6 border-t border-slate-700", children: [
          step === 3 && !isLoading && /* @__PURE__ */ jsx15("div", { className: "text-center mb-4", children: !hasEnoughPoints && dynamicCost > 0 && /* @__PURE__ */ jsxs13("p", { className: "text-red-400 text-sm", children: [
            "Poin Anda tidak cukup (butuh ",
            dynamicCost,
            " poin)."
          ] }) }),
          /* @__PURE__ */ jsxs13("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx15(
              "button",
              {
                type: "button",
                onClick: prevStep,
                disabled: isLoading || step === 1,
                className: "bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                children: "Kembali"
              }
            ),
            step < 3 ? /* @__PURE__ */ jsx15(
              "button",
              {
                type: "button",
                onClick: handleNextClick,
                disabled: isLoading,
                className: "bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg",
                children: "Selanjutnya"
              }
            ) : /* @__PURE__ */ jsx15(
              "button",
              {
                type: "button",
                onClick: handleFinalSubmit,
                disabled: isLoading || !hasEnoughPoints || dynamicCost === 0,
                className: "bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg",
                children: isLoading ? /* @__PURE__ */ jsxs13(Fragment2, { children: [
                  /* @__PURE__ */ jsxs13("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsx15("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                    /* @__PURE__ */ jsx15("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                  ] }),
                  "Memproses..."
                ] }) : `Buat Modul Ajar (${dynamicCost > 0 ? `${dynamicCost} Poin` : "..."})`
              }
            )
          ] })
        ] })
      ] });
    };
  }
});

// src/components/LessonPlanDisplay.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
var LessonPlanDisplay;
var init_LessonPlanDisplay = __esm({
  "src/components/LessonPlanDisplay.tsx"() {
    "use strict";
    LessonPlanDisplay = ({ htmlContent }) => {
      return /* @__PURE__ */ jsx16(
        "div",
        {
          className: "prose prose-sm sm:prose-base max-w-none text-black h-full overflow-y-auto pr-2 print-content-body",
          dangerouslySetInnerHTML: { __html: htmlContent }
        }
      );
    };
  }
});

// src/components/LessonPlanEditor.tsx
import { useRef, useEffect as useEffect5 } from "react";
import { jsx as jsx17 } from "react/jsx-runtime";
var LessonPlanEditor;
var init_LessonPlanEditor = __esm({
  "src/components/LessonPlanEditor.tsx"() {
    "use strict";
    LessonPlanEditor = ({ html, onChange }) => {
      const editorRef = useRef(null);
      useEffect5(() => {
        if (editorRef.current && editorRef.current.innerHTML !== html) {
          editorRef.current.innerHTML = html;
        }
      }, [html]);
      const handleInput = () => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      return /* @__PURE__ */ jsx17(
        "div",
        {
          ref: editorRef,
          contentEditable: true,
          onInput: handleInput,
          className: "prose prose-sm sm:prose-base max-w-none text-black h-full overflow-y-auto pr-2 outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md p-2 -m-2",
          dangerouslySetInnerHTML: { __html: html },
          suppressContentEditableWarning: true
        }
      );
    };
  }
});

// node_modules/@firebase/util/dist/postinstall.mjs
var getDefaultsFromPostinstall;
var init_postinstall = __esm({
  "node_modules/@firebase/util/dist/postinstall.mjs"() {
    getDefaultsFromPostinstall = () => void 0;
  }
});

// node_modules/@firebase/util/dist/index.esm.js
function getGlobal() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
}
function getUA() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
}
function isMobileCordova() {
  return typeof window !== "undefined" && // @ts-ignore Setting up an broadly applicable index signature for Window
  // just to deal with this case would probably be a bad idea.
  !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
}
function isCloudflareWorker() {
  return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
}
function isBrowserExtension() {
  const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
  return typeof runtime === "object" && runtime.id !== void 0;
}
function isReactNative() {
  return typeof navigator === "object" && navigator["product"] === "ReactNative";
}
function isIE() {
  const ua = getUA();
  return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
}
function isIndexedDBAvailable() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
}
function validateIndexedDBOpenable() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        reject(request.error?.message || "");
      };
    } catch (error) {
      reject(error);
    }
  });
}
function replaceTemplate(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
}
function isEmpty(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
}
function isObject(thing) {
  return thing !== null && typeof thing === "object";
}
function querystring(querystringParams) {
  const params = [];
  for (const [key, value] of Object.entries(querystringParams)) {
    if (Array.isArray(value)) {
      value.forEach((arrayVal) => {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
      });
    } else {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return params.length ? "&" + params.join("&") : "";
}
function querystringDecode(querystring2) {
  const obj = {};
  const tokens = querystring2.replace(/^\?/, "").split("&");
  tokens.forEach((token) => {
    if (token) {
      const [key, value] = token.split("=");
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return obj;
}
function extractQuerystring(url) {
  const queryStart = url.indexOf("?");
  if (!queryStart) {
    return "";
  }
  const fragmentStart = url.indexOf("#", queryStart);
  return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
}
function createSubscribe(executor, onNoObservers) {
  const proxy = new ObserverProxy(executor, onNoObservers);
  return proxy.subscribe.bind(proxy);
}
function implementsAnyMethods(obj, methods) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (const method of methods) {
    if (method in obj && typeof obj[method] === "function") {
      return true;
    }
  }
  return false;
}
function noop() {
}
function getModularInstance(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
}
function isCloudWorkstation(url) {
  try {
    const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
    return host.endsWith(".cloudworkstations.dev");
  } catch {
    return false;
  }
}
async function pingServer(endpoint) {
  const result = await fetch(endpoint, {
    credentials: "include"
  });
  return result.ok;
}
var stringToByteArray$1, byteArrayToString, base64, DecodeBase64StringError, base64Encode, base64urlEncodeWithoutPadding, base64Decode, getDefaultsFromGlobal, getDefaultsFromEnvVariable, getDefaultsFromCookie, getDefaults, getDefaultEmulatorHost, getDefaultAppConfig, getExperimentalSetting, Deferred, ERROR_NAME, FirebaseError, ErrorFactory, PATTERN, ObserverProxy, MAX_VALUE_MILLIS;
var init_index_esm = __esm({
  "node_modules/@firebase/util/dist/index.esm.js"() {
    init_postinstall();
    stringToByteArray$1 = function(str) {
      const out = [];
      let p = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
          out[p++] = c;
        } else if (c < 2048) {
          out[p++] = c >> 6 | 192;
          out[p++] = c & 63 | 128;
        } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
          c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
          out[p++] = c >> 18 | 240;
          out[p++] = c >> 12 & 63 | 128;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        } else {
          out[p++] = c >> 12 | 224;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        }
      }
      return out;
    };
    byteArrayToString = function(bytes) {
      const out = [];
      let pos = 0, c = 0;
      while (pos < bytes.length) {
        const c1 = bytes[pos++];
        if (c1 < 128) {
          out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
          const c2 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
          const c2 = bytes[pos++];
          const c3 = bytes[pos++];
          const c4 = bytes[pos++];
          const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
          out[c++] = String.fromCharCode(55296 + (u >> 10));
          out[c++] = String.fromCharCode(56320 + (u & 1023));
        } else {
          const c2 = bytes[pos++];
          const c3 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
      }
      return out.join("");
    };
    base64 = {
      /**
       * Maps bytes to characters.
       */
      byteToCharMap_: null,
      /**
       * Maps characters to bytes.
       */
      charToByteMap_: null,
      /**
       * Maps bytes to websafe characters.
       * @private
       */
      byteToCharMapWebSafe_: null,
      /**
       * Maps websafe characters to bytes.
       * @private
       */
      charToByteMapWebSafe_: null,
      /**
       * Our default alphabet, shared between
       * ENCODED_VALS and ENCODED_VALS_WEBSAFE
       */
      ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      /**
       * Our default alphabet. Value 64 (=) is special; it means "nothing."
       */
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/=";
      },
      /**
       * Our websafe alphabet.
       */
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_.";
      },
      /**
       * Whether this browser supports the atob and btoa functions. This extension
       * started at Mozilla but is now implemented by many browsers. We use the
       * ASSUME_* variables to avoid pulling in the full useragent detection library
       * but still allowing the standard per-browser compilations.
       *
       */
      HAS_NATIVE_SUPPORT: typeof atob === "function",
      /**
       * Base64-encode an array of bytes.
       *
       * @param input An array of bytes (numbers with
       *     value in [0, 255]) to encode.
       * @param webSafe Boolean indicating we should use the
       *     alternative alphabet.
       * @return The base64 encoded string.
       */
      encodeByteArray(input, webSafe) {
        if (!Array.isArray(input)) {
          throw Error("encodeByteArray takes an array as a parameter");
        }
        this.init_();
        const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
        const output = [];
        for (let i = 0; i < input.length; i += 3) {
          const byte1 = input[i];
          const haveByte2 = i + 1 < input.length;
          const byte2 = haveByte2 ? input[i + 1] : 0;
          const haveByte3 = i + 2 < input.length;
          const byte3 = haveByte3 ? input[i + 2] : 0;
          const outByte1 = byte1 >> 2;
          const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
          let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
          let outByte4 = byte3 & 63;
          if (!haveByte3) {
            outByte4 = 64;
            if (!haveByte2) {
              outByte3 = 64;
            }
          }
          output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join("");
      },
      /**
       * Base64-encode a string.
       *
       * @param input A string to encode.
       * @param webSafe If true, we should use the
       *     alternative alphabet.
       * @return The base64 encoded string.
       */
      encodeString(input, webSafe) {
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
          return btoa(input);
        }
        return this.encodeByteArray(stringToByteArray$1(input), webSafe);
      },
      /**
       * Base64-decode a string.
       *
       * @param input to decode.
       * @param webSafe True if we should use the
       *     alternative alphabet.
       * @return string representing the decoded value.
       */
      decodeString(input, webSafe) {
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
          return atob(input);
        }
        return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
      },
      /**
       * Base64-decode a string.
       *
       * In base-64 decoding, groups of four characters are converted into three
       * bytes.  If the encoder did not apply padding, the input length may not
       * be a multiple of 4.
       *
       * In this case, the last group will have fewer than 4 characters, and
       * padding will be inferred.  If the group has one or two characters, it decodes
       * to one byte.  If the group has three characters, it decodes to two bytes.
       *
       * @param input Input to decode.
       * @param webSafe True if we should use the web-safe alphabet.
       * @return bytes representing the decoded value.
       */
      decodeStringToByteArray(input, webSafe) {
        this.init_();
        const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
        const output = [];
        for (let i = 0; i < input.length; ) {
          const byte1 = charToByteMap[input.charAt(i++)];
          const haveByte2 = i < input.length;
          const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
          ++i;
          const haveByte3 = i < input.length;
          const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
          ++i;
          const haveByte4 = i < input.length;
          const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
          ++i;
          if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
            throw new DecodeBase64StringError();
          }
          const outByte1 = byte1 << 2 | byte2 >> 4;
          output.push(outByte1);
          if (byte3 !== 64) {
            const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
            output.push(outByte2);
            if (byte4 !== 64) {
              const outByte3 = byte3 << 6 & 192 | byte4;
              output.push(outByte3);
            }
          }
        }
        return output;
      },
      /**
       * Lazy static initialization function. Called before
       * accessing any of the static map variables.
       * @private
       */
      init_() {
        if (!this.byteToCharMap_) {
          this.byteToCharMap_ = {};
          this.charToByteMap_ = {};
          this.byteToCharMapWebSafe_ = {};
          this.charToByteMapWebSafe_ = {};
          for (let i = 0; i < this.ENCODED_VALS.length; i++) {
            this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
            this.charToByteMap_[this.byteToCharMap_[i]] = i;
            this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
            this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
            if (i >= this.ENCODED_VALS_BASE.length) {
              this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
              this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
            }
          }
        }
      }
    };
    DecodeBase64StringError = class extends Error {
      constructor() {
        super(...arguments);
        this.name = "DecodeBase64StringError";
      }
    };
    base64Encode = function(str) {
      const utf8Bytes = stringToByteArray$1(str);
      return base64.encodeByteArray(utf8Bytes, true);
    };
    base64urlEncodeWithoutPadding = function(str) {
      return base64Encode(str).replace(/\./g, "");
    };
    base64Decode = function(str) {
      try {
        return base64.decodeString(str, true);
      } catch (e) {
        console.error("base64Decode failed: ", e);
      }
      return null;
    };
    getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
    getDefaultsFromEnvVariable = () => {
      if (typeof process === "undefined" || typeof process.env === "undefined") {
        return;
      }
      const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
      if (defaultsJsonString) {
        return JSON.parse(defaultsJsonString);
      }
    };
    getDefaultsFromCookie = () => {
      if (typeof document === "undefined") {
        return;
      }
      let match;
      try {
        match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
      } catch (e) {
        return;
      }
      const decoded = match && base64Decode(match[1]);
      return decoded && JSON.parse(decoded);
    };
    getDefaults = () => {
      try {
        return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
      } catch (e) {
        console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
        return;
      }
    };
    getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
    getDefaultAppConfig = () => getDefaults()?.config;
    getExperimentalSetting = (name4) => getDefaults()?.[`_${name4}`];
    Deferred = class {
      constructor() {
        this.reject = () => {
        };
        this.resolve = () => {
        };
        this.promise = new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      }
      /**
       * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
       * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
       * and returns a node-style callback which will resolve or reject the Deferred's promise.
       */
      wrapCallback(callback) {
        return (error, value) => {
          if (error) {
            this.reject(error);
          } else {
            this.resolve(value);
          }
          if (typeof callback === "function") {
            this.promise.catch(() => {
            });
            if (callback.length === 1) {
              callback(error);
            } else {
              callback(error, value);
            }
          }
        };
      }
    };
    ERROR_NAME = "FirebaseError";
    FirebaseError = class _FirebaseError extends Error {
      constructor(code, message, customData) {
        super(message);
        this.code = code;
        this.customData = customData;
        this.name = ERROR_NAME;
        Object.setPrototypeOf(this, _FirebaseError.prototype);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ErrorFactory.prototype.create);
        }
      }
    };
    ErrorFactory = class {
      constructor(service, serviceName, errors) {
        this.service = service;
        this.serviceName = serviceName;
        this.errors = errors;
      }
      create(code, ...data) {
        const customData = data[0] || {};
        const fullCode = `${this.service}/${code}`;
        const template = this.errors[code];
        const message = template ? replaceTemplate(template, customData) : "Error";
        const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
        const error = new FirebaseError(fullCode, fullMessage, customData);
        return error;
      }
    };
    PATTERN = /\{\$([^}]+)}/g;
    ObserverProxy = class {
      /**
       * @param executor Function which can make calls to a single Observer
       *     as a proxy.
       * @param onNoObservers Callback when count of Observers goes to zero.
       */
      constructor(executor, onNoObservers) {
        this.observers = [];
        this.unsubscribes = [];
        this.observerCount = 0;
        this.task = Promise.resolve();
        this.finalized = false;
        this.onNoObservers = onNoObservers;
        this.task.then(() => {
          executor(this);
        }).catch((e) => {
          this.error(e);
        });
      }
      next(value) {
        this.forEachObserver((observer) => {
          observer.next(value);
        });
      }
      error(error) {
        this.forEachObserver((observer) => {
          observer.error(error);
        });
        this.close(error);
      }
      complete() {
        this.forEachObserver((observer) => {
          observer.complete();
        });
        this.close();
      }
      /**
       * Subscribe function that can be used to add an Observer to the fan-out list.
       *
       * - We require that no event is sent to a subscriber synchronously to their
       *   call to subscribe().
       */
      subscribe(nextOrObserver, error, complete) {
        let observer;
        if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
          throw new Error("Missing Observer.");
        }
        if (implementsAnyMethods(nextOrObserver, [
          "next",
          "error",
          "complete"
        ])) {
          observer = nextOrObserver;
        } else {
          observer = {
            next: nextOrObserver,
            error,
            complete
          };
        }
        if (observer.next === void 0) {
          observer.next = noop;
        }
        if (observer.error === void 0) {
          observer.error = noop;
        }
        if (observer.complete === void 0) {
          observer.complete = noop;
        }
        const unsub = this.unsubscribeOne.bind(this, this.observers.length);
        if (this.finalized) {
          this.task.then(() => {
            try {
              if (this.finalError) {
                observer.error(this.finalError);
              } else {
                observer.complete();
              }
            } catch (e) {
            }
            return;
          });
        }
        this.observers.push(observer);
        return unsub;
      }
      // Unsubscribe is synchronous - we guarantee that no events are sent to
      // any unsubscribed Observer.
      unsubscribeOne(i) {
        if (this.observers === void 0 || this.observers[i] === void 0) {
          return;
        }
        delete this.observers[i];
        this.observerCount -= 1;
        if (this.observerCount === 0 && this.onNoObservers !== void 0) {
          this.onNoObservers(this);
        }
      }
      forEachObserver(fn) {
        if (this.finalized) {
          return;
        }
        for (let i = 0; i < this.observers.length; i++) {
          this.sendOne(i, fn);
        }
      }
      // Call the Observer via one of it's callback function. We are careful to
      // confirm that the observe has not been unsubscribed since this asynchronous
      // function had been queued.
      sendOne(i, fn) {
        this.task.then(() => {
          if (this.observers !== void 0 && this.observers[i] !== void 0) {
            try {
              fn(this.observers[i]);
            } catch (e) {
              if (typeof console !== "undefined" && console.error) {
                console.error(e);
              }
            }
          }
        });
      }
      close(err) {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        if (err !== void 0) {
          this.finalError = err;
        }
        this.task.then(() => {
          this.observers = void 0;
          this.onNoObservers = void 0;
        });
      }
    };
    MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
  }
});

// node_modules/@firebase/component/dist/esm/index.esm.js
function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
}
function isComponentEager(component) {
  return component.instantiationMode === "EAGER";
}
var Component, DEFAULT_ENTRY_NAME, Provider, ComponentContainer;
var init_index_esm2 = __esm({
  "node_modules/@firebase/component/dist/esm/index.esm.js"() {
    init_index_esm();
    Component = class {
      /**
       *
       * @param name The public service name, e.g. app, auth, firestore, database
       * @param instanceFactory Service factory responsible for creating the public interface
       * @param type whether the service provided by the component is public or private
       */
      constructor(name4, instanceFactory, type) {
        this.name = name4;
        this.instanceFactory = instanceFactory;
        this.type = type;
        this.multipleInstances = false;
        this.serviceProps = {};
        this.instantiationMode = "LAZY";
        this.onInstanceCreated = null;
      }
      setInstantiationMode(mode) {
        this.instantiationMode = mode;
        return this;
      }
      setMultipleInstances(multipleInstances) {
        this.multipleInstances = multipleInstances;
        return this;
      }
      setServiceProps(props) {
        this.serviceProps = props;
        return this;
      }
      setInstanceCreatedCallback(callback) {
        this.onInstanceCreated = callback;
        return this;
      }
    };
    DEFAULT_ENTRY_NAME = "[DEFAULT]";
    Provider = class {
      constructor(name4, container) {
        this.name = name4;
        this.container = container;
        this.component = null;
        this.instances = /* @__PURE__ */ new Map();
        this.instancesDeferred = /* @__PURE__ */ new Map();
        this.instancesOptions = /* @__PURE__ */ new Map();
        this.onInitCallbacks = /* @__PURE__ */ new Map();
      }
      /**
       * @param identifier A provider can provide multiple instances of a service
       * if this.component.multipleInstances is true.
       */
      get(identifier) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        if (!this.instancesDeferred.has(normalizedIdentifier)) {
          const deferred = new Deferred();
          this.instancesDeferred.set(normalizedIdentifier, deferred);
          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              if (instance) {
                deferred.resolve(instance);
              }
            } catch (e) {
            }
          }
        }
        return this.instancesDeferred.get(normalizedIdentifier).promise;
      }
      getImmediate(options) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
        const optional = options?.optional ?? false;
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            return this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
          } catch (e) {
            if (optional) {
              return null;
            } else {
              throw e;
            }
          }
        } else {
          if (optional) {
            return null;
          } else {
            throw Error(`Service ${this.name} is not available`);
          }
        }
      }
      getComponent() {
        return this.component;
      }
      setComponent(component) {
        if (component.name !== this.name) {
          throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
        }
        if (this.component) {
          throw Error(`Component for ${this.name} has already been provided`);
        }
        this.component = component;
        if (!this.shouldAutoInitialize()) {
          return;
        }
        if (isComponentEager(component)) {
          try {
            this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
          } catch (e) {
          }
        }
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            instanceDeferred.resolve(instance);
          } catch (e) {
          }
        }
      }
      clearInstance(identifier = DEFAULT_ENTRY_NAME) {
        this.instancesDeferred.delete(identifier);
        this.instancesOptions.delete(identifier);
        this.instances.delete(identifier);
      }
      // app.delete() will call this method on every provider to delete the services
      // TODO: should we mark the provider as deleted?
      async delete() {
        const services = Array.from(this.instances.values());
        await Promise.all([
          ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
          ...services.filter((service) => "_delete" in service).map((service) => service._delete())
        ]);
      }
      isComponentSet() {
        return this.component != null;
      }
      isInitialized(identifier = DEFAULT_ENTRY_NAME) {
        return this.instances.has(identifier);
      }
      getOptions(identifier = DEFAULT_ENTRY_NAME) {
        return this.instancesOptions.get(identifier) || {};
      }
      initialize(opts = {}) {
        const { options = {} } = opts;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
        if (this.isInitialized(normalizedIdentifier)) {
          throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
        }
        if (!this.isComponentSet()) {
          throw Error(`Component ${this.name} has not been registered yet`);
        }
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier,
          options
        });
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
          const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
          if (normalizedIdentifier === normalizedDeferredIdentifier) {
            instanceDeferred.resolve(instance);
          }
        }
        return instance;
      }
      /**
       *
       * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
       * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
       *
       * @param identifier An optional instance identifier
       * @returns a function to unregister the callback
       */
      onInit(callback, identifier) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
        existingCallbacks.add(callback);
        this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
        const existingInstance = this.instances.get(normalizedIdentifier);
        if (existingInstance) {
          callback(existingInstance, normalizedIdentifier);
        }
        return () => {
          existingCallbacks.delete(callback);
        };
      }
      /**
       * Invoke onInit callbacks synchronously
       * @param instance the service instance`
       */
      invokeOnInitCallbacks(instance, identifier) {
        const callbacks = this.onInitCallbacks.get(identifier);
        if (!callbacks) {
          return;
        }
        for (const callback of callbacks) {
          try {
            callback(instance, identifier);
          } catch {
          }
        }
      }
      getOrInitializeService({ instanceIdentifier, options = {} }) {
        let instance = this.instances.get(instanceIdentifier);
        if (!instance && this.component) {
          instance = this.component.instanceFactory(this.container, {
            instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
            options
          });
          this.instances.set(instanceIdentifier, instance);
          this.instancesOptions.set(instanceIdentifier, options);
          this.invokeOnInitCallbacks(instance, instanceIdentifier);
          if (this.component.onInstanceCreated) {
            try {
              this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
            } catch {
            }
          }
        }
        return instance || null;
      }
      normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
        if (this.component) {
          return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
        } else {
          return identifier;
        }
      }
      shouldAutoInitialize() {
        return !!this.component && this.component.instantiationMode !== "EXPLICIT";
      }
    };
    ComponentContainer = class {
      constructor(name4) {
        this.name = name4;
        this.providers = /* @__PURE__ */ new Map();
      }
      /**
       *
       * @param component Component being added
       * @param overwrite When a component with the same name has already been registered,
       * if overwrite is true: overwrite the existing component with the new component and create a new
       * provider with the new component. It can be useful in tests where you want to use different mocks
       * for different tests.
       * if overwrite is false: throw an exception
       */
      addComponent(component) {
        const provider2 = this.getProvider(component.name);
        if (provider2.isComponentSet()) {
          throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
        }
        provider2.setComponent(component);
      }
      addOrOverwriteComponent(component) {
        const provider2 = this.getProvider(component.name);
        if (provider2.isComponentSet()) {
          this.providers.delete(component.name);
        }
        this.addComponent(component);
      }
      /**
       * getProvider provides a type safe interface where it can only be called with a field name
       * present in NameServiceMapping interface.
       *
       * Firebase SDKs providing services should extend NameServiceMapping interface to register
       * themselves.
       */
      getProvider(name4) {
        if (this.providers.has(name4)) {
          return this.providers.get(name4);
        }
        const provider2 = new Provider(name4, this);
        this.providers.set(name4, provider2);
        return provider2;
      }
      getProviders() {
        return Array.from(this.providers.values());
      }
    };
  }
});

// node_modules/@firebase/logger/dist/esm/index.esm.js
var instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler, Logger;
var init_index_esm3 = __esm({
  "node_modules/@firebase/logger/dist/esm/index.esm.js"() {
    instances = [];
    (function(LogLevel2) {
      LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
      LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
      LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
      LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
      LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
      LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
    })(LogLevel || (LogLevel = {}));
    levelStringToEnum = {
      "debug": LogLevel.DEBUG,
      "verbose": LogLevel.VERBOSE,
      "info": LogLevel.INFO,
      "warn": LogLevel.WARN,
      "error": LogLevel.ERROR,
      "silent": LogLevel.SILENT
    };
    defaultLogLevel = LogLevel.INFO;
    ConsoleMethod = {
      [LogLevel.DEBUG]: "log",
      [LogLevel.VERBOSE]: "log",
      [LogLevel.INFO]: "info",
      [LogLevel.WARN]: "warn",
      [LogLevel.ERROR]: "error"
    };
    defaultLogHandler = (instance, logType, ...args) => {
      if (logType < instance.logLevel) {
        return;
      }
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const method = ConsoleMethod[logType];
      if (method) {
        console[method](`[${now}]  ${instance.name}:`, ...args);
      } else {
        throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
      }
    };
    Logger = class {
      /**
       * Gives you an instance of a Logger to capture messages according to
       * Firebase's logging scheme.
       *
       * @param name The name that the logs will be associated with
       */
      constructor(name4) {
        this.name = name4;
        this._logLevel = defaultLogLevel;
        this._logHandler = defaultLogHandler;
        this._userLogHandler = null;
        instances.push(this);
      }
      get logLevel() {
        return this._logLevel;
      }
      set logLevel(val) {
        if (!(val in LogLevel)) {
          throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
        }
        this._logLevel = val;
      }
      // Workaround for setter/getter having to be the same type.
      setLogLevel(val) {
        this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
      }
      get logHandler() {
        return this._logHandler;
      }
      set logHandler(val) {
        if (typeof val !== "function") {
          throw new TypeError("Value assigned to `logHandler` must be a function");
        }
        this._logHandler = val;
      }
      get userLogHandler() {
        return this._userLogHandler;
      }
      set userLogHandler(val) {
        this._userLogHandler = val;
      }
      /**
       * The functions below are all based on the `console` interface
       */
      debug(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
        this._logHandler(this, LogLevel.DEBUG, ...args);
      }
      log(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
        this._logHandler(this, LogLevel.VERBOSE, ...args);
      }
      info(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
        this._logHandler(this, LogLevel.INFO, ...args);
      }
      warn(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
        this._logHandler(this, LogLevel.WARN, ...args);
      }
      error(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
        this._logHandler(this, LogLevel.ERROR, ...args);
      }
    };
  }
});

// node_modules/idb/build/wrap-idb-value.js
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var instanceOfAny, idbProxyableTypes, cursorAdvanceMethods, cursorRequestMap, transactionDoneMap, transactionStoreNamesMap, transformCache, reverseTransformCache, idbProxyTraps, unwrap;
var init_wrap_idb_value = __esm({
  "node_modules/idb/build/wrap-idb-value.js"() {
    instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
    cursorRequestMap = /* @__PURE__ */ new WeakMap();
    transactionDoneMap = /* @__PURE__ */ new WeakMap();
    transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
    transformCache = /* @__PURE__ */ new WeakMap();
    reverseTransformCache = /* @__PURE__ */ new WeakMap();
    idbProxyTraps = {
      get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
          if (prop === "done")
            return transactionDoneMap.get(target);
          if (prop === "objectStoreNames") {
            return target.objectStoreNames || transactionStoreNamesMap.get(target);
          }
          if (prop === "store") {
            return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
          }
        }
        return wrap(target[prop]);
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
      has(target, prop) {
        if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
          return true;
        }
        return prop in target;
      }
    };
    unwrap = (value) => reverseTransformCache.get(value);
  }
});

// node_modules/idb/build/index.js
function openDB(name4, version4, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name4, version4);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
var readMethods, writeMethods, cachedMethods;
var init_build = __esm({
  "node_modules/idb/build/index.js"() {
    init_wrap_idb_value();
    init_wrap_idb_value();
    readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
    writeMethods = ["put", "add", "delete", "clear"];
    cachedMethods = /* @__PURE__ */ new Map();
    replaceTraps((oldTraps) => ({
      ...oldTraps,
      get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
      has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
    }));
  }
});

// node_modules/@firebase/app/dist/esm/index.esm.js
function isVersionServiceProvider(provider2) {
  const component = provider2.getComponent();
  return component?.type === "VERSION";
}
function _addComponent(app2, component) {
  try {
    app2.container.addComponent(component);
  } catch (e) {
    logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
  }
}
function _registerComponent(component) {
  const componentName = component.name;
  if (_components.has(componentName)) {
    logger.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component);
  for (const app2 of _apps.values()) {
    _addComponent(app2, component);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component);
  }
  return true;
}
function _getProvider(app2, name4) {
  const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    void heartbeatController.triggerHeartbeat();
  }
  return app2.container.getProvider(name4);
}
function _isFirebaseServerApp(obj) {
  if (obj === null || obj === void 0) {
    return false;
  }
  return obj.settings !== void 0;
}
function initializeApp(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name5 = rawConfig;
    rawConfig = { name: name5 };
  }
  const config = {
    name: DEFAULT_ENTRY_NAME2,
    automaticDataCollectionEnabled: true,
    ...rawConfig
  };
  const name4 = config.name;
  if (typeof name4 !== "string" || !name4) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name4)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  }
  const existingApp = _apps.get(name4);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name4 });
    }
  }
  const container = new ComponentContainer(name4);
  for (const component of _components.values()) {
    container.addComponent(component);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name4, newApp);
  return newApp;
}
function getApp(name4 = DEFAULT_ENTRY_NAME2) {
  const app2 = _apps.get(name4);
  if (!app2 && name4 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app2) {
    throw ERROR_FACTORY.create("no-app", { appName: name4 });
  }
  return app2;
}
function registerVersion(libraryKeyOrName, version4, variant) {
  let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version4.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version4}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version4}" contains illegal characters (whitespace or "/")`);
    }
    logger.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(
    `${library}-version`,
    () => ({ library, version: version4 }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db2, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db2.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app2) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e?.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app2));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e?.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
function computeKey(app2) {
  return `${app2.name}!${app2.options.appId}`;
}
function getUTCDateString() {
  const today = /* @__PURE__ */ new Date();
  return today.toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
}
function countBytes(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
  ).length;
}
function getEarliestHeartbeatIdx(heartbeats) {
  if (heartbeats.length === 0) {
    return -1;
  }
  let earliestHeartbeatIdx = 0;
  let earliestHeartbeatDate = heartbeats[0].date;
  for (let i = 1; i < heartbeats.length; i++) {
    if (heartbeats[i].date < earliestHeartbeatDate) {
      earliestHeartbeatDate = heartbeats[i].date;
      earliestHeartbeatIdx = i;
    }
  }
  return earliestHeartbeatIdx;
}
function registerCoreComponents(variant) {
  _registerComponent(new Component(
    "platform-logger",
    (container) => new PlatformLoggerServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  _registerComponent(new Component(
    "heartbeat",
    (container) => new HeartbeatServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  registerVersion(name$q, version$1, variant);
  registerVersion(name$q, version$1, "esm2020");
  registerVersion("fire-js", "");
}
var PlatformLoggerServiceImpl, name$q, version$1, logger, name$p, name$o, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, version, DEFAULT_ENTRY_NAME2, PLATFORM_LOG_STRING, _apps, _serverApps, _components, ERRORS, ERROR_FACTORY, FirebaseAppImpl, SDK_VERSION, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, MAX_NUM_STORED_HEARTBEATS, HeartbeatServiceImpl, HeartbeatStorageImpl;
var init_index_esm4 = __esm({
  "node_modules/@firebase/app/dist/esm/index.esm.js"() {
    init_index_esm2();
    init_index_esm3();
    init_index_esm();
    init_index_esm();
    init_build();
    PlatformLoggerServiceImpl = class {
      constructor(container) {
        this.container = container;
      }
      // In initial implementation, this will be called by installations on
      // auth token refresh, and installations will send this string.
      getPlatformInfoString() {
        const providers = this.container.getProviders();
        return providers.map((provider2) => {
          if (isVersionServiceProvider(provider2)) {
            const service = provider2.getImmediate();
            return `${service.library}/${service.version}`;
          } else {
            return null;
          }
        }).filter((logString) => logString).join(" ");
      }
    };
    name$q = "@firebase/app";
    version$1 = "0.15.0";
    logger = new Logger("@firebase/app");
    name$p = "@firebase/app-compat";
    name$o = "@firebase/analytics-compat";
    name$n = "@firebase/analytics";
    name$m = "@firebase/app-check-compat";
    name$l = "@firebase/app-check";
    name$k = "@firebase/auth";
    name$j = "@firebase/auth-compat";
    name$i = "@firebase/database";
    name$h = "@firebase/data-connect";
    name$g = "@firebase/database-compat";
    name$f = "@firebase/functions";
    name$e = "@firebase/functions-compat";
    name$d = "@firebase/installations";
    name$c = "@firebase/installations-compat";
    name$b = "@firebase/messaging";
    name$a = "@firebase/messaging-compat";
    name$9 = "@firebase/performance";
    name$8 = "@firebase/performance-compat";
    name$7 = "@firebase/remote-config";
    name$6 = "@firebase/remote-config-compat";
    name$5 = "@firebase/storage";
    name$4 = "@firebase/storage-compat";
    name$3 = "@firebase/firestore";
    name$2 = "@firebase/ai";
    name$1 = "@firebase/firestore-compat";
    name = "firebase";
    version = "12.15.0";
    DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
    PLATFORM_LOG_STRING = {
      [name$q]: "fire-core",
      [name$p]: "fire-core-compat",
      [name$n]: "fire-analytics",
      [name$o]: "fire-analytics-compat",
      [name$l]: "fire-app-check",
      [name$m]: "fire-app-check-compat",
      [name$k]: "fire-auth",
      [name$j]: "fire-auth-compat",
      [name$i]: "fire-rtdb",
      [name$h]: "fire-data-connect",
      [name$g]: "fire-rtdb-compat",
      [name$f]: "fire-fn",
      [name$e]: "fire-fn-compat",
      [name$d]: "fire-iid",
      [name$c]: "fire-iid-compat",
      [name$b]: "fire-fcm",
      [name$a]: "fire-fcm-compat",
      [name$9]: "fire-perf",
      [name$8]: "fire-perf-compat",
      [name$7]: "fire-rc",
      [name$6]: "fire-rc-compat",
      [name$5]: "fire-gcs",
      [name$4]: "fire-gcs-compat",
      [name$3]: "fire-fst",
      [name$1]: "fire-fst-compat",
      [name$2]: "fire-vertex",
      "fire-js": "fire-js",
      // Platform identifier for JS SDK.
      [name]: "fire-js-all"
    };
    _apps = /* @__PURE__ */ new Map();
    _serverApps = /* @__PURE__ */ new Map();
    _components = /* @__PURE__ */ new Map();
    ERRORS = {
      [
        "no-app"
        /* AppError.NO_APP */
      ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
      [
        "bad-app-name"
        /* AppError.BAD_APP_NAME */
      ]: "Illegal App name: '{$appName}'",
      [
        "duplicate-app"
        /* AppError.DUPLICATE_APP */
      ]: "Firebase App named '{$appName}' already exists with different options or config",
      [
        "app-deleted"
        /* AppError.APP_DELETED */
      ]: "Firebase App named '{$appName}' already deleted",
      [
        "server-app-deleted"
        /* AppError.SERVER_APP_DELETED */
      ]: "Firebase Server App has been deleted",
      [
        "no-options"
        /* AppError.NO_OPTIONS */
      ]: "Need to provide options, when not being deployed to hosting via source.",
      [
        "invalid-app-argument"
        /* AppError.INVALID_APP_ARGUMENT */
      ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
      [
        "invalid-log-argument"
        /* AppError.INVALID_LOG_ARGUMENT */
      ]: "First argument to `onLog` must be null or a function.",
      [
        "idb-open"
        /* AppError.IDB_OPEN */
      ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
      [
        "idb-get"
        /* AppError.IDB_GET */
      ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
      [
        "idb-set"
        /* AppError.IDB_WRITE */
      ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
      [
        "idb-delete"
        /* AppError.IDB_DELETE */
      ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
      [
        "finalization-registry-not-supported"
        /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
      ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
      [
        "invalid-server-app-environment"
        /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
      ]: "FirebaseServerApp is not for use in browser environments."
    };
    ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
    FirebaseAppImpl = class {
      constructor(options, config, container) {
        this._isDeleted = false;
        this._options = { ...options };
        this._config = { ...config };
        this._name = config.name;
        this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
        this._container = container;
        this.container.addComponent(new Component(
          "app",
          () => this,
          "PUBLIC"
          /* ComponentType.PUBLIC */
        ));
      }
      get automaticDataCollectionEnabled() {
        this.checkDestroyed();
        return this._automaticDataCollectionEnabled;
      }
      set automaticDataCollectionEnabled(val) {
        this.checkDestroyed();
        this._automaticDataCollectionEnabled = val;
      }
      get name() {
        this.checkDestroyed();
        return this._name;
      }
      get options() {
        this.checkDestroyed();
        return this._options;
      }
      get config() {
        this.checkDestroyed();
        return this._config;
      }
      get container() {
        return this._container;
      }
      get isDeleted() {
        return this._isDeleted;
      }
      set isDeleted(val) {
        this._isDeleted = val;
      }
      /**
       * This function will throw an Error if the App has already been deleted -
       * use before performing API actions on the App.
       */
      checkDestroyed() {
        if (this.isDeleted) {
          throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
        }
      }
    };
    SDK_VERSION = version;
    DB_NAME = "firebase-heartbeat-database";
    DB_VERSION = 1;
    STORE_NAME = "firebase-heartbeat-store";
    dbPromise = null;
    MAX_HEADER_BYTES = 1024;
    MAX_NUM_STORED_HEARTBEATS = 30;
    HeartbeatServiceImpl = class {
      constructor(container) {
        this.container = container;
        this._heartbeatsCache = null;
        const app2 = this.container.getProvider("app").getImmediate();
        this._storage = new HeartbeatStorageImpl(app2);
        this._heartbeatsCachePromise = this._storage.read().then((result) => {
          this._heartbeatsCache = result;
          return result;
        });
      }
      /**
       * Called to report a heartbeat. The function will generate
       * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
       * to IndexedDB.
       * Note that we only store one heartbeat per day. So if a heartbeat for today is
       * already logged, subsequent calls to this function in the same day will be ignored.
       */
      async triggerHeartbeat() {
        try {
          const platformLogger = this.container.getProvider("platform-logger").getImmediate();
          const agent = platformLogger.getPlatformInfoString();
          const date = getUTCDateString();
          if (this._heartbeatsCache?.heartbeats == null) {
            this._heartbeatsCache = await this._heartbeatsCachePromise;
            if (this._heartbeatsCache?.heartbeats == null) {
              return;
            }
          }
          if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
            return;
          } else {
            this._heartbeatsCache.heartbeats.push({ date, agent });
            if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
              const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
              this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
            }
          }
          return this._storage.overwrite(this._heartbeatsCache);
        } catch (e) {
          logger.warn(e);
        }
      }
      /**
       * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
       * It also clears all heartbeats from memory as well as in IndexedDB.
       *
       * NOTE: Consuming product SDKs should not send the header if this method
       * returns an empty string.
       */
      async getHeartbeatsHeader() {
        try {
          if (this._heartbeatsCache === null) {
            await this._heartbeatsCachePromise;
          }
          if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) {
            return "";
          }
          const date = getUTCDateString();
          const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
          const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
          this._heartbeatsCache.lastSentHeartbeatDate = date;
          if (unsentEntries.length > 0) {
            this._heartbeatsCache.heartbeats = unsentEntries;
            await this._storage.overwrite(this._heartbeatsCache);
          } else {
            this._heartbeatsCache.heartbeats = [];
            void this._storage.overwrite(this._heartbeatsCache);
          }
          return headerString;
        } catch (e) {
          logger.warn(e);
          return "";
        }
      }
    };
    HeartbeatStorageImpl = class {
      constructor(app2) {
        this.app = app2;
        this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
      }
      async runIndexedDBEnvironmentCheck() {
        if (!isIndexedDBAvailable()) {
          return false;
        } else {
          return validateIndexedDBOpenable().then(() => true).catch(() => false);
        }
      }
      /**
       * Read all heartbeats.
       */
      async read() {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
          return { heartbeats: [] };
        } else {
          const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
          if (idbHeartbeatObject?.heartbeats) {
            return idbHeartbeatObject;
          } else {
            return { heartbeats: [] };
          }
        }
      }
      // overwrite the storage with the provided heartbeats
      async overwrite(heartbeatsObject) {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
          return;
        } else {
          const existingHeartbeatsObject = await this.read();
          return writeHeartbeatsToIndexedDB(this.app, {
            lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
            heartbeats: heartbeatsObject.heartbeats
          });
        }
      }
      // add heartbeats
      async add(heartbeatsObject) {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
          return;
        } else {
          const existingHeartbeatsObject = await this.read();
          return writeHeartbeatsToIndexedDB(this.app, {
            lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
            heartbeats: [
              ...existingHeartbeatsObject.heartbeats,
              ...heartbeatsObject.heartbeats
            ]
          });
        }
      }
    };
    registerCoreComponents("");
  }
});

// node_modules/firebase/app/dist/esm/index.esm.js
var name2, version2;
var init_index_esm5 = __esm({
  "node_modules/firebase/app/dist/esm/index.esm.js"() {
    init_index_esm4();
    init_index_esm4();
    name2 = "firebase";
    version2 = "12.15.0";
    registerVersion(name2, version2, "app");
  }
});

// node_modules/firebase/node_modules/@firebase/auth/dist/esm/index-d90d2ee5.js
function _prodErrorMap() {
  return {
    [
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
}
function _logWarn(msg, ...args) {
  if (logClient.logLevel <= LogLevel.WARN) {
    logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _logError(msg, ...args) {
  if (logClient.logLevel <= LogLevel.ERROR) {
    logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _fail(authOrCode, ...rest) {
  throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
  return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth2, code, message) {
  const errorMap = {
    ...prodErrorMap(),
    [code]: message
  };
  const factory = new ErrorFactory("auth", "Firebase", errorMap);
  return factory.create(code, {
    appName: auth2.name
  });
}
function _serverAppCurrentUserOperationNotSupportedError(auth2) {
  return _errorWithCustomMessage(auth2, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function createErrorInternal(authOrCode, ...rest) {
  if (typeof authOrCode !== "string") {
    const code = rest[0];
    const fullParams = [...rest.slice(1)];
    if (fullParams[0]) {
      fullParams[0].appName = authOrCode.name;
    }
    return authOrCode._errorFactory.create(code, ...fullParams);
  }
  return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
  if (!assertion) {
    throw createErrorInternal(authOrCode, ...rest);
  }
}
function debugFail(failure) {
  const message = `INTERNAL ASSERTION FAILED: ` + failure;
  _logError(message);
  throw new Error(message);
}
function debugAssert(assertion, message) {
  if (!assertion) {
    debugFail(message);
  }
}
function _getCurrentUrl() {
  return typeof self !== "undefined" && self.location?.href || "";
}
function _isHttpOrHttps() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _getCurrentScheme() {
  return typeof self !== "undefined" && self.location?.protocol || null;
}
function _isOnline() {
  if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
  // This is especially true for Cordova apps which have unreliable
  // navigator.onLine behavior unless cordova-plugin-network-information is
  // installed which overwrites the native navigator.onLine value and
  // defines navigator.connection.
  (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
    return navigator.onLine;
  }
  return true;
}
function _getUserLanguage() {
  if (typeof navigator === "undefined") {
    return null;
  }
  const navigatorLanguage = navigator;
  return (
    // Most reliable, but only supported in Chrome/Firefox.
    navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
    // UI, not the language set in browser settings.
    navigatorLanguage.language || // Couldn't determine language.
    null
  );
}
function _emulatorUrl(config, path) {
  debugAssert(config.emulator, "Emulator should always be set here");
  const { url } = config.emulator;
  if (!path) {
    return url;
  }
  return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
}
function _addTidIfNecessary(auth2, request) {
  if (auth2.tenantId && !request.tenantId) {
    return {
      ...request,
      tenantId: auth2.tenantId
    };
  }
  return request;
}
async function _performApiRequest(auth2, method, path, request, customErrorMap = {}) {
  return _performFetchWithErrorHandling(auth2, customErrorMap, async () => {
    let body = {};
    let params = {};
    if (request) {
      if (method === "GET") {
        params = request;
      } else {
        body = {
          body: JSON.stringify(request)
        };
      }
    }
    const query = querystring({
      ...params,
      key: auth2.config.apiKey
    }).slice(1);
    const headers = await auth2._getAdditionalHeaders();
    headers[
      "Content-Type"
      /* HttpHeader.CONTENT_TYPE */
    ] = "application/json";
    if (auth2.languageCode) {
      headers[
        "X-Firebase-Locale"
        /* HttpHeader.X_FIREBASE_LOCALE */
      ] = auth2.languageCode;
    }
    const fetchArgs = {
      method,
      headers,
      ...body
    };
    if (!isCloudflareWorker()) {
      fetchArgs.referrerPolicy = "strict-origin-when-cross-origin";
    }
    if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
      fetchArgs.credentials = "include";
    }
    return FetchProvider.fetch()(await _getFinalTarget(auth2, auth2.config.apiHost, path, query), fetchArgs);
  });
}
async function _performFetchWithErrorHandling(auth2, customErrorMap, fetchFn) {
  auth2._canInitEmulator = false;
  const errorMap = { ...SERVER_ERROR_MAP, ...customErrorMap };
  try {
    const networkTimeout = new NetworkTimeout(auth2);
    const response = await Promise.race([
      fetchFn(),
      networkTimeout.promise
    ]);
    networkTimeout.clearNetworkTimeout();
    const json = await response.json();
    if ("needConfirmation" in json) {
      throw _makeTaggedError(auth2, "account-exists-with-different-credential", json);
    }
    if (response.ok && !("errorMessage" in json)) {
      return json;
    } else {
      const errorMessage = response.ok ? json.errorMessage : json.error.message;
      const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
      if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
        throw _makeTaggedError(auth2, "credential-already-in-use", json);
      } else if (serverErrorCode === "EMAIL_EXISTS") {
        throw _makeTaggedError(auth2, "email-already-in-use", json);
      } else if (serverErrorCode === "USER_DISABLED") {
        throw _makeTaggedError(auth2, "user-disabled", json);
      }
      const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
      if (serverErrorMessage) {
        throw _errorWithCustomMessage(auth2, authError, serverErrorMessage);
      } else {
        _fail(auth2, authError);
      }
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e;
    }
    _fail(auth2, "network-request-failed", { "message": String(e) });
  }
}
async function _performSignInRequest(auth2, method, path, request, customErrorMap = {}) {
  const serverResponse = await _performApiRequest(auth2, method, path, request, customErrorMap);
  if ("mfaPendingCredential" in serverResponse) {
    _fail(auth2, "multi-factor-auth-required", {
      _serverResponse: serverResponse
    });
  }
  return serverResponse;
}
async function _getFinalTarget(auth2, host, path, query) {
  const base = `${host}${path}?${query}`;
  const authInternal = auth2;
  const finalTarget = authInternal.config.emulator ? _emulatorUrl(auth2.config, base) : `${auth2.config.apiScheme}://${base}`;
  if (CookieAuthProxiedEndpoints.includes(path)) {
    await authInternal._persistenceManagerAvailable;
    if (authInternal._getPersistenceType() === "COOKIE") {
      const cookiePersistence = authInternal._getPersistence();
      return cookiePersistence._getFinalTarget(finalTarget).toString();
    }
  }
  return finalTarget;
}
function _parseEnforcementState(enforcementStateStr) {
  switch (enforcementStateStr) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
}
function _makeTaggedError(auth2, code, response) {
  const errorParams = {
    appName: auth2.name
  };
  if (response.email) {
    errorParams.email = response.email;
  }
  if (response.phoneNumber) {
    errorParams.phoneNumber = response.phoneNumber;
  }
  const error = _createError(auth2, code, errorParams);
  error.customData._tokenResponse = response;
  return error;
}
function isEnterprise(grecaptcha) {
  return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
}
async function getRecaptchaConfig(auth2, request) {
  return _performApiRequest(auth2, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth2, request));
}
async function deleteAccount(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v1/accounts:delete", request);
}
async function getAccountInfo(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v1/accounts:lookup", request);
}
function utcTimestampToDateString(utcTimestamp) {
  if (!utcTimestamp) {
    return void 0;
  }
  try {
    const date = new Date(Number(utcTimestamp));
    if (!isNaN(date.getTime())) {
      return date.toUTCString();
    }
  } catch (e) {
  }
  return void 0;
}
async function getIdTokenResult(user, forceRefresh = false) {
  const userInternal = getModularInstance(user);
  const token = await userInternal.getIdToken(forceRefresh);
  const claims = _parseToken(token);
  _assert(
    claims && claims.exp && claims.auth_time && claims.iat,
    userInternal.auth,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
  const signInProvider = firebase?.["sign_in_provider"];
  return {
    claims,
    token,
    authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
    issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
    expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
    signInProvider: signInProvider || null,
    signInSecondFactor: firebase?.["sign_in_second_factor"] || null
  };
}
function secondsStringToMilliseconds(seconds) {
  return Number(seconds) * 1e3;
}
function _parseToken(token) {
  const [algorithm, payload, signature] = token.split(".");
  if (algorithm === void 0 || payload === void 0 || signature === void 0) {
    _logError("JWT malformed, contained fewer than 3 sections");
    return null;
  }
  try {
    const decoded = base64Decode(payload);
    if (!decoded) {
      _logError("Failed to decode base64 JWT payload");
      return null;
    }
    return JSON.parse(decoded);
  } catch (e) {
    _logError("Caught error parsing JWT payload as JSON", e?.toString());
    return null;
  }
}
function _tokenExpiresIn(token) {
  const parsedToken = _parseToken(token);
  _assert(
    parsedToken,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.exp !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.iat !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return Number(parsedToken.exp) - Number(parsedToken.iat);
}
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
  if (bypassAuthState) {
    return promise;
  }
  try {
    return await promise;
  } catch (e) {
    if (e instanceof FirebaseError && isUserInvalidated(e)) {
      if (user.auth.currentUser === user) {
        await user.auth.signOut();
      }
    }
    throw e;
  }
}
function isUserInvalidated({ code }) {
  return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
}
async function _reloadWithoutSaving(user) {
  const auth2 = user.auth;
  const idToken = await user.getIdToken();
  const response = await _logoutIfInvalidated(user, getAccountInfo(auth2, { idToken }));
  _assert(
    response?.users.length,
    auth2,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  const coreAccount = response.users[0];
  user._notifyReloadListener(coreAccount);
  const newProviderData = coreAccount.providerUserInfo?.length ? extractProviderData(coreAccount.providerUserInfo) : [];
  const providerData = mergeProviderData(user.providerData, newProviderData);
  const oldIsAnonymous = user.isAnonymous;
  const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !providerData?.length;
  const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
  const updates = {
    uid: coreAccount.localId,
    displayName: coreAccount.displayName || null,
    photoURL: coreAccount.photoUrl || null,
    email: coreAccount.email || null,
    emailVerified: coreAccount.emailVerified || false,
    phoneNumber: coreAccount.phoneNumber || null,
    tenantId: coreAccount.tenantId || null,
    providerData,
    metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
    isAnonymous
  };
  Object.assign(user, updates);
}
async function reload(user) {
  const userInternal = getModularInstance(user);
  await _reloadWithoutSaving(userInternal);
  await userInternal.auth._persistUserIfCurrent(userInternal);
  userInternal.auth._notifyListenersIfCurrent(userInternal);
}
function mergeProviderData(original, newData) {
  const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
  return [...deduped, ...newData];
}
function extractProviderData(providers) {
  return providers.map(({ providerId, ...provider2 }) => {
    return {
      providerId,
      uid: provider2.rawId || "",
      displayName: provider2.displayName || null,
      email: provider2.email || null,
      phoneNumber: provider2.phoneNumber || null,
      photoURL: provider2.photoUrl || null
    };
  });
}
async function requestStsToken(auth2, refreshToken) {
  const response = await _performFetchWithErrorHandling(auth2, {}, async () => {
    const body = querystring({
      "grant_type": "refresh_token",
      "refresh_token": refreshToken
    }).slice(1);
    const { tokenApiHost, apiKey } = auth2.config;
    const url = await _getFinalTarget(auth2, tokenApiHost, "/v1/token", `key=${apiKey}`);
    const headers = await auth2._getAdditionalHeaders();
    headers[
      "Content-Type"
      /* HttpHeader.CONTENT_TYPE */
    ] = "application/x-www-form-urlencoded";
    const options = {
      method: "POST",
      headers,
      body
    };
    if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
      options.credentials = "include";
    }
    return FetchProvider.fetch()(url, options);
  });
  return {
    accessToken: response.access_token,
    expiresIn: response.expires_in,
    refreshToken: response.refresh_token
  };
}
async function revokeToken(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth2, request));
}
function assertStringOrUndefined(assertion, appName) {
  _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
}
function _getInstance(cls) {
  debugAssert(cls instanceof Function, "Expected a class definition");
  let instance = instanceCache.get(cls);
  if (instance) {
    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
    return instance;
  }
  instance = new cls();
  instanceCache.set(cls, instance);
  return instance;
}
function _persistenceKeyName(key, apiKey, appName) {
  return `${"firebase"}:${key}:${apiKey}:${appName}`;
}
function _getBrowserName(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
    return "Opera";
  } else if (_isIEMobile(ua)) {
    return "IEMobile";
  } else if (ua.includes("msie") || ua.includes("trident/")) {
    return "IE";
  } else if (ua.includes("edge/")) {
    return "Edge";
  } else if (_isFirefox(ua)) {
    return "Firefox";
  } else if (ua.includes("silk/")) {
    return "Silk";
  } else if (_isBlackBerry(ua)) {
    return "Blackberry";
  } else if (_isWebOS(ua)) {
    return "Webos";
  } else if (_isSafari(ua)) {
    return "Safari";
  } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
    return "Chrome";
  } else if (_isAndroid(ua)) {
    return "Android";
  } else {
    const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
    const matches = userAgent.match(re);
    if (matches?.length === 2) {
      return matches[1];
    }
  }
  return "Other";
}
function _isFirefox(ua = getUA()) {
  return /firefox\//i.test(ua);
}
function _isSafari(userAgent = getUA()) {
  const ua = userAgent.toLowerCase();
  return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
}
function _isChromeIOS(ua = getUA()) {
  return /crios\//i.test(ua);
}
function _isIEMobile(ua = getUA()) {
  return /iemobile/i.test(ua);
}
function _isAndroid(ua = getUA()) {
  return /android/i.test(ua);
}
function _isBlackBerry(ua = getUA()) {
  return /blackberry/i.test(ua);
}
function _isWebOS(ua = getUA()) {
  return /webos/i.test(ua);
}
function _isIOS(ua = getUA()) {
  return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
}
function _isIOSStandalone(ua = getUA()) {
  return _isIOS(ua) && !!window.navigator?.standalone;
}
function _isIE10() {
  return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua = getUA()) {
  return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
}
function _getClientVersion(clientPlatform, frameworks = []) {
  let reportedPlatform;
  switch (clientPlatform) {
    case "Browser":
      reportedPlatform = _getBrowserName(getUA());
      break;
    case "Worker":
      reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
      break;
    default:
      reportedPlatform = clientPlatform;
  }
  const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
  return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
}
async function _getPasswordPolicy(auth2, request = {}) {
  return _performApiRequest(auth2, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth2, request));
}
function _castAuth(auth2) {
  return getModularInstance(auth2);
}
function _setExternalJSProvider(p) {
  externalJSProvider = p;
}
function _loadJS(url) {
  return externalJSProvider.loadJS(url);
}
function _recaptchaEnterpriseScriptUrl() {
  return externalJSProvider.recaptchaEnterpriseScript;
}
function _gapiScriptUrl() {
  return externalJSProvider.gapiScript;
}
function _generateCallbackName(prefix) {
  return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
}
async function injectRecaptchaFields(auth2, request, action, isCaptchaResp = false, isFakeToken = false) {
  const verifier = new RecaptchaEnterpriseVerifier(auth2);
  let captchaResponse;
  if (isFakeToken) {
    captchaResponse = FAKE_TOKEN;
  } else {
    try {
      captchaResponse = await verifier.verify(action);
    } catch (error) {
      captchaResponse = await verifier.verify(action, true);
    }
  }
  const newRequest = { ...request };
  if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
    if ("phoneEnrollmentInfo" in newRequest) {
      const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
      const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
      Object.assign(newRequest, {
        "phoneEnrollmentInfo": {
          phoneNumber,
          recaptchaToken,
          captchaResponse,
          "clientType": "CLIENT_TYPE_WEB",
          "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
          /* RecaptchaVersion.ENTERPRISE */
        }
      });
    } else if ("phoneSignInInfo" in newRequest) {
      const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
      Object.assign(newRequest, {
        "phoneSignInInfo": {
          recaptchaToken,
          captchaResponse,
          "clientType": "CLIENT_TYPE_WEB",
          "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
          /* RecaptchaVersion.ENTERPRISE */
        }
      });
    }
    return newRequest;
  }
  if (!isCaptchaResp) {
    Object.assign(newRequest, { captchaResponse });
  } else {
    Object.assign(newRequest, { "captchaResp": captchaResponse });
  }
  Object.assign(newRequest, {
    "clientType": "CLIENT_TYPE_WEB"
    /* RecaptchaClientType.WEB */
  });
  Object.assign(newRequest, {
    "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
    /* RecaptchaVersion.ENTERPRISE */
  });
  return newRequest;
}
async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
  if (recaptchaAuthProvider === "EMAIL_PASSWORD_PROVIDER") {
    if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    )) {
      const requestWithRecaptcha = await injectRecaptchaFields(
        authInstance,
        request,
        actionName,
        actionName === "getOobCode"
        /* RecaptchaActionName.GET_OOB_CODE */
      );
      return actionMethod(authInstance, requestWithRecaptcha);
    } else {
      return actionMethod(authInstance, request).catch(async (error) => {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
          const requestWithRecaptcha = await injectRecaptchaFields(
            authInstance,
            request,
            actionName,
            actionName === "getOobCode"
            /* RecaptchaActionName.GET_OOB_CODE */
          );
          return actionMethod(authInstance, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      });
    }
  } else if (recaptchaAuthProvider === "PHONE_PROVIDER") {
    if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
      "PHONE_PROVIDER"
      /* RecaptchaAuthProvider.PHONE_PROVIDER */
    )) {
      const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName);
      return actionMethod(authInstance, requestWithRecaptcha).catch(async (error) => {
        if (authInstance._getRecaptchaConfig()?.getProviderEnforcementState(
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        ) === "AUDIT") {
          if (error.code === `auth/${"missing-recaptcha-token"}` || error.code === `auth/${"invalid-app-credential"}`) {
            console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${actionName} flow.`);
            const requestWithRecaptchaFields = await injectRecaptchaFields(
              authInstance,
              request,
              actionName,
              false,
              // isCaptchaResp
              true
              // isFakeToken
            );
            return actionMethod(authInstance, requestWithRecaptchaFields);
          }
        }
        return Promise.reject(error);
      });
    } else {
      const requestWithRecaptchaFields = await injectRecaptchaFields(
        authInstance,
        request,
        actionName,
        false,
        // isCaptchaResp
        true
        // isFakeToken
      );
      return actionMethod(authInstance, requestWithRecaptchaFields);
    }
  } else {
    return Promise.reject(recaptchaAuthProvider + " provider is not supported.");
  }
}
async function _initializeRecaptchaConfig(auth2) {
  const authInternal = _castAuth(auth2);
  const response = await getRecaptchaConfig(authInternal, {
    clientType: "CLIENT_TYPE_WEB",
    version: "RECAPTCHA_ENTERPRISE"
    /* RecaptchaVersion.ENTERPRISE */
  });
  const config = new RecaptchaConfig(response);
  if (authInternal.tenantId == null) {
    authInternal._agentRecaptchaConfig = config;
  } else {
    authInternal._tenantRecaptchaConfigs[authInternal.tenantId] = config;
  }
  if (config.isAnyProviderEnabled()) {
    const verifier = new RecaptchaEnterpriseVerifier(authInternal);
    void verifier.verify();
  }
}
function initializeAuth(app2, deps) {
  const provider2 = _getProvider(app2, "auth");
  if (provider2.isInitialized()) {
    const auth3 = provider2.getImmediate();
    const initialOptions = provider2.getOptions();
    if (deepEqual(initialOptions, deps ?? {})) {
      return auth3;
    } else {
      _fail(
        auth3,
        "already-initialized"
        /* AuthErrorCode.ALREADY_INITIALIZED */
      );
    }
  }
  const auth2 = provider2.initialize({ options: deps });
  return auth2;
}
function _initializeAuthInstance(auth2, deps) {
  const persistence = deps?.persistence || [];
  const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
  if (deps?.errorMap) {
    auth2._updateErrorMap(deps.errorMap);
  }
  auth2._initializeWithPersistence(hierarchy, deps?.popupRedirectResolver);
}
function connectAuthEmulator(auth2, url, options) {
  const authInternal = _castAuth(auth2);
  _assert(
    /^https?:\/\//.test(url),
    authInternal,
    "invalid-emulator-scheme"
    /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
  );
  const disableWarnings = !!options?.disableWarnings;
  const protocol = extractProtocol(url);
  const { host, port } = extractHostAndPort(url);
  const portStr = port === null ? "" : `:${port}`;
  const emulator = { url: `${protocol}//${host}${portStr}/` };
  const emulatorConfig = Object.freeze({
    host,
    port,
    protocol: protocol.replace(":", ""),
    options: Object.freeze({ disableWarnings })
  });
  if (!authInternal._canInitEmulator) {
    _assert(
      authInternal.config.emulator && authInternal.emulatorConfig,
      authInternal,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    _assert(
      deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig),
      authInternal,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    return;
  }
  authInternal.config.emulator = emulator;
  authInternal.emulatorConfig = emulatorConfig;
  authInternal.settings.appVerificationDisabledForTesting = true;
  if (isCloudWorkstation(host)) {
    void pingServer(`${protocol}//${host}${portStr}`);
  } else if (!disableWarnings) {
    emitEmulatorWarning();
  }
}
function extractProtocol(url) {
  const protocolEnd = url.indexOf(":");
  return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
}
function extractHostAndPort(url) {
  const protocol = extractProtocol(url);
  const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
  if (!authority) {
    return { host: "", port: null };
  }
  const hostAndPort = authority[2].split("@").pop() || "";
  const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
  if (bracketedIPv6) {
    const host = bracketedIPv6[1];
    return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
  } else {
    const [host, port] = hostAndPort.split(":");
    return { host, port: parsePort(port) };
  }
}
function parsePort(portStr) {
  if (!portStr) {
    return null;
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    return null;
  }
  return port;
}
function emitEmulatorWarning() {
  function attachBanner() {
    const el = document.createElement("p");
    const sty = el.style;
    el.innerText = "Running in emulator mode. Do not use with production credentials.";
    sty.position = "fixed";
    sty.width = "100%";
    sty.backgroundColor = "#ffffff";
    sty.border = ".1em solid #000000";
    sty.color = "#b50000";
    sty.bottom = "0px";
    sty.left = "0px";
    sty.margin = "0px";
    sty.zIndex = "10000";
    sty.textAlign = "center";
    el.classList.add("firebase-emulator-warning");
    document.body.appendChild(el);
  }
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", attachBanner);
    } else {
      attachBanner();
    }
  }
}
async function linkEmailPassword(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v1/accounts:signUp", request);
}
async function signInWithPassword(auth2, request) {
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth2, request));
}
async function signInWithEmailLink$1(auth2, request) {
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
}
async function signInWithEmailLinkForLinking(auth2, request) {
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
}
async function signInWithIdp(auth2, request) {
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth2, request));
}
async function sendPhoneVerificationCode(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth2, request));
}
async function signInWithPhoneNumber$1(auth2, request) {
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
}
async function linkWithPhoneNumber$1(auth2, request) {
  const response = await _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
  if (response.temporaryProof) {
    throw _makeTaggedError(auth2, "account-exists-with-different-credential", response);
  }
  return response;
}
async function verifyPhoneNumberForExisting(auth2, request) {
  const apiRequest = {
    ...request,
    operation: "REAUTH"
  };
  return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
}
function parseMode(mode) {
  switch (mode) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
}
function parseDeepLink(url) {
  const link = querystringDecode(extractQuerystring(url))["link"];
  const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
  const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
  const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
function providerIdForResponse(response) {
  if (response.providerId) {
    return response.providerId;
  }
  if ("phoneNumber" in response) {
    return "phone";
  }
  return null;
}
function _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user) {
  const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth2) : credential._getIdTokenResponse(auth2);
  return idTokenProvider.catch((error) => {
    if (error.code === `auth/${"multi-factor-auth-required"}`) {
      throw MultiFactorError._fromErrorAndOperation(auth2, error, operationType, user);
    }
    throw error;
  });
}
async function _link$1(user, credential, bypassAuthState = false) {
  const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
  return UserCredentialImpl._forOperation(user, "link", response);
}
async function _reauthenticate(user, credential, bypassAuthState = false) {
  const { auth: auth2 } = user;
  if (_isFirebaseServerApp(auth2.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
  }
  const operationType = "reauthenticate";
  try {
    const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user), bypassAuthState);
    _assert(
      response.idToken,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const parsed = _parseToken(response.idToken);
    _assert(
      parsed,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const { sub: localId } = parsed;
    _assert(
      user.uid === localId,
      auth2,
      "user-mismatch"
      /* AuthErrorCode.USER_MISMATCH */
    );
    return UserCredentialImpl._forOperation(user, operationType, response);
  } catch (e) {
    if (e?.code === `auth/${"user-not-found"}`) {
      _fail(
        auth2,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
    }
    throw e;
  }
}
async function _signInWithCredential(auth2, credential, bypassAuthState = false) {
  if (_isFirebaseServerApp(auth2.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
  }
  const operationType = "signIn";
  const response = await _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential);
  const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth2, operationType, response);
  if (!bypassAuthState) {
    await auth2._updateCurrentUser(userCredential.user);
  }
  return userCredential;
}
function onIdTokenChanged(auth2, nextOrObserver, error, completed) {
  return getModularInstance(auth2).onIdTokenChanged(nextOrObserver, error, completed);
}
function beforeAuthStateChanged(auth2, callback, onAbort) {
  return getModularInstance(auth2).beforeAuthStateChanged(callback, onAbort);
}
function onAuthStateChanged(auth2, nextOrObserver, error, completed) {
  return getModularInstance(auth2).onAuthStateChanged(nextOrObserver, error, completed);
}
function startEnrollPhoneMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
}
function finalizeEnrollPhoneMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
}
function startEnrollTotpMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
}
function finalizeEnrollTotpMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
}
function getDocumentCookie(name4) {
  const escapedName = name4.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  const matcher = RegExp(`${escapedName}=([^;]+)`);
  return document.cookie.match(matcher)?.[1] ?? null;
}
function getCookieName(key) {
  const isDevMode = window.location.protocol === "http:";
  return `${isDevMode ? "__dev_" : "__HOST-"}FIREBASE_${key.split(":")[3]}`;
}
function _allSettled(promises) {
  return Promise.all(promises.map(async (promise) => {
    try {
      const value = await promise;
      return {
        fulfilled: true,
        value
      };
    } catch (reason) {
      return {
        fulfilled: false,
        reason
      };
    }
  }));
}
function _generateEventId(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0; i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
}
function _window() {
  return window;
}
function _setWindowLocation(url) {
  _window().location.href = url;
}
function _isWorker() {
  return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
}
async function _getActiveServiceWorker() {
  if (!navigator?.serviceWorker) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active;
  } catch {
    return null;
  }
}
function _getServiceWorkerController() {
  return navigator?.serviceWorker?.controller || null;
}
function _getWorkerGlobalScope() {
  return _isWorker() ? self : null;
}
function getObjectStore(db2, isReadWrite) {
  return db2.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
}
function _deleteDatabase() {
  const request = indexedDB.deleteDatabase(DB_NAME2);
  return new DBPromise(request).toPromise();
}
function _openDatabase() {
  const request = indexedDB.open(DB_NAME2, DB_VERSION2);
  return new Promise((resolve, reject) => {
    request.addEventListener("error", () => {
      reject(request.error);
    });
    request.addEventListener("upgradeneeded", () => {
      const db2 = request.result;
      try {
        db2.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
      } catch (e) {
        reject(e);
      }
    });
    request.addEventListener("success", async () => {
      const db2 = request.result;
      if (!db2.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
        db2.close();
        await _deleteDatabase();
        resolve(await _openDatabase());
      } else {
        resolve(db2);
      }
    });
  });
}
async function _putObject(db2, key, value) {
  const request = getObjectStore(db2, true).put({
    [DB_DATA_KEYPATH]: key,
    value
  });
  return new DBPromise(request).toPromise();
}
async function getObject(db2, key) {
  const request = getObjectStore(db2, false).get(key);
  const data = await new DBPromise(request).toPromise();
  return data === void 0 ? null : data.value;
}
function _deleteObject(db2, key) {
  const request = getObjectStore(db2, true).delete(key);
  return new DBPromise(request).toPromise();
}
function startSignInPhoneMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth2, request));
}
function finalizeSignInPhoneMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
}
function finalizeSignInTotpMfa(auth2, request) {
  return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
}
async function _verifyPhoneNumber(auth2, options, verifier) {
  if (!auth2._getRecaptchaConfig()) {
    try {
      await _initializeRecaptchaConfig(auth2);
    } catch (error) {
      console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.");
    }
  }
  try {
    let phoneInfoOptions;
    if (typeof options === "string") {
      phoneInfoOptions = {
        phoneNumber: options
      };
    } else {
      phoneInfoOptions = options;
    }
    if ("session" in phoneInfoOptions) {
      const session = phoneInfoOptions.session;
      if ("phoneNumber" in phoneInfoOptions) {
        _assert(
          session.type === "enroll",
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const startPhoneMfaEnrollmentRequest = {
          idToken: session.credential,
          phoneEnrollmentInfo: {
            phoneNumber: phoneInfoOptions.phoneNumber,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          }
        };
        const startEnrollPhoneMfaActionCallback = async (authInstance, request) => {
          if (request.phoneEnrollmentInfo.captchaResponse === FAKE_TOKEN) {
            _assert(
              verifier?.type === RECAPTCHA_VERIFIER_TYPE,
              authInstance,
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
            const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
            return startEnrollPhoneMfa(authInstance, requestWithRecaptchaV2);
          }
          return startEnrollPhoneMfa(authInstance, request);
        };
        const startPhoneMfaEnrollmentResponse = handleRecaptchaFlow(
          auth2,
          startPhoneMfaEnrollmentRequest,
          "mfaSmsEnrollment",
          startEnrollPhoneMfaActionCallback,
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        );
        const response = await startPhoneMfaEnrollmentResponse.catch((error) => {
          return Promise.reject(error);
        });
        return response.phoneSessionInfo.sessionInfo;
      } else {
        _assert(
          session.type === "signin",
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const mfaEnrollmentId = phoneInfoOptions.multiFactorHint?.uid || phoneInfoOptions.multiFactorUid;
        _assert(
          mfaEnrollmentId,
          auth2,
          "missing-multi-factor-info"
          /* AuthErrorCode.MISSING_MFA_INFO */
        );
        const startPhoneMfaSignInRequest = {
          mfaPendingCredential: session.credential,
          mfaEnrollmentId,
          phoneSignInInfo: {
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          }
        };
        const startSignInPhoneMfaActionCallback = async (authInstance, request) => {
          if (request.phoneSignInInfo.captchaResponse === FAKE_TOKEN) {
            _assert(
              verifier?.type === RECAPTCHA_VERIFIER_TYPE,
              authInstance,
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
            const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
            return startSignInPhoneMfa(authInstance, requestWithRecaptchaV2);
          }
          return startSignInPhoneMfa(authInstance, request);
        };
        const startPhoneMfaSignInResponse = handleRecaptchaFlow(
          auth2,
          startPhoneMfaSignInRequest,
          "mfaSmsSignIn",
          startSignInPhoneMfaActionCallback,
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        );
        const response = await startPhoneMfaSignInResponse.catch((error) => {
          return Promise.reject(error);
        });
        return response.phoneResponseInfo.sessionInfo;
      }
    } else {
      const sendPhoneVerificationCodeRequest = {
        phoneNumber: phoneInfoOptions.phoneNumber,
        clientType: "CLIENT_TYPE_WEB"
        /* RecaptchaClientType.WEB */
      };
      const sendPhoneVerificationCodeActionCallback = async (authInstance, request) => {
        if (request.captchaResponse === FAKE_TOKEN) {
          _assert(
            verifier?.type === RECAPTCHA_VERIFIER_TYPE,
            authInstance,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
          return sendPhoneVerificationCode(authInstance, requestWithRecaptchaV2);
        }
        return sendPhoneVerificationCode(authInstance, request);
      };
      const sendPhoneVerificationCodeResponse = handleRecaptchaFlow(
        auth2,
        sendPhoneVerificationCodeRequest,
        "sendVerificationCode",
        sendPhoneVerificationCodeActionCallback,
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      );
      const response = await sendPhoneVerificationCodeResponse.catch((error) => {
        return Promise.reject(error);
      });
      return response.sessionInfo;
    }
  } finally {
    verifier?._reset();
  }
}
async function injectRecaptchaV2Token(auth2, request, recaptchaV2Verifier) {
  _assert(
    recaptchaV2Verifier.type === RECAPTCHA_VERIFIER_TYPE,
    auth2,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  const recaptchaV2Token = await recaptchaV2Verifier.verify();
  _assert(
    typeof recaptchaV2Token === "string",
    auth2,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  const newRequest = { ...request };
  if ("phoneEnrollmentInfo" in newRequest) {
    const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
    const captchaResponse = newRequest.phoneEnrollmentInfo.captchaResponse;
    const clientType = newRequest.phoneEnrollmentInfo.clientType;
    const recaptchaVersion = newRequest.phoneEnrollmentInfo.recaptchaVersion;
    Object.assign(newRequest, {
      "phoneEnrollmentInfo": {
        phoneNumber,
        recaptchaToken: recaptchaV2Token,
        captchaResponse,
        clientType,
        recaptchaVersion
      }
    });
    return newRequest;
  } else if ("phoneSignInInfo" in newRequest) {
    const captchaResponse = newRequest.phoneSignInInfo.captchaResponse;
    const clientType = newRequest.phoneSignInInfo.clientType;
    const recaptchaVersion = newRequest.phoneSignInInfo.recaptchaVersion;
    Object.assign(newRequest, {
      "phoneSignInInfo": {
        recaptchaToken: recaptchaV2Token,
        captchaResponse,
        clientType,
        recaptchaVersion
      }
    });
    return newRequest;
  } else {
    Object.assign(newRequest, { "recaptchaToken": recaptchaV2Token });
    return newRequest;
  }
}
function _withDefaultResolver(auth2, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(
    auth2._popupRedirectResolver,
    auth2,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return auth2._popupRedirectResolver;
}
function _signIn(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
  const { auth: auth2, user } = params;
  _assert(
    user,
    auth2,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
async function _link(params) {
  const { auth: auth2, user } = params;
  _assert(
    user,
    auth2,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return _link$1(user, new IdpCredential(params), params.bypassAuthState);
}
async function _getAndClearPendingRedirectStatus(resolver, auth2) {
  const key = pendingRedirectKey(auth2);
  const persistence = resolverPersistence(resolver);
  if (!await persistence._isAvailable()) {
    return false;
  }
  const hasPendingRedirect = await persistence._get(key) === "true";
  await persistence._remove(key);
  return hasPendingRedirect;
}
function _overrideRedirectResult(auth2, result) {
  redirectOutcomeMap.set(auth2._key(), result);
}
function resolverPersistence(resolver) {
  return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth2) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth2.config.apiKey, auth2.name);
}
async function _getRedirectResult(auth2, resolverExtern, bypassAuthState = false) {
  if (_isFirebaseServerApp(auth2.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
  }
  const authInternal = _castAuth(auth2);
  const resolver = _withDefaultResolver(authInternal, resolverExtern);
  const action = new RedirectAction(authInternal, resolver, bypassAuthState);
  const result = await action.execute();
  if (result && !bypassAuthState) {
    delete result.user._redirectEventId;
    await authInternal._persistUserIfCurrent(result.user);
    await authInternal._setRedirectUser(null, resolverExtern);
  }
  return result;
}
function eventUid(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
}
function isNullRedirectEvent({ type, error }) {
  return type === "unknown" && error?.code === `auth/${"no-auth-event"}`;
}
function isRedirectEvent(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
}
async function _getProjectConfig(auth2, request = {}) {
  return _performApiRequest(auth2, "GET", "/v1/projects", request);
}
async function _validateOrigin(auth2) {
  if (auth2.config.emulator) {
    return;
  }
  const { authorizedDomains } = await _getProjectConfig(auth2);
  for (const domain of authorizedDomains) {
    try {
      if (matchDomain(domain)) {
        return;
      }
    } catch {
    }
  }
  _fail(
    auth2,
    "unauthorized-domain"
    /* AuthErrorCode.INVALID_ORIGIN */
  );
}
function matchDomain(expected) {
  const currentUrl = _getCurrentUrl();
  const { protocol, hostname } = new URL(currentUrl);
  if (expected.startsWith("chrome-extension://")) {
    const ceUrl = new URL(expected);
    if (ceUrl.hostname === "" && hostname === "") {
      return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
    }
    return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
  }
  if (!HTTP_REGEX.test(protocol)) {
    return false;
  }
  if (IP_ADDRESS_REGEX.test(expected)) {
    return hostname === expected;
  }
  const escapedDomainPattern = expected.replace(/\./g, "\\.");
  const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
  return re.test(hostname);
}
function resetUnloadedGapiModules() {
  const beacon = _window().___jsl;
  if (beacon?.H) {
    for (const hint of Object.keys(beacon.H)) {
      beacon.H[hint].r = beacon.H[hint].r || [];
      beacon.H[hint].L = beacon.H[hint].L || [];
      beacon.H[hint].r = [...beacon.H[hint].L];
      if (beacon.CP) {
        for (let i = 0; i < beacon.CP.length; i++) {
          beacon.CP[i] = null;
        }
      }
    }
  }
}
function loadGapi(auth2) {
  return new Promise((resolve, reject) => {
    function loadGapiIframe() {
      resetUnloadedGapiModules();
      gapi.load("gapi.iframes", {
        callback: () => {
          resolve(gapi.iframes.getContext());
        },
        ontimeout: () => {
          resetUnloadedGapiModules();
          reject(_createError(
            auth2,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        },
        timeout: NETWORK_TIMEOUT.get()
      });
    }
    if (_window().gapi?.iframes?.Iframe) {
      resolve(gapi.iframes.getContext());
    } else if (!!_window().gapi?.load) {
      loadGapiIframe();
    } else {
      const cbName = _generateCallbackName("iframefcb");
      _window()[cbName] = () => {
        if (!!gapi.load) {
          loadGapiIframe();
        } else {
          reject(_createError(
            auth2,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        }
      };
      return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e) => reject(e));
    }
  }).catch((error) => {
    cachedGApiLoader = null;
    throw error;
  });
}
function _loadGapi(auth2) {
  cachedGApiLoader = cachedGApiLoader || loadGapi(auth2);
  return cachedGApiLoader;
}
function getIframeUrl(auth2) {
  const config = auth2.config;
  _assert(
    config.authDomain,
    auth2,
    "auth-domain-config-required"
    /* AuthErrorCode.MISSING_AUTH_DOMAIN */
  );
  const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth2.config.authDomain}/${IFRAME_PATH}`;
  const params = {
    apiKey: config.apiKey,
    appName: auth2.name,
    v: SDK_VERSION
  };
  const eid = EID_FROM_APIHOST.get(auth2.config.apiHost);
  if (eid) {
    params.eid = eid;
  }
  const frameworks = auth2._getFrameworks();
  if (frameworks.length) {
    params.fw = frameworks.join(",");
  }
  return `${url}?${querystring(params).slice(1)}`;
}
async function _openIframe(auth2) {
  const context = await _loadGapi(auth2);
  const gapi2 = _window().gapi;
  _assert(
    gapi2,
    auth2,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return context.open({
    where: document.body,
    url: getIframeUrl(auth2),
    messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
    attributes: IFRAME_ATTRIBUTES,
    dontclear: true
  }, (iframe) => new Promise(async (resolve, reject) => {
    await iframe.restyle({
      // Prevent iframe from closing on mouse out.
      setHideOnLeave: false
    });
    const networkError = _createError(
      auth2,
      "network-request-failed"
      /* AuthErrorCode.NETWORK_REQUEST_FAILED */
    );
    const networkErrorTimer = _window().setTimeout(() => {
      reject(networkError);
    }, PING_TIMEOUT.get());
    function clearTimerAndResolve() {
      _window().clearTimeout(networkErrorTimer);
      resolve(iframe);
    }
    iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
      reject(networkError);
    });
  }));
}
function _open(auth2, url, name4, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
  const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
  let target = "";
  const options = {
    ...BASE_POPUP_OPTIONS,
    width: width.toString(),
    height: height.toString(),
    top,
    left
  };
  const ua = getUA().toLowerCase();
  if (name4) {
    target = _isChromeIOS(ua) ? TARGET_BLANK : name4;
  }
  if (_isFirefox(ua)) {
    url = url || FIREFOX_EMPTY_URL;
    options.scrollbars = "yes";
  }
  const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
  if (_isIOSStandalone(ua) && target !== "_self") {
    openAsNewWindowIOS(url || "", target);
    return new AuthPopup(null);
  }
  const newWin = window.open(url || "", target, optionsString);
  _assert(
    newWin,
    auth2,
    "popup-blocked"
    /* AuthErrorCode.POPUP_BLOCKED */
  );
  try {
    newWin.focus();
  } catch (e) {
  }
  return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
  const el = document.createElement("a");
  el.href = url;
  el.target = target;
  const click = document.createEvent("MouseEvent");
  click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
  el.dispatchEvent(click);
}
async function _getRedirectUrl(auth2, provider2, authType, redirectUrl, eventId, additionalParams) {
  _assert(
    auth2.config.authDomain,
    auth2,
    "auth-domain-config-required"
    /* AuthErrorCode.MISSING_AUTH_DOMAIN */
  );
  _assert(
    auth2.config.apiKey,
    auth2,
    "invalid-api-key"
    /* AuthErrorCode.INVALID_API_KEY */
  );
  const params = {
    apiKey: auth2.config.apiKey,
    appName: auth2.name,
    authType,
    redirectUrl,
    v: SDK_VERSION,
    eventId
  };
  if (provider2 instanceof FederatedAuthProvider) {
    provider2.setDefaultLanguage(auth2.languageCode);
    params.providerId = provider2.providerId || "";
    if (!isEmpty(provider2.getCustomParameters())) {
      params.customParameters = JSON.stringify(provider2.getCustomParameters());
    }
    for (const [key, value] of Object.entries(additionalParams || {})) {
      params[key] = value;
    }
  }
  if (provider2 instanceof BaseOAuthProvider) {
    const scopes = provider2.getScopes().filter((scope) => scope !== "");
    if (scopes.length > 0) {
      params.scopes = scopes.join(",");
    }
  }
  if (auth2.tenantId) {
    params.tid = auth2.tenantId;
  }
  const paramsDict = params;
  for (const key of Object.keys(paramsDict)) {
    if (paramsDict[key] === void 0) {
      delete paramsDict[key];
    }
  }
  const appCheckToken = await auth2._getAppCheckToken();
  const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
  return `${getHandlerBase(auth2)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
}
function getHandlerBase({ config }) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
}
function _isEmptyString(input) {
  return typeof input === "undefined" || input?.length === 0;
}
function getVersionForPlatform(clientPlatform) {
  switch (clientPlatform) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return void 0;
  }
}
function registerAuth(clientPlatform) {
  _registerComponent(new Component(
    "auth",
    (container, { options: deps }) => {
      const app2 = container.getProvider("app").getImmediate();
      const heartbeatServiceProvider = container.getProvider("heartbeat");
      const appCheckServiceProvider = container.getProvider("app-check-internal");
      const { apiKey, authDomain } = app2.options;
      _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
      const config = {
        apiKey,
        authDomain,
        clientPlatform,
        apiHost: "identitytoolkit.googleapis.com",
        tokenApiHost: "securetoken.googleapis.com",
        apiScheme: "https",
        sdkClientVersion: _getClientVersion(clientPlatform)
      };
      const authInstance = new AuthImpl(app2, heartbeatServiceProvider, appCheckServiceProvider, config);
      _initializeAuthInstance(authInstance, deps);
      return authInstance;
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
    const authInternalProvider = container.getProvider(
      "auth-internal"
      /* _ComponentName.AUTH_INTERNAL */
    );
    authInternalProvider.initialize();
  }));
  _registerComponent(new Component(
    "auth-internal",
    (container) => {
      const auth2 = _castAuth(container.getProvider(
        "auth"
        /* _ComponentName.AUTH */
      ).getImmediate());
      return ((auth3) => new AuthInterop(auth3))(auth2);
    },
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ));
  registerVersion(name3, version3, getVersionForPlatform(clientPlatform));
  registerVersion(name3, version3, "esm2020");
}
function getAuth(app2 = getApp()) {
  const provider2 = _getProvider(app2, "auth");
  if (provider2.isInitialized()) {
    return provider2.getImmediate();
  }
  const auth2 = initializeAuth(app2, {
    popupRedirectResolver: browserPopupRedirectResolver,
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    ]
  });
  const authTokenSyncPath = getExperimentalSetting("authTokenSyncURL");
  if (authTokenSyncPath && typeof isSecureContext === "boolean" && isSecureContext) {
    const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
    if (location.origin === authTokenSyncUrl.origin) {
      const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
      beforeAuthStateChanged(auth2, mintCookie, () => mintCookie(auth2.currentUser));
      onIdTokenChanged(auth2, (user) => mintCookie(user));
    }
  }
  const authEmulatorHost = getDefaultEmulatorHost("auth");
  if (authEmulatorHost) {
    connectAuthEmulator(auth2, `http://${authEmulatorHost}`);
  }
  return auth2;
}
function getScriptParentElement() {
  return document.getElementsByTagName("head")?.[0] ?? document;
}
var prodErrorMap, _DEFAULT_AUTH_ERROR_FACTORY, logClient, Delay, FetchProvider, SERVER_ERROR_MAP, CookieAuthProxiedEndpoints, DEFAULT_API_TIMEOUT_MS, NetworkTimeout, RecaptchaConfig, ProactiveRefresh, UserMetadata, StsTokenManager, UserImpl, instanceCache, InMemoryPersistence, inMemoryPersistence, PersistenceUserManager, AuthMiddlewareQueue, MINIMUM_MIN_PASSWORD_LENGTH, PasswordPolicyImpl, AuthImpl, Subscription, externalJSProvider, MockGreCAPTCHATopLevel, MockGreCAPTCHA, RECAPTCHA_ENTERPRISE_VERIFIER_TYPE, FAKE_TOKEN, RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME, RecaptchaEnterpriseVerifier, AuthCredential, EmailAuthCredential, IDP_REQUEST_URI$1, OAuthCredential, VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_, PhoneAuthCredential, ActionCodeURL, EmailAuthProvider, FederatedAuthProvider, BaseOAuthProvider, FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider, UserCredentialImpl, MultiFactorError, STORAGE_AVAILABLE_KEY, BrowserPersistenceClass, _POLLING_INTERVAL_MS$1, IE10_LOCAL_STORAGE_SYNC_DELAY, BrowserLocalPersistence, browserLocalPersistence, POLLING_INTERVAL_MS, CookiePersistence, BrowserSessionPersistence, browserSessionPersistence, Receiver, Sender, DB_NAME2, DB_VERSION2, DB_OBJECTSTORE_NAME, DB_DATA_KEYPATH, DBPromise, _POLLING_INTERVAL_MS, _TRANSACTION_RETRY_COUNT, IndexedDBLocalPersistence, indexedDBLocalPersistence, _JSLOAD_CALLBACK, NETWORK_TIMEOUT_DELAY, RECAPTCHA_VERIFIER_TYPE, PhoneAuthProvider, IdpCredential, AbstractPopupRedirectOperation, _POLL_WINDOW_CLOSE_TIMEOUT, PopupOperation, PENDING_REDIRECT_KEY, redirectOutcomeMap, RedirectAction, EVENT_DUPLICATION_CACHE_DURATION_MS, AuthEventManager, IP_ADDRESS_REGEX, HTTP_REGEX, NETWORK_TIMEOUT, cachedGApiLoader, PING_TIMEOUT, IFRAME_PATH, EMULATED_IFRAME_PATH, IFRAME_ATTRIBUTES, EID_FROM_APIHOST, BASE_POPUP_OPTIONS, DEFAULT_WIDTH, DEFAULT_HEIGHT, TARGET_BLANK, FIREFOX_EMPTY_URL, AuthPopup, WIDGET_PATH, EMULATOR_WIDGET_PATH, FIREBASE_APP_CHECK_FRAGMENT_ID, WEB_STORAGE_SUPPORT_KEY, BrowserPopupRedirectResolver, browserPopupRedirectResolver, MultiFactorAssertionImpl, PhoneMultiFactorAssertionImpl, PhoneMultiFactorGenerator, TotpMultiFactorGenerator, TotpMultiFactorAssertionImpl, TotpSecret, name3, version3, AuthInterop, DEFAULT_ID_TOKEN_MAX_AGE, authIdTokenMaxAge, lastPostedIdToken, mintCookieFactory;
var init_index_d90d2ee5 = __esm({
  "node_modules/firebase/node_modules/@firebase/auth/dist/esm/index-d90d2ee5.js"() {
    init_index_esm4();
    init_index_esm();
    init_index_esm3();
    init_index_esm2();
    prodErrorMap = _prodErrorMap;
    _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
    logClient = new Logger("@firebase/auth");
    Delay = class {
      constructor(shortDelay, longDelay) {
        this.shortDelay = shortDelay;
        this.longDelay = longDelay;
        debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
        this.isMobile = isMobileCordova() || isReactNative();
      }
      get() {
        if (!_isOnline()) {
          return Math.min(5e3, this.shortDelay);
        }
        return this.isMobile ? this.longDelay : this.shortDelay;
      }
    };
    FetchProvider = class {
      static initialize(fetchImpl, headersImpl, responseImpl) {
        this.fetchImpl = fetchImpl;
        if (headersImpl) {
          this.headersImpl = headersImpl;
        }
        if (responseImpl) {
          this.responseImpl = responseImpl;
        }
      }
      static fetch() {
        if (this.fetchImpl) {
          return this.fetchImpl;
        }
        if (typeof self !== "undefined" && "fetch" in self) {
          return self.fetch;
        }
        if (typeof globalThis !== "undefined" && globalThis.fetch) {
          return globalThis.fetch;
        }
        if (typeof fetch !== "undefined") {
          return fetch;
        }
        debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
      }
      static headers() {
        if (this.headersImpl) {
          return this.headersImpl;
        }
        if (typeof self !== "undefined" && "Headers" in self) {
          return self.Headers;
        }
        if (typeof globalThis !== "undefined" && globalThis.Headers) {
          return globalThis.Headers;
        }
        if (typeof Headers !== "undefined") {
          return Headers;
        }
        debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
      }
      static response() {
        if (this.responseImpl) {
          return this.responseImpl;
        }
        if (typeof self !== "undefined" && "Response" in self) {
          return self.Response;
        }
        if (typeof globalThis !== "undefined" && globalThis.Response) {
          return globalThis.Response;
        }
        if (typeof Response !== "undefined") {
          return Response;
        }
        debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
      }
    };
    SERVER_ERROR_MAP = {
      // Custom token errors.
      [
        "CREDENTIAL_MISMATCH"
        /* ServerError.CREDENTIAL_MISMATCH */
      ]: "custom-token-mismatch",
      // This can only happen if the SDK sends a bad request.
      [
        "MISSING_CUSTOM_TOKEN"
        /* ServerError.MISSING_CUSTOM_TOKEN */
      ]: "internal-error",
      // Create Auth URI errors.
      [
        "INVALID_IDENTIFIER"
        /* ServerError.INVALID_IDENTIFIER */
      ]: "invalid-email",
      // This can only happen if the SDK sends a bad request.
      [
        "MISSING_CONTINUE_URI"
        /* ServerError.MISSING_CONTINUE_URI */
      ]: "internal-error",
      // Sign in with email and password errors (some apply to sign up too).
      [
        "INVALID_PASSWORD"
        /* ServerError.INVALID_PASSWORD */
      ]: "wrong-password",
      // This can only happen if the SDK sends a bad request.
      [
        "MISSING_PASSWORD"
        /* ServerError.MISSING_PASSWORD */
      ]: "missing-password",
      // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
      // invalid.
      [
        "INVALID_LOGIN_CREDENTIALS"
        /* ServerError.INVALID_LOGIN_CREDENTIALS */
      ]: "invalid-credential",
      // Sign up with email and password errors.
      [
        "EMAIL_EXISTS"
        /* ServerError.EMAIL_EXISTS */
      ]: "email-already-in-use",
      [
        "PASSWORD_LOGIN_DISABLED"
        /* ServerError.PASSWORD_LOGIN_DISABLED */
      ]: "operation-not-allowed",
      // Verify assertion for sign in with credential errors:
      [
        "INVALID_IDP_RESPONSE"
        /* ServerError.INVALID_IDP_RESPONSE */
      ]: "invalid-credential",
      [
        "INVALID_PENDING_TOKEN"
        /* ServerError.INVALID_PENDING_TOKEN */
      ]: "invalid-credential",
      [
        "FEDERATED_USER_ID_ALREADY_LINKED"
        /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
      ]: "credential-already-in-use",
      // This can only happen if the SDK sends a bad request.
      [
        "MISSING_REQ_TYPE"
        /* ServerError.MISSING_REQ_TYPE */
      ]: "internal-error",
      // Send Password reset email errors:
      [
        "EMAIL_NOT_FOUND"
        /* ServerError.EMAIL_NOT_FOUND */
      ]: "user-not-found",
      [
        "RESET_PASSWORD_EXCEED_LIMIT"
        /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
      ]: "too-many-requests",
      [
        "EXPIRED_OOB_CODE"
        /* ServerError.EXPIRED_OOB_CODE */
      ]: "expired-action-code",
      [
        "INVALID_OOB_CODE"
        /* ServerError.INVALID_OOB_CODE */
      ]: "invalid-action-code",
      // This can only happen if the SDK sends a bad request.
      [
        "MISSING_OOB_CODE"
        /* ServerError.MISSING_OOB_CODE */
      ]: "internal-error",
      // Operations that require ID token in request:
      [
        "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
        /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
      ]: "requires-recent-login",
      [
        "INVALID_ID_TOKEN"
        /* ServerError.INVALID_ID_TOKEN */
      ]: "invalid-user-token",
      [
        "TOKEN_EXPIRED"
        /* ServerError.TOKEN_EXPIRED */
      ]: "user-token-expired",
      [
        "USER_NOT_FOUND"
        /* ServerError.USER_NOT_FOUND */
      ]: "user-token-expired",
      // Other errors.
      [
        "TOO_MANY_ATTEMPTS_TRY_LATER"
        /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
      ]: "too-many-requests",
      [
        "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
        /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
      ]: "password-does-not-meet-requirements",
      // Phone Auth related errors.
      [
        "INVALID_CODE"
        /* ServerError.INVALID_CODE */
      ]: "invalid-verification-code",
      [
        "INVALID_SESSION_INFO"
        /* ServerError.INVALID_SESSION_INFO */
      ]: "invalid-verification-id",
      [
        "INVALID_TEMPORARY_PROOF"
        /* ServerError.INVALID_TEMPORARY_PROOF */
      ]: "invalid-credential",
      [
        "MISSING_SESSION_INFO"
        /* ServerError.MISSING_SESSION_INFO */
      ]: "missing-verification-id",
      [
        "SESSION_EXPIRED"
        /* ServerError.SESSION_EXPIRED */
      ]: "code-expired",
      // Other action code errors when additional settings passed.
      // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
      // This is OK as this error will be caught by client side validation.
      [
        "MISSING_ANDROID_PACKAGE_NAME"
        /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
      ]: "missing-android-pkg-name",
      [
        "UNAUTHORIZED_DOMAIN"
        /* ServerError.UNAUTHORIZED_DOMAIN */
      ]: "unauthorized-continue-uri",
      // getProjectConfig errors when clientId is passed.
      [
        "INVALID_OAUTH_CLIENT_ID"
        /* ServerError.INVALID_OAUTH_CLIENT_ID */
      ]: "invalid-oauth-client-id",
      // User actions (sign-up or deletion) disabled errors.
      [
        "ADMIN_ONLY_OPERATION"
        /* ServerError.ADMIN_ONLY_OPERATION */
      ]: "admin-restricted-operation",
      // Multi factor related errors.
      [
        "INVALID_MFA_PENDING_CREDENTIAL"
        /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
      ]: "invalid-multi-factor-session",
      [
        "MFA_ENROLLMENT_NOT_FOUND"
        /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
      ]: "multi-factor-info-not-found",
      [
        "MISSING_MFA_ENROLLMENT_ID"
        /* ServerError.MISSING_MFA_ENROLLMENT_ID */
      ]: "missing-multi-factor-info",
      [
        "MISSING_MFA_PENDING_CREDENTIAL"
        /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
      ]: "missing-multi-factor-session",
      [
        "SECOND_FACTOR_EXISTS"
        /* ServerError.SECOND_FACTOR_EXISTS */
      ]: "second-factor-already-in-use",
      [
        "SECOND_FACTOR_LIMIT_EXCEEDED"
        /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
      ]: "maximum-second-factor-count-exceeded",
      // Blocking functions related errors.
      [
        "BLOCKING_FUNCTION_ERROR_RESPONSE"
        /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
      ]: "internal-error",
      // Recaptcha related errors.
      [
        "RECAPTCHA_NOT_ENABLED"
        /* ServerError.RECAPTCHA_NOT_ENABLED */
      ]: "recaptcha-not-enabled",
      [
        "MISSING_RECAPTCHA_TOKEN"
        /* ServerError.MISSING_RECAPTCHA_TOKEN */
      ]: "missing-recaptcha-token",
      [
        "INVALID_RECAPTCHA_TOKEN"
        /* ServerError.INVALID_RECAPTCHA_TOKEN */
      ]: "invalid-recaptcha-token",
      [
        "INVALID_RECAPTCHA_ACTION"
        /* ServerError.INVALID_RECAPTCHA_ACTION */
      ]: "invalid-recaptcha-action",
      [
        "MISSING_CLIENT_TYPE"
        /* ServerError.MISSING_CLIENT_TYPE */
      ]: "missing-client-type",
      [
        "MISSING_RECAPTCHA_VERSION"
        /* ServerError.MISSING_RECAPTCHA_VERSION */
      ]: "missing-recaptcha-version",
      [
        "INVALID_RECAPTCHA_VERSION"
        /* ServerError.INVALID_RECAPTCHA_VERSION */
      ]: "invalid-recaptcha-version",
      [
        "INVALID_REQ_TYPE"
        /* ServerError.INVALID_REQ_TYPE */
      ]: "invalid-req-type"
      /* AuthErrorCode.INVALID_REQ_TYPE */
    };
    CookieAuthProxiedEndpoints = [
      "/v1/accounts:signInWithCustomToken",
      "/v1/accounts:signInWithEmailLink",
      "/v1/accounts:signInWithIdp",
      "/v1/accounts:signInWithPassword",
      "/v1/accounts:signInWithPhoneNumber",
      "/v1/token"
      /* Endpoint.TOKEN */
    ];
    DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
    NetworkTimeout = class {
      clearNetworkTimeout() {
        clearTimeout(this.timer);
      }
      constructor(auth2) {
        this.auth = auth2;
        this.timer = null;
        this.promise = new Promise((_, reject) => {
          this.timer = setTimeout(() => {
            return reject(_createError(
              this.auth,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          }, DEFAULT_API_TIMEOUT_MS.get());
        });
      }
    };
    RecaptchaConfig = class {
      constructor(response) {
        this.siteKey = "";
        this.recaptchaEnforcementState = [];
        if (response.recaptchaKey === void 0) {
          throw new Error("recaptchaKey undefined");
        }
        this.siteKey = response.recaptchaKey.split("/")[3];
        this.recaptchaEnforcementState = response.recaptchaEnforcementState;
      }
      /**
       * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
       *
       * @param providerStr - The provider whose enforcement state is to be returned.
       * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
       */
      getProviderEnforcementState(providerStr) {
        if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
          return null;
        }
        for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
          if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
            return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
          }
        }
        return null;
      }
      /**
       * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
       *
       * @param providerStr - The provider whose enablement state is to be returned.
       * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
       */
      isProviderEnabled(providerStr) {
        return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
      }
      /**
       * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
       * returns false.
       *
       * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
       */
      isAnyProviderEnabled() {
        return this.isProviderEnabled(
          "EMAIL_PASSWORD_PROVIDER"
          /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
        ) || this.isProviderEnabled(
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        );
      }
    };
    ProactiveRefresh = class {
      constructor(user) {
        this.user = user;
        this.isRunning = false;
        this.timerId = null;
        this.errorBackoff = 3e4;
      }
      _start() {
        if (this.isRunning) {
          return;
        }
        this.isRunning = true;
        this.schedule();
      }
      _stop() {
        if (!this.isRunning) {
          return;
        }
        this.isRunning = false;
        if (this.timerId !== null) {
          clearTimeout(this.timerId);
        }
      }
      getInterval(wasError) {
        if (wasError) {
          const interval = this.errorBackoff;
          this.errorBackoff = Math.min(
            this.errorBackoff * 2,
            96e4
            /* Duration.RETRY_BACKOFF_MAX */
          );
          return interval;
        } else {
          this.errorBackoff = 3e4;
          const expTime = this.user.stsTokenManager.expirationTime ?? 0;
          const interval = expTime - Date.now() - 3e5;
          return Math.max(0, interval);
        }
      }
      schedule(wasError = false) {
        if (!this.isRunning) {
          return;
        }
        const interval = this.getInterval(wasError);
        this.timerId = setTimeout(async () => {
          await this.iteration();
        }, interval);
      }
      async iteration() {
        try {
          await this.user.getIdToken(true);
        } catch (e) {
          if (e?.code === `auth/${"network-request-failed"}`) {
            this.schedule(
              /* wasError */
              true
            );
          }
          return;
        }
        this.schedule();
      }
    };
    UserMetadata = class {
      constructor(createdAt, lastLoginAt) {
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this._initializeTime();
      }
      _initializeTime() {
        this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
        this.creationTime = utcTimestampToDateString(this.createdAt);
      }
      _copy(metadata) {
        this.createdAt = metadata.createdAt;
        this.lastLoginAt = metadata.lastLoginAt;
        this._initializeTime();
      }
      toJSON() {
        return {
          createdAt: this.createdAt,
          lastLoginAt: this.lastLoginAt
        };
      }
    };
    StsTokenManager = class _StsTokenManager {
      constructor() {
        this.refreshToken = null;
        this.accessToken = null;
        this.expirationTime = null;
      }
      get isExpired() {
        return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
      }
      updateFromServerResponse(response) {
        _assert(
          response.idToken,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        _assert(
          typeof response.idToken !== "undefined",
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        _assert(
          typeof response.refreshToken !== "undefined",
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
        this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
      }
      updateFromIdToken(idToken) {
        _assert(
          idToken.length !== 0,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const expiresIn = _tokenExpiresIn(idToken);
        this.updateTokensAndExpiration(idToken, null, expiresIn);
      }
      async getToken(auth2, forceRefresh = false) {
        if (!forceRefresh && this.accessToken && !this.isExpired) {
          return this.accessToken;
        }
        _assert(
          this.refreshToken,
          auth2,
          "user-token-expired"
          /* AuthErrorCode.TOKEN_EXPIRED */
        );
        if (this.refreshToken) {
          await this.refresh(auth2, this.refreshToken);
          return this.accessToken;
        }
        return null;
      }
      clearRefreshToken() {
        this.refreshToken = null;
      }
      async refresh(auth2, oldToken) {
        const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth2, oldToken);
        this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
      }
      updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
        this.refreshToken = refreshToken || null;
        this.accessToken = accessToken || null;
        this.expirationTime = Date.now() + expiresInSec * 1e3;
      }
      static fromJSON(appName, object) {
        const { refreshToken, accessToken, expirationTime } = object;
        const manager = new _StsTokenManager();
        if (refreshToken) {
          _assert(typeof refreshToken === "string", "internal-error", {
            appName
          });
          manager.refreshToken = refreshToken;
        }
        if (accessToken) {
          _assert(typeof accessToken === "string", "internal-error", {
            appName
          });
          manager.accessToken = accessToken;
        }
        if (expirationTime) {
          _assert(typeof expirationTime === "number", "internal-error", {
            appName
          });
          manager.expirationTime = expirationTime;
        }
        return manager;
      }
      toJSON() {
        return {
          refreshToken: this.refreshToken,
          accessToken: this.accessToken,
          expirationTime: this.expirationTime
        };
      }
      _assign(stsTokenManager) {
        this.accessToken = stsTokenManager.accessToken;
        this.refreshToken = stsTokenManager.refreshToken;
        this.expirationTime = stsTokenManager.expirationTime;
      }
      _clone() {
        return Object.assign(new _StsTokenManager(), this.toJSON());
      }
      _performRefresh() {
        return debugFail("not implemented");
      }
    };
    UserImpl = class _UserImpl {
      constructor({ uid, auth: auth2, stsTokenManager, ...opt }) {
        this.providerId = "firebase";
        this.proactiveRefresh = new ProactiveRefresh(this);
        this.reloadUserInfo = null;
        this.reloadListener = null;
        this.uid = uid;
        this.auth = auth2;
        this.stsTokenManager = stsTokenManager;
        this.accessToken = stsTokenManager.accessToken;
        this.displayName = opt.displayName || null;
        this.email = opt.email || null;
        this.emailVerified = opt.emailVerified || false;
        this.phoneNumber = opt.phoneNumber || null;
        this.photoURL = opt.photoURL || null;
        this.isAnonymous = opt.isAnonymous || false;
        this.tenantId = opt.tenantId || null;
        this.providerData = opt.providerData ? [...opt.providerData] : [];
        this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
      }
      async getIdToken(forceRefresh) {
        const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
        _assert(
          accessToken,
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        if (this.accessToken !== accessToken) {
          this.accessToken = accessToken;
          await this.auth._persistUserIfCurrent(this);
          this.auth._notifyListenersIfCurrent(this);
        }
        return accessToken;
      }
      getIdTokenResult(forceRefresh) {
        return getIdTokenResult(this, forceRefresh);
      }
      reload() {
        return reload(this);
      }
      _assign(user) {
        if (this === user) {
          return;
        }
        _assert(
          this.uid === user.uid,
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
        this.emailVerified = user.emailVerified;
        this.phoneNumber = user.phoneNumber;
        this.isAnonymous = user.isAnonymous;
        this.tenantId = user.tenantId;
        this.providerData = user.providerData.map((userInfo) => ({ ...userInfo }));
        this.metadata._copy(user.metadata);
        this.stsTokenManager._assign(user.stsTokenManager);
      }
      _clone(auth2) {
        const newUser = new _UserImpl({
          ...this,
          auth: auth2,
          stsTokenManager: this.stsTokenManager._clone()
        });
        newUser.metadata._copy(this.metadata);
        return newUser;
      }
      _onReload(callback) {
        _assert(
          !this.reloadListener,
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        this.reloadListener = callback;
        if (this.reloadUserInfo) {
          this._notifyReloadListener(this.reloadUserInfo);
          this.reloadUserInfo = null;
        }
      }
      _notifyReloadListener(userInfo) {
        if (this.reloadListener) {
          this.reloadListener(userInfo);
        } else {
          this.reloadUserInfo = userInfo;
        }
      }
      _startProactiveRefresh() {
        this.proactiveRefresh._start();
      }
      _stopProactiveRefresh() {
        this.proactiveRefresh._stop();
      }
      async _updateTokensIfNecessary(response, reload2 = false) {
        let tokensRefreshed = false;
        if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
          this.stsTokenManager.updateFromServerResponse(response);
          tokensRefreshed = true;
        }
        if (reload2) {
          await _reloadWithoutSaving(this);
        }
        await this.auth._persistUserIfCurrent(this);
        if (tokensRefreshed) {
          this.auth._notifyListenersIfCurrent(this);
        }
      }
      async delete() {
        if (_isFirebaseServerApp(this.auth.app)) {
          return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
        }
        const idToken = await this.getIdToken();
        await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
        this.stsTokenManager.clearRefreshToken();
        return this.auth.signOut();
      }
      toJSON() {
        return {
          uid: this.uid,
          email: this.email || void 0,
          emailVerified: this.emailVerified,
          displayName: this.displayName || void 0,
          isAnonymous: this.isAnonymous,
          photoURL: this.photoURL || void 0,
          phoneNumber: this.phoneNumber || void 0,
          tenantId: this.tenantId || void 0,
          providerData: this.providerData.map((userInfo) => ({ ...userInfo })),
          stsTokenManager: this.stsTokenManager.toJSON(),
          // Redirect event ID must be maintained in case there is a pending
          // redirect event.
          _redirectEventId: this._redirectEventId,
          ...this.metadata.toJSON(),
          // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
          apiKey: this.auth.config.apiKey,
          appName: this.auth.name
          // Missing authDomain will be tolerated by the legacy SDK.
          // stsTokenManager.apiKey isn't actually required (despite the legacy SDK persisting it).
        };
      }
      get refreshToken() {
        return this.stsTokenManager.refreshToken || "";
      }
      static _fromJSON(auth2, object) {
        const displayName = object.displayName ?? void 0;
        const email = object.email ?? void 0;
        const phoneNumber = object.phoneNumber ?? void 0;
        const photoURL = object.photoURL ?? void 0;
        const tenantId = object.tenantId ?? void 0;
        const _redirectEventId = object._redirectEventId ?? void 0;
        const createdAt = object.createdAt ?? void 0;
        const lastLoginAt = object.lastLoginAt ?? void 0;
        const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
        _assert(
          uid && plainObjectTokenManager,
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
        _assert(
          typeof uid === "string",
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        assertStringOrUndefined(displayName, auth2.name);
        assertStringOrUndefined(email, auth2.name);
        _assert(
          typeof emailVerified === "boolean",
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        _assert(
          typeof isAnonymous === "boolean",
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        assertStringOrUndefined(phoneNumber, auth2.name);
        assertStringOrUndefined(photoURL, auth2.name);
        assertStringOrUndefined(tenantId, auth2.name);
        assertStringOrUndefined(_redirectEventId, auth2.name);
        assertStringOrUndefined(createdAt, auth2.name);
        assertStringOrUndefined(lastLoginAt, auth2.name);
        const user = new _UserImpl({
          uid,
          auth: auth2,
          email,
          emailVerified,
          displayName,
          isAnonymous,
          photoURL,
          phoneNumber,
          tenantId,
          stsTokenManager,
          createdAt,
          lastLoginAt
        });
        if (providerData && Array.isArray(providerData)) {
          user.providerData = providerData.map((userInfo) => ({ ...userInfo }));
        }
        if (_redirectEventId) {
          user._redirectEventId = _redirectEventId;
        }
        return user;
      }
      /**
       * Initialize a User from an idToken server response
       * @param auth
       * @param idTokenResponse
       */
      static async _fromIdTokenResponse(auth2, idTokenResponse, isAnonymous = false) {
        const stsTokenManager = new StsTokenManager();
        stsTokenManager.updateFromServerResponse(idTokenResponse);
        const user = new _UserImpl({
          uid: idTokenResponse.localId,
          auth: auth2,
          stsTokenManager,
          isAnonymous
        });
        await _reloadWithoutSaving(user);
        return user;
      }
      /**
       * Initialize a User from an idToken server response
       * @param auth
       * @param idTokenResponse
       */
      static async _fromGetAccountInfoResponse(auth2, response, idToken) {
        const coreAccount = response.users[0];
        _assert(
          coreAccount.localId !== void 0,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
        const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length;
        const stsTokenManager = new StsTokenManager();
        stsTokenManager.updateFromIdToken(idToken);
        const user = new _UserImpl({
          uid: coreAccount.localId,
          auth: auth2,
          stsTokenManager,
          isAnonymous
        });
        const updates = {
          uid: coreAccount.localId,
          displayName: coreAccount.displayName || null,
          photoURL: coreAccount.photoUrl || null,
          email: coreAccount.email || null,
          emailVerified: coreAccount.emailVerified || false,
          phoneNumber: coreAccount.phoneNumber || null,
          tenantId: coreAccount.tenantId || null,
          providerData,
          metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
          isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length
        };
        Object.assign(user, updates);
        return user;
      }
    };
    instanceCache = /* @__PURE__ */ new Map();
    InMemoryPersistence = class {
      constructor() {
        this.type = "NONE";
        this.storage = {};
      }
      async _isAvailable() {
        return true;
      }
      async _set(key, value) {
        this.storage[key] = value;
      }
      async _get(key) {
        const value = this.storage[key];
        return value === void 0 ? null : value;
      }
      async _remove(key) {
        delete this.storage[key];
      }
      _addListener(_key, _listener) {
        return;
      }
      _removeListener(_key, _listener) {
        return;
      }
    };
    InMemoryPersistence.type = "NONE";
    inMemoryPersistence = InMemoryPersistence;
    PersistenceUserManager = class _PersistenceUserManager {
      constructor(persistence, auth2, userKey) {
        this.persistence = persistence;
        this.auth = auth2;
        this.userKey = userKey;
        const { config, name: name4 } = this.auth;
        this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name4);
        this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name4);
        this.boundEventHandler = auth2._onStorageEvent.bind(auth2);
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
      }
      setCurrentUser(user) {
        return this.persistence._set(this.fullUserKey, user.toJSON());
      }
      async getCurrentUser() {
        const blob = await this.persistence._get(this.fullUserKey);
        if (!blob) {
          return null;
        }
        if (typeof blob === "string") {
          const response = await getAccountInfo(this.auth, { idToken: blob }).catch(() => void 0);
          if (!response) {
            return null;
          }
          return UserImpl._fromGetAccountInfoResponse(this.auth, response, blob);
        }
        return UserImpl._fromJSON(this.auth, blob);
      }
      removeCurrentUser() {
        return this.persistence._remove(this.fullUserKey);
      }
      savePersistenceForRedirect() {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
      }
      async setPersistence(newPersistence) {
        if (this.persistence === newPersistence) {
          return;
        }
        const currentUser = await this.getCurrentUser();
        await this.removeCurrentUser();
        this.persistence = newPersistence;
        if (currentUser) {
          return this.setCurrentUser(currentUser);
        }
      }
      delete() {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
      }
      static async create(auth2, persistenceHierarchy, userKey = "authUser") {
        if (!persistenceHierarchy.length) {
          return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth2, userKey);
        }
        const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
          if (await persistence._isAvailable()) {
            return persistence;
          }
          return void 0;
        }))).filter((persistence) => persistence);
        let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
        const key = _persistenceKeyName(userKey, auth2.config.apiKey, auth2.name);
        let userToMigrate = null;
        for (const persistence of persistenceHierarchy) {
          try {
            const blob = await persistence._get(key);
            if (blob) {
              let user;
              if (typeof blob === "string") {
                const response = await getAccountInfo(auth2, {
                  idToken: blob
                }).catch(() => void 0);
                if (!response) {
                  break;
                }
                user = await UserImpl._fromGetAccountInfoResponse(auth2, response, blob);
              } else {
                user = UserImpl._fromJSON(auth2, blob);
              }
              if (persistence !== selectedPersistence) {
                userToMigrate = user;
              }
              selectedPersistence = persistence;
              break;
            }
          } catch {
          }
        }
        const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
        if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
          return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
        }
        selectedPersistence = migrationHierarchy[0];
        if (userToMigrate) {
          await selectedPersistence._set(key, userToMigrate.toJSON());
        }
        await Promise.all(persistenceHierarchy.map(async (persistence) => {
          if (persistence !== selectedPersistence) {
            try {
              await persistence._remove(key);
            } catch {
            }
          }
        }));
        return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
      }
    };
    AuthMiddlewareQueue = class {
      constructor(auth2) {
        this.auth = auth2;
        this.queue = [];
      }
      pushCallback(callback, onAbort) {
        const wrappedCallback = (user) => new Promise((resolve, reject) => {
          try {
            const result = callback(user);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
        wrappedCallback.onAbort = onAbort;
        this.queue.push(wrappedCallback);
        const index = this.queue.length - 1;
        return () => {
          this.queue[index] = () => Promise.resolve();
        };
      }
      async runMiddleware(nextUser) {
        if (this.auth.currentUser === nextUser) {
          return;
        }
        const onAbortStack = [];
        try {
          for (const beforeStateCallback of this.queue) {
            await beforeStateCallback(nextUser);
            if (beforeStateCallback.onAbort) {
              onAbortStack.push(beforeStateCallback.onAbort);
            }
          }
        } catch (e) {
          onAbortStack.reverse();
          for (const onAbort of onAbortStack) {
            try {
              onAbort();
            } catch (_) {
            }
          }
          throw this.auth._errorFactory.create("login-blocked", {
            originalMessage: e?.message
          });
        }
      }
    };
    MINIMUM_MIN_PASSWORD_LENGTH = 6;
    PasswordPolicyImpl = class {
      constructor(response) {
        const responseOptions = response.customStrengthOptions;
        this.customStrengthOptions = {};
        this.customStrengthOptions.minPasswordLength = responseOptions.minPasswordLength ?? MINIMUM_MIN_PASSWORD_LENGTH;
        if (responseOptions.maxPasswordLength) {
          this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
        }
        if (responseOptions.containsLowercaseCharacter !== void 0) {
          this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
        }
        if (responseOptions.containsUppercaseCharacter !== void 0) {
          this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
        }
        if (responseOptions.containsNumericCharacter !== void 0) {
          this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
        }
        if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
          this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
        }
        this.enforcementState = response.enforcementState;
        if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
          this.enforcementState = "OFF";
        }
        this.allowedNonAlphanumericCharacters = response.allowedNonAlphanumericCharacters?.join("") ?? "";
        this.forceUpgradeOnSignin = response.forceUpgradeOnSignin ?? false;
        this.schemaVersion = response.schemaVersion;
      }
      validatePassword(password) {
        const status = {
          isValid: true,
          passwordPolicy: this
        };
        this.validatePasswordLengthOptions(password, status);
        this.validatePasswordCharacterOptions(password, status);
        status.isValid && (status.isValid = status.meetsMinPasswordLength ?? true);
        status.isValid && (status.isValid = status.meetsMaxPasswordLength ?? true);
        status.isValid && (status.isValid = status.containsLowercaseLetter ?? true);
        status.isValid && (status.isValid = status.containsUppercaseLetter ?? true);
        status.isValid && (status.isValid = status.containsNumericCharacter ?? true);
        status.isValid && (status.isValid = status.containsNonAlphanumericCharacter ?? true);
        return status;
      }
      /**
       * Validates that the password meets the length options for the policy.
       *
       * @param password Password to validate.
       * @param status Validation status.
       */
      validatePasswordLengthOptions(password, status) {
        const minPasswordLength = this.customStrengthOptions.minPasswordLength;
        const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
        if (minPasswordLength) {
          status.meetsMinPasswordLength = password.length >= minPasswordLength;
        }
        if (maxPasswordLength) {
          status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
        }
      }
      /**
       * Validates that the password meets the character options for the policy.
       *
       * @param password Password to validate.
       * @param status Validation status.
       */
      validatePasswordCharacterOptions(password, status) {
        this.updatePasswordCharacterOptionsStatuses(
          status,
          /* containsLowercaseCharacter= */
          false,
          /* containsUppercaseCharacter= */
          false,
          /* containsNumericCharacter= */
          false,
          /* containsNonAlphanumericCharacter= */
          false
        );
        let passwordChar;
        for (let i = 0; i < password.length; i++) {
          passwordChar = password.charAt(i);
          this.updatePasswordCharacterOptionsStatuses(
            status,
            /* containsLowercaseCharacter= */
            passwordChar >= "a" && passwordChar <= "z",
            /* containsUppercaseCharacter= */
            passwordChar >= "A" && passwordChar <= "Z",
            /* containsNumericCharacter= */
            passwordChar >= "0" && passwordChar <= "9",
            /* containsNonAlphanumericCharacter= */
            this.allowedNonAlphanumericCharacters.includes(passwordChar)
          );
        }
      }
      /**
       * Updates the running validation status with the statuses for the character options.
       * Expected to be called each time a character is processed to update each option status
       * based on the current character.
       *
       * @param status Validation status.
       * @param containsLowercaseCharacter Whether the character is a lowercase letter.
       * @param containsUppercaseCharacter Whether the character is an uppercase letter.
       * @param containsNumericCharacter Whether the character is a numeric character.
       * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
       */
      updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
        if (this.customStrengthOptions.containsLowercaseLetter) {
          status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
        }
        if (this.customStrengthOptions.containsUppercaseLetter) {
          status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
        }
        if (this.customStrengthOptions.containsNumericCharacter) {
          status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
        }
        if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
          status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
        }
      }
    };
    AuthImpl = class {
      constructor(app2, heartbeatServiceProvider, appCheckServiceProvider, config) {
        this.app = app2;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
        this.appCheckServiceProvider = appCheckServiceProvider;
        this.config = config;
        this.currentUser = null;
        this.emulatorConfig = null;
        this.operations = Promise.resolve();
        this.authStateSubscription = new Subscription(this);
        this.idTokenSubscription = new Subscription(this);
        this.beforeStateQueue = new AuthMiddlewareQueue(this);
        this.redirectUser = null;
        this.isProactiveRefreshEnabled = false;
        this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
        this._canInitEmulator = true;
        this._isInitialized = false;
        this._deleted = false;
        this._initializationPromise = null;
        this._popupRedirectResolver = null;
        this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
        this._agentRecaptchaConfig = null;
        this._tenantRecaptchaConfigs = {};
        this._projectPasswordPolicy = null;
        this._tenantPasswordPolicies = {};
        this._resolvePersistenceManagerAvailable = void 0;
        this.lastNotifiedUid = void 0;
        this.languageCode = null;
        this.tenantId = null;
        this.settings = { appVerificationDisabledForTesting: false };
        this.frameworks = [];
        this.name = app2.name;
        this.clientVersion = config.sdkClientVersion;
        this._persistenceManagerAvailable = new Promise((resolve) => this._resolvePersistenceManagerAvailable = resolve);
      }
      _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
        if (popupRedirectResolver) {
          this._popupRedirectResolver = _getInstance(popupRedirectResolver);
        }
        this._initializationPromise = this.queue(async () => {
          if (this._deleted) {
            return;
          }
          this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
          this._resolvePersistenceManagerAvailable?.();
          if (this._deleted) {
            return;
          }
          if (this._popupRedirectResolver?._shouldInitProactively) {
            try {
              await this._popupRedirectResolver._initialize(this);
            } catch (e) {
            }
          }
          await this.initializeCurrentUser(popupRedirectResolver);
          this.lastNotifiedUid = this.currentUser?.uid || null;
          if (this._deleted) {
            return;
          }
          this._isInitialized = true;
        });
        return this._initializationPromise;
      }
      /**
       * If the persistence is changed in another window, the user manager will let us know
       */
      async _onStorageEvent() {
        if (this._deleted) {
          return;
        }
        const user = await this.assertedPersistence.getCurrentUser();
        if (!this.currentUser && !user) {
          return;
        }
        if (this.currentUser && user && this.currentUser.uid === user.uid) {
          this._currentUser._assign(user);
          await this.currentUser.getIdToken();
          return;
        }
        await this._updateCurrentUser(
          user,
          /* skipBeforeStateCallbacks */
          true
        );
      }
      async initializeCurrentUserFromIdToken(idToken) {
        try {
          const response = await getAccountInfo(this, { idToken });
          const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
          await this.directlySetCurrentUser(user);
        } catch (err) {
          console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
          await this.directlySetCurrentUser(null);
        }
      }
      async initializeCurrentUser(popupRedirectResolver) {
        if (_isFirebaseServerApp(this.app)) {
          const idToken = this.app.settings.authIdToken;
          if (idToken) {
            return new Promise((resolve) => {
              setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
            });
          } else {
            return this.directlySetCurrentUser(null);
          }
        }
        const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
        let futureCurrentUser = previouslyStoredUser;
        let needsTocheckMiddleware = false;
        if (popupRedirectResolver && this.config.authDomain) {
          await this.getOrInitRedirectPersistenceManager();
          const redirectUserEventId = this.redirectUser?._redirectEventId;
          const storedUserEventId = futureCurrentUser?._redirectEventId;
          const result = await this.tryRedirectSignIn(popupRedirectResolver);
          if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && result?.user) {
            futureCurrentUser = result.user;
            needsTocheckMiddleware = true;
          }
        }
        if (!futureCurrentUser) {
          return this.directlySetCurrentUser(null);
        }
        if (!futureCurrentUser._redirectEventId) {
          if (needsTocheckMiddleware) {
            try {
              await this.beforeStateQueue.runMiddleware(futureCurrentUser);
            } catch (e) {
              futureCurrentUser = previouslyStoredUser;
              this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
            }
          }
          if (futureCurrentUser) {
            return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
          } else {
            return this.directlySetCurrentUser(null);
          }
        }
        _assert(
          this._popupRedirectResolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        await this.getOrInitRedirectPersistenceManager();
        if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
          return this.directlySetCurrentUser(futureCurrentUser);
        }
        return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
      }
      async tryRedirectSignIn(redirectResolver) {
        let result = null;
        try {
          result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
        } catch (e) {
          await this._setRedirectUser(null);
        }
        return result;
      }
      async reloadAndSetCurrentUserOrClear(user) {
        try {
          await _reloadWithoutSaving(user);
        } catch (e) {
          if (e?.code !== `auth/${"network-request-failed"}`) {
            return this.directlySetCurrentUser(null);
          }
        }
        return this.directlySetCurrentUser(user);
      }
      useDeviceLanguage() {
        this.languageCode = _getUserLanguage();
      }
      async _delete() {
        this._deleted = true;
      }
      async updateCurrentUser(userExtern) {
        if (_isFirebaseServerApp(this.app)) {
          return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
        }
        const user = userExtern ? getModularInstance(userExtern) : null;
        if (user) {
          _assert(
            user.auth.config.apiKey === this.config.apiKey,
            this,
            "invalid-user-token"
            /* AuthErrorCode.INVALID_AUTH */
          );
        }
        return this._updateCurrentUser(user && user._clone(this));
      }
      async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
        if (this._deleted) {
          return;
        }
        if (user) {
          _assert(
            this.tenantId === user.tenantId,
            this,
            "tenant-id-mismatch"
            /* AuthErrorCode.TENANT_ID_MISMATCH */
          );
        }
        if (!skipBeforeStateCallbacks) {
          await this.beforeStateQueue.runMiddleware(user);
        }
        return this.queue(async () => {
          await this.directlySetCurrentUser(user);
          this.notifyAuthListeners();
        });
      }
      async signOut() {
        if (_isFirebaseServerApp(this.app)) {
          return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
        }
        await this.beforeStateQueue.runMiddleware(null);
        if (this.redirectPersistenceManager || this._popupRedirectResolver) {
          await this._setRedirectUser(null);
        }
        return this._updateCurrentUser(
          null,
          /* skipBeforeStateCallbacks */
          true
        );
      }
      setPersistence(persistence) {
        if (_isFirebaseServerApp(this.app)) {
          return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
        }
        return this.queue(async () => {
          await this.assertedPersistence.setPersistence(_getInstance(persistence));
        });
      }
      _getRecaptchaConfig() {
        if (this.tenantId == null) {
          return this._agentRecaptchaConfig;
        } else {
          return this._tenantRecaptchaConfigs[this.tenantId];
        }
      }
      async validatePassword(password) {
        if (!this._getPasswordPolicyInternal()) {
          await this._updatePasswordPolicy();
        }
        const passwordPolicy = this._getPasswordPolicyInternal();
        if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
          return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
        }
        return passwordPolicy.validatePassword(password);
      }
      _getPasswordPolicyInternal() {
        if (this.tenantId === null) {
          return this._projectPasswordPolicy;
        } else {
          return this._tenantPasswordPolicies[this.tenantId];
        }
      }
      async _updatePasswordPolicy() {
        const response = await _getPasswordPolicy(this);
        const passwordPolicy = new PasswordPolicyImpl(response);
        if (this.tenantId === null) {
          this._projectPasswordPolicy = passwordPolicy;
        } else {
          this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
        }
      }
      _getPersistenceType() {
        return this.assertedPersistence.persistence.type;
      }
      _getPersistence() {
        return this.assertedPersistence.persistence;
      }
      _updateErrorMap(errorMap) {
        this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
      }
      onAuthStateChanged(nextOrObserver, error, completed) {
        return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
      }
      beforeAuthStateChanged(callback, onAbort) {
        return this.beforeStateQueue.pushCallback(callback, onAbort);
      }
      onIdTokenChanged(nextOrObserver, error, completed) {
        return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
      }
      authStateReady() {
        return new Promise((resolve, reject) => {
          if (this.currentUser) {
            resolve();
          } else {
            const unsubscribe = this.onAuthStateChanged(() => {
              unsubscribe();
              resolve();
            }, reject);
          }
        });
      }
      /**
       * Revokes the given access token. Currently only supports Apple OAuth access tokens.
       */
      async revokeAccessToken(token) {
        if (this.currentUser) {
          const idToken = await this.currentUser.getIdToken();
          const request = {
            providerId: "apple.com",
            tokenType: "ACCESS_TOKEN",
            token,
            idToken
          };
          if (this.tenantId != null) {
            request.tenantId = this.tenantId;
          }
          await revokeToken(this, request);
        }
      }
      toJSON() {
        return {
          apiKey: this.config.apiKey,
          authDomain: this.config.authDomain,
          appName: this.name,
          currentUser: this._currentUser?.toJSON()
        };
      }
      async _setRedirectUser(user, popupRedirectResolver) {
        const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
        return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
      }
      async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
        if (!this.redirectPersistenceManager) {
          const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
          _assert(
            resolver,
            this,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          this.redirectPersistenceManager = await PersistenceUserManager.create(
            this,
            [_getInstance(resolver._redirectPersistence)],
            "redirectUser"
            /* KeyName.REDIRECT_USER */
          );
          this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
        }
        return this.redirectPersistenceManager;
      }
      async _redirectUserForId(id) {
        if (this._isInitialized) {
          await this.queue(async () => {
          });
        }
        if (this._currentUser?._redirectEventId === id) {
          return this._currentUser;
        }
        if (this.redirectUser?._redirectEventId === id) {
          return this.redirectUser;
        }
        return null;
      }
      async _persistUserIfCurrent(user) {
        if (user === this.currentUser) {
          return this.queue(async () => this.directlySetCurrentUser(user));
        }
      }
      /** Notifies listeners only if the user is current */
      _notifyListenersIfCurrent(user) {
        if (user === this.currentUser) {
          this.notifyAuthListeners();
        }
      }
      _key() {
        return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
      }
      _startProactiveRefresh() {
        this.isProactiveRefreshEnabled = true;
        if (this.currentUser) {
          this._currentUser._startProactiveRefresh();
        }
      }
      _stopProactiveRefresh() {
        this.isProactiveRefreshEnabled = false;
        if (this.currentUser) {
          this._currentUser._stopProactiveRefresh();
        }
      }
      /** Returns the current user cast as the internal type */
      get _currentUser() {
        return this.currentUser;
      }
      notifyAuthListeners() {
        if (!this._isInitialized) {
          return;
        }
        this.idTokenSubscription.next(this.currentUser);
        const currentUid = this.currentUser?.uid ?? null;
        if (this.lastNotifiedUid !== currentUid) {
          this.lastNotifiedUid = currentUid;
          this.authStateSubscription.next(this.currentUser);
        }
      }
      registerStateListener(subscription, nextOrObserver, error, completed) {
        if (this._deleted) {
          return () => {
          };
        }
        const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
        let isUnsubscribed = false;
        const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
        _assert(
          promise,
          this,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        promise.then(() => {
          if (isUnsubscribed) {
            return;
          }
          cb(this.currentUser);
        });
        if (typeof nextOrObserver === "function") {
          const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
          return () => {
            isUnsubscribed = true;
            unsubscribe();
          };
        } else {
          const unsubscribe = subscription.addObserver(nextOrObserver);
          return () => {
            isUnsubscribed = true;
            unsubscribe();
          };
        }
      }
      /**
       * Unprotected (from race conditions) method to set the current user. This
       * should only be called from within a queued callback. This is necessary
       * because the queue shouldn't rely on another queued callback.
       */
      async directlySetCurrentUser(user) {
        if (this.currentUser && this.currentUser !== user) {
          this._currentUser._stopProactiveRefresh();
        }
        if (user && this.isProactiveRefreshEnabled) {
          user._startProactiveRefresh();
        }
        this.currentUser = user;
        if (user) {
          await this.assertedPersistence.setCurrentUser(user);
        } else {
          await this.assertedPersistence.removeCurrentUser();
        }
      }
      queue(action) {
        this.operations = this.operations.then(action, action);
        return this.operations;
      }
      get assertedPersistence() {
        _assert(
          this.persistenceManager,
          this,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        return this.persistenceManager;
      }
      _logFramework(framework) {
        if (!framework || this.frameworks.includes(framework)) {
          return;
        }
        this.frameworks.push(framework);
        this.frameworks.sort();
        this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
      }
      _getFrameworks() {
        return this.frameworks;
      }
      async _getAdditionalHeaders() {
        const headers = {
          [
            "X-Client-Version"
            /* HttpHeader.X_CLIENT_VERSION */
          ]: this.clientVersion
        };
        if (this.app.options.appId) {
          headers[
            "X-Firebase-gmpid"
            /* HttpHeader.X_FIREBASE_GMPID */
          ] = this.app.options.appId;
        }
        const heartbeatsHeader = await this.heartbeatServiceProvider.getImmediate({
          optional: true
        })?.getHeartbeatsHeader();
        if (heartbeatsHeader) {
          headers[
            "X-Firebase-Client"
            /* HttpHeader.X_FIREBASE_CLIENT */
          ] = heartbeatsHeader;
        }
        const appCheckToken = await this._getAppCheckToken();
        if (appCheckToken) {
          headers[
            "X-Firebase-AppCheck"
            /* HttpHeader.X_FIREBASE_APP_CHECK */
          ] = appCheckToken;
        }
        return headers;
      }
      async _getAppCheckToken() {
        if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
          return this.app.settings.appCheckToken;
        }
        const appCheckTokenResult = await this.appCheckServiceProvider.getImmediate({ optional: true })?.getToken();
        if (appCheckTokenResult?.error) {
          _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
        }
        return appCheckTokenResult?.token;
      }
    };
    Subscription = class {
      constructor(auth2) {
        this.auth = auth2;
        this.observer = null;
        this.addObserver = createSubscribe((observer) => this.observer = observer);
      }
      get next() {
        _assert(
          this.observer,
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        return this.observer.next.bind(this.observer);
      }
    };
    externalJSProvider = {
      async loadJS() {
        throw new Error("Unable to load external scripts");
      },
      recaptchaV2Script: "",
      recaptchaEnterpriseScript: "",
      gapiScript: ""
    };
    MockGreCAPTCHATopLevel = class {
      constructor() {
        this.enterprise = new MockGreCAPTCHA();
      }
      ready(callback) {
        callback();
      }
      execute(_siteKey, _options) {
        return Promise.resolve("token");
      }
      render(_container, _parameters) {
        return "";
      }
    };
    MockGreCAPTCHA = class {
      ready(callback) {
        callback();
      }
      execute(_siteKey, _options) {
        return Promise.resolve("token");
      }
      render(_container, _parameters) {
        return "";
      }
    };
    RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
    FAKE_TOKEN = "NO_RECAPTCHA";
    RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME = "onFirebaseAuthREInstanceReady";
    RecaptchaEnterpriseVerifier = class _RecaptchaEnterpriseVerifier {
      /**
       *
       * @param authExtern - The corresponding Firebase {@link Auth} instance.
       *
       */
      constructor(authExtern) {
        this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
        this.auth = _castAuth(authExtern);
      }
      /**
       * Executes the verification process.
       *
       * @returns A Promise for a token that can be used to assert the validity of a request.
       */
      async verify(action = "verify", forceRefresh = false) {
        async function retrieveSiteKey(auth2) {
          if (!forceRefresh) {
            if (auth2.tenantId == null && auth2._agentRecaptchaConfig != null) {
              return auth2._agentRecaptchaConfig.siteKey;
            }
            if (auth2.tenantId != null && auth2._tenantRecaptchaConfigs[auth2.tenantId] !== void 0) {
              return auth2._tenantRecaptchaConfigs[auth2.tenantId].siteKey;
            }
          }
          return new Promise(async (resolve, reject) => {
            getRecaptchaConfig(auth2, {
              clientType: "CLIENT_TYPE_WEB",
              version: "RECAPTCHA_ENTERPRISE"
              /* RecaptchaVersion.ENTERPRISE */
            }).then((response) => {
              if (response.recaptchaKey === void 0) {
                reject(new Error("recaptcha Enterprise site key undefined"));
              } else {
                const config = new RecaptchaConfig(response);
                if (auth2.tenantId == null) {
                  auth2._agentRecaptchaConfig = config;
                } else {
                  auth2._tenantRecaptchaConfigs[auth2.tenantId] = config;
                }
                return resolve(config.siteKey);
              }
            }).catch((error) => {
              reject(error);
            });
          });
        }
        function retrieveRecaptchaToken(siteKey, resolve, reject) {
          const grecaptcha = window.grecaptcha;
          if (isEnterprise(grecaptcha)) {
            grecaptcha.enterprise.ready(() => {
              grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
                resolve(token);
              }).catch(() => {
                resolve(FAKE_TOKEN);
              });
            });
          } else {
            reject(Error("No reCAPTCHA enterprise script loaded."));
          }
        }
        if (this.auth.settings.appVerificationDisabledForTesting) {
          const mockRecaptcha = new MockGreCAPTCHATopLevel();
          return mockRecaptcha.execute("siteKey", { action: "verify" });
        }
        return new Promise((resolve, reject) => {
          retrieveSiteKey(this.auth).then(async (siteKey) => {
            if (!forceRefresh && isEnterprise(window.grecaptcha) && // If download has already been initiated, do not trigger another
            // download, await the promise here.
            _RecaptchaEnterpriseVerifier.scriptInjectionDeferred) {
              await _RecaptchaEnterpriseVerifier.scriptInjectionDeferred.promise;
              retrieveRecaptchaToken(siteKey, resolve, reject);
            } else {
              if (typeof window === "undefined") {
                reject(new Error("RecaptchaVerifier is only supported in browser"));
                return;
              }
              let url = _recaptchaEnterpriseScriptUrl();
              if (url.length !== 0) {
                url += siteKey + `&onload=${RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME}`;
              }
              _RecaptchaEnterpriseVerifier.scriptInjectionDeferred = new Deferred();
              window[RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME] = () => {
                _RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.resolve();
              };
              _loadJS(url).then(() => _RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.promise).then(() => {
                retrieveRecaptchaToken(siteKey, resolve, reject);
              }).catch((error) => {
                reject(error);
              });
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
    };
    RecaptchaEnterpriseVerifier.scriptInjectionDeferred = null;
    AuthCredential = class {
      /** @internal */
      constructor(providerId, signInMethod) {
        this.providerId = providerId;
        this.signInMethod = signInMethod;
      }
      /**
       * Returns a JSON-serializable representation of this object.
       *
       * @returns a JSON-serializable representation of this object.
       */
      toJSON() {
        return debugFail("not implemented");
      }
      /** @internal */
      _getIdTokenResponse(_auth) {
        return debugFail("not implemented");
      }
      /** @internal */
      _linkToIdToken(_auth, _idToken) {
        return debugFail("not implemented");
      }
      /** @internal */
      _getReauthenticationResolver(_auth) {
        return debugFail("not implemented");
      }
    };
    EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
      /** @internal */
      constructor(_email, _password, signInMethod, _tenantId = null) {
        super("password", signInMethod);
        this._email = _email;
        this._password = _password;
        this._tenantId = _tenantId;
      }
      /** @internal */
      static _fromEmailAndPassword(email, password) {
        return new _EmailAuthCredential(
          email,
          password,
          "password"
          /* SignInMethod.EMAIL_PASSWORD */
        );
      }
      /** @internal */
      static _fromEmailAndCode(email, oobCode, tenantId = null) {
        return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
      }
      /** {@inheritdoc AuthCredential.toJSON} */
      toJSON() {
        return {
          email: this._email,
          password: this._password,
          signInMethod: this.signInMethod,
          tenantId: this._tenantId
        };
      }
      /**
       * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
       *
       * @param json - Either `object` or the stringified representation of the object. When string is
       * provided, `JSON.parse` would be called first.
       *
       * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
       */
      static fromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        if (obj?.email && obj?.password) {
          if (obj.signInMethod === "password") {
            return this._fromEmailAndPassword(obj.email, obj.password);
          } else if (obj.signInMethod === "emailLink") {
            return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
          }
        }
        return null;
      }
      /** @internal */
      async _getIdTokenResponse(auth2) {
        switch (this.signInMethod) {
          case "password":
            const request = {
              returnSecureToken: true,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            };
            return handleRecaptchaFlow(
              auth2,
              request,
              "signInWithPassword",
              signInWithPassword,
              "EMAIL_PASSWORD_PROVIDER"
              /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
            );
          case "emailLink":
            return signInWithEmailLink$1(auth2, {
              email: this._email,
              oobCode: this._password
            });
          default:
            _fail(
              auth2,
              "internal-error"
              /* AuthErrorCode.INTERNAL_ERROR */
            );
        }
      }
      /** @internal */
      async _linkToIdToken(auth2, idToken) {
        switch (this.signInMethod) {
          case "password":
            const request = {
              idToken,
              returnSecureToken: true,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            };
            return handleRecaptchaFlow(
              auth2,
              request,
              "signUpPassword",
              linkEmailPassword,
              "EMAIL_PASSWORD_PROVIDER"
              /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
            );
          case "emailLink":
            return signInWithEmailLinkForLinking(auth2, {
              idToken,
              email: this._email,
              oobCode: this._password
            });
          default:
            _fail(
              auth2,
              "internal-error"
              /* AuthErrorCode.INTERNAL_ERROR */
            );
        }
      }
      /** @internal */
      _getReauthenticationResolver(auth2) {
        return this._getIdTokenResponse(auth2);
      }
    };
    IDP_REQUEST_URI$1 = "http://localhost";
    OAuthCredential = class _OAuthCredential extends AuthCredential {
      constructor() {
        super(...arguments);
        this.pendingToken = null;
      }
      /** @internal */
      static _fromParams(params) {
        const cred = new _OAuthCredential(params.providerId, params.signInMethod);
        if (params.idToken || params.accessToken) {
          if (params.idToken) {
            cred.idToken = params.idToken;
          }
          if (params.accessToken) {
            cred.accessToken = params.accessToken;
          }
          if (params.nonce && !params.pendingToken) {
            cred.nonce = params.nonce;
          }
          if (params.pendingToken) {
            cred.pendingToken = params.pendingToken;
          }
        } else if (params.oauthToken && params.oauthTokenSecret) {
          cred.accessToken = params.oauthToken;
          cred.secret = params.oauthTokenSecret;
        } else {
          _fail(
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
        }
        return cred;
      }
      /** {@inheritdoc AuthCredential.toJSON}  */
      toJSON() {
        return {
          idToken: this.idToken,
          accessToken: this.accessToken,
          secret: this.secret,
          nonce: this.nonce,
          pendingToken: this.pendingToken,
          providerId: this.providerId,
          signInMethod: this.signInMethod
        };
      }
      /**
       * Static method to deserialize a JSON representation of an object into an
       * {@link  AuthCredential}.
       *
       * @param json - Input can be either Object or the stringified representation of the object.
       * When string is provided, JSON.parse would be called first.
       *
       * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
       */
      static fromJSON(json) {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        const { providerId, signInMethod, ...rest } = obj;
        if (!providerId || !signInMethod) {
          return null;
        }
        const cred = new _OAuthCredential(providerId, signInMethod);
        cred.idToken = rest.idToken || void 0;
        cred.accessToken = rest.accessToken || void 0;
        cred.secret = rest.secret;
        cred.nonce = rest.nonce;
        cred.pendingToken = rest.pendingToken || null;
        return cred;
      }
      /** @internal */
      _getIdTokenResponse(auth2) {
        const request = this.buildRequest();
        return signInWithIdp(auth2, request);
      }
      /** @internal */
      _linkToIdToken(auth2, idToken) {
        const request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth2, request);
      }
      /** @internal */
      _getReauthenticationResolver(auth2) {
        const request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth2, request);
      }
      buildRequest() {
        const request = {
          requestUri: IDP_REQUEST_URI$1,
          returnSecureToken: true
        };
        if (this.pendingToken) {
          request.pendingToken = this.pendingToken;
        } else {
          const postBody = {};
          if (this.idToken) {
            postBody["id_token"] = this.idToken;
          }
          if (this.accessToken) {
            postBody["access_token"] = this.accessToken;
          }
          if (this.secret) {
            postBody["oauth_token_secret"] = this.secret;
          }
          postBody["providerId"] = this.providerId;
          if (this.nonce && !this.pendingToken) {
            postBody["nonce"] = this.nonce;
          }
          request.postBody = querystring(postBody);
        }
        return request;
      }
    };
    VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
      [
        "USER_NOT_FOUND"
        /* ServerError.USER_NOT_FOUND */
      ]: "user-not-found"
      /* AuthErrorCode.USER_DELETED */
    };
    PhoneAuthCredential = class _PhoneAuthCredential extends AuthCredential {
      constructor(params) {
        super(
          "phone",
          "phone"
          /* SignInMethod.PHONE */
        );
        this.params = params;
      }
      /** @internal */
      static _fromVerification(verificationId, verificationCode) {
        return new _PhoneAuthCredential({ verificationId, verificationCode });
      }
      /** @internal */
      static _fromTokenResponse(phoneNumber, temporaryProof) {
        return new _PhoneAuthCredential({ phoneNumber, temporaryProof });
      }
      /** @internal */
      _getIdTokenResponse(auth2) {
        return signInWithPhoneNumber$1(auth2, this._makeVerificationRequest());
      }
      /** @internal */
      _linkToIdToken(auth2, idToken) {
        return linkWithPhoneNumber$1(auth2, {
          idToken,
          ...this._makeVerificationRequest()
        });
      }
      /** @internal */
      _getReauthenticationResolver(auth2) {
        return verifyPhoneNumberForExisting(auth2, this._makeVerificationRequest());
      }
      /** @internal */
      _makeVerificationRequest() {
        const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
        if (temporaryProof && phoneNumber) {
          return { temporaryProof, phoneNumber };
        }
        return {
          sessionInfo: verificationId,
          code: verificationCode
        };
      }
      /** {@inheritdoc AuthCredential.toJSON} */
      toJSON() {
        const obj = {
          providerId: this.providerId
        };
        if (this.params.phoneNumber) {
          obj.phoneNumber = this.params.phoneNumber;
        }
        if (this.params.temporaryProof) {
          obj.temporaryProof = this.params.temporaryProof;
        }
        if (this.params.verificationCode) {
          obj.verificationCode = this.params.verificationCode;
        }
        if (this.params.verificationId) {
          obj.verificationId = this.params.verificationId;
        }
        return obj;
      }
      /** Generates a phone credential based on a plain object or a JSON string. */
      static fromJSON(json) {
        if (typeof json === "string") {
          json = JSON.parse(json);
        }
        const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
        if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
          return null;
        }
        return new _PhoneAuthCredential({
          verificationId,
          verificationCode,
          phoneNumber,
          temporaryProof
        });
      }
    };
    ActionCodeURL = class _ActionCodeURL {
      /**
       * @param actionLink - The link from which to extract the URL.
       * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
       *
       * @internal
       */
      constructor(actionLink) {
        const searchParams = querystringDecode(extractQuerystring(actionLink));
        const apiKey = searchParams[
          "apiKey"
          /* QueryField.API_KEY */
        ] ?? null;
        const code = searchParams[
          "oobCode"
          /* QueryField.CODE */
        ] ?? null;
        const operation = parseMode(searchParams[
          "mode"
          /* QueryField.MODE */
        ] ?? null);
        _assert(
          apiKey && code && operation,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.apiKey = apiKey;
        this.operation = operation;
        this.code = code;
        this.continueUrl = searchParams[
          "continueUrl"
          /* QueryField.CONTINUE_URL */
        ] ?? null;
        this.languageCode = searchParams[
          "lang"
          /* QueryField.LANGUAGE_CODE */
        ] ?? null;
        this.tenantId = searchParams[
          "tenantId"
          /* QueryField.TENANT_ID */
        ] ?? null;
      }
      /**
       * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
       * otherwise returns null.
       *
       * @param link  - The email action link string.
       * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
       *
       * @public
       */
      static parseLink(link) {
        const actionLink = parseDeepLink(link);
        try {
          return new _ActionCodeURL(actionLink);
        } catch {
          return null;
        }
      }
    };
    EmailAuthProvider = class _EmailAuthProvider {
      constructor() {
        this.providerId = _EmailAuthProvider.PROVIDER_ID;
      }
      /**
       * Initialize an {@link AuthCredential} using an email and password.
       *
       * @example
       * ```javascript
       * const authCredential = EmailAuthProvider.credential(email, password);
       * const userCredential = await signInWithCredential(auth, authCredential);
       * ```
       *
       * @example
       * ```javascript
       * const userCredential = await signInWithEmailAndPassword(auth, email, password);
       * ```
       *
       * @param email - Email address.
       * @param password - User account password.
       * @returns The auth provider credential.
       */
      static credential(email, password) {
        return EmailAuthCredential._fromEmailAndPassword(email, password);
      }
      /**
       * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
       * email link operation.
       *
       * @example
       * ```javascript
       * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
       * const userCredential = await signInWithCredential(auth, authCredential);
       * ```
       *
       * @example
       * ```javascript
       * await sendSignInLinkToEmail(auth, email);
       * // Obtain emailLink from user.
       * const userCredential = await signInWithEmailLink(auth, email, emailLink);
       * ```
       *
       * @param auth - The {@link Auth} instance used to verify the link.
       * @param email - Email address.
       * @param emailLink - Sign-in email link.
       * @returns - The auth provider credential.
       */
      static credentialWithLink(email, emailLink) {
        const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
        _assert(
          actionCodeUrl,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
      }
    };
    EmailAuthProvider.PROVIDER_ID = "password";
    EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
    EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
    FederatedAuthProvider = class {
      /**
       * Constructor for generic OAuth providers.
       *
       * @param providerId - Provider for which credentials should be generated.
       */
      constructor(providerId) {
        this.providerId = providerId;
        this.defaultLanguageCode = null;
        this.customParameters = {};
      }
      /**
       * Set the language gode.
       *
       * @param languageCode - language code
       */
      setDefaultLanguage(languageCode) {
        this.defaultLanguageCode = languageCode;
      }
      /**
       * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
       * operations.
       *
       * @remarks
       * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
       * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
       *
       * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
       */
      setCustomParameters(customOAuthParameters) {
        this.customParameters = customOAuthParameters;
        return this;
      }
      /**
       * Retrieve the current list of {@link CustomParameters}.
       */
      getCustomParameters() {
        return this.customParameters;
      }
    };
    BaseOAuthProvider = class extends FederatedAuthProvider {
      constructor() {
        super(...arguments);
        this.scopes = [];
      }
      /**
       * Add an OAuth scope to the credential.
       *
       * @param scope - Provider OAuth scope to add.
       */
      addScope(scope) {
        if (!this.scopes.includes(scope)) {
          this.scopes.push(scope);
        }
        return this;
      }
      /**
       * Retrieve the current list of OAuth scopes.
       */
      getScopes() {
        return [...this.scopes];
      }
    };
    FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
      constructor() {
        super(
          "facebook.com"
          /* ProviderId.FACEBOOK */
        );
      }
      /**
       * Creates a credential for Facebook.
       *
       * @example
       * ```javascript
       * // `event` from the Facebook auth.authResponseChange callback.
       * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
       * const result = await signInWithCredential(credential);
       * ```
       *
       * @param accessToken - Facebook access token.
       */
      static credential(accessToken) {
        return OAuthCredential._fromParams({
          providerId: _FacebookAuthProvider.PROVIDER_ID,
          signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
          accessToken
        });
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromResult(userCredential) {
        return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
       * thrown during a sign-in, link, or reauthenticate operation.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromError(error) {
        return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
      }
      static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
          return null;
        }
        if (!tokenResponse.oauthAccessToken) {
          return null;
        }
        try {
          return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
        } catch {
          return null;
        }
      }
    };
    FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
    FacebookAuthProvider.PROVIDER_ID = "facebook.com";
    GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
      constructor() {
        super(
          "google.com"
          /* ProviderId.GOOGLE */
        );
        this.addScope("profile");
      }
      /**
       * Creates a credential for Google. At least one of ID token and access token is required.
       *
       * @example
       * ```javascript
       * // \`googleUser\` from the onsuccess Google Sign In callback.
       * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
       * const result = await signInWithCredential(credential);
       * ```
       *
       * @param idToken - Google ID token.
       * @param accessToken - Google access token.
       */
      static credential(idToken, accessToken) {
        return OAuthCredential._fromParams({
          providerId: _GoogleAuthProvider.PROVIDER_ID,
          signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
          idToken,
          accessToken
        });
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromResult(userCredential) {
        return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
       * thrown during a sign-in, link, or reauthenticate operation.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromError(error) {
        return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
      }
      static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse) {
          return null;
        }
        const { oauthIdToken, oauthAccessToken } = tokenResponse;
        if (!oauthIdToken && !oauthAccessToken) {
          return null;
        }
        try {
          return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
        } catch {
          return null;
        }
      }
    };
    GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
    GoogleAuthProvider.PROVIDER_ID = "google.com";
    GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
      constructor() {
        super(
          "github.com"
          /* ProviderId.GITHUB */
        );
      }
      /**
       * Creates a credential for GitHub.
       *
       * @param accessToken - GitHub access token.
       */
      static credential(accessToken) {
        return OAuthCredential._fromParams({
          providerId: _GithubAuthProvider.PROVIDER_ID,
          signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
          accessToken
        });
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromResult(userCredential) {
        return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
       * thrown during a sign-in, link, or reauthenticate operation.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromError(error) {
        return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
      }
      static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
          return null;
        }
        if (!tokenResponse.oauthAccessToken) {
          return null;
        }
        try {
          return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
        } catch {
          return null;
        }
      }
    };
    GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
    GithubAuthProvider.PROVIDER_ID = "github.com";
    TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
      constructor() {
        super(
          "twitter.com"
          /* ProviderId.TWITTER */
        );
      }
      /**
       * Creates a credential for Twitter.
       *
       * @param token - Twitter access token.
       * @param secret - Twitter secret.
       */
      static credential(token, secret) {
        return OAuthCredential._fromParams({
          providerId: _TwitterAuthProvider.PROVIDER_ID,
          signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
          oauthToken: token,
          oauthTokenSecret: secret
        });
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromResult(userCredential) {
        return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
      }
      /**
       * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
       * thrown during a sign-in, link, or reauthenticate operation.
       *
       * @param userCredential - The user credential.
       */
      static credentialFromError(error) {
        return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
      }
      static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse) {
          return null;
        }
        const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
        if (!oauthAccessToken || !oauthTokenSecret) {
          return null;
        }
        try {
          return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
        } catch {
          return null;
        }
      }
    };
    TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
    TwitterAuthProvider.PROVIDER_ID = "twitter.com";
    UserCredentialImpl = class _UserCredentialImpl {
      constructor(params) {
        this.user = params.user;
        this.providerId = params.providerId;
        this._tokenResponse = params._tokenResponse;
        this.operationType = params.operationType;
      }
      static async _fromIdTokenResponse(auth2, operationType, idTokenResponse, isAnonymous = false) {
        const user = await UserImpl._fromIdTokenResponse(auth2, idTokenResponse, isAnonymous);
        const providerId = providerIdForResponse(idTokenResponse);
        const userCred = new _UserCredentialImpl({
          user,
          providerId,
          _tokenResponse: idTokenResponse,
          operationType
        });
        return userCred;
      }
      static async _forOperation(user, operationType, response) {
        await user._updateTokensIfNecessary(
          response,
          /* reload */
          true
        );
        const providerId = providerIdForResponse(response);
        return new _UserCredentialImpl({
          user,
          providerId,
          _tokenResponse: response,
          operationType
        });
      }
    };
    MultiFactorError = class _MultiFactorError extends FirebaseError {
      constructor(auth2, error, operationType, user) {
        super(error.code, error.message);
        this.operationType = operationType;
        this.user = user;
        Object.setPrototypeOf(this, _MultiFactorError.prototype);
        this.customData = {
          appName: auth2.name,
          tenantId: auth2.tenantId ?? void 0,
          _serverResponse: error.customData._serverResponse,
          operationType
        };
      }
      static _fromErrorAndOperation(auth2, error, operationType, user) {
        return new _MultiFactorError(auth2, error, operationType, user);
      }
    };
    STORAGE_AVAILABLE_KEY = "__sak";
    BrowserPersistenceClass = class {
      constructor(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
      }
      _isAvailable() {
        try {
          if (!this.storage) {
            return Promise.resolve(false);
          }
          this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
          this.storage.removeItem(STORAGE_AVAILABLE_KEY);
          return Promise.resolve(true);
        } catch {
          return Promise.resolve(false);
        }
      }
      _set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
      }
      _get(key) {
        const json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
      }
      _remove(key) {
        this.storage.removeItem(key);
        return Promise.resolve();
      }
      get storage() {
        return this.storageRetriever();
      }
    };
    _POLLING_INTERVAL_MS$1 = 1e3;
    IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
    BrowserLocalPersistence = class extends BrowserPersistenceClass {
      constructor() {
        super(
          () => window.localStorage,
          "LOCAL"
          /* PersistenceType.LOCAL */
        );
        this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
        this.listeners = {};
        this.localCache = {};
        this.pollTimer = null;
        this.fallbackToPolling = _isMobileBrowser();
        this._shouldAllowMigration = true;
      }
      forAllChangedKeys(cb) {
        for (const key of Object.keys(this.listeners)) {
          const newValue = this.storage.getItem(key);
          const oldValue = this.localCache[key];
          if (newValue !== oldValue) {
            cb(key, oldValue, newValue);
          }
        }
      }
      onStorageEvent(event, poll = false) {
        if (!event.key) {
          this.forAllChangedKeys((key2, _oldValue, newValue) => {
            this.notifyListeners(key2, newValue);
          });
          return;
        }
        const key = event.key;
        if (poll) {
          this.detachListener();
        } else {
          this.stopPolling();
        }
        const triggerListeners = () => {
          const storedValue2 = this.storage.getItem(key);
          if (!poll && this.localCache[key] === storedValue2) {
            return;
          }
          this.notifyListeners(key, storedValue2);
        };
        const storedValue = this.storage.getItem(key);
        if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
          setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
        } else {
          triggerListeners();
        }
      }
      notifyListeners(key, value) {
        this.localCache[key] = value;
        const listeners = this.listeners[key];
        if (listeners) {
          for (const listener of Array.from(listeners)) {
            listener(value ? JSON.parse(value) : value);
          }
        }
      }
      startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => {
          this.forAllChangedKeys((key, oldValue, newValue) => {
            this.onStorageEvent(
              new StorageEvent("storage", {
                key,
                oldValue,
                newValue
              }),
              /* poll */
              true
            );
          });
        }, _POLLING_INTERVAL_MS$1);
      }
      stopPolling() {
        if (this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
        }
      }
      attachListener() {
        window.addEventListener("storage", this.boundEventHandler);
      }
      detachListener() {
        window.removeEventListener("storage", this.boundEventHandler);
      }
      _addListener(key, listener) {
        if (Object.keys(this.listeners).length === 0) {
          if (this.fallbackToPolling) {
            this.startPolling();
          } else {
            this.attachListener();
          }
        }
        if (!this.listeners[key]) {
          this.listeners[key] = /* @__PURE__ */ new Set();
          this.localCache[key] = this.storage.getItem(key);
        }
        this.listeners[key].add(listener);
      }
      _removeListener(key, listener) {
        if (this.listeners[key]) {
          this.listeners[key].delete(listener);
          if (this.listeners[key].size === 0) {
            delete this.listeners[key];
          }
        }
        if (Object.keys(this.listeners).length === 0) {
          this.detachListener();
          this.stopPolling();
        }
      }
      // Update local cache on base operations:
      async _set(key, value) {
        await super._set(key, value);
        this.localCache[key] = JSON.stringify(value);
      }
      async _get(key) {
        const value = await super._get(key);
        this.localCache[key] = JSON.stringify(value);
        return value;
      }
      async _remove(key) {
        await super._remove(key);
        delete this.localCache[key];
      }
    };
    BrowserLocalPersistence.type = "LOCAL";
    browserLocalPersistence = BrowserLocalPersistence;
    POLLING_INTERVAL_MS = 1e3;
    CookiePersistence = class {
      constructor() {
        this.type = "COOKIE";
        this.listenerUnsubscribes = /* @__PURE__ */ new Map();
      }
      // used to get the URL to the backend to proxy to
      _getFinalTarget(originalUrl) {
        if (typeof window === void 0) {
          return originalUrl;
        }
        const url = new URL(`${window.location.origin}/__cookies__`);
        url.searchParams.set("finalTarget", originalUrl);
        return url;
      }
      // To be a usable persistence method in a chain browserCookiePersistence ensures that
      // prerequisites have been met, namely that we're in a secureContext, navigator and document are
      // available and cookies are enabled. Not all UAs support these method, so fallback accordingly.
      async _isAvailable() {
        if (typeof isSecureContext === "boolean" && !isSecureContext) {
          return false;
        }
        if (typeof navigator === "undefined" || typeof document === "undefined") {
          return false;
        }
        return navigator.cookieEnabled ?? true;
      }
      // Set should be a noop as we expect middleware to handle this
      async _set(_key, _value) {
        return;
      }
      // Attempt to get the cookie from cookieStore, fallback to document.cookie
      async _get(key) {
        if (!this._isAvailable()) {
          return null;
        }
        const name4 = getCookieName(key);
        if (window.cookieStore) {
          const cookie = await window.cookieStore.get(name4);
          return cookie?.value;
        }
        return getDocumentCookie(name4);
      }
      // Log out by overriding the idToken with a sentinel value of ""
      async _remove(key) {
        if (!this._isAvailable()) {
          return;
        }
        const existingValue = await this._get(key);
        if (!existingValue) {
          return;
        }
        const name4 = getCookieName(key);
        document.cookie = `${name4}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`;
        await fetch(`/__cookies__`, { method: "DELETE" }).catch(() => void 0);
      }
      // Listen for cookie changes, both cookieStore and fallback to polling document.cookie
      _addListener(key, listener) {
        if (!this._isAvailable()) {
          return;
        }
        const name4 = getCookieName(key);
        if (window.cookieStore) {
          const cb = (event) => {
            const changedCookie = event.changed.find((change) => change.name === name4);
            if (changedCookie) {
              listener(changedCookie.value);
            }
            const deletedCookie = event.deleted.find((change) => change.name === name4);
            if (deletedCookie) {
              listener(null);
            }
          };
          const unsubscribe2 = () => window.cookieStore.removeEventListener("change", cb);
          this.listenerUnsubscribes.set(listener, unsubscribe2);
          return window.cookieStore.addEventListener("change", cb);
        }
        let lastValue = getDocumentCookie(name4);
        const interval = setInterval(() => {
          const currentValue = getDocumentCookie(name4);
          if (currentValue !== lastValue) {
            listener(currentValue);
            lastValue = currentValue;
          }
        }, POLLING_INTERVAL_MS);
        const unsubscribe = () => clearInterval(interval);
        this.listenerUnsubscribes.set(listener, unsubscribe);
      }
      _removeListener(_key, listener) {
        const unsubscribe = this.listenerUnsubscribes.get(listener);
        if (!unsubscribe) {
          return;
        }
        unsubscribe();
        this.listenerUnsubscribes.delete(listener);
      }
    };
    CookiePersistence.type = "COOKIE";
    BrowserSessionPersistence = class extends BrowserPersistenceClass {
      constructor() {
        super(
          () => window.sessionStorage,
          "SESSION"
          /* PersistenceType.SESSION */
        );
      }
      _addListener(_key, _listener) {
        return;
      }
      _removeListener(_key, _listener) {
        return;
      }
    };
    BrowserSessionPersistence.type = "SESSION";
    browserSessionPersistence = BrowserSessionPersistence;
    Receiver = class _Receiver {
      constructor(eventTarget) {
        this.eventTarget = eventTarget;
        this.handlersMap = {};
        this.boundEventHandler = this.handleEvent.bind(this);
      }
      /**
       * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
       *
       * @param eventTarget - An event target (such as window or self) through which the underlying
       * messages will be received.
       */
      static _getInstance(eventTarget) {
        const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
        if (existingInstance) {
          return existingInstance;
        }
        const newInstance = new _Receiver(eventTarget);
        this.receivers.push(newInstance);
        return newInstance;
      }
      isListeningto(eventTarget) {
        return this.eventTarget === eventTarget;
      }
      /**
       * Fans out a MessageEvent to the appropriate listeners.
       *
       * @remarks
       * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
       * finished processing.
       *
       * @param event - The MessageEvent.
       *
       */
      async handleEvent(event) {
        const messageEvent = event;
        const { eventId, eventType, data } = messageEvent.data;
        const handlers = this.handlersMap[eventType];
        if (!handlers?.size) {
          return;
        }
        messageEvent.ports[0].postMessage({
          status: "ack",
          eventId,
          eventType
        });
        const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
        const response = await _allSettled(promises);
        messageEvent.ports[0].postMessage({
          status: "done",
          eventId,
          eventType,
          response
        });
      }
      /**
       * Subscribe an event handler for a particular event.
       *
       * @param eventType - Event name to subscribe to.
       * @param eventHandler - The event handler which should receive the events.
       *
       */
      _subscribe(eventType, eventHandler) {
        if (Object.keys(this.handlersMap).length === 0) {
          this.eventTarget.addEventListener("message", this.boundEventHandler);
        }
        if (!this.handlersMap[eventType]) {
          this.handlersMap[eventType] = /* @__PURE__ */ new Set();
        }
        this.handlersMap[eventType].add(eventHandler);
      }
      /**
       * Unsubscribe an event handler from a particular event.
       *
       * @param eventType - Event name to unsubscribe from.
       * @param eventHandler - Optional event handler, if none provided, unsubscribe all handlers on this event.
       *
       */
      _unsubscribe(eventType, eventHandler) {
        if (this.handlersMap[eventType] && eventHandler) {
          this.handlersMap[eventType].delete(eventHandler);
        }
        if (!eventHandler || this.handlersMap[eventType].size === 0) {
          delete this.handlersMap[eventType];
        }
        if (Object.keys(this.handlersMap).length === 0) {
          this.eventTarget.removeEventListener("message", this.boundEventHandler);
        }
      }
    };
    Receiver.receivers = [];
    Sender = class {
      constructor(target) {
        this.target = target;
        this.handlers = /* @__PURE__ */ new Set();
      }
      /**
       * Unsubscribe the handler and remove it from our tracking Set.
       *
       * @param handler - The handler to unsubscribe.
       */
      removeMessageHandler(handler) {
        if (handler.messageChannel) {
          handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
          handler.messageChannel.port1.close();
        }
        this.handlers.delete(handler);
      }
      /**
       * Send a message to the Receiver located at {@link target}.
       *
       * @remarks
       * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
       * receiver has had a chance to fully process the event.
       *
       * @param eventType - Type of event to send.
       * @param data - The payload of the event.
       * @param timeout - Timeout for waiting on an ACK from the receiver.
       *
       * @returns An array of settled promises from all the handlers that were listening on the receiver.
       */
      async _send(eventType, data, timeout = 50) {
        const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
        if (!messageChannel) {
          throw new Error(
            "connection_unavailable"
            /* _MessageError.CONNECTION_UNAVAILABLE */
          );
        }
        let completionTimer;
        let handler;
        return new Promise((resolve, reject) => {
          const eventId = _generateEventId("", 20);
          messageChannel.port1.start();
          const ackTimer = setTimeout(() => {
            reject(new Error(
              "unsupported_event"
              /* _MessageError.UNSUPPORTED_EVENT */
            ));
          }, timeout);
          handler = {
            messageChannel,
            onMessage(event) {
              const messageEvent = event;
              if (messageEvent.data.eventId !== eventId) {
                return;
              }
              switch (messageEvent.data.status) {
                case "ack":
                  clearTimeout(ackTimer);
                  completionTimer = setTimeout(
                    () => {
                      reject(new Error(
                        "timeout"
                        /* _MessageError.TIMEOUT */
                      ));
                    },
                    3e3
                    /* _TimeoutDuration.COMPLETION */
                  );
                  break;
                case "done":
                  clearTimeout(completionTimer);
                  resolve(messageEvent.data.response);
                  break;
                default:
                  clearTimeout(ackTimer);
                  clearTimeout(completionTimer);
                  reject(new Error(
                    "invalid_response"
                    /* _MessageError.INVALID_RESPONSE */
                  ));
                  break;
              }
            }
          };
          this.handlers.add(handler);
          messageChannel.port1.addEventListener("message", handler.onMessage);
          this.target.postMessage({
            eventType,
            eventId,
            data
          }, [messageChannel.port2]);
        }).finally(() => {
          if (handler) {
            this.removeMessageHandler(handler);
          }
        });
      }
    };
    DB_NAME2 = "firebaseLocalStorageDb";
    DB_VERSION2 = 1;
    DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
    DB_DATA_KEYPATH = "fbase_key";
    DBPromise = class {
      constructor(request) {
        this.request = request;
      }
      toPromise() {
        return new Promise((resolve, reject) => {
          this.request.addEventListener("success", () => {
            resolve(this.request.result);
          });
          this.request.addEventListener("error", () => {
            reject(this.request.error);
          });
        });
      }
    };
    _POLLING_INTERVAL_MS = 800;
    _TRANSACTION_RETRY_COUNT = 3;
    IndexedDBLocalPersistence = class {
      constructor() {
        this.type = "LOCAL";
        this.dbPromise = null;
        this._shouldAllowMigration = true;
        this.listeners = {};
        this.localCache = {};
        this.pollTimer = null;
        this.pendingWrites = 0;
        this.receiver = null;
        this.sender = null;
        this.serviceWorkerReceiverAvailable = false;
        this.activeServiceWorker = null;
        this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
        }, () => {
        });
      }
      async _openDb() {
        if (this.dbPromise) {
          return this.dbPromise;
        }
        this.dbPromise = _openDatabase();
        this.dbPromise.catch(() => {
          this.dbPromise = null;
        });
        return this.dbPromise;
      }
      async _withRetries(op) {
        let numAttempts = 0;
        while (true) {
          try {
            const db2 = await this._openDb();
            return await op(db2);
          } catch (e) {
            if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
              throw e;
            }
            if (this.dbPromise) {
              const db2 = await this.dbPromise;
              db2.close();
              this.dbPromise = null;
            }
          }
        }
      }
      /**
       * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
       * postMessage interface to send these events to the worker ourselves.
       */
      async initializeServiceWorkerMessaging() {
        return _isWorker() ? this.initializeReceiver() : this.initializeSender();
      }
      /**
       * As the worker we should listen to events from the main window.
       */
      async initializeReceiver() {
        this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
        this.receiver._subscribe("keyChanged", async (_origin, data) => {
          const keys = await this._poll();
          return {
            keyProcessed: keys.includes(data.key)
          };
        });
        this.receiver._subscribe("ping", async (_origin, _data) => {
          return [
            "keyChanged"
            /* _EventType.KEY_CHANGED */
          ];
        });
      }
      /**
       * As the main window, we should let the worker know when keys change (set and remove).
       *
       * @remarks
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
       * may not resolve.
       */
      async initializeSender() {
        this.activeServiceWorker = await _getActiveServiceWorker();
        if (!this.activeServiceWorker) {
          return;
        }
        this.sender = new Sender(this.activeServiceWorker);
        const results = await this.sender._send(
          "ping",
          {},
          800
          /* _TimeoutDuration.LONG_ACK */
        );
        if (!results) {
          return;
        }
        if (results[0]?.fulfilled && results[0]?.value.includes(
          "keyChanged"
          /* _EventType.KEY_CHANGED */
        )) {
          this.serviceWorkerReceiverAvailable = true;
        }
      }
      /**
       * Let the worker know about a changed key, the exact key doesn't technically matter since the
       * worker will just trigger a full sync anyway.
       *
       * @remarks
       * For now, we only support one service worker per page.
       *
       * @param key - Storage key which changed.
       */
      async notifyServiceWorker(key) {
        if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
          return;
        }
        try {
          await this.sender._send(
            "keyChanged",
            { key },
            // Use long timeout if receiver has previously responded to a ping from us.
            this.serviceWorkerReceiverAvailable ? 800 : 50
            /* _TimeoutDuration.ACK */
          );
        } catch {
        }
      }
      async _isAvailable() {
        try {
          if (!indexedDB) {
            return false;
          }
          await this._withRetries(async (db2) => {
            await _putObject(db2, STORAGE_AVAILABLE_KEY, "1");
            await _deleteObject(db2, STORAGE_AVAILABLE_KEY);
          });
          return true;
        } catch {
        }
        return false;
      }
      async _withPendingWrite(write) {
        this.pendingWrites++;
        try {
          await write();
        } finally {
          this.pendingWrites--;
        }
      }
      async _set(key, value) {
        return this._withPendingWrite(async () => {
          await this._withRetries((db2) => _putObject(db2, key, value));
          this.localCache[key] = value;
          return this.notifyServiceWorker(key);
        });
      }
      async _get(key) {
        const obj = await this._withRetries((db2) => getObject(db2, key));
        this.localCache[key] = obj;
        return obj;
      }
      async _remove(key) {
        return this._withPendingWrite(async () => {
          await this._withRetries((db2) => _deleteObject(db2, key));
          delete this.localCache[key];
          return this.notifyServiceWorker(key);
        });
      }
      async _poll() {
        const result = await this._withRetries((db2) => {
          const getAllRequest = getObjectStore(db2, false).getAll();
          return new DBPromise(getAllRequest).toPromise();
        });
        if (!result) {
          return [];
        }
        if (this.pendingWrites !== 0) {
          return [];
        }
        const keys = [];
        const keysInResult = /* @__PURE__ */ new Set();
        if (result.length !== 0) {
          for (const { fbase_key: key, value } of result) {
            keysInResult.add(key);
            if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
              this.notifyListeners(key, value);
              keys.push(key);
            }
          }
        }
        for (const localKey of Object.keys(this.localCache)) {
          if (this.localCache[localKey] && !keysInResult.has(localKey)) {
            this.notifyListeners(localKey, null);
            keys.push(localKey);
          }
        }
        return keys;
      }
      notifyListeners(key, newValue) {
        this.localCache[key] = newValue;
        const listeners = this.listeners[key];
        if (listeners) {
          for (const listener of Array.from(listeners)) {
            listener(newValue);
          }
        }
      }
      startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
      }
      stopPolling() {
        if (this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
        }
      }
      _addListener(key, listener) {
        if (Object.keys(this.listeners).length === 0) {
          this.startPolling();
        }
        if (!this.listeners[key]) {
          this.listeners[key] = /* @__PURE__ */ new Set();
          void this._get(key);
        }
        this.listeners[key].add(listener);
      }
      _removeListener(key, listener) {
        if (this.listeners[key]) {
          this.listeners[key].delete(listener);
          if (this.listeners[key].size === 0) {
            delete this.listeners[key];
          }
        }
        if (Object.keys(this.listeners).length === 0) {
          this.stopPolling();
        }
      }
    };
    IndexedDBLocalPersistence.type = "LOCAL";
    indexedDBLocalPersistence = IndexedDBLocalPersistence;
    _JSLOAD_CALLBACK = _generateCallbackName("rcb");
    NETWORK_TIMEOUT_DELAY = new Delay(3e4, 6e4);
    RECAPTCHA_VERIFIER_TYPE = "recaptcha";
    PhoneAuthProvider = class _PhoneAuthProvider {
      /**
       * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
       *
       */
      constructor(auth2) {
        this.providerId = _PhoneAuthProvider.PROVIDER_ID;
        this.auth = _castAuth(auth2);
      }
      /**
       *
       * Starts a phone number authentication flow by sending a verification code to the given phone
       * number.
       *
       * @example
       * ```javascript
       * const provider = new PhoneAuthProvider(auth);
       * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
       * // Obtain verificationCode from the user.
       * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
       * const userCredential = await signInWithCredential(auth, authCredential);
       * ```
       *
       * @example
       * An alternative flow is provided using the `signInWithPhoneNumber` method.
       * ```javascript
       * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
       * // Obtain verificationCode from the user.
       * const userCredential = confirmationResult.confirm(verificationCode);
       * ```
       *
       * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
       * E.164 format (e.g. +16505550101).
       * @param applicationVerifier - An {@link ApplicationVerifier}, which prevents
       * requests from unauthorized clients. This SDK includes an implementation
       * based on reCAPTCHA v2, {@link RecaptchaVerifier}. If you've enabled
       * reCAPTCHA Enterprise bot protection in Enforce mode, this parameter is
       * optional; in all other configurations, the parameter is required.
       *
       * @returns A Promise for a verification ID that can be passed to
       * {@link PhoneAuthProvider.credential} to identify this flow.
       */
      verifyPhoneNumber(phoneOptions, applicationVerifier) {
        return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
      }
      /**
       * Creates a phone auth credential, given the verification ID from
       * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
       * mobile device.
       *
       * @example
       * ```javascript
       * const provider = new PhoneAuthProvider(auth);
       * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
       * // Obtain verificationCode from the user.
       * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
       * const userCredential = signInWithCredential(auth, authCredential);
       * ```
       *
       * @example
       * An alternative flow is provided using the `signInWithPhoneNumber` method.
       * ```javascript
       * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
       * // Obtain verificationCode from the user.
       * const userCredential = await confirmationResult.confirm(verificationCode);
       * ```
       *
       * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
       * @param verificationCode - The verification code sent to the user's mobile device.
       *
       * @returns The auth provider credential.
       */
      static credential(verificationId, verificationCode) {
        return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
      }
      /**
       * Generates an {@link AuthCredential} from a {@link UserCredential}.
       * @param userCredential - The user credential.
       */
      static credentialFromResult(userCredential) {
        const credential = userCredential;
        return _PhoneAuthProvider.credentialFromTaggedObject(credential);
      }
      /**
       * Returns an {@link AuthCredential} when passed an error.
       *
       * @remarks
       *
       * This method works for errors like
       * `auth/account-exists-with-different-credentials`. This is useful for
       * recovering when attempting to set a user's phone number but the number
       * in question is already tied to another account. For example, the following
       * code tries to update the current user's phone number, and if that
       * fails, links the user with the account associated with that number:
       *
       * ```js
       * const provider = new PhoneAuthProvider(auth);
       * const verificationId = await provider.verifyPhoneNumber(number, verifier);
       * try {
       *   const code = ''; // Prompt the user for the verification code
       *   await updatePhoneNumber(
       *       auth.currentUser,
       *       PhoneAuthProvider.credential(verificationId, code));
       * } catch (e) {
       *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
       *     const cred = PhoneAuthProvider.credentialFromError(e);
       *     await linkWithCredential(auth.currentUser, cred);
       *   }
       * }
       *
       * // At this point, auth.currentUser.phoneNumber === number.
       * ```
       *
       * @param error - The error to generate a credential from.
       */
      static credentialFromError(error) {
        return _PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
      }
      static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse) {
          return null;
        }
        const { phoneNumber, temporaryProof } = tokenResponse;
        if (phoneNumber && temporaryProof) {
          return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
        }
        return null;
      }
    };
    PhoneAuthProvider.PROVIDER_ID = "phone";
    PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
    IdpCredential = class extends AuthCredential {
      constructor(params) {
        super(
          "custom",
          "custom"
          /* ProviderId.CUSTOM */
        );
        this.params = params;
      }
      _getIdTokenResponse(auth2) {
        return signInWithIdp(auth2, this._buildIdpRequest());
      }
      _linkToIdToken(auth2, idToken) {
        return signInWithIdp(auth2, this._buildIdpRequest(idToken));
      }
      _getReauthenticationResolver(auth2) {
        return signInWithIdp(auth2, this._buildIdpRequest());
      }
      _buildIdpRequest(idToken) {
        const request = {
          requestUri: this.params.requestUri,
          sessionId: this.params.sessionId,
          postBody: this.params.postBody,
          tenantId: this.params.tenantId,
          pendingToken: this.params.pendingToken,
          returnSecureToken: true,
          returnIdpCredential: true
        };
        if (idToken) {
          request.idToken = idToken;
        }
        return request;
      }
    };
    AbstractPopupRedirectOperation = class {
      constructor(auth2, filter, resolver, user, bypassAuthState = false) {
        this.auth = auth2;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
      }
      execute() {
        return new Promise(async (resolve, reject) => {
          this.pendingPromise = { resolve, reject };
          try {
            this.eventManager = await this.resolver._initialize(this.auth);
            await this.onExecution();
            this.eventManager.registerConsumer(this);
          } catch (e) {
            this.reject(e);
          }
        });
      }
      async onAuthEvent(event) {
        const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
        if (error) {
          this.reject(error);
          return;
        }
        const params = {
          auth: this.auth,
          requestUri: urlResponse,
          sessionId,
          tenantId: tenantId || void 0,
          postBody: postBody || void 0,
          user: this.user,
          bypassAuthState: this.bypassAuthState
        };
        try {
          this.resolve(await this.getIdpTask(type)(params));
        } catch (e) {
          this.reject(e);
        }
      }
      onError(error) {
        this.reject(error);
      }
      getIdpTask(type) {
        switch (type) {
          case "signInViaPopup":
          case "signInViaRedirect":
            return _signIn;
          case "linkViaPopup":
          case "linkViaRedirect":
            return _link;
          case "reauthViaPopup":
          case "reauthViaRedirect":
            return _reauth;
          default:
            _fail(
              this.auth,
              "internal-error"
              /* AuthErrorCode.INTERNAL_ERROR */
            );
        }
      }
      resolve(cred) {
        debugAssert(this.pendingPromise, "Pending promise was never set");
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
      }
      reject(error) {
        debugAssert(this.pendingPromise, "Pending promise was never set");
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
      }
      unregisterAndCleanUp() {
        if (this.eventManager) {
          this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
      }
    };
    _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
    PopupOperation = class _PopupOperation extends AbstractPopupRedirectOperation {
      constructor(auth2, filter, provider2, resolver, user) {
        super(auth2, filter, resolver, user);
        this.provider = provider2;
        this.authWindow = null;
        this.pollId = null;
        if (_PopupOperation.currentPopupAction) {
          _PopupOperation.currentPopupAction.cancel();
        }
        _PopupOperation.currentPopupAction = this;
      }
      async executeNotNull() {
        const result = await this.execute();
        _assert(
          result,
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        return result;
      }
      async onExecution() {
        debugAssert(this.filter.length === 1, "Popup operations only handle one event");
        const eventId = _generateEventId();
        this.authWindow = await this.resolver._openPopup(
          this.auth,
          this.provider,
          this.filter[0],
          // There's always one, see constructor
          eventId
        );
        this.authWindow.associatedEvent = eventId;
        this.resolver._originValidation(this.auth).catch((e) => {
          this.reject(e);
        });
        this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
          if (!isSupported) {
            this.reject(_createError(
              this.auth,
              "web-storage-unsupported"
              /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
            ));
          }
        });
        this.pollUserCancellation();
      }
      get eventId() {
        return this.authWindow?.associatedEvent || null;
      }
      cancel() {
        this.reject(_createError(
          this.auth,
          "cancelled-popup-request"
          /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
        ));
      }
      cleanUp() {
        if (this.authWindow) {
          this.authWindow.close();
        }
        if (this.pollId) {
          window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        _PopupOperation.currentPopupAction = null;
      }
      pollUserCancellation() {
        const poll = () => {
          if (this.authWindow?.window?.closed) {
            this.pollId = window.setTimeout(
              () => {
                this.pollId = null;
                this.reject(_createError(
                  this.auth,
                  "popup-closed-by-user"
                  /* AuthErrorCode.POPUP_CLOSED_BY_USER */
                ));
              },
              8e3
              /* _Timeout.AUTH_EVENT */
            );
            return;
          }
          this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
      }
    };
    PopupOperation.currentPopupAction = null;
    PENDING_REDIRECT_KEY = "pendingRedirect";
    redirectOutcomeMap = /* @__PURE__ */ new Map();
    RedirectAction = class extends AbstractPopupRedirectOperation {
      constructor(auth2, resolver, bypassAuthState = false) {
        super(auth2, [
          "signInViaRedirect",
          "linkViaRedirect",
          "reauthViaRedirect",
          "unknown"
          /* AuthEventType.UNKNOWN */
        ], resolver, void 0, bypassAuthState);
        this.eventId = null;
      }
      /**
       * Override the execute function; if we already have a redirect result, then
       * just return it.
       */
      async execute() {
        let readyOutcome = redirectOutcomeMap.get(this.auth._key());
        if (!readyOutcome) {
          try {
            const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
            const result = hasPendingRedirect ? await super.execute() : null;
            readyOutcome = () => Promise.resolve(result);
          } catch (e) {
            readyOutcome = () => Promise.reject(e);
          }
          redirectOutcomeMap.set(this.auth._key(), readyOutcome);
        }
        if (!this.bypassAuthState) {
          redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
        }
        return readyOutcome();
      }
      async onAuthEvent(event) {
        if (event.type === "signInViaRedirect") {
          return super.onAuthEvent(event);
        } else if (event.type === "unknown") {
          this.resolve(null);
          return;
        }
        if (event.eventId) {
          const user = await this.auth._redirectUserForId(event.eventId);
          if (user) {
            this.user = user;
            return super.onAuthEvent(event);
          } else {
            this.resolve(null);
          }
        }
      }
      async onExecution() {
      }
      cleanUp() {
      }
    };
    EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
    AuthEventManager = class {
      constructor(auth2) {
        this.auth = auth2;
        this.cachedEventUids = /* @__PURE__ */ new Set();
        this.consumers = /* @__PURE__ */ new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
      }
      registerConsumer(authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
          this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
          this.saveEventToCache(this.queuedRedirectEvent);
          this.queuedRedirectEvent = null;
        }
      }
      unregisterConsumer(authEventConsumer) {
        this.consumers.delete(authEventConsumer);
      }
      onEvent(event) {
        if (this.hasEventBeenHandled(event)) {
          return false;
        }
        let handled = false;
        this.consumers.forEach((consumer) => {
          if (this.isEventForConsumer(event, consumer)) {
            handled = true;
            this.sendToConsumer(event, consumer);
            this.saveEventToCache(event);
          }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
          return handled;
        }
        this.hasHandledPotentialRedirect = true;
        if (!handled) {
          this.queuedRedirectEvent = event;
          handled = true;
        }
        return handled;
      }
      sendToConsumer(event, consumer) {
        if (event.error && !isNullRedirectEvent(event)) {
          const code = event.error.code?.split("auth/")[1] || "internal-error";
          consumer.onError(_createError(this.auth, code));
        } else {
          consumer.onAuthEvent(event);
        }
      }
      isEventForConsumer(event, consumer) {
        const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
        return consumer.filter.includes(event.type) && eventIdMatches;
      }
      hasEventBeenHandled(event) {
        if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
          this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
      }
      saveEventToCache(event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
      }
    };
    IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    HTTP_REGEX = /^https?/;
    NETWORK_TIMEOUT = new Delay(3e4, 6e4);
    cachedGApiLoader = null;
    PING_TIMEOUT = new Delay(5e3, 15e3);
    IFRAME_PATH = "__/auth/iframe";
    EMULATED_IFRAME_PATH = "emulator/auth/iframe";
    IFRAME_ATTRIBUTES = {
      style: {
        position: "absolute",
        top: "-100px",
        width: "1px",
        height: "1px"
      },
      "aria-hidden": "true",
      tabindex: "-1"
    };
    EID_FROM_APIHOST = /* @__PURE__ */ new Map([
      ["identitytoolkit.googleapis.com", "p"],
      // production
      ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
      // staging
      ["test-identitytoolkit.sandbox.googleapis.com", "t"]
      // test
    ]);
    BASE_POPUP_OPTIONS = {
      location: "yes",
      resizable: "yes",
      statusbar: "yes",
      toolbar: "no"
    };
    DEFAULT_WIDTH = 500;
    DEFAULT_HEIGHT = 600;
    TARGET_BLANK = "_blank";
    FIREFOX_EMPTY_URL = "http://localhost";
    AuthPopup = class {
      constructor(window2) {
        this.window = window2;
        this.associatedEvent = null;
      }
      close() {
        if (this.window) {
          try {
            this.window.close();
          } catch (e) {
          }
        }
      }
    };
    WIDGET_PATH = "__/auth/handler";
    EMULATOR_WIDGET_PATH = "emulator/auth/handler";
    FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
    WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
    BrowserPopupRedirectResolver = class {
      constructor() {
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
      }
      // Wrapping in async even though we don't await anywhere in order
      // to make sure errors are raised as promise rejections
      async _openPopup(auth2, provider2, authType, eventId) {
        debugAssert(this.eventManagers[auth2._key()]?.manager, "_initialize() not called before _openPopup()");
        const url = await _getRedirectUrl(auth2, provider2, authType, _getCurrentUrl(), eventId);
        return _open(auth2, url, _generateEventId());
      }
      async _openRedirect(auth2, provider2, authType, eventId) {
        await this._originValidation(auth2);
        const url = await _getRedirectUrl(auth2, provider2, authType, _getCurrentUrl(), eventId);
        _setWindowLocation(url);
        return new Promise(() => {
        });
      }
      _initialize(auth2) {
        const key = auth2._key();
        if (this.eventManagers[key]) {
          const { manager, promise: promise2 } = this.eventManagers[key];
          if (manager) {
            return Promise.resolve(manager);
          } else {
            debugAssert(promise2, "If manager is not set, promise should be");
            return promise2;
          }
        }
        const promise = this.initAndGetManager(auth2);
        this.eventManagers[key] = { promise };
        promise.catch(() => {
          delete this.eventManagers[key];
        });
        return promise;
      }
      async initAndGetManager(auth2) {
        const iframe = await _openIframe(auth2);
        const manager = new AuthEventManager(auth2);
        iframe.register("authEvent", (iframeEvent) => {
          _assert(
            iframeEvent?.authEvent,
            auth2,
            "invalid-auth-event"
            /* AuthErrorCode.INVALID_AUTH_EVENT */
          );
          const handled = manager.onEvent(iframeEvent.authEvent);
          return {
            status: handled ? "ACK" : "ERROR"
            /* GapiOutcome.ERROR */
          };
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
        this.eventManagers[auth2._key()] = { manager };
        this.iframes[auth2._key()] = iframe;
        return manager;
      }
      _isIframeWebStorageSupported(auth2, cb) {
        const iframe = this.iframes[auth2._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
          const isSupported = result?.[0]?.[WEB_STORAGE_SUPPORT_KEY];
          if (isSupported !== void 0) {
            cb(!!isSupported);
          }
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
      }
      _originValidation(auth2) {
        const key = auth2._key();
        if (!this.originValidationPromises[key]) {
          this.originValidationPromises[key] = _validateOrigin(auth2);
        }
        return this.originValidationPromises[key];
      }
      get _shouldInitProactively() {
        return _isMobileBrowser() || _isSafari() || _isIOS();
      }
    };
    browserPopupRedirectResolver = BrowserPopupRedirectResolver;
    MultiFactorAssertionImpl = class {
      constructor(factorId) {
        this.factorId = factorId;
      }
      _process(auth2, session, displayName) {
        switch (session.type) {
          case "enroll":
            return this._finalizeEnroll(auth2, session.credential, displayName);
          case "signin":
            return this._finalizeSignIn(auth2, session.credential);
          default:
            return debugFail("unexpected MultiFactorSessionType");
        }
      }
    };
    PhoneMultiFactorAssertionImpl = class _PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
      constructor(credential) {
        super(
          "phone"
          /* FactorId.PHONE */
        );
        this.credential = credential;
      }
      /** @internal */
      static _fromCredential(credential) {
        return new _PhoneMultiFactorAssertionImpl(credential);
      }
      /** @internal */
      _finalizeEnroll(auth2, idToken, displayName) {
        return finalizeEnrollPhoneMfa(auth2, {
          idToken,
          displayName,
          phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
      }
      /** @internal */
      _finalizeSignIn(auth2, mfaPendingCredential) {
        return finalizeSignInPhoneMfa(auth2, {
          mfaPendingCredential,
          phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
      }
    };
    PhoneMultiFactorGenerator = class {
      constructor() {
      }
      /**
       * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
       *
       * @remarks
       * This method does not work in a Node.js environment.
       *
       * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
       * @returns A {@link PhoneMultiFactorAssertion} which can be used with
       * {@link MultiFactorResolver.resolveSignIn}
       */
      static assertion(credential) {
        return PhoneMultiFactorAssertionImpl._fromCredential(credential);
      }
    };
    PhoneMultiFactorGenerator.FACTOR_ID = "phone";
    TotpMultiFactorGenerator = class {
      /**
       * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
       * the TOTP (time-based one-time password) second factor.
       * This assertion is used to complete enrollment in TOTP second factor.
       *
       * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
       * @param oneTimePassword One-time password from TOTP App.
       * @returns A {@link TotpMultiFactorAssertion} which can be used with
       * {@link MultiFactorUser.enroll}.
       */
      static assertionForEnrollment(secret, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
      }
      /**
       * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
       * This assertion is used to complete signIn with TOTP as the second factor.
       *
       * @param enrollmentId identifies the enrolled TOTP second factor.
       * @param oneTimePassword One-time password from TOTP App.
       * @returns A {@link TotpMultiFactorAssertion} which can be used with
       * {@link MultiFactorResolver.resolveSignIn}.
       */
      static assertionForSignIn(enrollmentId, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
      }
      /**
       * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
       * Creates a TOTP secret as part of enrolling a TOTP second factor.
       * Used for generating a QR code URL or inputting into a TOTP app.
       * This method uses the auth instance corresponding to the user in the multiFactorSession.
       *
       * @param session The {@link MultiFactorSession} that the user is part of.
       * @returns A promise to {@link TotpSecret}.
       */
      static async generateSecret(session) {
        const mfaSession = session;
        _assert(
          typeof mfaSession.user?.auth !== "undefined",
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        const response = await startEnrollTotpMfa(mfaSession.user.auth, {
          idToken: mfaSession.credential,
          totpEnrollmentInfo: {}
        });
        return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
      }
    };
    TotpMultiFactorGenerator.FACTOR_ID = "totp";
    TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
      constructor(otp, enrollmentId, secret) {
        super(
          "totp"
          /* FactorId.TOTP */
        );
        this.otp = otp;
        this.enrollmentId = enrollmentId;
        this.secret = secret;
      }
      /** @internal */
      static _fromSecret(secret, otp) {
        return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
      }
      /** @internal */
      static _fromEnrollmentId(enrollmentId, otp) {
        return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
      }
      /** @internal */
      async _finalizeEnroll(auth2, idToken, displayName) {
        _assert(
          typeof this.secret !== "undefined",
          auth2,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        return finalizeEnrollTotpMfa(auth2, {
          idToken,
          displayName,
          totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
        });
      }
      /** @internal */
      async _finalizeSignIn(auth2, mfaPendingCredential) {
        _assert(
          this.enrollmentId !== void 0 && this.otp !== void 0,
          auth2,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        const totpVerificationInfo = { verificationCode: this.otp };
        return finalizeSignInTotpMfa(auth2, {
          mfaPendingCredential,
          mfaEnrollmentId: this.enrollmentId,
          totpVerificationInfo
        });
      }
    };
    TotpSecret = class _TotpSecret {
      // The public members are declared outside the constructor so the docs can be generated.
      constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth2) {
        this.sessionInfo = sessionInfo;
        this.auth = auth2;
        this.secretKey = secretKey;
        this.hashingAlgorithm = hashingAlgorithm;
        this.codeLength = codeLength;
        this.codeIntervalSeconds = codeIntervalSeconds;
        this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
      }
      /** @internal */
      static _fromStartTotpMfaEnrollmentResponse(response, auth2) {
        return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth2);
      }
      /** @internal */
      _makeTotpVerificationInfo(otp) {
        return { sessionInfo: this.sessionInfo, verificationCode: otp };
      }
      /**
       * Returns a QR code URL as described in
       * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
       * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
       * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
       *
       * @param accountName the name of the account/app along with a user identifier.
       * @param issuer issuer of the TOTP (likely the app name).
       * @returns A QR code URL string.
       */
      generateQrCodeUrl(accountName, issuer) {
        let useDefaults = false;
        if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
          useDefaults = true;
        }
        if (useDefaults) {
          if (_isEmptyString(accountName)) {
            accountName = this.auth.currentUser?.email || "unknownuser";
          }
          if (_isEmptyString(issuer)) {
            issuer = this.auth.name;
          }
        }
        return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
      }
    };
    name3 = "@firebase/auth";
    version3 = "1.13.3";
    AuthInterop = class {
      constructor(auth2) {
        this.auth = auth2;
        this.internalListeners = /* @__PURE__ */ new Map();
      }
      getUid() {
        this.assertAuthConfigured();
        return this.auth.currentUser?.uid || null;
      }
      async getToken(forceRefresh) {
        this.assertAuthConfigured();
        await this.auth._initializationPromise;
        if (!this.auth.currentUser) {
          return null;
        }
        const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
        return { accessToken };
      }
      addAuthTokenListener(listener) {
        this.assertAuthConfigured();
        if (this.internalListeners.has(listener)) {
          return;
        }
        const unsubscribe = this.auth.onIdTokenChanged((user) => {
          listener(user?.stsTokenManager.accessToken || null);
        });
        this.internalListeners.set(listener, unsubscribe);
        this.updateProactiveRefresh();
      }
      removeAuthTokenListener(listener) {
        this.assertAuthConfigured();
        const unsubscribe = this.internalListeners.get(listener);
        if (!unsubscribe) {
          return;
        }
        this.internalListeners.delete(listener);
        unsubscribe();
        this.updateProactiveRefresh();
      }
      assertAuthConfigured() {
        _assert(
          this.auth._initializationPromise,
          "dependent-sdk-initialized-before-auth"
          /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
        );
      }
      updateProactiveRefresh() {
        if (this.internalListeners.size > 0) {
          this.auth._startProactiveRefresh();
        } else {
          this.auth._stopProactiveRefresh();
        }
      }
    };
    DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
    authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
    lastPostedIdToken = null;
    mintCookieFactory = (url) => async (user) => {
      const idTokenResult = user && await user.getIdTokenResult();
      const idTokenAge = idTokenResult && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1e3;
      if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
        return;
      }
      const idToken = idTokenResult?.token;
      if (lastPostedIdToken === idToken) {
        return;
      }
      lastPostedIdToken = idToken;
      await fetch(url, {
        method: idToken ? "POST" : "DELETE",
        headers: idToken ? {
          "Authorization": `Bearer ${idToken}`
        } : {}
      });
    };
    _setExternalJSProvider({
      loadJS(url) {
        return new Promise((resolve, reject) => {
          const el = document.createElement("script");
          el.setAttribute("src", url);
          el.onload = resolve;
          el.onerror = (e) => {
            const error = _createError(
              "internal-error"
              /* AuthErrorCode.INTERNAL_ERROR */
            );
            error.customData = e;
            reject(error);
          };
          el.type = "text/javascript";
          el.charset = "UTF-8";
          getScriptParentElement().appendChild(el);
        });
      },
      gapiScript: "https://apis.google.com/js/api.js",
      recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
      recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
    });
    registerAuth(
      "Browser"
      /* ClientPlatform.BROWSER */
    );
  }
});

// node_modules/firebase/node_modules/@firebase/auth/dist/esm/index.js
var init_esm = __esm({
  "node_modules/firebase/node_modules/@firebase/auth/dist/esm/index.js"() {
    init_index_d90d2ee5();
    init_index_esm4();
    init_index_esm();
    init_index_esm3();
    init_index_esm2();
  }
});

// node_modules/firebase/auth/dist/esm/index.esm.js
var init_index_esm6 = __esm({
  "node_modules/firebase/auth/dist/esm/index.esm.js"() {
    init_esm();
  }
});

// firebase-applet-config.json
var firebase_applet_config_default;
var init_firebase_applet_config = __esm({
  "firebase-applet-config.json"() {
    firebase_applet_config_default = {
      projectId: "gen-lang-client-0096733152",
      appId: "1:281650535750:web:5414e50c5dafebbbc11947",
      apiKey: "AIzaSyDP5hh29eDNLMTze--L2BGraOulHgdTD7E",
      authDomain: "gen-lang-client-0096733152.firebaseapp.com",
      storageBucket: "gen-lang-client-0096733152.firebasestorage.app",
      messagingSenderId: "281650535750",
      measurementId: ""
    };
  }
});

// src/utils/googleDocs.ts
var app, auth, provider, cachedAccessToken, isSigningIn, initGoogleAuth;
var init_googleDocs = __esm({
  "src/utils/googleDocs.ts"() {
    "use strict";
    init_index_esm5();
    init_index_esm6();
    init_firebase_applet_config();
    app = initializeApp(firebase_applet_config_default);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/documents");
    provider.addScope("https://www.googleapis.com/auth/drive.file");
    cachedAccessToken = null;
    isSigningIn = false;
    initGoogleAuth = (onAuthSuccess, onAuthFailure) => {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (cachedAccessToken) {
            if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
          } else if (!isSigningIn) {
            cachedAccessToken = null;
            if (onAuthFailure) onAuthFailure();
          }
        } else {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      });
    };
  }
});

// src/utils/markdownUtils.ts
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function parseInlineMarkdownToHtmlSpans(text) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(text);
  let html = hasHtml ? text : escapeHtml(text);
  html = html.replace(/(?<!\w)\*\*(?!\s)(.+?)(?<!\s)\*\*(?!\w)/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\w)\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, "<em>$1</em>");
  html = html.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
    if (p1.includes("<strong>") || p1.includes("&lt;strong&gt;") || hasHtml && p1.includes("<")) return match;
    return `<strong>${p1}</strong>`;
  });
  html = html.replace(/\*(.*?)\*/g, (match, p1) => {
    if (p1.includes("<em>") || p1.includes("&lt;em&gt;") || hasHtml && p1.includes("<")) return match;
    return `<em>${p1}</em>`;
  });
  return html;
}
function parseSingleMarkdownTableToHtml(tableMarkdown) {
  const lines = tableMarkdown.split("\n").map((l) => l.trim()).filter((line) => line.startsWith("|") && line.endsWith("|"));
  if (lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`;
  let html = "<table>\n";
  const headerLine = lines.shift();
  let hasHeader = false;
  if (headerLine) {
    const headerCellsContent = headerLine.split("|").slice(1, -1).map((s) => s.trim());
    const isNextLineSeparator = lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/);
    if (isNextLineSeparator || headerCellsContent.some((c) => c.length > 0) && lines.length === 0) {
      html += "<thead>\n<tr>\n";
      headerCellsContent.forEach((cell) => {
        html += `<th>${parseInlineMarkdownToHtmlSpans(cell)}</th>
`;
      });
      html += "</tr>\n</thead>\n";
      hasHeader = true;
    } else {
      lines.unshift(headerLine);
    }
  }
  if (lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/)) {
    lines.shift();
    if (!hasHeader && lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`;
  } else if (hasHeader && lines.length === 0) {
    html += "<tbody></tbody>\n</table>\n";
    return html;
  } else if (!hasHeader && lines.length === 0 && !headerLine) {
    return "";
  } else if (!hasHeader && lines.length === 0 && headerLine && !headerLine.split("|").slice(1, -1).join("").trim()) {
    return "";
  }
  html += "<tbody>\n";
  let rowCount = 0;
  lines.forEach((line) => {
    const bodyCellsContent = line.split("|").slice(1, -1);
    if (bodyCellsContent.join("").trim() === "") return;
    html += "<tr>\n";
    bodyCellsContent.forEach((cell) => {
      html += `<td>${parseInlineMarkdownToHtmlSpans(cell.trim())}</td>
`;
    });
    html += "</tr>\n";
    rowCount++;
  });
  html += "</tbody>\n</table>\n";
  if (!hasHeader && rowCount === 0) {
    return tableMarkdown.split("\n").map((line) => `<p>${parseInlineMarkdownToHtmlSpans(line)}</p>`).join("\n");
  }
  return html;
}
function cleanMarkdownContent(markdown) {
  let content = markdown.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = content.match(fenceRegex);
  if (match && match[2]) {
    content = match[2].trim();
  }
  let lines = content.split("\n");
  let startIndex = 0;
  const judulMarker = "[JUDUL RPP/MODUL AJAR:";
  const sectionAMarker = "A. INFORMASI UMUM";
  const unwantedPreamblePhrases = [
    "Tentu, sebagai ahli",
    "Tentu, berikut adalah",
    "Tentu, Bapak/Ibu Guru",
    "Berikut adalah drafnya:",
    "Berikut adalah rancangan RPP/Modul Ajar",
    "Berikut rancangan Modul Ajar",
    "saya tidak perlu itu",
    "langsung saja pada RPP/MODUL AJAR",
    "---"
  ];
  const genericRppHeaderRegex = /^RPP\/MODUL AJAR\s*.*?:?\s*$/i;
  let judulLineIndex = -1;
  let sectionALineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const currentLineTrimmed = lines[i].trim();
    if (currentLineTrimmed.includes(judulMarker)) {
      judulLineIndex = i;
      break;
    }
    if (sectionALineIndex === -1 && currentLineTrimmed.startsWith(sectionAMarker)) {
      sectionALineIndex = i;
    }
  }
  if (judulLineIndex !== -1) {
    startIndex = judulLineIndex;
  } else if (sectionALineIndex !== -1) {
    let potentialTitleIndex = -1;
    for (let i = sectionALineIndex - 1; i >= 0; i--) {
      const lineToCheck = lines[i].trim();
      if (lineToCheck.length === 0) continue;
      const isUnwanted = unwantedPreamblePhrases.some((phrase) => lineToCheck.toLowerCase().includes(phrase.toLowerCase())) || genericRppHeaderRegex.test(lineToCheck);
      if (!isUnwanted) {
        potentialTitleIndex = i;
        break;
      } else if (genericRppHeaderRegex.test(lineToCheck) || lineToCheck.toLowerCase().includes("langsung saja pada")) {
        break;
      }
    }
    startIndex = potentialTitleIndex !== -1 ? potentialTitleIndex : sectionALineIndex;
  } else {
    for (let i = 0; i < lines.length; i++) {
      const currentLineTrimmed = lines[i].trim();
      if (currentLineTrimmed.length === 0) {
        startIndex = i + 1;
        continue;
      }
      const isUnwanted = unwantedPreamblePhrases.some((phrase) => currentLineTrimmed.toLowerCase().includes(phrase.toLowerCase())) || genericRppHeaderRegex.test(currentLineTrimmed);
      if (!isUnwanted) {
        startIndex = i;
        break;
      } else {
        startIndex = i + 1;
      }
    }
  }
  if (startIndex >= lines.length) {
    return "<p>Tidak ada konten RPP yang dapat ditampilkan. Respons AI mungkin hanya berisi pendahuluan.</p>";
  }
  const finalLinesToParse = lines.slice(startIndex);
  if (finalLinesToParse.length === 0 || finalLinesToParse.every((line) => line.trim() === "")) {
    return "<p>Tidak ada konten RPP yang dapat ditampilkan setelah pembersihan pendahuluan.</p>";
  }
  return finalLinesToParse.join("\n");
}
function markdownToHtml(markdown) {
  const cleanedMarkdown = cleanMarkdownContent(markdown);
  if (cleanedMarkdown.startsWith("<p>Tidak ada konten")) {
    return cleanedMarkdown;
  }
  if (/<(?:table|h[1-6]|ul|ol|div|p)\b/i.test(cleanedMarkdown)) {
    return cleanedMarkdown;
  }
  let lines = cleanedMarkdown.split("\n");
  let htmlOutput = "";
  let inListType = null;
  let listLevel = 0;
  let tableLinesBuffer = [];
  function closeOpenList(targetLevel = -1) {
    while (inListType && listLevel >= targetLevel) {
      htmlOutput += inListType === "ul" ? "</ul>\n" : "</ol>\n";
      listLevel--;
      if (listLevel < 0) {
        inListType = null;
        listLevel = 0;
      }
    }
    if (targetLevel === -1) {
      inListType = null;
      listLevel = 0;
    }
  }
  function flushTableBuffer() {
    if (tableLinesBuffer.length > 0) {
      htmlOutput += parseSingleMarkdownTableToHtml(tableLinesBuffer.join("\n"));
      tableLinesBuffer = [];
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      closeOpenList();
      tableLinesBuffer.push(line);
      if (i === lines.length - 1) flushTableBuffer();
      continue;
    } else if (tableLinesBuffer.length > 0) {
      flushTableBuffer();
    }
    const headingMatch = line.trim().match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      closeOpenList();
      const level = headingMatch[1].length;
      const contentText = headingMatch[2].trim();
      const slug = contentText.replace(/\*\*/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      const content = parseInlineMarkdownToHtmlSpans(contentText);
      htmlOutput += `<h${level} id="${slug}">${content}</h${level}>
`;
      continue;
    }
    const listItemMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s+(.*)/);
    if (listItemMatch) {
      const indentSpace = listItemMatch[1].length;
      const marker = listItemMatch[2];
      const content = listItemMatch[3].trim();
      const currentLevel = Math.max(0, Math.floor(indentSpace / 2));
      const newListType = marker.match(/\d+\./) ? "ol" : "ul";
      if (currentLevel < listLevel || currentLevel === listLevel && inListType !== newListType && inListType) {
        closeOpenList(currentLevel);
      }
      if (!inListType || currentLevel > listLevel || inListType !== newListType) {
        htmlOutput += newListType === "ul" ? "<ul>\n" : "<ol>\n";
        inListType = newListType;
        listLevel = currentLevel;
      }
      htmlOutput += `  <li>${parseInlineMarkdownToHtmlSpans(content)}</li>
`;
      continue;
    }
    closeOpenList();
    if (line.trim().length > 0) {
      htmlOutput += `<p>${parseInlineMarkdownToHtmlSpans(line.trim())}</p>
`;
    } else {
      if (htmlOutput.length > 0 && !htmlOutput.endsWith("<br />\n") && !htmlOutput.endsWith("</ol>\n") && !htmlOutput.endsWith("</ul>\n") && !htmlOutput.endsWith("</table>\n") && !htmlOutput.match(/<\/h[1-6]>\n$/)) {
        htmlOutput += "<br />\n";
      }
    }
  }
  closeOpenList();
  flushTableBuffer();
  return htmlOutput;
}
function htmlToPlainText(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  tempDiv.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6").forEach((el) => {
    el.appendChild(document.createTextNode("\n"));
  });
  tempDiv.querySelectorAll("tr").forEach((tr) => {
    tr.querySelectorAll("td, th").forEach((cell) => {
      cell.appendChild(document.createTextNode("	"));
    });
    tr.appendChild(document.createTextNode("\n"));
  });
  let text = tempDiv.textContent || "";
  text = text.replace(/[ \t]{2,}/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}
function cleanTextForDocx(text) {
  if (!text) return "";
  let clean = text;
  clean = clean.replace(/\*\*(.*?)\*\*/g, "$1");
  clean = clean.replace(/\*(.*?)\*/g, "$1");
  clean = clean.replace(/__(.*?)__/g, "$1");
  clean = clean.replace(/^#{1,6}\s+/gm, "");
  return clean.trim();
}
function parseMarkdownToDocxJson(markdown) {
  const json = {};
  const titleMatch = markdown.match(/^# \*\*MODUL AJAR: (.*)\*\*/);
  json.judul_modul = titleMatch ? cleanTextForDocx(titleMatch[1].trim()) : "Tanpa Judul";
  const identitasSection = getContentBetween(markdown, "## Identitas", "## IDENTIFIKASI");
  json.mata_pelajaran = cleanTextForDocx(extractValue(identitasSection, "Mata Pelajaran"));
  json.kelas_fase = cleanTextForDocx(extractValue(identitasSection, "Kelas/Fase"));
  json.materi = cleanTextForDocx(extractValue(identitasSection, "Materi"));
  json.alokasi_waktu = cleanTextForDocx(extractValue(identitasSection, "Alokasi Waktu"));
  json.peserta_didik = cleanTextForDocx(extractValue(identitasSection, "Peserta Didik"));
  json.show_peserta_didik = !!json.peserta_didik;
  const identifikasiSection = getContentBetween(markdown, "## IDENTIFIKASI", "### Langkah-Langkah Pembelajaran");
  json.capaian_pembelajaran = cleanTextForDocx(extractValue(identifikasiSection, "Capaian Pembelajaran"));
  json.show_capaian_pembelajaran = !!json.capaian_pembelajaran;
  json.dimensi_profil_lulusan = cleanTextForDocx(extractValue(identifikasiSection, "Dimensi Profil Lulusan"));
  json.show_dimensi_profil_lulusan = !!json.dimensi_profil_lulusan;
  json.lintas_disiplin_ilmu = cleanTextForDocx(extractValue(identifikasiSection, "Lintas Disiplin Ilmu"));
  json.show_lintas_disiplin_ilmu = !!json.lintas_disiplin_ilmu;
  let rawTujuan = getContentBetween(identifikasiSection, "- **Tujuan Pembelajaran:**", "- **Praktik Pedagogis:**").replace(/^- /gm, "").trim();
  if (rawTujuan.startsWith("[")) rawTujuan = rawTujuan.substring(1);
  if (rawTujuan.endsWith("]")) rawTujuan = rawTujuan.substring(0, rawTujuan.length - 1);
  json.tujuan_pembelajaran = cleanTextForDocx(rawTujuan);
  json.praktik_pedagogis = cleanTextForDocx(extractValue(identifikasiSection, "Praktik Pedagogis"));
  const langkahSection = getContentBetween(markdown, "### Langkah-Langkah Pembelajaran", "### Asesmen Pembelajaran");
  const pertemuanBlocks = langkahSection.split(/---+\s*#{1,6}\s*\**PERTEMUAN\s+(\d+)\**\s*---+/i).slice(1);
  json.langkah_pembelajaran = [];
  for (let i = 0; i < pertemuanBlocks.length; i += 2) {
    const pertemuanKe = pertemuanBlocks[i];
    const blockContent = pertemuanBlocks[i + 1];
    if (blockContent) {
      const kegiatan_awal = cleanTextForDocx(getContentBetween(blockContent, "**AWAL**", "**INTI**"));
      const kegiatan_inti = cleanTextForDocx(getContentBetween(blockContent, "**INTI**", "**PENUTUP**"));
      const penutupMarker = "**PENUTUP**";
      const penutupIndex = blockContent.indexOf(penutupMarker);
      const kegiatan_penutup = penutupIndex !== -1 ? cleanTextForDocx(blockContent.substring(penutupIndex + penutupMarker.length).trim()) : "";
      json.langkah_pembelajaran.push({
        pertemuan_ke: pertemuanKe,
        kegiatan_awal,
        kegiatan_inti,
        kegiatan_penutup
      });
    }
  }
  json.asesmen_pembelajaran = cleanTextForDocx(getContentBetween(markdown, "### Asesmen Pembelajaran", "## LAMPIRAN"));
  const lampiranSection = markdown.substring(markdown.indexOf("## LAMPIRAN"));
  json.rubrik_penilaian = cleanTextForDocx(getContentBetween(lampiranSection, "### 1. Rubrik Penilaian", "### 2. LKPD"));
  json.lkpd = cleanTextForDocx(getContentBetween(lampiranSection, "### 2. LKPD", "### 3. Evaluasi Mandiri"));
  json.evaluasi_mandiri = cleanTextForDocx(getContentBetween(lampiranSection, "### 3. Evaluasi Mandiri", "### 4. Materi Ajar"));
  json.materi_ajar = cleanTextForDocx(lampiranSection.substring(lampiranSection.indexOf("### 4. Materi Ajar") + "### 4. Materi Ajar".length).trim());
  return json;
}
var getContentBetween, extractValue;
var init_markdownUtils = __esm({
  "src/utils/markdownUtils.ts"() {
    "use strict";
    getContentBetween = (text, start, end) => {
      const startIndex = text.indexOf(start);
      if (startIndex === -1) return "";
      const endIndex = text.indexOf(end, startIndex);
      const content = endIndex === -1 ? text.substring(startIndex + start.length) : text.substring(startIndex + start.length, endIndex);
      return content.trim();
    };
    extractValue = (text, key) => {
      const regex = new RegExp(`- (?:\\*\\*)?${key}:(?:\\*\\*)?\\s*(.*)`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };
  }
});

// src/utils/docxUtils.ts
var docxUtils_exports = {};
__export(docxUtils_exports, {
  exportToWord: () => exportToWord
});
var createWordHtml, triggerDownload, exportToWord;
var init_docxUtils = __esm({
  "src/utils/docxUtils.ts"() {
    "use strict";
    createWordHtml = (bodyContent, orientation = "portrait") => {
      const pageStyle = orientation === "landscape" ? `@page WordSection1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 72.0pt 72.0pt 72.0pt 72.0pt; mso-header-margin: 35.4pt; mso-footer-margin: 35.4pt; mso-paper-source: 0; }
         div.WordSection1 { page: WordSection1; }` : `@page WordSection1 { size: 595.3pt 841.9pt; margin: 72.0pt 72.0pt 72.0pt 72.0pt; mso-header-margin: 35.4pt; mso-footer-margin: 35.4pt; mso-paper-source: 0; }
         div.WordSection1 { page: WordSection1; }`;
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
                         xmlns:w='urn:schemas-microsoft-com:office:word'
                         xmlns='http://www.w3.org/TR/REC-html40'>
                        <head>
                          <meta charset='utf-8'>
                          <title>Modul Ajar</title>
                          <style>
                            /* --- General Word Compatibility Styles --- */
                            ${pageStyle}
                            body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.3; }
                            p { margin: 0 0 8pt 0; }
                            /* Let Word handle list indentation by removing custom padding */
                            ul, ol { margin-top: 0; margin-bottom: 8pt; }
                            li { margin-bottom: 4pt; }
                            table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; }
                            td, th { border: 1px solid black; padding: 5px; }
                            th { background-color: #1a3a5c; color: white; font-weight: bold; }
                            h1, h2, h3, h4, h5, h6 { font-family: 'Cambria', 'Times New Roman', serif; margin-top: 18pt; margin-bottom: 10pt; }
                          </style>
                        </head><body><div class="WordSection1">`;
      const footer = "</div></body></html>";
      return header + bodyContent + footer;
    };
    triggerDownload = (blob, fileName) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    exportToWord = (htmlContent, fileName, orientation = "portrait") => {
      const wordCompatibleHtml = htmlContent.replace(/<br \/>/g, "<br>");
      const fullHtml = createWordHtml(wordCompatibleHtml, orientation);
      const blob = new Blob(["\uFEFF", fullHtml], {
        type: "application/msword"
      });
      triggerDownload(blob, `${fileName}.doc`);
    };
  }
});

// src/pages/HomePage.tsx
var HomePage_exports = {};
__export(HomePage_exports, {
  default: () => HomePage_default
});
import { useState as useState8, useEffect as useEffect6 } from "react";
import { Fragment as Fragment3, jsx as jsx18, jsxs as jsxs14 } from "react/jsx-runtime";
var TABS, emptyForm2, HomePage, HomePage_default;
var init_HomePage = __esm({
  "src/pages/HomePage.tsx"() {
    "use strict";
    init_fetchWithRetry();
    init_types();
    init_IdentityForm();
    init_LessonPlanForm();
    init_LessonPlanDisplay();
    init_LessonPlanEditor();
    init_useAuth();
    init_googleDocs();
    init_markdownUtils();
    TABS = [
      "Identitas & Kurikulum",
      "1. Analisis CP",
      "2. Tujuan Pembelajaran",
      "3. Alur TP (ATP)",
      "4. Program Tahunan",
      "5. Program Semester",
      "6. KKTP",
      "7. Modul Ajar"
    ];
    emptyForm2 = {
      provinsiKota: "",
      dinasPendidikan: "",
      satuanPendidikan: "SMP Negeri 3 Kerinci",
      alamatSekolah: "Jl. Lempur Tengah",
      mataPelajaran: "",
      singkatan: "",
      kelasFase: "Kelas VII",
      tahunPelajaran: "",
      alokasiWaktu: "",
      jpPerMinggu: "",
      durasiPertemuan: "",
      namaGuru: "",
      nipGuru: "",
      namaKepalaSekolah: "",
      nipKepalaSekolah: "",
      kotaTanggalTtd: "",
      elemenKode: "",
      cpUmum: "",
      cpPerElemen: "",
      kalenderPendidikan: "",
      rentangNilaiKktp: "",
      materi: "",
      jumlahPertemuan: "1 Pertemuan",
      jamPelajaran: "",
      pesertaDidik: "",
      dimensiProfilLulusan: [],
      capaianPembelajaran: "",
      lintasDisiplinIlmu: "",
      tujuanPembelajaran: "",
      praktikPedagogis: "Pendekatan Berdiferensiasi",
      lingkunganPembelajaran: "",
      pemanfaatanDigital: "",
      kemitraanPembelajaran: ""
    };
    HomePage = () => {
      const { authData, updatePoints } = useAuth();
      const [appMode, setAppMode] = useState8("select");
      const [activeTab, setActiveTab] = useState8(0);
      const [formData, setFormData] = useState8(emptyForm2);
      const [pricingConfig, setPricingConfig] = useState8(null);
      const [docs, setDocs] = useState8({});
      const [isLoadingStep, setIsLoadingStep] = useState8(0);
      const [error, setError] = useState8(null);
      const [extractedTPs, setExtractedTPs] = useState8([]);
      const [modulHtml, setModulHtml] = useState8(null);
      const [isGeneratingModul, setIsGeneratingModul] = useState8(false);
      const [isEditingModul, setIsEditingModul] = useState8(false);
      useEffect6(() => {
        initGoogleAuth((u, t) => {
        }, () => {
        });
        initDB().catch(console.error);
        fetch("/api/pricing/config").then((res) => res.json()).then(setPricingConfig).catch(console.error);
      }, []);
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      const parseATP = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const tables = doc.querySelectorAll("table");
        let tps = [];
        tables.forEach((table) => {
          const rows = table.querySelectorAll("tr");
          let headerIndices = { kode: -1, tujuan: -1, materi: -1, alokasi: -1 };
          rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll("td, th"));
            if (rowIndex < 2) {
              cells.forEach((cell, cellIndex) => {
                const text = cell.textContent?.toLowerCase() || "";
                if (text.includes("kode") || text.includes("tp")) headerIndices.kode = cellIndex;
                if (text.includes("tujuan") || text.includes("pembelajaran")) headerIndices.tujuan = cellIndex;
                if (text.includes("materi")) headerIndices.materi = cellIndex;
                if (text.includes("alokasi") || text.includes("jp") || text.includes("waktu")) headerIndices.alokasi = cellIndex;
              });
            }
            if (cells.length >= 2) {
              const rowText = row.textContent?.toLowerCase() || "";
              const isHeader = rowText.includes("kode") || rowText.includes("tujuan") || rowText.includes("alokasi");
              if (!isHeader) {
                const kode = headerIndices.kode !== -1 ? cells[headerIndices.kode]?.textContent?.trim() : cells[0]?.textContent?.trim();
                const tujuan = headerIndices.tujuan !== -1 ? cells[headerIndices.tujuan]?.textContent?.trim() : cells[1]?.textContent?.trim();
                const materi = headerIndices.materi !== -1 ? cells[headerIndices.materi]?.textContent?.trim() : cells[2]?.textContent?.trim();
                const alokasi = headerIndices.alokasi !== -1 ? cells[headerIndices.alokasi]?.textContent?.trim() : cells[3]?.textContent?.trim();
                if (tujuan && tujuan.length > 5) {
                  tps.push({ kode, tujuan, materi, alokasi });
                }
              }
            }
          });
        });
        const uniqueTPs = Array.from(new Set(tps.map((t) => JSON.stringify(t)))).map((t) => JSON.parse(t));
        setExtractedTPs(uniqueTPs);
      };
      const handleGenerateBundle = async () => {
        setError(null);
        let bundleId = null;
        let previousDocs = {};
        for (let step = 1; step <= 6; step++) {
          setIsLoadingStep(step);
          try {
            const response = await fetchWithRetry("/api/generate-bundle-step", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authData.token}` },
              body: JSON.stringify({ step, inputData: formData, previousDocs, bundleId })
            }, 3);
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message || `Gagal generate dokumen ${step}`);
            }
            bundleId = response.headers.get("X-Bundle-Id") || bundleId;
            const text = await response.text();
            const html = markdownToHtml(text);
            setDocs((prev) => ({ ...prev, [step]: html }));
            previousDocs[`doc${step}`] = text;
            if (step === 3) parseATP(html);
          } catch (err) {
            setError(err.message);
            setIsLoadingStep(0);
            return;
          }
        }
        setIsLoadingStep(0);
        const bundleCost = pricingConfig?.bundleCost || 50;
        updatePoints(Math.max(0, (authData.user?.points || 0) - bundleCost));
        setActiveTab(1);
      };
      const handleGenerateModulAjar = async (data) => {
        if (!authData.token) return setError("Anda harus login");
        setIsGeneratingModul(true);
        setError(null);
        setModulHtml("");
        try {
          const response = await fetchWithRetry("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authData.token}` },
            body: JSON.stringify(data)
          }, 5);
          if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || "Gagal dari server AI.");
          }
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let accumulatedMarkdown = "";
          let newPoints = authData.user?.points || 0;
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              accumulatedMarkdown += chunk;
              setModulHtml(accumulatedMarkdown);
            }
            const numSessions = parseInt(data.jumlahPertemuan) || 1;
            const costConfig = pricingConfig?.sessionCosts.find((sc) => sc.sessions === numSessions);
            const cost = costConfig ? costConfig.cost : 0;
            updatePoints(Math.max(0, newPoints - cost));
            try {
              await addRppToHistory(data, accumulatedMarkdown);
            } catch (e) {
              console.error("Gagal simpan riwayat", e);
            }
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsGeneratingModul(false);
        }
      };
      const handleDownloadDoc = async (htmlContent, fileName, isLandscape = false) => {
        try {
          const { exportToWord: exportToWord2 } = await Promise.resolve().then(() => (init_docxUtils(), docxUtils_exports));
          exportToWord2(htmlContent, fileName, isLandscape ? "landscape" : "portrait");
        } catch (e) {
          setError("Gagal membuat DOC: " + e.message);
        }
      };
      const printDocument = (content, isLandscape = false) => {
        const printFrame = document.createElement("iframe");
        printFrame.style.position = "fixed";
        printFrame.style.right = "0";
        printFrame.style.bottom = "0";
        printFrame.style.width = "0";
        printFrame.style.height = "0";
        printFrame.style.border = "none";
        document.body.appendChild(printFrame);
        const doc = printFrame.contentWindow?.document;
        if (doc) {
          const size = isLandscape ? "A4 landscape" : "A4 portrait";
          doc.open();
          doc.write(`
                <html>
                <head>
                    <style>
                    @media print { 
                        @page { size: ${size}; margin: 1.5cm; } 
                        body { font-family: 'Calibri', sans-serif; color: black; line-height: 1.5; }
                        table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #1a3a5c !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
          doc.close();
          setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
            setTimeout(() => document.body.removeChild(printFrame), 500);
          }, 1e3);
        }
      };
      return /* @__PURE__ */ jsxs14("div", { className: "flex flex-col md:flex-row gap-6 min-h-screen", children: [
        appMode === "select" && /* @__PURE__ */ jsx18("div", { className: "flex-1 flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs14("div", { className: "max-w-4xl w-full", children: [
          /* @__PURE__ */ jsxs14("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsx18("h2", { className: "text-3xl font-bold text-slate-800 mb-4", children: "Mulai Buat Perangkat Ajar" }),
            /* @__PURE__ */ jsx18("p", { className: "text-slate-600", children: "Pilih mode pembuatan dokumen sesuai dengan kebutuhan dan sisa poin Anda." })
          ] }),
          /* @__PURE__ */ jsxs14("div", { className: "grid md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs14(
              "div",
              {
                className: "bg-white rounded-2xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col",
                onClick: () => {
                  setAppMode("modul_ajar");
                  setActiveTab(7);
                },
                children: [
                  /* @__PURE__ */ jsx18("div", { className: "w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600", children: /* @__PURE__ */ jsx18("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx18("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
                  /* @__PURE__ */ jsx18("h3", { className: "text-2xl font-bold text-slate-800 mb-3", children: "Modul Ajar Saja" }),
                  /* @__PURE__ */ jsx18("p", { className: "text-slate-600 mb-6 flex-1", children: "Cocok untuk mencoba secara gratis (Trial) dengan mengisi topik dan TP secara mandiri. Langsung buat RPP/Modul Ajar tanpa perlu membuat CP/ATP/Prota/Promes terlebih dahulu." }),
                  /* @__PURE__ */ jsx18("div", { className: "mt-auto", children: /* @__PURE__ */ jsx18("span", { className: "inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold", children: "Gratis 200 Poin Awal" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxs14(
              "div",
              {
                className: "bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col",
                onClick: () => {
                  setAppMode("bundle");
                  setActiveTab(0);
                },
                children: [
                  /* @__PURE__ */ jsx18("div", { className: "w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400", children: /* @__PURE__ */ jsx18("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx18("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }) }),
                  /* @__PURE__ */ jsx18("h3", { className: "text-2xl font-bold text-white mb-3", children: "Bundle Lengkap (Satu Semester)" }),
                  /* @__PURE__ */ jsx18("p", { className: "text-slate-300 mb-6 flex-1", children: "Isi identitas satu kali, sistem akan secara otomatis membuatkan Dokumen Analisis CP, Tujuan Pembelajaran, ATP, Prota, Promes, KKTP, hingga ke Modul Ajar." }),
                  /* @__PURE__ */ jsx18("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs14("span", { className: "inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-sm font-semibold", children: [
                    "Membutuhkan ",
                    pricingConfig?.bundleCost || 50,
                    " Poin / Bundle"
                  ] }) })
                ]
              }
            )
          ] })
        ] }) }),
        appMode !== "select" && /* @__PURE__ */ jsxs14(Fragment3, { children: [
          appMode === "bundle" && /* @__PURE__ */ jsxs14("div", { className: "w-full md:w-64 flex-shrink-0 bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 h-fit sticky top-8", children: [
            /* @__PURE__ */ jsx18("h3", { className: "text-white font-bold mb-4 text-lg border-b border-slate-600 pb-2", children: "Menu Dokumen" }),
            /* @__PURE__ */ jsx18("ul", { className: "space-y-2", children: TABS.map((tab, idx) => /* @__PURE__ */ jsx18("li", { children: /* @__PURE__ */ jsxs14(
              "button",
              {
                onClick: () => setActiveTab(idx),
                className: `w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === idx ? "bg-sky-600 text-white font-semibold" : "text-slate-300 hover:bg-slate-700"}`,
                children: [
                  tab,
                  isLoadingStep === idx && /* @__PURE__ */ jsx18("span", { className: "ml-2 animate-pulse text-sky-300", children: "\u23F3" })
                ]
              }
            ) }, idx)) })
          ] }),
          appMode === "modul_ajar" && /* @__PURE__ */ jsxs14("div", { className: "w-full md:w-64 flex-shrink-0 bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 h-fit sticky top-8", children: [
            /* @__PURE__ */ jsx18("h3", { className: "text-white font-bold mb-4 text-lg border-b border-slate-600 pb-2", children: "Navigasi" }),
            /* @__PURE__ */ jsxs14("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx18("li", { children: /* @__PURE__ */ jsx18(
                "button",
                {
                  onClick: () => setAppMode("select"),
                  className: "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 flex items-center",
                  children: "\u2190 Kembali ke Pilihan Mode"
                }
              ) }),
              /* @__PURE__ */ jsx18("li", { children: /* @__PURE__ */ jsx18(
                "button",
                {
                  className: "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors bg-sky-600 text-white font-semibold mt-4",
                  children: "Modul Ajar"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs14("div", { className: "flex-1 w-full max-w-[8.5in]", children: [
            error && /* @__PURE__ */ jsx18("div", { className: "bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200", children: error }),
            activeTab === 0 && /* @__PURE__ */ jsx18(
              IdentityForm,
              {
                formData,
                handleChange,
                onSubmit: handleGenerateBundle,
                isLoading: isLoadingStep > 0,
                bundleCost: pricingConfig?.bundleCost || 50
              }
            ),
            activeTab > 0 && activeTab < 7 && /* @__PURE__ */ jsxs14("div", { className: "bg-white p-8 rounded-xl shadow-lg border border-slate-100 min-h-[11in]", children: [
              /* @__PURE__ */ jsxs14("div", { className: "flex justify-between items-center mb-6 no-print", children: [
                /* @__PURE__ */ jsx18("h2", { className: "text-2xl font-bold text-slate-800", children: TABS[activeTab] }),
                /* @__PURE__ */ jsxs14("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx18("button", { onClick: () => handleDownloadDoc(docs[activeTab] || "", `Dokumen_${activeTab}_${formData.mataPelajaran}`, activeTab >= 3 && activeTab <= 6), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold", children: "Unduh DOC" }),
                  /* @__PURE__ */ jsx18("button", { onClick: () => printDocument(docs[activeTab] || "", activeTab >= 3 && activeTab <= 6), className: "bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold", children: "Cetak / PDF" })
                ] })
              ] }),
              docs[activeTab] ? /* @__PURE__ */ jsx18("div", { className: "prose max-w-none text-slate-800", dangerouslySetInnerHTML: { __html: docs[activeTab] } }) : /* @__PURE__ */ jsx18("div", { className: "text-slate-500 text-center py-20 italic", children: "Dokumen belum di-generate. Silakan generate dari tab Identitas." })
            ] }),
            activeTab === 7 && /* @__PURE__ */ jsxs14("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs14("div", { className: "bg-white p-6 rounded-xl shadow-lg border border-slate-100", children: [
                /* @__PURE__ */ jsx18("h2", { className: "text-2xl font-bold text-slate-800 mb-6", children: "Buat Modul Ajar Baru" }),
                extractedTPs.length > 0 ? /* @__PURE__ */ jsxs14("div", { className: "mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg", children: [
                  /* @__PURE__ */ jsx18("label", { className: "block text-sm font-semibold text-emerald-800 mb-2", children: "Pilih Tujuan Pembelajaran dari ATP:" }),
                  /* @__PURE__ */ jsxs14(
                    "select",
                    {
                      className: "w-full p-2 border border-emerald-300 rounded bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none",
                      onChange: (e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value }),
                      children: [
                        /* @__PURE__ */ jsx18("option", { value: "", children: "-- Pilih TP --" }),
                        extractedTPs.map((tp, i) => /* @__PURE__ */ jsxs14("option", { value: tp.tujuan, children: [
                          tp.kode,
                          " - ",
                          tp.tujuan
                        ] }, i))
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsx18("div", { className: "mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm", children: "\u26A0\uFE0F ATP belum digenerate atau TP tidak ditemukan. Anda dapat mengisi manual." }),
                /* @__PURE__ */ jsx18(
                  LessonPlanForm,
                  {
                    onSubmit: (data) => handleGenerateModulAjar({ ...formData, ...data }),
                    isLoading: isGeneratingModul,
                    points: authData.user?.points || 0,
                    sessionCosts: pricingConfig?.sessionCosts || [],
                    token: authData.token,
                    initialData: formData,
                    updatePoints: () => {
                    }
                  }
                )
              ] }),
              modulHtml && /* @__PURE__ */ jsxs14("div", { className: "bg-white p-8 rounded-xl shadow-lg border border-slate-100 min-h-[11in]", children: [
                /* @__PURE__ */ jsxs14("div", { className: "flex justify-between items-center mb-6 no-print", children: [
                  /* @__PURE__ */ jsx18("h2", { className: "text-2xl font-bold text-slate-800", children: "Preview Modul Ajar" }),
                  /* @__PURE__ */ jsxs14("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx18("button", { onClick: () => handleDownloadDoc(modulHtml || "", `ModulAjar_${formData.mataPelajaran}`, false), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold", children: "Unduh DOC" }),
                    /* @__PURE__ */ jsx18("button", { onClick: () => setIsEditingModul(!isEditingModul), className: "bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold", children: isEditingModul ? "Simpan" : "Edit" }),
                    /* @__PURE__ */ jsx18("button", { onClick: () => printDocument(modulHtml, false), className: "bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold", children: "Cetak / PDF" })
                  ] })
                ] }),
                isEditingModul ? /* @__PURE__ */ jsx18(LessonPlanEditor, { html: modulHtml, onChange: setModulHtml }) : /* @__PURE__ */ jsx18(LessonPlanDisplay, { htmlContent: modulHtml })
              ] })
            ] })
          ] })
        ] })
      ] });
    };
    HomePage_default = HomePage;
  }
});

// src/pages/AdminPage.tsx
var AdminPage_exports = {};
__export(AdminPage_exports, {
  default: () => AdminPage_default
});
import { useState as useState9, useEffect as useEffect7, useCallback } from "react";
import { jsx as jsx19, jsxs as jsxs15 } from "react/jsx-runtime";
var AdminPage, AdminPage_default;
var init_AdminPage = __esm({
  "src/pages/AdminPage.tsx"() {
    "use strict";
    init_useAuth();
    init_LoadingSpinner();
    AdminPage = () => {
      const { authData } = useAuth();
      const [users, setUsers] = useState9([]);
      const [pointsToAdd, setPointsToAdd] = useState9({});
      const [editingUserId, setEditingUserId] = useState9(null);
      const [editPointValue, setEditPointValue] = useState9("");
      const [loading, setLoading] = useState9(true);
      const [error, setError] = useState9(null);
      const [messages, setMessages] = useState9({});
      const [searchTerm, setSearchTerm] = useState9("");
      const [pricingConfig, setPricingConfig] = useState9({ pointPackages: [], paymentMethods: [], sessionCosts: [], bundleCost: 50 });
      const [isSavingConfig, setIsSavingConfig] = useState9(false);
      const [configMessage, setConfigMessage] = useState9(null);
      const maxSessions = 5;
      const fetchAllData = useCallback(async () => {
        if (!authData.token) return;
        setLoading(true);
        setError(null);
        try {
          const usersResponse = await fetch("/api/admin/users", {
            headers: { "Authorization": `Bearer ${authData.token}` }
          });
          const usersData = await usersResponse.json();
          if (!usersResponse.ok) throw new Error(usersData.message || "Gagal memuat pengguna.");
          setUsers(usersData);
          const configResponse = await fetch("/api/pricing/config");
          const configData = await configResponse.json();
          if (!configResponse.ok) throw new Error(configData.message || "Gagal memuat konfigurasi harga.");
          const sessionCostsMap = new Map(configData.sessionCosts.map((sc) => [sc.sessions, sc]));
          const fullSessionCosts = [];
          for (let i = 1; i <= maxSessions; i++) {
            if (sessionCostsMap.has(i)) {
              fullSessionCosts.push(sessionCostsMap.get(i));
            } else {
              fullSessionCosts.push({ sessions: i, cost: i * 20 });
            }
          }
          configData.sessionCosts = fullSessionCosts;
          setPricingConfig(configData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.");
        } finally {
          setLoading(false);
        }
      }, [authData.token]);
      useEffect7(() => {
        fetchAllData();
      }, [fetchAllData]);
      const handlePointsInputChange = (userId, value) => {
        setPointsToAdd((prev) => ({ ...prev, [userId]: value }));
      };
      const handleAddPoints = async (userEmail, userId) => {
        if (!authData.token) return;
        const points = Number(pointsToAdd[userId]);
        if (isNaN(points) || points <= 0) {
          setMessages((prev) => ({ ...prev, [userId]: { type: "error", text: "Poin harus angka positif." } }));
          return;
        }
        try {
          const response = await fetch("/api/admin/add-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authData.token}`
            },
            body: JSON.stringify({ email: userEmail, points })
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || "Gagal menambahkan poin.");
          setMessages((prev) => ({ ...prev, [userId]: { type: "success", text: result.message } }));
          setPointsToAdd((prev) => ({ ...prev, [userId]: "" }));
          setTimeout(() => {
            setMessages((prev) => {
              const newMessages = { ...prev };
              delete newMessages[userId];
              return newMessages;
            });
          }, 5e3);
          await fetchAllData();
        } catch (err) {
          setMessages((prev) => ({ ...prev, [userId]: { type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" } }));
        }
      };
      const startEditing = (user) => {
        setEditingUserId(user._id);
        setEditPointValue(user.points.toString());
      };
      const cancelEditing = () => {
        setEditingUserId(null);
        setEditPointValue("");
      };
      const saveEditedPoints = async (userId) => {
        if (!authData.token) return;
        const newPoints = Number(editPointValue);
        if (isNaN(newPoints) || newPoints < 0) {
          setMessages((prev) => ({ ...prev, [userId]: { type: "error", text: "Poin harus angka 0 atau lebih." } }));
          return;
        }
        try {
          const response = await fetch("/api/admin/update-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authData.token}`
            },
            body: JSON.stringify({ userId, points: newPoints })
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || "Gagal mengupdate poin.");
          setMessages((prev) => ({ ...prev, [userId]: { type: "success", text: "Poin berhasil diubah." } }));
          setEditingUserId(null);
          setTimeout(() => {
            setMessages((prev) => {
              const newMessages = { ...prev };
              delete newMessages[userId];
              return newMessages;
            });
          }, 3e3);
          await fetchAllData();
        } catch (err) {
          setMessages((prev) => ({ ...prev, [userId]: { type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" } }));
        }
      };
      const handleConfigChange = (type, index, field, value) => {
        const newConfig = { ...pricingConfig };
        newConfig[type][index][field] = value;
        setPricingConfig(newConfig);
      };
      const addConfigItem = (type) => {
        const newConfig = { ...pricingConfig };
        if (type === "pointPackages") {
          newConfig.pointPackages.push({ points: 0, price: 0 });
        } else {
          newConfig.paymentMethods.push({ method: "", details: "" });
        }
        setPricingConfig(newConfig);
      };
      const removeConfigItem = (type, index) => {
        const newConfig = { ...pricingConfig };
        newConfig[type].splice(index, 1);
        setPricingConfig(newConfig);
      };
      const handleSaveConfig = async () => {
        if (!authData.token) return;
        setIsSavingConfig(true);
        setConfigMessage(null);
        try {
          const response = await fetch("/api/admin/pricing", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authData.token}`
            },
            body: JSON.stringify(pricingConfig)
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || "Gagal menyimpan konfigurasi.");
          setConfigMessage({ type: "success", text: "Konfigurasi berhasil disimpan!" });
          setPricingConfig(result);
        } catch (err) {
          setConfigMessage({ type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" });
        } finally {
          setIsSavingConfig(false);
          setTimeout(() => setConfigMessage(null), 5e3);
        }
      };
      if (loading) return /* @__PURE__ */ jsx19("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx19(LoadingSpinner, {}) });
      if (error) return /* @__PURE__ */ jsx19("div", { className: "text-center text-red-400 bg-red-900/50 p-4 rounded-lg", children: error });
      const inputClass = "p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100";
      const buttonClass = "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md shadow-sm transition-all text-sm disabled:opacity-50";
      const filteredUsers = users.filter(
        (user) => user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return /* @__PURE__ */ jsxs15("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxs15("div", { className: "bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex justify-between items-center mb-6", children: [
            /* @__PURE__ */ jsx19("h2", { className: "text-3xl font-bold text-white", children: "Manajemen Pengguna" }),
            /* @__PURE__ */ jsx19("button", { onClick: fetchAllData, className: "bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all text-sm", children: "Refresh Data" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx19("label", { htmlFor: "search-user", className: "block text-sm font-medium text-sky-300 mb-2", children: "Cari Pengguna" }),
            /* @__PURE__ */ jsx19(
              "input",
              {
                type: "text",
                id: "search-user",
                placeholder: "Cari berdasarkan email...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100"
              }
            ),
            /* @__PURE__ */ jsx19("p", { className: "text-xs text-slate-400 mt-2", children: "Klik ikon pensil di kolom Poin untuk mengoreksi (overwrite) jumlah poin jika salah input." })
          ] }),
          /* @__PURE__ */ jsx19("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs15("table", { className: "w-full text-left text-slate-300", children: [
            /* @__PURE__ */ jsx19("thead", { className: "bg-slate-900/50 text-xs text-sky-300 uppercase", children: /* @__PURE__ */ jsxs15("tr", { children: [
              /* @__PURE__ */ jsx19("th", { className: "p-3", children: "Email" }),
              /* @__PURE__ */ jsx19("th", { className: "p-3 text-center", children: "Poin (Total)" }),
              /* @__PURE__ */ jsx19("th", { className: "p-3 text-center", children: "Tgl. Daftar" }),
              /* @__PURE__ */ jsx19("th", { className: "p-3", children: "Tambah (Top Up)" })
            ] }) }),
            /* @__PURE__ */ jsx19("tbody", { children: filteredUsers.length > 0 ? filteredUsers.map((user) => /* @__PURE__ */ jsxs15("tr", { className: "border-b border-slate-700 hover:bg-slate-700/50", children: [
              /* @__PURE__ */ jsx19("td", { className: "p-3 font-medium text-white", children: user.email }),
              /* @__PURE__ */ jsx19("td", { className: "p-3 text-center", children: editingUserId === user._id ? /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx19(
                  "input",
                  {
                    type: "number",
                    value: editPointValue,
                    onChange: (e) => setEditPointValue(e.target.value),
                    className: "w-20 p-1 bg-slate-600 border border-sky-500 rounded text-center text-white",
                    min: "0"
                  }
                ),
                /* @__PURE__ */ jsx19("button", { onClick: () => saveEditedPoints(user._id), title: "Simpan", className: "text-green-400 hover:text-green-300", children: /* @__PURE__ */ jsx19("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6", children: /* @__PURE__ */ jsx19("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m4.5 12.75 6 6 9-13.5" }) }) }),
                /* @__PURE__ */ jsx19("button", { onClick: cancelEditing, title: "Batal", className: "text-red-400 hover:text-red-300", children: /* @__PURE__ */ jsx19("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6", children: /* @__PURE__ */ jsx19("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }) }) })
              ] }) : /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-center gap-2 group", children: [
                /* @__PURE__ */ jsx19("span", { className: "font-bold text-emerald-400 text-lg", children: user.points }),
                /* @__PURE__ */ jsx19("button", { onClick: () => startEditing(user), className: "text-sky-500 hover:text-sky-400 transition-colors", title: "Edit Poin Manual", children: /* @__PURE__ */ jsx19("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx19("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" }) }) })
              ] }) }),
              /* @__PURE__ */ jsx19("td", { className: "p-3 text-center text-sm", children: new Date(user.createdAt).toLocaleDateString("id-ID") }),
              /* @__PURE__ */ jsxs15("td", { className: "p-3", children: [
                /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx19("input", { type: "number", value: pointsToAdd[user._id] || "", onChange: (e) => handlePointsInputChange(user._id, e.target.value), className: `${inputClass} w-24 text-center`, placeholder: "Jumlah", min: "1" }),
                  /* @__PURE__ */ jsx19("button", { onClick: () => handleAddPoints(user.email, user._id), className: buttonClass, children: "Tambah" })
                ] }),
                messages[user._id] && /* @__PURE__ */ jsx19("p", { className: `text-xs mt-1 ${messages[user._id].type === "success" ? "text-green-400" : "text-red-400"}`, children: messages[user._id].text })
              ] })
            ] }, user._id)) : /* @__PURE__ */ jsx19("tr", { children: /* @__PURE__ */ jsx19("td", { colSpan: 4, className: "text-center p-6 text-slate-400", children: searchTerm ? "Tidak ada pengguna yang cocok dengan pencarian." : "Tidak ada pengguna." }) }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsx19("h2", { className: "text-3xl font-bold text-white mb-6", children: "Pengaturan Harga & Pembayaran" }),
          /* @__PURE__ */ jsxs15("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs15("div", { className: "mb-8", children: [
              /* @__PURE__ */ jsx19("h3", { className: "text-xl font-semibold text-emerald-300 mb-4", children: "Biaya Bundle Dokumen 1-6 (Poin)" }),
              /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg", children: [
                /* @__PURE__ */ jsx19("span", { className: "font-medium text-slate-300 w-40", children: "Dokumen 1-6" }),
                /* @__PURE__ */ jsx19("input", { type: "number", value: pricingConfig.bundleCost || 50, onChange: (e) => setPricingConfig({ ...pricingConfig, bundleCost: Number(e.target.value) }), className: `${inputClass} w-40 text-center` }),
                /* @__PURE__ */ jsx19("span", { className: "text-slate-400", children: "Poin" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx19("h3", { className: "text-xl font-semibold text-sky-300 mb-4", children: "Biaya Pembuatan Modul Ajar (Poin)" }),
              /* @__PURE__ */ jsx19("div", { className: "space-y-3", children: pricingConfig.sessionCosts.map((sc, index) => /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg", children: [
                /* @__PURE__ */ jsxs15("span", { className: "font-medium text-slate-300 w-40", children: [
                  sc.sessions,
                  " Sesi Pembelajaran"
                ] }),
                /* @__PURE__ */ jsx19(
                  "input",
                  {
                    type: "number",
                    value: sc.cost,
                    onChange: (e) => handleConfigChange("sessionCosts", index, "cost", Number(e.target.value)),
                    className: `${inputClass} w-40 text-center`
                  }
                ),
                /* @__PURE__ */ jsx19("span", { className: "text-slate-400", children: "Poin" })
              ] }, sc.sessions)) })
            ] }),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx19("h3", { className: "text-xl font-semibold text-sky-300 mb-4", children: "Metode Pembayaran (Isi Ulang)" }),
              /* @__PURE__ */ jsx19("div", { className: "space-y-3", children: pricingConfig.paymentMethods.map((pm, index) => /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg", children: [
                /* @__PURE__ */ jsx19("input", { type: "text", placeholder: "Metode (cth: DANA)", value: pm.method, onChange: (e) => handleConfigChange("paymentMethods", index, "method", e.target.value), className: `${inputClass} flex-grow` }),
                /* @__PURE__ */ jsx19("input", { type: "text", placeholder: "Detail (cth: 0812... a/n...)", value: pm.details, onChange: (e) => handleConfigChange("paymentMethods", index, "details", e.target.value), className: `${inputClass} flex-grow` }),
                /* @__PURE__ */ jsx19("button", { onClick: () => removeConfigItem("paymentMethods", index), className: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm", children: "Hapus" })
              ] }, index)) }),
              /* @__PURE__ */ jsx19("button", { onClick: () => addConfigItem("paymentMethods"), className: "mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm", children: "Tambah Metode" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx19("h3", { className: "text-xl font-semibold text-sky-300 mb-4", children: "Paket Poin (Isi Ulang)" }),
              /* @__PURE__ */ jsx19("div", { className: "space-y-3", children: pricingConfig.pointPackages.map((pp, index) => /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg", children: [
                /* @__PURE__ */ jsx19("input", { type: "number", placeholder: "Jumlah Poin", value: pp.points, onChange: (e) => handleConfigChange("pointPackages", index, "points", Number(e.target.value)), className: `${inputClass} w-1/3` }),
                /* @__PURE__ */ jsx19("input", { type: "number", placeholder: "Harga (Rp)", value: pp.price, onChange: (e) => handleConfigChange("pointPackages", index, "price", Number(e.target.value)), className: `${inputClass} w-1/3` }),
                /* @__PURE__ */ jsx19("button", { onClick: () => removeConfigItem("pointPackages", index), className: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm", children: "Hapus" })
              ] }, index)) }),
              /* @__PURE__ */ jsx19("button", { onClick: () => addConfigItem("pointPackages"), className: "mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm", children: "Tambah Paket" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "border-t border-slate-700 pt-6", children: [
              /* @__PURE__ */ jsx19("button", { onClick: handleSaveConfig, disabled: isSavingConfig, className: "w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 text-lg", children: isSavingConfig ? "Menyimpan..." : "Simpan Perubahan Konfigurasi" }),
              configMessage && /* @__PURE__ */ jsx19("p", { className: `text-center mt-4 text-sm ${configMessage.type === "success" ? "text-green-400" : "text-red-400"}`, children: configMessage.text })
            ] })
          ] })
        ] })
      ] });
    };
    AdminPage_default = AdminPage;
  }
});

// src/pages/HistoryPage.tsx
var HistoryPage_exports = {};
__export(HistoryPage_exports, {
  default: () => HistoryPage_default
});
import { useState as useState10, useEffect as useEffect8, useCallback as useCallback2 } from "react";
import { Link as Link10 } from "react-router-dom";
import { jsx as jsx20, jsxs as jsxs16 } from "react/jsx-runtime";
var HistoryPage, HistoryPage_default;
var init_HistoryPage = __esm({
  "src/pages/HistoryPage.tsx"() {
    "use strict";
    init_types();
    init_LoadingSpinner();
    HistoryPage = () => {
      const [history, setHistory] = useState10([]);
      const [loading, setLoading] = useState10(true);
      const [error, setError] = useState10(null);
      const loadHistory = useCallback2(async () => {
        setLoading(true);
        try {
          await initDB();
          const rpps = await getAllRpps();
          setHistory(rpps);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gagal memuat riwayat.");
        } finally {
          setLoading(false);
        }
      }, []);
      useEffect8(() => {
        loadHistory();
      }, [loadHistory]);
      const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus riwayat Modul Ajar ini? Tindakan ini tidak dapat dibatalkan.")) {
          try {
            await deleteRppById(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menghapus item.");
          }
        }
      };
      if (loading) {
        return /* @__PURE__ */ jsx20("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx20(LoadingSpinner, {}) });
      }
      if (error) {
        return /* @__PURE__ */ jsx20("div", { className: "text-center text-red-400 bg-red-900/50 p-4 rounded-lg", children: error });
      }
      return /* @__PURE__ */ jsxs16("div", { className: "w-full max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs16("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsx20("h1", { className: "text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400", children: "Riwayat Modul Ajar" }),
          /* @__PURE__ */ jsx20("p", { className: "text-slate-300 mt-2 text-lg", children: "Lihat kembali Modul Ajar yang pernah Anda buat. Data disimpan di perangkat Anda." })
        ] }),
        /* @__PURE__ */ jsx20("div", { className: "bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 space-y-4", children: history.length === 0 ? /* @__PURE__ */ jsxs16("div", { className: "text-center text-slate-400 py-10", children: [
          /* @__PURE__ */ jsx20("p", { className: "text-xl", children: "Riwayat Anda masih kosong." }),
          /* @__PURE__ */ jsx20("p", { children: "Setiap Modul Ajar yang Anda buat akan muncul di sini." })
        ] }) : history.map((item) => /* @__PURE__ */ jsxs16("div", { className: "bg-slate-700/50 rounded-lg p-4 flex items-center justify-between shadow-md hover:bg-slate-700 transition-colors", children: [
          /* @__PURE__ */ jsxs16("div", { children: [
            /* @__PURE__ */ jsx20("p", { className: "font-semibold text-sky-300 text-lg", children: item.mataPelajaran }),
            /* @__PURE__ */ jsx20("p", { className: "text-white text-md font-light", children: item.materi }),
            /* @__PURE__ */ jsxs16("p", { className: "text-xs text-slate-400 mt-1", children: [
              "Dibuat pada: ",
              new Date(item.createdAt).toLocaleString("id-ID")
            ] })
          ] }),
          /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx20(Link10, { to: `/app/history/${item.id}`, className: "bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors", children: "Lihat" }),
            /* @__PURE__ */ jsx20("button", { onClick: () => handleDelete(item.id), className: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors", children: "Hapus" })
          ] })
        ] }, item.id)) })
      ] });
    };
    HistoryPage_default = HistoryPage;
  }
});

// src/utils/docxTemplaterUtils.ts
var docxTemplaterUtils_exports = {};
__export(docxTemplaterUtils_exports, {
  exportWithDocxTemplater: () => exportWithDocxTemplater
});
var exportWithDocxTemplater;
var init_docxTemplaterUtils = __esm({
  "src/utils/docxTemplaterUtils.ts"() {
    "use strict";
    exportWithDocxTemplater = async (data, fileName) => {
      const PizZip = (await import("pizzip")).default;
      const Docxtemplater = (await import("docxtemplater")).default;
      const saveAs = (await import("file-saver")).default;
      const response = await fetch("/api/template");
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(`Gagal mengambil file template dari server: ${errorData.message || response.statusText}`);
        } catch (e) {
          throw new Error(`Gagal mengambil file template dari server (status: ${response.status}).`);
        }
      }
      const templateBlob = await response.arrayBuffer();
      try {
        const zip = new PizZip(templateBlob);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true
          // Handles newlines (\n) in data by converting them to <w:br/>
        });
        doc.setData(data);
        doc.render();
        const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(out, fileName);
      } catch (error) {
        if (error instanceof Error && error.message.includes("Can't find end of central directory")) {
          throw new Error("File template yang diterima dari server rusak atau tidak valid. Silakan hubungi admin.");
        }
        throw error;
      }
    };
  }
});

// src/pages/HistoryDetailPage.tsx
var HistoryDetailPage_exports = {};
__export(HistoryDetailPage_exports, {
  default: () => HistoryDetailPage_default
});
import { useState as useState11, useEffect as useEffect9, useCallback as useCallback3 } from "react";
import { useParams as useParams2, Link as Link11 } from "react-router-dom";
import { Fragment as Fragment4, jsx as jsx21, jsxs as jsxs17 } from "react/jsx-runtime";
var HistoryDetailPage, HistoryDetailPage_default;
var init_HistoryDetailPage = __esm({
  "src/pages/HistoryDetailPage.tsx"() {
    "use strict";
    init_types();
    init_LoadingSpinner();
    init_LessonPlanDisplay();
    init_LessonPlanEditor();
    init_markdownUtils();
    init_docxUtils();
    HistoryDetailPage = () => {
      const { id } = useParams2();
      const [rpp, setRpp] = useState11(null);
      const [loading, setLoading] = useState11(true);
      const [error, setError] = useState11(null);
      const [isEditing, setIsEditing] = useState11(false);
      const [displayHtml, setDisplayHtml] = useState11(null);
      const [originalHtml, setOriginalHtml] = useState11(null);
      useEffect9(() => {
        const loadRpp = async () => {
          if (!id) {
            setError("ID Modul Ajar tidak ditemukan di URL.");
            setLoading(false);
            return;
          }
          try {
            await initDB();
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
              setError("ID Modul Ajar tidak valid. Pastikan URL benar.");
              setLoading(false);
              return;
            }
            const item = await getRppById(numericId);
            if (item) {
              setRpp(item);
              const html = markdownToHtml(item.generatedPlan);
              setDisplayHtml(html);
              setOriginalHtml(html);
            } else {
              setError(`Modul Ajar dengan ID ${id} tidak ditemukan di riwayat Anda.`);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat Modul Ajar dari database lokal.");
          } finally {
            setLoading(false);
          }
        };
        loadRpp();
      }, [id]);
      const handleDownloadTxt = useCallback3(async () => {
        if (!rpp || !displayHtml) return;
        try {
          const plainTextContent = htmlToPlainText(displayHtml);
          const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, "_")}.txt`;
          const blob = new Blob([plainTextContent], { type: "text/plain;charset=utf-8" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } catch (e) {
          console.error("Error generating TXT file:", e);
          setError(e instanceof Error ? `Kesalahan saat membuat file TXT: ${e.message}` : "Gagal membuat file TXT.");
        }
      }, [rpp, displayHtml]);
      const handleDownloadDoc = useCallback3(() => {
        if (!rpp || !displayHtml) return;
        try {
          const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, "_")}`;
          exportToWord(displayHtml, fileName);
        } catch (e) {
          console.error("Error creating DOC file:", e);
          setError(e instanceof Error ? `Kesalahan saat membuat file DOC: ${e.message}` : "Gagal membuat file DOC.");
        }
      }, [rpp, displayHtml]);
      const handleDownloadDocx = useCallback3(async () => {
        if (!rpp) return;
        try {
          const { exportWithDocxTemplater: exportWithDocxTemplater2 } = await Promise.resolve().then(() => (init_docxTemplaterUtils(), docxTemplaterUtils_exports));
          const jsonData = parseMarkdownToDocxJson(rpp.generatedPlan);
          const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, "_")}.docx`;
          await exportWithDocxTemplater2(jsonData, fileName);
        } catch (e) {
          console.error("Error creating DOCX from template:", e);
          setError(e instanceof Error ? `Gagal membuat file DOCX. Kesalahan: ${e.message}` : "Gagal membuat DOCX.");
        }
      }, [rpp]);
      const handlePrint = useCallback3(() => {
        if (!rpp) return;
        window.print();
      }, [rpp]);
      const handleEdit = () => setIsEditing(true);
      const handleSave = () => setIsEditing(false);
      const handleCancel = () => {
        setIsEditing(false);
        if (originalHtml) {
          setDisplayHtml(originalHtml);
        }
      };
      if (loading) {
        return /* @__PURE__ */ jsx21("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx21(LoadingSpinner, {}) });
      }
      if (error) {
        return /* @__PURE__ */ jsxs17("div", { className: "text-center p-4 max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxs17("div", { className: "text-center text-red-400 bg-red-900/50 p-6 rounded-lg shadow-lg", children: [
            /* @__PURE__ */ jsx21("p", { className: "font-bold text-xl mb-2", children: "Terjadi Kesalahan" }),
            /* @__PURE__ */ jsx21("p", { children: error })
          ] }),
          /* @__PURE__ */ jsx21(Link11, { to: "/app/history", className: "mt-6 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-md text-sm transition-colors shadow-md", children: "Kembali ke Riwayat" })
        ] });
      }
      if (!rpp) {
        return /* @__PURE__ */ jsxs17("div", { className: "text-center text-slate-400 py-10", children: [
          /* @__PURE__ */ jsx21("p", { className: "text-xl", children: "Modul Ajar tidak ditemukan." }),
          /* @__PURE__ */ jsx21(Link11, { to: "/app/history", className: "mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors", children: "Kembali ke Riwayat" })
        ] });
      }
      const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto no-print";
      const editButtonBaseClass = "font-semibold py-2 px-4 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2";
      return /* @__PURE__ */ jsxs17("div", { className: "w-full", children: [
        /* @__PURE__ */ jsx21("div", { className: "no-print mb-6", children: /* @__PURE__ */ jsxs17(Link11, { to: "/app/history", className: "inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-medium", children: [
          /* @__PURE__ */ jsx21("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx21("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5 8.25 12l7.5-7.5" }) }),
          "Kembali ke Riwayat"
        ] }) }),
        /* @__PURE__ */ jsxs17("div", { className: "text-center mb-6 no-print", children: [
          /* @__PURE__ */ jsx21("h1", { className: "text-3xl font-bold text-white", children: rpp.mataPelajaran }),
          /* @__PURE__ */ jsx21("p", { className: "text-slate-300 mt-1 text-lg", children: rpp.materi }),
          /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap gap-3 justify-center mt-6", children: [
            /* @__PURE__ */ jsx21("button", { onClick: handleDownloadDocx, className: `${downloadButtonBaseClass} bg-blue-600 hover:bg-blue-700`, children: "Unduh DOCX (Template)" }),
            /* @__PURE__ */ jsx21("button", { onClick: handleDownloadDoc, className: `${downloadButtonBaseClass} bg-gray-600 hover:bg-gray-700`, children: "Unduh DOC (Lama)" }),
            /* @__PURE__ */ jsx21("button", { onClick: handleDownloadTxt, className: `${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`, children: "Unduh TXT" }),
            /* @__PURE__ */ jsx21("button", { onClick: handlePrint, className: `${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`, children: "Cetak / Simpan PDF" })
          ] }),
          /* @__PURE__ */ jsx21("div", { className: "mt-4 flex flex-row gap-3 justify-center", children: !isEditing ? /* @__PURE__ */ jsxs17("button", { onClick: handleEdit, className: `${editButtonBaseClass} bg-slate-600 hover:bg-slate-700 text-white`, children: [
            /* @__PURE__ */ jsx21("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx21("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" }) }),
            "Edit Modul"
          ] }) : /* @__PURE__ */ jsxs17(Fragment4, { children: [
            /* @__PURE__ */ jsxs17("button", { onClick: handleSave, className: `${editButtonBaseClass} bg-green-500 hover:bg-green-600 text-white`, children: [
              /* @__PURE__ */ jsx21("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx21("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
              "Simpan Perubahan"
            ] }),
            /* @__PURE__ */ jsxs17("button", { onClick: handleCancel, className: `${editButtonBaseClass} bg-gray-500 hover:bg-gray-600 text-white`, children: [
              /* @__PURE__ */ jsx21("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx21("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
              "Batalkan"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx21("div", { id: "rpp-paper-preview", className: "bg-white rounded-md shadow-lg mx-auto p-8 md:p-12", style: { maxWidth: "8.5in" }, children: displayHtml && (isEditing ? /* @__PURE__ */ jsx21(LessonPlanEditor, { html: displayHtml, onChange: setDisplayHtml }) : /* @__PURE__ */ jsx21(LessonPlanDisplay, { htmlContent: displayHtml })) })
      ] });
    };
    HistoryDetailPage_default = HistoryDetailPage;
  }
});

// src/index.tsx
import React15 from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation as useLocation5, Navigate as Navigate3 } from "react-router-dom";

// src/components/Header.tsx
init_useAuth();
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var Header = () => {
  const { authData, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location2 = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isAppRoute = location2.pathname.startsWith("/app");
  const isPublicRoute = !isAppRoute;
  const appLogoLink = isAuthenticated ? "/app" : "/";
  const headerBgClass = isPublicRoute ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-slate-900/50 backdrop-blur-sm shadow-lg";
  const navLinkClass = isPublicRoute ? "text-slate-600 hover:text-sky-600" : "text-slate-300 hover:text-white";
  return /* @__PURE__ */ jsx2("header", { className: `sticky top-0 z-50 transition-colors duration-300 ${headerBgClass}`, children: /* @__PURE__ */ jsx2("div", { className: "container mx-auto max-w-7xl px-4 sm:px-6 md:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
    /* @__PURE__ */ jsx2(Link, { to: appLogoLink, className: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400", children: "Modul Ajar Cerdas" }),
    /* @__PURE__ */ jsx2("nav", { className: "flex items-center gap-4", children: isAuthenticated ? (
      // Tampilan Header untuk Pengguna yang Sudah Login
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx2(Link, { to: "/app", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Home" }),
        isAdmin && /* @__PURE__ */ jsx2(Link, { to: "/app/admin", className: "text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors", children: "Admin Panel" }),
        /* @__PURE__ */ jsx2(Link, { to: "/app/history", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Riwayat" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-300 hidden sm:block", children: [
          /* @__PURE__ */ jsx2("span", { className: "font-medium text-sky-400", children: authData.user?.email }),
          " | ",
          /* @__PURE__ */ jsxs("span", { children: [
            "Poin: ",
            /* @__PURE__ */ jsx2("span", { className: "font-bold text-emerald-400", children: authData.user?.points })
          ] })
        ] }),
        !isAdmin && /* @__PURE__ */ jsx2(Link, { to: "/pricing", className: "text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors", children: "Isi Ulang Poin" }),
        /* @__PURE__ */ jsx2(
          "button",
          {
            onClick: handleLogout,
            className: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm",
            children: "Logout"
          }
        )
      ] })
    ) : (
      // Tampilan Header untuk Halaman Publik
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx2(Link, { to: "/", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Beranda" }),
        /* @__PURE__ */ jsx2(Link, { to: "/#fitur", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Fitur" }),
        /* @__PURE__ */ jsx2(Link, { to: "/pricing", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Harga" }),
        /* @__PURE__ */ jsx2(Link, { to: "/login", className: `text-sm font-medium ${navLinkClass} transition-colors`, children: "Login" }),
        /* @__PURE__ */ jsx2(Link, { to: "/register", className: "bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm", children: "Daftar Gratis" })
      ] })
    ) })
  ] }) }) });
};

// src/components/Footer.tsx
import { Link as Link2 } from "react-router-dom";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Footer = () => {
  return /* @__PURE__ */ jsx3("footer", { className: "bg-slate-800 text-slate-300 mt-16 no-print", children: /* @__PURE__ */ jsx3("div", { className: "container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8", children: /* @__PURE__ */ jsxs2("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6", children: [
    /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx3("p", { className: "font-semibold text-white", children: "Modul Ajar Cerdas" }),
      /* @__PURE__ */ jsxs2("p", { className: "text-sm text-slate-400", children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Hak Cipta Dilindungi."
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "flex gap-6 text-sm", children: [
      /* @__PURE__ */ jsx3(Link2, { to: "/", className: "hover:text-white transition-colors", children: "Beranda" }),
      /* @__PURE__ */ jsx3(Link2, { to: "/about", className: "hover:text-white transition-colors", children: "Tentang Kami" }),
      /* @__PURE__ */ jsx3(Link2, { to: "/privacy", className: "hover:text-white transition-colors", children: "Kebijakan Privasi" }),
      /* @__PURE__ */ jsx3(Link2, { to: "/pricing", className: "hover:text-white transition-colors", children: "Harga" })
    ] })
  ] }) }) });
};

// src/components/ProtectedRoute.tsx
init_useAuth();
init_LoadingSpinner();
import { Navigate, useLocation as useLocation2 } from "react-router-dom";
import { jsx as jsx5 } from "react/jsx-runtime";
var ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, authData } = useAuth();
  const location2 = useLocation2();
  if (authData.token && !authData.user) {
    return /* @__PURE__ */ jsx5("div", { className: "flex justify-center items-center h-screen", children: /* @__PURE__ */ jsx5(LoadingSpinner, {}) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx5(Navigate, { to: "/login", state: { from: location2 }, replace: true });
  }
  if (adminOnly && !isAdmin) {
    return /* @__PURE__ */ jsx5(Navigate, { to: "/app", replace: true });
  }
  return children;
};

// src/App.tsx
init_LoadingSpinner();
import { jsx as jsx22, jsxs as jsxs18 } from "react/jsx-runtime";
var LandingPage2 = lazy(() => Promise.resolve().then(() => (init_LandingPage(), LandingPage_exports)));
var AboutPage2 = lazy(() => Promise.resolve().then(() => (init_AboutPage(), AboutPage_exports)));
var PrivacyPolicyPage2 = lazy(() => Promise.resolve().then(() => (init_PrivacyPolicyPage(), PrivacyPolicyPage_exports)));
var PricingPage2 = lazy(() => Promise.resolve().then(() => (init_PricingPage(), PricingPage_exports)));
var LoginPage2 = lazy(() => Promise.resolve().then(() => (init_LoginPage(), LoginPage_exports)));
var RegisterPage2 = lazy(() => Promise.resolve().then(() => (init_RegisterPage(), RegisterPage_exports)));
var ForgotPasswordPage2 = lazy(() => Promise.resolve().then(() => (init_ForgotPasswordPage(), ForgotPasswordPage_exports)));
var ResetPasswordPage2 = lazy(() => Promise.resolve().then(() => (init_ResetPasswordPage(), ResetPasswordPage_exports)));
var HomePage2 = lazy(() => Promise.resolve().then(() => (init_HomePage(), HomePage_exports)));
var AdminPage2 = lazy(() => Promise.resolve().then(() => (init_AdminPage(), AdminPage_exports)));
var HistoryPage2 = lazy(() => Promise.resolve().then(() => (init_HistoryPage(), HistoryPage_exports)));
var HistoryDetailPage2 = lazy(() => Promise.resolve().then(() => (init_HistoryDetailPage(), HistoryDetailPage_exports)));
var App = () => {
  const location2 = useLocation5();
  const isAppRoute = location2.pathname.startsWith("/app");
  const mainBgClass = isAppRoute ? "bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100" : "bg-white text-slate-800";
  return /* @__PURE__ */ jsxs18("div", { className: `min-h-screen ${mainBgClass}`, style: { fontFamily: "'Poppins', sans-serif" }, children: [
    /* @__PURE__ */ jsx22(Header, {}),
    /* @__PURE__ */ jsx22("main", { className: "container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8", children: /* @__PURE__ */ jsx22(Suspense, { fallback: /* @__PURE__ */ jsx22("div", { className: "flex justify-center items-center h-[calc(100vh-12rem)]", children: /* @__PURE__ */ jsx22(LoadingSpinner, {}) }), children: /* @__PURE__ */ jsxs18(Routes, { children: [
      /* @__PURE__ */ jsx22(Route, { path: "/", element: /* @__PURE__ */ jsx22(LandingPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/about", element: /* @__PURE__ */ jsx22(AboutPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/privacy", element: /* @__PURE__ */ jsx22(PrivacyPolicyPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/pricing", element: /* @__PURE__ */ jsx22(PricingPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/login", element: /* @__PURE__ */ jsx22(LoginPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/register", element: /* @__PURE__ */ jsx22(RegisterPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsx22(ForgotPasswordPage2, {}) }),
      /* @__PURE__ */ jsx22(Route, { path: "/reset-password/:token", element: /* @__PURE__ */ jsx22(ResetPasswordPage2, {}) }),
      /* @__PURE__ */ jsx22(
        Route,
        {
          path: "/app",
          element: /* @__PURE__ */ jsx22(ProtectedRoute, { children: /* @__PURE__ */ jsx22(HomePage2, {}) })
        }
      ),
      /* @__PURE__ */ jsx22(
        Route,
        {
          path: "/app/admin",
          element: /* @__PURE__ */ jsx22(ProtectedRoute, { adminOnly: true, children: /* @__PURE__ */ jsx22(AdminPage2, {}) })
        }
      ),
      /* @__PURE__ */ jsx22(
        Route,
        {
          path: "/app/history",
          element: /* @__PURE__ */ jsx22(ProtectedRoute, { children: /* @__PURE__ */ jsx22(HistoryPage2, {}) })
        }
      ),
      /* @__PURE__ */ jsx22(
        Route,
        {
          path: "/app/history/:id",
          element: /* @__PURE__ */ jsx22(ProtectedRoute, { children: /* @__PURE__ */ jsx22(HistoryDetailPage2, {}) })
        }
      ),
      /* @__PURE__ */ jsx22(Route, { path: "/admin", element: /* @__PURE__ */ jsx22(Navigate3, { to: "/app/admin", replace: true }) }),
      /* @__PURE__ */ jsx22(Route, { path: "/history", element: /* @__PURE__ */ jsx22(Navigate3, { to: "/app/history", replace: true }) }),
      /* @__PURE__ */ jsx22(Route, { path: "/history/:id", element: /* @__PURE__ */ jsx22(Navigate3, { to: "/app/history/:id", replace: true }) })
    ] }) }) }),
    !isAppRoute && /* @__PURE__ */ jsx22(Footer, {})
  ] });
};
var App_default = App;

// src/index.tsx
init_AuthContext();
import { jsx as jsx23 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx23(React15.StrictMode, { children: /* @__PURE__ */ jsx23(BrowserRouter, { children: /* @__PURE__ */ jsx23(AuthProvider, { children: /* @__PURE__ */ jsx23(App_default, {}) }) }) })
);
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
