import { CP_DATABASE_E_F } from "./cpDatabaseEandF";

export interface CpData {
  subjectName: string;
  fase: string;
  elements: { name: string; cp: string }[];
}

export const CP_DATABASE_046: CpData[] = [
  // ================= PAUD (FASE FONDASI) =================
  {
    subjectName: "PAUD",
    fase: "Fase Fondasi",
    elements: [
      {
        name: "Nilai Agama dan Budi Pekerti",
        cp: "Murid percaya kepada Tuhan Yang Maha Esa sebagai pencipta dirinya, makhluk lain dan alam, serta mulai mengenal dan mempraktikkan ajaran pokok sesuai dengan agama dan kepercayaannya; Murid menghargai diri sendiri dan memiliki rasa syukur terhadap Tuhan YME sehingga dapat berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan dirinya; Murid menghargai sesama manusia dengan berbagai perbedaannya sehingga mempraktikkan perilaku baik dan berakhlak mulia; dan Murid menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha Esa."
      },
      {
        name: "Jati Diri",
        cp: "Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya; Murid mengenali kebiasaan-kebiasaan di lingkungan keluarga, satuan pendidikan, dan masyarakat; Murid mengenali, mengekspresikan, dan mengelola emosi diri, serta membangun hubungan sosial secara sehat; Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia; dan Murid memiliki fungsi gerak (motorik kasar, halus, dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan."
      },
      {
        name: "Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni",
        cp: "Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan, menunjukkan minat, dan berpartisipasi dalam kegiatan pramembaca; Murid memiliki kepekaaan bilangan; mengidentifikasi pola; memiliki kesadaran tentang bentuk, posisi, dan ruang; menyadari adanya persamaan dan perbedaan karakteristik antar objek; mampu melakukan pengukuran dengan satuan tidak baku; dan memiliki kesadaran mengenai waktu; Murid mampu mengamati, menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam dan kondisi sosial; Murid menunjukkan kemampuan awal menggunakan dan merekayasa teknologi serta untuk mencari informasi, gagasan, dan keterampilan secara aman dan bertanggung jawab; dan Murid mengeksplorasi berbagai proses seni, mengekspresikannya, serta mengapresiasi karya seni."
      }
    ]
  },

  // ================= PJOK =================
  {
    subjectName: "PJOK",
    fase: "Fase A",
    elements: [
      {
        name: "Terampil Bergerak",
        cp: "Mempraktikkan keterampilan gerak fundamental dan menerapkannya dalam berbagai situasi gerak yang berbeda; mengeksplorasi berbagai strategi gerak; dan mengeksplorasi berbagai konsep gerak serta menyimpulkan efektivitasnya."
      },
      {
        name: "Belajar Melalui Gerak",
        cp: "Menaati peraturan untuk menumbuhkan fair play di dalam berbagai aktivitas jasmani; menerapkan strategi gerak sederhana dan memecahkan masalah gerak."
      },
      {
        name: "Memilih Hidup yang Menyehatkan",
        cp: "Mengenali kebiasaan hidup sehat, menjaga kebersihan diri dan lingkungan, serta menerapkan prinsip keselamatan diri dalam beraktivitas jasmani."
      }
    ]
  },
  {
    subjectName: "PJOK",
    fase: "Fase B",
    elements: [
      {
        name: "Terampil Bergerak",
        cp: "Menghaluskan keterampilan gerak fundamental dan menerapkannya dalam situasi gerak yang baru; menyesuaikan strategi gerak untuk mendapatkan capaian keterampilan gerak; dan memperagakan berbagai konsep gerak yang dapat diterapkan dalam rangkaian gerak."
      },
      {
        name: "Belajar Melalui Gerak",
        cp: "Menerapkan strategi gerak sederhana dan memecahkan masalah gerak; menerapkan peraturan untuk menumbuhkan fair play di dalam berbagai aktivitas jasmani."
      },
      {
        name: "Memilih Hidup yang Menyehatkan",
        cp: "Menerapkan perilaku hidup sehat terkait nutrisi dan pemenuhan gizi, kebersihan diri dan lingkungan, pemeliharaan kebugaran, serta keselamatan diri dan pencegahan cedera."
      }
    ]
  },
  {
    subjectName: "PJOK",
    fase: "Fase C",
    elements: [
      {
        name: "Terampil Bergerak",
        cp: "Menghaluskan dan memperagakan variasi serta kombinasi keterampilan gerak spesifik dalam berbagai situasi gerak; menerapkan konsep dan strategi gerak untuk meningkatkan efektivitas penampilan."
      },
      {
        name: "Belajar Melalui Gerak",
        cp: "Menerapkan strategi gerak yang efektif dalam situasi gerak yang berbeda; menunjukkan perilaku fair play, kepemimpinan, kerja sama, dan tanggung jawab sosial dalam aktivitas jasmani."
      },
      {
        name: "Memilih Hidup yang Menyehatkan",
        cp: "Memilih dan menerapkan pola hidup sehat, menganalisis pengaruh kebiasaan aktivitas fisik, nutrisi, kebugaran, dan manajemen keselamatan terhadap kesehatan."
      }
    ]
  },

  // ================= SENI MUSIK =================
  {
    subjectName: "Seni Musik",
    fase: "Fase A",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengimitasi bunyi-musik sederhana dan menunjukkan kepekaan terhadap unsur-unsur musik dalam benda-benda sekitar maupun pertunjukan musik."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Mengenali dan memberi tanggapan atau apresiasi terhadap karya musik diri sendiri atau orang lain menggunakan bahasa sehari-hari."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Menirukan pola irama dan nada menggunakan alat musik ritmis atau melodis; mengenali ragam alat musik dan bunyi yang dihasilkan; mengenali cara memainkan dan membersihkan instrumen/alat musik."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Membuat pola irama menggunakan anggota tubuh atau alat musik ritmis yang tersedia di lingkungan sekitar."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menunjukkan ekspresi senang dalam kegiatan musik ritmis atau melodis."
      }
    ]
  },
  {
    subjectName: "Seni Musik",
    fase: "Fase B",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengidentifikasi dan mengimitasi unsur-unsur musik serta menyanyikan atau memainkan instrumen musik sederhana."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Memberi tanggapan terhadap karya musik diri sendiri atau orang lain menggunakan istilah musik sederhana."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Menirukan pola irama dan nada menggunakan alat musik ritmis atau melodis; menyebutkan karakteristik ragam alat musik dan bunyi yang dihasilkan; mengetahui cara memainkan dan merawat alat musik."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Membuat bunyi menggunakan anggota tubuh atau alat musik ritmis dan melodis yang tersedia di lingkungan sekitar."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menunjukkan minat dalam kegiatan bermusik."
      }
    ]
  },
  {
    subjectName: "Seni Musik",
    fase: "Fase C",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Menyajikan musik sederhana dengan alat musik ritmis dan melodis menggunakan notasi musik dan teknik dasar yang telah dipelajari; menemukan alternatif untuk menghasilkan bunyi musik sederhana melalui eksplorasi material yang tersedia di lingkungan sekitar dan menerapkan cara memainkan dan merawat alat musik dengan teknik yang tepat sesuai dengan spesifikasi bahan alat musik."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Melakukan umpan balik kemampuan bermain musik, karya musik diri sendiri atau orang lain sesuai dengan genre menggunakan istilah musik yang tepat."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Menerapkan seluruh proses berpraktik musik untuk perbaikan dan perkembangan keterampilan bermusik; menyajikan musik sederhana dari daerah setempat dan Nusantara; dan menyajikan karya-karya musik modern Indonesia dengan interpretasi dan ekspresi yang tepat, baik secara individu maupun berkelompok."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Membuat dan mengembangkan pola irama menggunakan anggota tubuh atau alat musik ritmis yang tersedia berdasarkan nilai kearifan lokal."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menunjukkan minat, empati, dan kepedulian terhadap isu-isu di lingkungan sekitar melalui kegiatan bermusik."
      }
    ]
  },

  // ================= SENI RUPA =================
  {
    subjectName: "Seni Rupa",
    fase: "Fase A",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengenali dan menyebutkan unsur-unsur rupa dalam benda-benda di sekitar/karya seni rupa."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Merefleksikan dan mengapresiasi karya diri sendiri."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Mengenali dan menguji coba alat dan/atau bahan yang dimiliki."
      },
      {
        name: "Menciptakan (Making/Creating)",
        cp: "Membuat karya seni rupa berdasarkan pengalaman dan hasil pengamatan terhadap lingkungan sekitar."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menghasilkan karya seni rupa yang berdampak pada perasaan dirinya."
      }
    ]
  },
  {
    subjectName: "Seni Rupa",
    fase: "Fase B",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengidentifikasi unsur rupa dan prinsip desain dalam benda-benda di sekitar/karya seni rupa."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Merefleksikan dan mengapresiasi karya diri sendiri dan teman sekelas."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Mengenali dan menguji coba variasi alat dan/atau bahan dalam berkarya."
      },
      {
        name: "Menciptakan (Making/Creating)",
        cp: "Membuat karya seni rupa berdasarkan pengalaman dan hasil pengamatan terhadap lingkungan sekitar."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menghasilkan karya seni rupa yang mewakili minat dan gagasannya."
      }
    ]
  },
  {
    subjectName: "Seni Rupa",
    fase: "Fase C",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Menjelaskan unsur rupa dan prinsip desain dalam benda-benda di sekitar/karya seni rupa."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Merefleksikan dan mengapresiasi karya diri sendiri dan teman sekelas menggunakan kosa kata seni rupa yang sesuai."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Mengenali dan menguji coba variasi teknik penggunaan alat dan/atau bahan."
      },
      {
        name: "Menciptakan (Making/Creating)",
        cp: "Membuat karya seni rupa berdasarkan pengalaman dan/atau hasil pengamatan terhadap lingkungan sekitar melalui pengembangan imajinasi."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menghasilkan karya seni rupa yang mewakili minatnya."
      }
    ]
  },

  // ================= SENI TARI =================
  {
    subjectName: "Seni Tari",
    fase: "Fase A",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengenal bentuk tari sebagai media komunikasi serta mengembangkan kesadaran diri dalam bereksplorasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Mengidentifikasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah, serta mengemukakan pencapaian diri secara lisan, tulisan, dan kinestetik."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Meragakan hasil gerak berdasarkan etika sebagai penampil dan penonton dengan keyakinan dan percaya diri saat mengekspresikan ide, perasaan kepada penonton atau lingkungan sekitar."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Mengembangkan unsur utama tari (gerak, ruang, waktu, dan tenaga), gerak di tempat, dan gerak berpindah untuk membuat gerak sederhana yang memiliki kesatuan gerak yang indah."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menerima proses pembelajaran sehingga tumbuh rasa ingin tahu dan dapat menunjukkan antusiasme yang berdampak pada kemampuan diri dalam menyelesaikan aktivitas pembelajaran tari."
      }
    ]
  },
  {
    subjectName: "Seni Tari",
    fase: "Fase B",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengamati bentuk penyajikan tari berdasarkan latar belakang serta mengeksplorasi unsur utama tari sesuai level gerak, dan perubahan arah hadap."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Mengidentifikasi unsur utama tari sesuai level gerak, dan perubahan arah hadap, serta menilai pencapaian diri saat melakukan aktivitas pembelajaran tari."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Meragakan hasil tari dengan bekerja secara kooperatif untuk mengembangkan kemampuan bekerja sama dan saling menghargai demi tercapainya tujuan bersama."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Mengembangkan gerak dengan unsur utama tari, level, dan perubahan arah hadap."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menerima proses pembelajaran sehingga tumbuh rasa ingin tahu dan dapat menunjukkan usaha yang berdampak pada kemampuan diri dalam menyelesaikan aktivitas pembelajaran tari."
      }
    ]
  },
  {
    subjectName: "Seni Tari",
    fase: "Fase C",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengamati berbagai bentuk tari tradisi yang dapat digunakan untuk mengekspresikan diri melalui unsur pendukung tari."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Mengidentifikasi unsur pendukung tari dalam tari tradisi serta menghargai hasil pencapaian diri dengan mempertimbangkan pendapat orang lain."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Meragakan hasil rangkaian gerak tari menggunakan unsur pendukung tari dengan menunjukan kerja sama dan berperan aktif dalam kelompok."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Merangkai gerak tari yang berpijak pada tradisi/kreasi dengan menerapkan desain kelompok."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menanggapi kejadian-kejadian di lingkungan sekitar melalui ekspresi gerak tari."
      }
    ]
  },

  // ================= SENI TEATER =================
  {
    subjectName: "Seni Teater",
    fase: "Fase A",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengamati, merespons, meniru gerak tubuh dan suara sebagai media untuk mengomunikasikan emosi."
      },
      {
        name: "Merefleksikan (Reflection)",
        cp: "Mengenali pengalaman dan emosi selama proses berseni teater serta menceritakan sebuah karya dengan kosakata sehari-hari."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Mengenal jenis-jenis properti/alat bantu yang dapat mendukung cerita/permainan peran."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Mengeksplorasi beragam peran mengenai tokoh di sekitar atau rekaan, dan memainkan sebuah lakon pertunjukan."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Memainkan gerak dan lagu sesuai arahan dari pendidik."
      }
    ]
  },
  {
    subjectName: "Seni Teater",
    fase: "Fase B",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Mengenal teknik dasar akting (pemeranan) melalui proses meniru (mimesis), mengenal gerak tubuh, suara/vokal sesuai tokoh/peran atau perilaku objek sekitar."
      },
      {
        name: "Merefleksikan (Reflection)",
        cp: "Mengenali lingkungan sekitarnya dan pengalaman dalam bermain teater."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Menggunakan properti yang sesuai dengan tokoh yang diperankan."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Mengamati berbagai peran, mengenal tokoh di sekitar, dan memainkan sebuah lakon dalam cerita."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Mengenal bentuk lakon dalam bermain teater."
      }
    ]
  },
  {
    subjectName: "Seni Teater",
    fase: "Fase C",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Menirukan teknik dasar akting (pemeranan), vokal, dan gerak tubuh sesuai karakter tokoh yang diperankan."
      },
      {
        name: "Merefleksikan (Reflection)",
        cp: "Merefleksikan pengalaman dan emosi selama proses berseni teater serta menyampaikan tanggapan terhadap pertunjukan teater sederhana."
      },
      {
        name: "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        cp: "Menggunakan alat bantu, properti, dan tata artistik sederhana untuk mendukung jalannya cerita pertunjukan."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Mengamati berbagai peran dan memainkan sebuah lakon dalam cerita teater sederhana."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Menunjukkan kerja sama dan rasa percaya diri dalam memerankan tokoh di pertunjukan teater."
      }
    ]
  },

  // ================= PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI - CP 020) =================
  {
    subjectName: "Pendidikan Agama Islam dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      {
        name: "Al-Qur'an Hadis",
        cp: "Membaca dan membedakan huruf hijaiah berharakat, huruf hijaiah bersambung; menghafal Surah al-Fātiḥah, beberapa surah pendek Al-Qur'an, dan hadis tentang kebersihan."
      },
      {
        name: "Akidah",
        cp: "Menjelaskan dan meyakini rukun iman, iman kepada Allah Swt., beberapa asmaulhusna, dan iman kepada malaikat."
      },
      {
        name: "Akhlak",
        cp: "Menerapkan akhlak terhadap Allah Swt. dengan menyucikan dan memuji-Nya, dan akhlak terhadap diri sendiri."
      },
      {
        name: "Fikih",
        cp: "Menerapkan rukun Islam, syahadatain, tata cara bersuci, salat fardu, zikir dan berdoa setelah salat."
      },
      {
        name: "Sejarah Peradaban Islam",
        cp: "Menceritakan kisah keteladanan beberapa nabi dan rasul."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Islam dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      {
        name: "Al-Qur'an Hadis",
        cp: "Membaca, menulis, dan membedakan huruf hijaiah bersambung; menghafal dan menjelaskan beberapa surah pendek, hadis tentang kewajiban salat dan menjaga hubungan baik dengan sesama."
      },
      {
        name: "Akidah",
        cp: "Menjelaskan dan meyakini sifat-sifat Allah Swt., iman kepada kitab-kitab Allah Swt., beberapa asmaulhusna, dan iman kepada rasul-rasul Allah Swt."
      },
      {
        name: "Akhlak",
        cp: "Menerapkan akhlak terhadap Allah Swt. dengan berbaik sangka kepada-Nya, akhlak terhadap orang tua, keluarga, dan guru."
      },
      {
        name: "Fikih",
        cp: "Menerapkan azan dan ikamah, salat jumat dan salat sunah; menjelaskan balig dan tanggung jawab yang menyertainya (taklīf)."
      },
      {
        name: "Sejarah Peradaban Islam",
        cp: "Menceritakan dan menjelaskan kisah Nabi Muhammad saw. sebelum dan sesudah menjadi rasul periode Makkah."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Islam dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      {
        name: "Al-Qur'an Hadis",
        cp: "Membaca, menulis, dan membedakan huruf hijaiah bersambung; menjelaskan beberapa surah pendek dan hadis tentang berbuat baik kepada orang tua, guru, dan teman."
      },
      {
        name: "Akidah",
        cp: "Menjelaskan dan meyakini beberapa asmaulhusna, iman kepada hari akhir, iman kepada qadā' dan qadar."
      },
      {
        name: "Akhlak",
        cp: "Menerapkan akhlak terhadap Allah Swt. dengan berdoa dan bertawakal kepada-Nya, akhlak terhadap teman, tetangga, non-muslim, hewan, dan tumbuhan."
      },
      {
        name: "Fikih",
        cp: "Menerapkan puasa wajib dan sunah, makanan minuman yang halal dan haram, zakat, infak, sedekah, dan wakaf."
      },
      {
        name: "Sejarah Peradaban Islam",
        cp: "Menceritakan dan menjelaskan kisah Nabi Muhammad saw. periode Madinah dan khulafaurasyidin."
      }
    ]
  },

  // ================= PENDIDIKAN AGAMA KRISTEN DAN BUDI PEKERTI =================
  {
    subjectName: "Pendidikan Agama Kristen dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      {
        name: "Allah Berkarya - Allah Pencipta",
        cp: "Murid memahami Allah menciptakan dirinya sebagai pribadi yang istimewa dan membangun interaksi dengan lingkungan terdekat."
      },
      {
        name: "Allah Berkarya - Allah Pemelihara",
        cp: "Murid memahami pemeliharaan Allah pada dirinya melalui kehadiran keluarga."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia",
        cp: "Murid memahami diri sebagai pribadi yang bertumbuh dan berkembang."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani",
        cp: "Murid memahami makna kebaikan, ramah dan sopan di rumah dan di sekolah."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja",
        cp: "Murid memahami keberadaan gereja sebagai wadah berkumpul dan beribadah serta kewajiban berdoa dan memuji Tuhan."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk",
        cp: "Murid memahami keragaman suku bangsa sebagai anugerah Allah."
      },
      {
        name: "Alam dan Lingkungan Hidup - Alam Ciptaan Allah",
        cp: "Murid memahami alam dan lingkungan hidup sebagai ciptaan Allah."
      },
      {
        name: "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam",
        cp: "Murid memahami tugas memelihara alam dan lingkungan hidup di rumah dan di sekolah."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Kristen dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      {
        name: "Allah Berkarya - Allah Pencipta",
        cp: "Murid memahami Allah menciptakan flora dan fauna, serta manusia (perempuan dan laki-laki)."
      },
      {
        name: "Allah Berkarya - Allah Pemelihara",
        cp: "Murid memahami pemeliharaan Allah pada dirinya dan melalui kehadiran orang-orang di sekitarnya."
      },
      {
        name: "Allah Berkarya - Allah Penyelamat",
        cp: "Murid memahami Allah sebagai penyelamat."
      },
      {
        name: "Allah Berkarya - Allah Pembaru",
        cp: "Murid mengenal Allah pembaru."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia",
        cp: "Murid memahami diri sebagai makhluk individu dan sosial yang dapat bergaul dan bekerja sama dengan teman, saudara, dan orang tua."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani",
        cp: "Murid memahami sikap disiplin di rumah dan di sekolah."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja",
        cp: "Murid memahami tugas panggilan gereja untuk bersekutu, bersaksi, dan melayani."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk",
        cp: "Murid memahami keragaman budaya dan agama sebagai anugerah Allah."
      },
      {
        name: "Alam dan Lingkungan Hidup - Alam Ciptaan Allah",
        cp: "Murid memahami Allah hadir dalam berbagai fenomena alam."
      },
      {
        name: "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam",
        cp: "Murid memahami upaya memelihara alam lingkungan sekitarnya."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Kristen dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      {
        name: "Allah Berkarya - Allah Pencipta",
        cp: "Murid memahami Allah Pencipta berkarya melalui keluarga, sekolah, dan masyarakat."
      },
      {
        name: "Allah Berkarya - Allah Pemelihara",
        cp: "Murid memahami Allah memelihara seluruh umat manusia termasuk mereka yang berkebutuhan khusus."
      },
      {
        name: "Allah Berkarya - Allah Penyelamat",
        cp: "Murid memahami Allah menyelamatkan manusia melalui Yesus Kristus."
      },
      {
        name: "Allah Berkarya - Allah Pembaru",
        cp: "Murid memahami Allah membarui hidup Manusia."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia",
        cp: "Murid memahami bahwa manusia adalah makhluk terbatas."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani",
        cp: "Murid memahami buah Roh dalam interaksi antar sesama."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja",
        cp: "Murid memahami pelayanan terhadap sesama sebagai tanggung jawab orang beriman dalam kehidupan."
      },
      {
        name: "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk",
        cp: "Murid memahami hidup rukun dan toleransi dalam masyarakat majemuk."
      },
      {
        name: "Alam dan Lingkungan Hidup - Alam Ciptaan Allah",
        cp: "Murid memahami Allah hadir melalui alam ciptaan."
      },
      {
        name: "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam",
        cp: "Murid memahami tanggung jawab orang beriman dalam memelihara alam dan lingkungan hidup."
      }
    ]
  },

  // ================= PENDIDIKAN AGAMA KATOLIK DAN BUDI PEKERTI =================
  {
    subjectName: "Pendidikan Agama Katolik dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      {
        name: "Pribadi murid",
        cp: "Murid memahami dirinya sebagai pribadi yang dicintai Tuhan, memiliki anggota tubuh yang berguna, memahami cara merawat tubuhnya; memahami teman-teman, lingkungan rumah dan sekolah sebagai tempat mengembangkan potensi diri."
      },
      {
        name: "Yesus Kristus",
        cp: "Murid memahami bahwa Tuhan menciptakan langit, bumi, dan seluruh isinya; memahami tokoh-tokoh iman di dalam Perjanjian Lama (Nuh, Abraham, Ishak dan Yakub); memahami kisah kelahiran Tuhan Yesus, kisah tiga orang Majus, masa kanak-kanak Yesus di Nazaret, Yesus dipersembahkan di Bait Allah, dan berada di Bait Allah pada umur 12 tahun."
      },
      {
        name: "Gereja",
        cp: "Murid memahami imannya dengan cara membuat tanda salib, berdoa Bapa Kami, Salam Maria, dan Kemuliaan; memahami iman dengan melaksanakan perintah Allah, dan membiasakan diri dengan berdoa pujian, syukur dan permohonan."
      },
      {
        name: "Masyarakat",
        cp: "Murid memahami lingkungan keluarga, dan teman-teman, memiliki kebiasaan bekerja sama dengan anggota keluarga dan teman-teman; memahami iman di tengah masyarakat melalui kebiasaan hidup rukun dengan tetangga dan bergotong royong merawat lingkungan."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Katolik dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      {
        name: "Pribadi murid",
        cp: "Murid memahami dirinya sebagai pribadi yang tumbuh dan berkembang, mewujudkan iman dengan cara melakukan perbuatan baik; memahami diri sebagai pribadi yang unik, bersyukur dan bersedia mengembangkan keunikan diri bersama orang lain dan lingkungan sekitar."
      },
      {
        name: "Yesus Kristus",
        cp: "Murid memahami karya keselamatan Allah melalui tokoh-tokoh Yusuf, Musa, dan Yosua; memahami Sepuluh Perintah Allah sebagai pedoman hidup; memahami bangsa Israel memasuki tanah terjanji, Allah memberkati pemimpin Israel (Samuel, Saul, dan Daud); memahami Yesus sebagai pemenuhan janji Allah yang mewartakan Kerajaan Allah melalui perkataan, perbuatan, dan mukjizat."
      },
      {
        name: "Gereja",
        cp: "Murid memahami Sakramen Baptis, Sakramen Ekaristi, dan Sakramen Tobat; mengungkapkan rasa syukur dalam doa pribadi dan doa bersama, mewujudkan makna doa melalui sikap dan tindakan dalam kehidupan sehari-hari."
      },
      {
        name: "Masyarakat",
        cp: "Murid mewujudkan imannya di tengah masyarakat melalui kebiasaan menghormati pemimpin masyarakat, menghargai tradisi masyarakat, melestarikan lingkungan alam; mewujudkan rasa hormat terhadap orang tua, menghormati hidup pribadi, menghormati milik orang lain."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Katolik dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      {
        name: "Pribadi murid",
        cp: "Murid memahami diri sebagai perempuan atau laki-laki sebagai citra Allah yang sederajat dan saling melengkapi; memahami hak dan kewajiban dirinya sebagai warga negara dan bangga sebagai bangsa Indonesia; memahami diri sebagai warga dunia."
      },
      {
        name: "Yesus Kristus",
        cp: "Murid memahami perjuangan tokoh-tokoh Kitab Suci: Daud sebagai pemimpin yang tangguh; Salomo yang bijaksana, dan Ester perempuan pemberani, serta tokoh Maria dan Elisabet yang setia dan berserah kepada Allah; meneladani Yesus yang taat kepada Allah; mengajarkan pengampunan, memanggil orang berdosa; menderita, wafat, dan bangkit; mengutus Roh Kudus untuk menguatkan para rasul, dan orang yang beriman kepada-Nya; memahami perjuangan Nabi Elia yang menobatkan bangsa Israel; Nabi Amos sebagai pejuang keadilan; dan Nabi Yesaya yang me-nubuat-kan kedatangan Juru Selamat; memahami Yesus yang mewartakan kerajaan Allah dengan perkataan dan perbuatan."
      },
      {
        name: "Gereja",
        cp: "Murid mewujudkan iman dalam kehidupan sehari-hari, melibatkan diri dalam kehidupan menggereja, sebagai wujud kehidupan bersama yang dijiwai oleh Roh Kudus; memahami gereja yang satu, kudus, katolik, dan apostolik; persekutuan para kudus; pengampunan dosa, kebangkitan badan dan kehidupan kekal."
      },
      {
        name: "Masyarakat",
        cp: "Murid memahami pentingnya terlibat aktif dalam pelestarian lingkungan, bersikap jujur, bertindak menurut hati nurani, menegakkan keadilan dalam hidup sehari-hari sebagai orang beriman Kristiani, melakukan dialog antarumat beragama."
      }
    ]
  },

  // ================= PENDIDIKAN AGAMA HINDU DAN BUDI PEKERTI =================
  {
    subjectName: "Pendidikan Agama Hindu dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      { name: "Kitab Suci Weda", cp: "Mengenali Kitab Rāmāyaṇa dan Kitab Mahābhārata." },
      { name: "Śraddhā dan Bhākti", cp: "Memahami Hyang Widhi Wasa sebagai pencipta dan sumber hidup." },
      { name: "Susila", cp: "Mengenali Subha Karma dan Asubha Karma, serta Tri Kaya Parisudha." },
      { name: "Acara", cp: "Mengenali Dainika Upasana dan sarana persembahyangan." },
      { name: "Sejarah Agama Hindu", cp: "Mengenali Kerajaan-kerajaan Hindu di Indonesia." }
    ]
  },
  {
    subjectName: "Pendidikan Agama Hindu dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      { name: "Kitab Suci Weda", cp: "Mengenali Kitab Purāṇa." },
      { name: "Śraddhā dan Bhākti", cp: "Memahami Hyang Widhi Wasa sebagai Tri Murti dan Cadu Sakti." },
      { name: "Susila", cp: "Menerapkan Ajaran Tri Parartha dan Catur Paramitha." },
      { name: "Acara", cp: "Mengenali Hari Suci dan Tempat Suci Agama Hindu sesuai kearifan lokal." },
      { name: "Sejarah Agama Hindu", cp: "Mengenali Tokoh Penyebar Agama Hindu di Indonesia." }
    ]
  },
  {
    subjectName: "Pendidikan Agama Hindu dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      { name: "Kitab Suci Weda", cp: "Memahami Kitab Weda Śruti dan Kitab Weda Smṛti." },
      { name: "Śraddhā dan Bhākti", cp: "Memahami Bhuana Agung dan Bhuana Alit." },
      { name: "Susila", cp: "Menerapkan ajaran Catur Guru dan Catur Asrama." },
      { name: "Acara", cp: "Menjelaskan Pañca Yajña dan Manggalaning Yajña." },
      { name: "Sejarah Agama Hindu", cp: "Menceritakan Sejarah Perkembangan Agama Hindu di Indonesia." }
    ]
  },

  // ================= PENDIDIKAN AGAMA BUDDHA DAN BUDI PEKERTI =================
  {
    subjectName: "Pendidikan Agama Buddha dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      {
        name: "Sejarah",
        cp: "Memadukan pemahaman identitas diri dan keluarga dengan apresiasi terhadap keragaman identitas dan budaya teman-teman di lingkungan rumah, sekolah, dan rumah ibadah untuk meninjau dan menulis ulang paradigma pluralisme yang inklusif dan harmonis dalam perbedaan identitas dan budaya teman-temannya di lingkungan rumah, sekolah, dan rumah ibadah. Merefleksikan sifat-sifat kehidupan para bodhisattva, para Buddha, murid Buddha, dan tokoh buddhis inspiratif untuk menghasilkan pola pikir dan perilaku dalam menyayangi diri sendiri melalui pemeliharaan kesehatan fisik dan batin yang holistik, serta menemukan budaya komunikasi yang hormat dan bijaksana di lingkungannya berdasarkan kebijaksanaan dari kisah jataka yang dapat diterapkan dalam konteks kehidupan kontemporer."
      },
      {
        name: "Ritual",
        cp: "Menyimpulkan identitas agama Buddha dengan keberadaan beragam identitas agama dan kepercayaan lain dalam konteks kelompok sosialnya. Meninjau dan menulis ulang makna simbol-simbol keagamaan Buddha dengan simbol agama dan kepercayaan lain yang ditemui di lingkungan rumah dan sekolahnya, sehingga dapat membangun pemahaman tentang keragaman."
      },
      {
        name: "Etika",
        cp: "Memadukan praktik aturan dan sopan santun dengan prinsip-prinsip pergaulan yang harmonis di lingkungan rumah, sekolah, dan tempat ibadah. Merefleksikan proses musyawarah sederhana untuk mufakat di lingkungan sekolah dengan nilai-nilai empat sifat luhur, hukum karma, dan Pancasila dasar negara, guna merefleksikan perilaku moderat yang mendukung kehidupan bersama."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Buddha dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      {
        name: "Sejarah",
        cp: "Menganalisis identitas Buddha Sakyamuni, sebagai dasar keyakinan terhadap Agama Buddha. Mengevaluasi dengan membandingkan secara hormat budaya dan bahasa dalam agama Buddha serta memiliki keterbukaan untuk menghargai perbedaan identitas dan budaya orang lain di lingkungan tempat tinggalnya. Mengadaptasi keteladanan Buddha Sakyamuni dalam menghargai sesama manusia untuk mengkreasi strategi inovatif dalam menyelesaikan masalah pergaulan di lingkungan terdekatnya, lingkungan sekolah dan rumah ibadah."
      },
      {
        name: "Ritual",
        cp: "Mengklasifikasi doa Buddhis dalam kegiatan sehari-hari menganalisis keterkaitan mendasar dengan keyakinan kepada Ketuhanan Yang Maha Esa dan Triratna. Mengevaluasi identitas masing-masing aliran atau tradisi dalam agama Buddha dengan membandingkan keunikan dan persamaan nilai-nilainya, dan mensintesis pemahaman satu kesatuan untuk mengkreasi model praktis bersatu dalam perbedaan yang dapat diimplementasikan dalam komunitas yang beragam."
      },
      {
        name: "Etika",
        cp: "Merefleksikan nilai-nilai Pancasila Buddhis dengan menganalisis keterkaitan fundamental berlandaskan pada nilai-nilai Hukum Sebab Akibat yang Saling Bergantungan untuk mengintegrasikan prinsip-prinsip tersebut dalam melaksanakan aturan dan sopan santun secara konsisten dan bermakna. Mengevaluasi efektivitas implementasi kesempurnaan (pāramī), sikap tolong menolong antarsesama kemudian mensintesis pendekatan holistik untuk menyelesaikan masalah sosial, kebersihan, dan kelestarian lingkungan secara musyawarah mufakat di rumah, sekolah, dan rumah ibadah yang mengkreasi model kehidupan moderat dan ramah anak di rumah, sekolah, dan rumah ibadah sebagai manifestasi autentik keyakinan terhadap agama Buddha."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Buddha dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      {
        name: "Sejarah",
        cp: "Menganalisis strategi Buddha Sakyamuni dalam menghadapi hambatan untuk meraih kesuksesan dan mengadaptasi pendekatan tersebut untuk mengatasi tantangan personal mereka. Mengevaluasi efektivitas cara Buddha Sakyamuni menyelesaikan masalah kehidupan individu dan sosial, kemudian mengkreasi solusi inovatif berdasarkan kebijaksanaan tersebut untuk konteks modern. Mengintegrasikan konsep dasar musyawarah mufakat dalam kehidupan Buddha Sakyamuni dengan mensintesis prinsip tersebut dalam praktik pengambilan keputusan demokratis di lingkungan keluarga, sekolah, dan masyarakat."
      },
      {
        name: "Ritual",
        cp: "Menganalisis keragaman upacara puja dan meditasi ketenangan dari berbagai aliran atau tradisi agama Buddha. Merefleksikan sikap bersatu dalam perbedaan dengan berperan serta melakukan dialog moderasi beragama."
      },
      {
        name: "Etika",
        cp: "Menganalisis nilai-nilai Buddhadharma, Pancasila Buddhis, dan nilai-nilai Pancasila dasar negara berlandaskan pada nilai-nilai Hukum Sebab Akibat yang Saling Bergantungan. Menerapkan hak dan kewajiban, permasalahan dan solusinya di rumah, sekolah, dan rumah ibadah sebagai dasar keyakinan terhadap agama Buddha, melalui pembelajaran ramah anak serta mencerminkan kehidupan yang moderat."
      }
    ]
  },

  // ================= PENDIDIKAN AGAMA KHONGHUCU DAN BUDI PEKERTI =================
  {
    subjectName: "Pendidikan Agama Khonghucu dan Budi Pekerti",
    fase: "Fase A",
    elements: [
      { name: "Sejarah Suci", cp: "Menjelaskan riwayat dan keluarga Nabi Kŏngzĭ (孔子); menginterpretasikan Kisah Keteladanan Anak Berbakti." },
      { name: "Kitab Suci", cp: "Menjelaskan ayat-ayat suci yang terdapat dalam kitab Bakti (Xiàojīng 孝经), Sìshū (四书) dan Wŭjīng (五经) yang berkaitan dengan kisah anak berbakti dan keteladanan Nabi Kŏngzĭ (孔子)." },
      { name: "Keimanan", cp: "Menjelaskan konsep Tiān (天) dalam agama Khonghucu bahwa manusia diciptakan Tiān (天) melalui kedua orang tua; menginterpretasikan peran keberadaan leluhur dalam kehidupan manusia serta Nabi Kŏngzĭ (孔子) sebagai genta rohani Tiān (天), Tiān Zhī Mùduó (天之木铎)." },
      { name: "Tata Ibadah", cp: "Menerapkan sikap dalam berdoa dan menghormat, sembahyang kepada Tiān (天), Nabi Kŏngzĭ (孔子), dan leluhur serta perlengkapan sembahyang di altar." },
      { name: "Perilaku Junzi (君子)", cp: "Menerapkan sikap bakti dan hormat kepada orang tua sebagai wujud hormat kepada Tiān (天), pembiasaan berdoa sebelum maupun sesudah beraktivitas, dan sikap toleransi dengan teman, serta sikap tanggung jawab terhadap kebutuhan diri sendiri." }
    ]
  },
  {
    subjectName: "Pendidikan Agama Khonghucu dan Budi Pekerti",
    fase: "Fase B",
    elements: [
      { name: "Sejarah Suci", cp: "Menjelaskan tentang watak sejati (xìng 性) menurut pendapat Mèngzĭ (孟子), Zhū Xī (朱熹) sebagai tokoh pembaharuan agama Khonghucu (Rújiào 儒教), keteladanan ibunda Nabi Kŏngzĭ (孔子), ibunda Mèngzĭ (孟子), ibunda Ōuyáng Xiū (欧阳修), dan ibunda Yuè Fēi (岳飞); menginterpretasikan sikap teladan dari murid-murid Nabi Kŏngzĭ (孔子), riwayat Nabi Kŏngzĭ (孔子) sebagai Genta Rohani Tiān (天) (Tiān Zhī Mùduó 天之木铎)." },
      { name: "Kitab Suci", cp: "Menjelaskan bagian-bagian kitab suci yang pokok (Sìshū 四书) dan yang mendasari (Wŭjīng 五经), ayat dalam kitab Sìshū (四书) yang berkaitan dengan delapan kebajikan (bādé 八德); menginterpretasikan tiga kesukaan yang membawa faedah dan tiga kesukaan yang membawa celaka." },
      { name: "Keimanan", cp: "Menjelaskan makna persembahyangan kepada Tiān (天), Nabi Kŏngzĭ (孔子), para suci (shénmíng 神明) dan leluhur, tanda-tanda khusus menjelang wafat Nabi Kŏngzĭ (孔子); menginterpretasikan cita-cita mulia dan semangat belajar Nabi Kŏngzĭ (孔子); menerapkan nilai-nilai delapan keimanan." }
    ]
  },
  {
    subjectName: "Pendidikan Agama Khonghucu dan Budi Pekerti",
    fase: "Fase C",
    elements: [
      { name: "Sejarah Suci", cp: "Menjelaskan karya dan jasa-jasa Nabi Kŏngzĭ (孔子), perjalanan mengelilingi berbagai negeri, karya murid-murid Nabi Kŏngzĭ (孔子) dan tokoh-tokoh yang berjasa dalam menegakkan agama Khonghucu." },
      { name: "Kitab Suci", cp: "Menjelaskan garis besar dan urutan penulisan Kitab Sìshū (四书) dan Wŭjīng (五经), ayat-ayat suci yang berkaitan dengan kebajikan, moderasi, persahabatan, dan pembinaan diri." },
      { name: "Keimanan", cp: "Menjelaskan konsep Tiāndìrén (天地人), hukum suci Tiān (Tiānlĭ 天理), dan penerapan firman Tiān dalam kehidupan." },
      { name: "Tata Ibadah", cp: "Menjelaskan tata cara dan makna sembahyang kepada Tiāndìrén (天地人), serta peringatan hari-hari suci keagamaan Khonghucu." },
      { name: "Perilaku Junzi (君子)", cp: "Menerapkan prinsip empat pantangan (sìwù 四勿) dan lima hubungan kemasyarakatan (wŭlún 五伦) dalam keseharian." }
    ]
  },

  // ================= PENDIDIKAN PANCASILA =================
  {
    subjectName: "Pendidikan Pancasila",
    fase: "Fase A",
    elements: [
      {
        name: "Pancasila",
        cp: "Mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila dan simbol Pancasila beserta sila-sila Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga."
      },
      {
        name: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        cp: "Mengenal aturan di lingkungan keluarga; menunjukkan dan menceritakan sikap mematuhi aturan di lingkungan keluarga."
      },
      {
        name: "Bhinneka Tunggal Ika",
        cp: "Mengenal semboyan Bhinneka Tunggal Ika; mengidentifikasi dan menghargai identitas dirinya sesuai dengan jenis kelamin, hobi, bahasa, serta agama dan kepercayaan di lingkungan sekitar."
      },
      {
        name: "Negara Kesatuan Republik Indonesia",
        cp: "Mengenal karakteristik lingkungan tempat tinggal dan sekolah, sebagai bagian dari wilayah Negara Kesatuan Republik Indonesia; menceritakan dan mempraktikkan bekerja sama menjaga lingkungan sekitar dalam keberagaman."
      }
    ]
  },
  {
    subjectName: "Pendidikan Pancasila",
    fase: "Fase B",
    elements: [
      {
        name: "Pancasila",
        cp: "Mengidentifikasi makna sila-sila Pancasila, dan penerapannya dalam kehidupan sehari-hari; mengenal karakter para perumus Pancasila; menunjukkan sikap bangga menjadi anak Indonesia yang memiliki bahasa Indonesia sebagai bahasa persatuan di lingkungan sekitar."
      },
      {
        name: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        cp: "Mengidentifikasi dan melaksanakan aturan di sekolah dan lingkungan tempat tinggal; mengidentifikasi dan menerapkan hak yang didapat dan kewajiban sebagai anggota keluarga dan sebagai warga sekolah."
      },
      {
        name: "Bhinneka Tunggal Ika",
        cp: "Membedakan dan menghargai identitas, keluarga, dan teman-temannya sesuai budaya, suku bangsa, bahasa, agama dan kepercayaannya di lingkungan sekitar."
      },
      {
        name: "Negara Kesatuan Republik Indonesia",
        cp: "Mengidentifikasi lingkungan tempat tinggal (RT, RW, desa atau kelurahan, dan kecamatan) sebagai bagian dari wilayah Negara Kesatuan Republik Indonesia; menunjukkan perilaku bekerja sama dalam berbagai bentuk keberagaman suku bangsa, sosial, dan budaya di Indonesia yang terikat persatuan dan kesatuan di lingkungan sekitar."
      }
    ]
  },
  {
    subjectName: "Pendidikan Pancasila",
    fase: "Fase C",
    elements: [
      {
        name: "Pancasila",
        cp: "Memahami kronologi sejarah kelahiran Pancasila; meneladani sikap para perumus Pancasila dan menerapkan di lingkungan masyarakat; menghubungkan sila-sila dalam Pancasila sebagai suatu kesatuan yang utuh; menguraikan makna nilai-nilai Pancasila sebagai dasar negara, dan pandangan hidup bangsa."
      },
      {
        name: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        cp: "Mengimplementasikan bentuk-bentuk norma, hak, dan kewajiban dalam kedudukannya sebagai warga negara; mengenal Pembukaan Undang-Undang Dasar Negara Republik Indonesia tahun 1945; mempraktikkan musyawarah untuk membuat kesepakatan dan aturan bersama, serta menerapkannya dalam lingkungan keluarga dan sekolah."
      },
      {
        name: "Bhinneka Tunggal Ika",
        cp: "Menyajikan hasil identifikasi sikap menghormati, menjaga, dan melestarikan keberagaman budaya sesuai semboyan dalam bingkai Bhinneka Tunggal Ika di lingkungan sekitar."
      },
      {
        name: "Negara Kesatuan Republik Indonesia",
        cp: "Mengenal wilayahnya dalam konteks kabupaten/kota, dan provinsi sebagai bagian dari wilayah Negara Kesatuan Republik Indonesia; menunjukkan perilaku gotong royong untuk menjaga persatuan di lingkungan sekolah dan sekitar sebagai wujud bela negara."
      }
    ]
  },

  // ================= BAHASA INDONESIA =================
  {
    subjectName: "Bahasa Indonesia",
    fase: "Fase A",
    elements: [
      {
        name: "Menyimak",
        cp: "Memahami informasi dari teks nonsastra berbentuk teks aural (teks yang dibacakan dan/atau didengarkan) berupa percakapan yang berkaitan dengan diri, keluarga, dan/atau lingkungan sekitar; dan memahami pesan teks sastra berbentuk teks aural."
      },
      {
        name: "Membaca dan Memirsa",
        cp: "Membaca kata-kata sederhana dengan fasih dari bacaan dan/atau tayangan yang dipirsa tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; dan memahami pesan teks sastra dan nonsastra berbentuk cetak dan/atau elektronik tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar."
      },
      {
        name: "Berbicara dan Mempresentasikan",
        cp: "Menyajikan pendapat dengan pilihan kata dan sikap tubuh/gestur yang sesuai, menggunakan volume dan intonasi yang tepat sesuai konteks; merespon percakapan tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; dan menceritakan kembali isi berbagai tipe teks yang dibaca, dipirsa, atau didengar tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar."
      },
      {
        name: "Menulis",
        cp: "Menulis permulaan dengan benar di atas kertas dan/atau melalui media digital; mengembangkan tulisan tangan yang semakin baik; dan menulis berbagai tipe teks sederhana tentang diri, keluarga, dan/atau lingkungan sekitar dengan beberapa kalimat sederhana."
      }
    ]
  },
  {
    subjectName: "Bahasa Indonesia",
    fase: "Fase B",
    elements: [
      {
        name: "Menyimak",
        cp: "Memahami ide pokok suatu informasi dari teks nonsastra berbentuk teks aural (teks yang dibacakan dan/atau didengarkan); dan memahami isi teks sastra berbentuk teks aural."
      },
      {
        name: "Membaca dan Memirsa",
        cp: "Membaca kata-kata baru dengan fasih dari bacaan dan/atau tayangan yang dipirsa; dan memahami ide pokok, ide pendukung, pesan, dan informasi dalam teks sastra dan nonsastra berbentuk cetak dan/atau elektronik."
      },
      {
        name: "Berbicara dan Mempresentasikan",
        cp: "Menyajikan pendapat dengan pilihan kata dan sikap tubuh/gestur yang sesuai, menggunakan volume dan intonasi yang tepat sesuai konteks; menanggapi diskusi sesuai tata cara; dan menceritakan kembali isi dan/atau informasi dari berbagai tipe teks yang dibaca, dipirsa, atau didengar."
      },
      {
        name: "Menulis",
        cp: "Menulis berbagai tipe teks sederhana dengan rangkaian kalimat yang beragam; dan menggunakan kaidah kebahasaan dan kosakata baru yang memiliki makna denotatif untuk menulis teks sesuai dengan konteks."
      }
    ]
  },
  {
    subjectName: "Bahasa Indonesia",
    fase: "Fase C",
    elements: [
      {
        name: "Menyimak",
        cp: "Menganalisis informasi dari teks nonsastra berbentuk teks aural (teks yang dibacakan dan/atau didengarkan; dan menganalisis isi teks sastra berbentuk teks aural."
      },
      {
        name: "Membaca dan Memirsa",
        cp: "Membaca kata-kata dengan berbagai pola kombinasi huruf dengan fasih dari bacaan dan/atau tayangan yang dipirsa; dan menganalisis informasi serta nilai-nilai dalam teks sastra dan nonsastra berwujud teks visual dan/atau audiovisual."
      },
      {
        name: "Berbicara dan Mempresentasikan",
        cp: "Mempresentasikan gagasan dengan pilihan kata, sikap tubuh/gestur, volume, dan intonasi yang tepat sesuai konteks; berpartisipasi aktif dalam diskusi sesuai tata cara; dan menceritakan kembali isi dan/atau informasi dari berbagai tipe teks yang dibaca, dipirsa, atau didengar."
      },
      {
        name: "Menulis",
        cp: "Menulis berbagai tipe teks dengan rangkaian kalimat yang beragam; dan menggunakan kaidah kebahasaan dan kosakata baru yang memiliki makna denotatif dan konotatif."
      }
    ]
  },

  // ================= MATEMATIKA =================
  {
    subjectName: "Matematika",
    fase: "Fase A",
    elements: [
      {
        name: "Bilangan",
        cp: "Menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100; membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan; melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret yang banyaknya sampai 20."
      },
      {
        name: "Aljabar",
        cp: "Menunjukkan pemahaman makna simbol sama dengan (=) dalam membandingkan bentuk penjumlahan dan pengurangan sampai 20 menggunakan gambar; mengidentifikasi, meniru, dan melanjutkan pola bukan bilangan (misalnya, gambar, warna, bunyi/suara)."
      },
      {
        name: "Pengukuran",
        cp: "Membandingkan panjang dan berat benda secara langsung, dan membandingkan durasi waktu; mengukur dan mengestimasi panjang dan berat benda menggunakan satuan tidak baku."
      },
      {
        name: "Geometri",
        cp: "Mengenal berbagai bangun datar (segitiga, segiempat, segi banyak, lingkaran) dan bangun ruang (balok, kubus, kerucut, dan bola); melakukan komposisi (penyusunan) dan dekomposisi (penguraian) suatu bangun datar (segitiga, segiempat, dan segi banyak); dan menentukan posisi benda terhadap benda lain (kanan, kiri, depan belakang, bawah, atas)."
      },
      {
        name: "Analisis Data dan Peluang",
        cp: "Mengurutkan, menyortir, mengelompokkan, membandingkan, dan menyajikan data dari banyak benda dengan menggunakan turus dan piktogram paling banyak 4 kategori."
      }
    ]
  },
  {
    subjectName: "Matematika",
    fase: "Fase B",
    elements: [
      {
        name: "Bilangan",
        cp: "Memiliki pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000; membaca, menulis, membandingkan, dan mengurutkan bilangan; menentukan dan menggunakan nilai tempat; melakukan komposisi dan dekomposisi bilangan cacah sampai 10.000. Murid dapat melakukan dan menyelesaikan masalah operasi bilangan penjumlahan dan pengurangan bilangan cacah sampai 1.000; melakukan dan menyelesaikan masalah operasi perkalian dan pembagian bilangan cacah sampai 100 dengan bantuan benda konkret, gambar dan simbol; mengenal kelipatan dan faktor. Murid dapat melakukan perbandingan dan pengurutan pecahan dengan pembilang satu dan antar pecahan dengan penyebut yang sama; mengenal dan dapat menerapkan pecahan senilai, memiliki intuisi pecahan dan desimal, serta dapat menentukan pecahan sebagai desimal dan persen."
      },
      {
        name: "Aljabar",
        cp: "Menemukan nilai yang tidak diketahui dalam kalimat matematika yang melibatkan penjumlahan dan pengurangan pada bilangan cacah sampai 100, dengan menggunakan sifat-sifat bilangan dan operasinya. Murid dapat mengidentifikasi, meniru, dan mengembangkan pola gambar atau objek sederhana dan pola bilangan membesar dan mengecil yang dapat melibatkan penjumlahan dan pengurangan pada bilangan cacah sampai 100."
      },
      {
        name: "Pengukuran",
        cp: "Mengukur panjang dan berat benda menggunakan satuan baku; menentukan hubungan antar-satuan baku panjang (cm, m) dan antar-satuan berat (g, kg); serta mengukur dan mengestimasi luas dan volume menggunakan satuan tidak baku dan satuan baku berupa bilangan cacah."
      },
      {
        name: "Geometri",
        cp: "Mendeskripsikan ciri berbagai bentuk bangun datar (segiempat, segitiga, segi banyak); menyusun (komposisi) dan mengurai (dekomposisi) berbagai bangun datar dengan lebih dari satu cara jika memungkinkan."
      },
      {
        name: "Analisis Data dan Peluang",
        cp: "Mengurutkan, membandingkan, menyajikan, menganalisis dan menginterpretasi data dalam bentuk tabel, diagram gambar, piktogram, dan diagram batang (skala satu satuan)."
      }
    ]
  },
  {
    subjectName: "Matematika",
    fase: "Fase C",
    elements: [
      {
        name: "Bilangan",
        cp: "Menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 1.000.000; membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, melakukan komposisi dan dekomposisi bilangan; menyelesaikan masalah yang berkaitan dengan uang; melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100.000; serta menyelesaikan masalah yang berkaitan dengan KPK dan FPB. Murid dapat membandingkan dan mengurutkan berbagai pecahan termasuk pecahan campuran, melakukan operasi penjumlahan dan pengurangan pecahan, serta melakukan operasi perkalian dan pembagian pecahan dengan bilangan asli; membandingkan dan mengurutkan bilangan desimal, serta mengubah pecahan menjadi desimal dan persen."
      },
      {
        name: "Aljabar",
        cp: "Mengisi nilai yang belum diketahui dalam kalimat matematika yang melibatkan operasi penjumlahan, pengurangan, perkalian, dan pembagian pada bilangan cacah sampai 1000; mengidentifikasi, meniru, dan mengembangkan pola bilangan membesar dan mengecil yang melibatkan perkalian dan pembagian; bernalar secara proporsional untuk menyelesaikan masalah sehari-hari dengan rasio satuan; menggunakan operasi perkalian dan pembagian dalam menyelesaikan masalah yang berkaitan dengan proporsi."
      },
      {
        name: "Pengukuran",
        cp: "Menentukan keliling dan luas berbagai bentuk bangun datar (segitiga, segiempat, dan segi banyak) serta gabungannya; menghitung durasi waktu dan mengukur besar sudut."
      },
      {
        name: "Geometri",
        cp: "Mengkonstruksi dan mengurai bangun ruang (kubus, balok, dan gabungannya) dan mengenali visualisasi spasial (bagian depan, atas, dan samping); membandingkan karakteristik antar bangun datar dan antar bangun ruang; serta menentukan lokasi pada peta yang menggunakan sistem berpetak."
      },
      {
        name: "Analisis Data dan Peluang",
        cp: "Mengurutkan, membandingkan, menyajikan, dan menganalisis data banyak benda dan data hasil pengukuran dalam bentuk gambar, piktogram, diagram batang, dan tabel frekuensi untuk mendapatkan informasi; menentukan kejadian dengan kemungkinan yang lebih besar atau lebih kecil dalam suatu percobaan acak."
      }
    ]
  },

  // ================= BAHASA INGGRIS =================
  {
    subjectName: "Bahasa Inggris",
    fase: "Fase B",
    elements: [
      {
        name: "Menyimak - Berbicara (Listening - Speaking)",
        cp: "Memahami dan merespon teks lisan atau teks multimodal sederhana tentang kehidupan sehari-hari baik secara verbal atau non-verbal sesuai konteks. (Understand and respond to simple oral or multimodal texts about everyday life verbally or non-verbally in line with its context)."
      },
      {
        name: "Membaca - Memirsa (Reading - Viewing)",
        cp: "Memahami alur informasi secara keseluruhan dan merespon teks tulis atau teks multimodal sederhana tentang kehidupan sehari-hari sesuai konteks. (Understand the entire flow of information and respond to simple written or multimodal texts about everyday life in line with its context)."
      },
      {
        name: "Menulis - Mempresentasikan (Writing - Presenting)",
        cp: "Mengomunikasikan ide dan pengalamannya melalui berbagai jenis teks tulis sederhana atau teks multimodal tentang kehidupan sehari-hari sesuai konteks. (Communicate their ideas and experiences through various types of simple written texts or multimodal texts about everyday life in line with its context)."
      }
    ]
  },
  {
    subjectName: "Bahasa Inggris",
    fase: "Fase C",
    elements: [
      {
        name: "Menyimak - Berbicara (Listening - Speaking)",
        cp: "Memahami alur informasi teks secara keseluruhan dan merespon teks lisan atau teks multimodal sederhana tentang topik sehari-hari secara lisan dengan kalimat pendek dan sederhana sesuai konteks. (Understand the entire flow of information and respond to simple oral or multimodal texts about everyday topics using short and simple sentences verbally in line with its context)."
      },
      {
        name: "Membaca - Memirsa (Reading - Viewing)",
        cp: "Memahami alur informasi secara keseluruhan, gagasan utama dan informasi rinci dari beragam teks pendek atau teks multimodal tentang topik sehari-hari dan meresponnya sesuai konteks. (Understand the entire flow of information, main ideas and details from a variety of short texts or multimodal texts about everyday topics and respond in line with its context)."
      },
      {
        name: "Menulis - Mempresentasikan (Writing - Presenting)",
        cp: "Mengomunikasikan ide dan pengalamannya melalui berbagai jenis teks tulis sederhana atau teks multimodal tentang topik sehari-hari sesuai konteks. (Communicate their ideas and experiences through various types of simple written texts or multimodal texts about everyday topics in line with its context)."
      }
    ]
  },

  // ================= IPAS =================
  {
    subjectName: "IPAS",
    fase: "Fase B",
    elements: [
      {
        name: "Pemahaman IPAS",
        cp: "Menjelaskan bentuk dan fungsi pancaindra; menganalisis siklus hidup makhluk hidup dan upaya pelestariannya; menghasilkan solusi untuk masalah yang berkaitan dengan pelestarian sumber daya alam sebagai upaya mitigasi perubahan iklim; menyimpulkan proses perubahan wujud zat; menjelaskan sumber dan bentuk energi, serta proses perubahan bentuk energi dalam kehidupan sehari-hari; membedakan jenis gaya dan pengaruhnya terhadap arah, gerak, dan bentuk benda; menjelaskan peran, tugas, dan tanggung jawab serta interaksi sosial yang terjadi di sekitar tempat tinggal dan sekolah; mengenali letak kabupaten/kota dan provinsi tempat tinggalnya dengan menggunakan peta konvensional/digital; mengklasifikasikan ragam bentang alam dan keterkaitannya dengan profesi masyarakat, ragam budaya serta upaya untuk melestarikannya; menganalisis sejarah masyarakat di lingkungan tempat tinggal; menjelaskan nilai mata uang dan fungsinya, serta cara mengelola keuangan secara bijak."
      },
      {
        name: "Keterampilan Proses",
        cp: "Mampu menerapkan keterampilan proses yang meliputi: Mengamati (mengamati fenomena dan peristiwa secara sederhana dan mencatat hasil pengamatannya); Mempertanyakan dan Memprediksi (mengajukan pertanyaan dan memprediksi); Merencanakan dan Melakukan Penyelidikan (mengorganisasikan data dengan bantuan pendidik); Memproses, Menganalisis Data dan Informasi (membandingkan hasil pengamatan dengan prediksi); Mengevaluasi dan Refleksi (melakukan refleksi terhadap penyelidikan); serta Mengomunikasikan Hasil (mengomunikasikan hasil penyelidikan secara lisan dan tertulis)."
      }
    ]
  },
  {
    subjectName: "IPAS",
    fase: "Fase C",
    elements: [
      {
        name: "Pemahaman IPAS",
        cp: "Menganalisis hubungan antar komponen ekosistem serta jaring-jaring makanan di lingkungan sekitar; menganalisis pemanfaatan organ tubuh manusia dan sistem organ tubuh; menganalisis gelombang bunyi dan cahaya dalam kehidupan sehari-hari; memanfaatkan gaya magnet dan kelistrikan untuk menyelesaikan masalah sehari-hari; menjelaskan rupa bumi dan perubahannya serta sistem tata surya; menganalisis interaksi sosial dan kegiatan ekonomi di masyarakat; mengidentifikasi warisan budaya dan sejarah di wilayahnya; serta mengidentifikasi posisi geografis Indonesia di peta dunia."
      },
      {
        name: "Keterampilan Proses",
        cp: "Mampu menerapkan keterampilan proses meliputi: Mengamati; Mempertanyakan dan Memprediksi; Merencanakan dan Melakukan Penyelidikan; Memproses, Menganalisis Data dan Informasi; Mengevaluasi dan Refleksi; serta Mengomunikasikan Hasil penyelidikan ilmiah dan sosial secara sistematis."
      }
    ]
  },

  // ================= KODING DAN KECERDASAN ARTIFISIAL =================
  {
    subjectName: "Koding dan Kecerdasan Artifisial",
    fase: "Fase C",
    elements: [
      {
        name: "Berpikir Komputasional",
        cp: "Memahami permasalahan sederhana dalam kehidupan sehari-hari, menerapkan pemecahan masalah secara sistematis, serta menuliskan instruksi logis dan terstruktur menggunakan sekumpulan kosakata atau simbol."
      },
      {
        name: "Literasi Digital",
        cp: "Memahami konsep dasar, manfaat, dan dampak teknologi digital, memahami sistem komputer tingkat pradasar, menerapkan pengamanan informasi pribadi dalam komunikasi daring, memanfaatkan internet, dan memproduksi serta mendiseminasi konten digital dalam bentuk teks dan gambar."
      },
      {
        name: "Literasi dan Etika Kecerdasan Artifisial",
        cp: "Memahami konsep KA sederhana, manfaat dan dampak KA pada kehidupan sehari-hari, prinsip bahwa KA dikembangkan untuk meningkatkan benda konkret."
      }
    ]
  },

  // ================= FASE D (SMP / MTs) =================
  {
    subjectName: "Pendidikan Agama Islam dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Al-Qur'an Hadis",
        cp: "Peserta didik memahami definisi Al-Qur'an dan hadis Nabi serta posisi keduanya sebagai sumber hukum Islam; memahami ayat Al-Qur'an dan hadis tentang pentingnya menuntut ilmu, toleransi, pemeliharaan lingkungan hidup, serta moderasi beragama."
      },
      {
        name: "Akidah",
        cp: "Peserta didik memahami rukun iman, sifat-sifat Allah Swt., Asmaulhusna, serta iman kepada malaikat, kitab-kitab Allah, rasul-rasul Allah, hari akhir, dan qada dan qadar."
      },
      {
        name: "Akhlak",
        cp: "Peserta didik memahami hakikat amanah, jujur, mawas diri, empati, hormat dan patuh kepada orang tua dan guru, berbaik sangka, serta menjauhi sifat iri hati, dengki, ghibah, dan fitnah dalam kehidupan sehari-hari."
      },
      {
        name: "Fikih",
        cp: "Peserta didik memahami ketentuan bersuci (taharah), shalat fardhu dan sunnah, sujud sahwi, sujud tilawah, sujud syukur, zakat, puasa, haji dan umrah, serta menyembelih hewan kurban dan akikah."
      },
      {
        name: "Sejarah Peradaban Islam",
        cp: "Peserta didik memahami sejarah Nabi Muhammad Saw. periode Makkah dan Madinah, peradaban Islam masa Khulafaurrasyidin, serta kontribusi kebudayaan dan ilmu pengetahuan pada masa Bani Umayyah, Bani Abbasiyah, dan penyebaran Islam di Indonesia."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Kristen dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Allah Karya-Nya",
        cp: "Peserta didik memahami karya Allah yang menyelamatkan manusia melalui Yesus Kristus dan Roh Kudus yang memelihara kehidupan serta membimbing orang beriman dalam karya pemeliharaan dan pembaruan-Nya."
      },
      {
        name: "Manusia dan Nilai-nilai Kristiani",
        cp: "Peserta didik memahami pemeliharaan Allah terhadap dirinya dan nilai-nilai Kristiani dalam membangun hubungan dengan orang lain, keluarga, gereja, dan masyarakat secara bertanggung jawab."
      },
      {
        name: "Gereja dan Masyarakat Majemuk",
        cp: "Peserta didik memahami peran gereja di tengah masyarakat majemuk, bersikap toleran, menghargai keberagaman, dan berkontribusi aktif dalam kehidupan bermasyarakat."
      },
      {
        name: "Alam dan Lingkungan Hidup",
        cp: "Peserta didik memahami tanggung jawabnya untuk memelihara dan melestarikan alam ciptaan Allah sebagai bagian dari wujud iman Kristiani."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Katolik dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Pribadi Peserta Didik",
        cp: "Peserta didik memahami keunikan dirinya sebagai citra Allah, menerima kekuatan dan keterbatasan, serta mengembangkan potensi diri demi kebaikan bersama."
      },
      {
        name: "Yesus Kristus",
        cp: "Peserta didik memahami Yesus Kristus yang mewartakan Kerajaan Allah melalui sabda dan tindakan, sengsara, wafat, dan kebangkitan-Nya demi keselamatan manusia."
      },
      {
        name: "Gereja",
        cp: "Peserta didik memahami Gereja sebagai umat Allah dan persekutuan terbuka yang dijiwai oleh Roh Kudus serta berpartisipasi dalam tugas perutusan Gereja."
      },
      {
        name: "Masyarakat",
        cp: "Peserta didik memahami tanggung jawab sebagai warga masyarakat dan warga negara yang berlandaskan ajaran sosial Gereja dan Pancasila."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Hindu dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Kitab Suci Veda",
        cp: "Peserta didik memahami struktur, kodifikasi, dan nilai-nilai ajaran suci Veda (Sruti dan Smrti) dalam merujuk perilaku kehidupan bermasyarakat."
      },
      {
        name: "Tattwa",
        cp: "Peserta didik memahami konsep Brahmavidya, Atman, Punarbhava, Karmaphala, dan Moksha sebagai bagian dari Panca Sradha."
      },
      {
        name: "Susila",
        cp: "Peserta didik memahami dan mengaplikasikan ajaran Sad Ripu, Tri Kaya Parisudha, serta nilai Tat Tvam Asi dalam interaksi sosial sehari-hari."
      },
      {
        name: "Acara",
        cp: "Peserta didik memahami bentuk dan makna Yajna, panca yajna, sarana persembahyangan, serta hari-hari suci keagamaan Hindu."
      },
      {
        name: "Sejarah Agama Hindu",
        cp: "Peserta didik memahami perkembangan dan kontribusi ajaran serta sejarah kebudayaan agama Hindu di Indonesia dan dunia."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Buddha dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Sejarah Buddha",
        cp: "Peserta didik memahami riwayat hidup Buddha Gotama, peristiwa-peristiwa penting dalam sejarah perkembangan Agama Buddha, serta peninggalan kebudayaan Buddha di Indonesia."
      },
      {
        name: "Kebenaran Mulia (Dhamma)",
        cp: "Peserta didik memahami Empat Kebenaran Mulia, Hukum Tilakkhana, Hukum Kamma dan Punabbhava, serta Hukum Paticcasamuppada."
      },
      {
        name: "Sila dan Akhlak",
        cp: "Peserta didik menerapkan Pancasila Buddhis, Mangala Sutta, dan sikap kesadaran (Sati) dalam kehidupan keluarga, sekolah, dan masyarakat."
      }
    ]
  },
  {
    subjectName: "Pendidikan Agama Khonghucu dan Budi Pekerti",
    fase: "Fase D",
    elements: [
      {
        name: "Kitab Suci (Si Shu Wu Jing)",
        cp: "Peserta didik memahami struktur, nilai, dan kandungan ajaran suci dalam Kitab Si Shu dan Wu Jing sebagai pedoman hidup moralitas."
      },
      {
        name: "Iman dan Kepercayaan (Tian)",
        cp: "Peserta didik memahami hakikat Huang Tian, Nabi Kongzi, dan ajaran Wu Chang (Ren, Yi, Li, Zhi, Xin) dalam membina diri menjadi Junzi."
      },
      {
        name: "Tata Ibadah dan Perilaku (Li)",
        cp: "Peserta didik menerapkan tata cara persembahyangan, penghormatan kepada leluhur, serta perayaan hari-hari besar keagamaan Khonghucu."
      }
    ]
  },
  {
    subjectName: "Pendidikan Pancasila",
    fase: "Fase D",
    elements: [
      {
        name: "Pancasila",
        cp: "Peserta didik menganalisis kronologi lahirnya Pancasila; memahami fungsi dan kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, dan ideologi negara; serta mengimplementasikan nilai-nilai Pancasila dalam kehidupan sehari-hari."
      },
      {
        name: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        cp: "Peserta didik menganalisis konstitusi dan norma yang berlaku; memahami hierarki perundang-undangan; serta memahami hak dan kewajiban warga negara dalam UUD NRI Tahun 1945."
      },
      {
        name: "Bhinneka Tunggal Ika",
        cp: "Peserta didik mengidentifikasi keberagaman suku, agama, ras, dan antargolongan; menganalisis potensi konflik dan solusinya; serta mengampanyekan toleransi dan penghargaan terhadap kebinekaan."
      },
      {
        name: "Negara Kesatuan Republik Indonesia",
        cp: "Peserta didik memahami konsep wilayah NKRI, persatuan dan kesatuan bangsa, serta peran aktif dalam menjaga keutuhan Negara Kesatuan Republik Indonesia."
      }
    ]
  },
  {
    subjectName: "Bahasa Indonesia",
    fase: "Fase D",
    elements: [
      {
        name: "Menyimak",
        cp: "Peserta didik mampu menganalisis dan mengevaluasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari berbagai tipe teks fiksi dan nonfiksi lisan/audio."
      },
      {
        name: "Membaca dan Memirsa",
        cp: "Peserta didik mampu memahami informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari berbagai jenis teks (deskripsi, narasi, eksposisi, eksplanasi, diskusi, ulasan, puisi, drama, dll.) secara visual maupun audiovisual."
      },
      {
        name: "Berbicara dan Mempresentasikan",
        cp: "Peserta didik mampu menyampaikan gagasan, pikiran, pandangan, arahan, atau pesan untuk tujuan pengajuan usul, pemecahan masalah, dan pemberian solusi secara lisan dalam bentuk monolog dan dialog logis, kritis, dan kreatif."
      },
      {
        name: "Menulis",
        cp: "Peserta didik mampu menulis gagasan, pikiran, pandangan, arahan, atau pesan tertulis untuk berbagai tujuan secara logis, kritis, dan kreatif dalam berbagai bentuk teks nonfiksi dan fiksi."
      }
    ]
  },
  {
    subjectName: "Matematika",
    fase: "Fase D",
    elements: [
      {
        name: "Bilangan",
        cp: "Peserta didik dapat membaca, menulis, membandingkan, dan melakukan operasi aritmetika pada bilangan bulat, pecahan, rasional, irasional, desimal, dan bentuk pangkat/akar."
      },
      {
        name: "Aljabar",
        cp: "Peserta didik dapat menyajikan, menganalisis, dan menyelesaikan masalah yang berkaitan dengan bentuk aljabar, persamaan dan pertidaksamaan linier satu variabel, persamaan linier dua variabel, serta fungsi linier."
      },
      {
        name: "Pengukuran",
        cp: "Peserta didik dapat menjelaskan cara menentukan luas permukaan dan volume bangun ruang (prisma, tabung, limas, kerucut, bola) dan menggunakannya untuk menyelesaikan masalah."
      },
      {
        name: "Geometri",
        cp: "Peserta didik dapat membuktikan teorema Pythagoras, mengidentifikasi sifat-sifat kongruensi dan kesebangunan pada bangun datar, serta melakukan transformasi geometri."
      },
      {
        name: "Analisis Data dan Peluang",
        cp: "Peserta didik dapat merumuskan pertanyaan, mengumpulkan, menyajikan, dan menginterpretasikan data tunggal dan kelompok (mean, median, modus, jangkauan); serta menentukan peluang teoritis dan frekuensi relatif suatu kejadian."
      }
    ]
  },
  {
    subjectName: "Ilmu Pengetahuan Alam (IPA)",
    fase: "Fase D",
    elements: [
      {
        name: "Pemahaman IPA",
        cp: "Peserta didik memahami hakikat sains dan metode ilmiah; struktur dan fungsi sel serta sistem organ manusia/makhluk hidup; interaksi makhluk hidup dan lingkungan; sifat zat dan perubahannya; pewarisan sifat; gaya, gerak, dan tekanan; energi dan perubahannya; gelombang dan cahaya; listrik dan kemagnetan; serta tata surya dan dinamika bumi."
      },
      {
        name: "Keterampilan Proses",
        cp: "Peserta didik melakukan penyelidikan ilmiah meliputi mengamati, mempertanyakan dan memprediksi, merencanakan dan melakukan penyelidikan, memproses, menganalisis data dan informasi, mengevaluasi dan refleksi, serta mengomunikasikan hasil riset."
      }
    ]
  },
  {
    subjectName: "Ilmu Pengetahuan Sosial (IPS)",
    fase: "Fase D",
    elements: [
      {
        name: "Pemahaman Konsep IPS",
        cp: "Peserta didik memahami kondisi sosial, geografis, dan demografis Indonesia; interaksi keruangan; aktivitas ekonomi (produksi, distribusi, konsumsi) dan pasar; perkembangan masyarakat Indonesia dari masa praaksara, Hindu-Buddha, Islam, kolonialisme, hingga kemerdekaan dan reformasi."
      },
      {
        name: "Keterampilan Proses IPS",
        cp: "Peserta didik melakukan penelitian sosial sederhana untuk mengamati, menanya, mengumpulkan data, menganalisis, menarik kesimpulan, serta menyajikan temuan isu-isu sosial dan lingkungan."
      }
    ]
  },
  {
    subjectName: "Bahasa Inggris",
    fase: "Fase D",
    elements: [
      {
        name: "Menyimak - Berbicara (Listening - Speaking)",
        cp: "Peserta didik menggunakan bahasa Inggris untuk berinteraksi, bertukar gagasan, menyampaikan pendapat, dan mengungkapkan perasaan dalam situasi formal dan informal terkait topik kehidupan sehari-hari."
      },
      {
        name: "Membaca - Memirsa (Reading - Viewing)",
        cp: "Peserta didik membaca dan merespons berbagai teks tulisan dan visual (descriptive, recount, narrative, procedure, report) untuk menemukan informasi tersurat dan tersirat serta mengevaluasi tujuan teks."
      },
      {
        name: "Menulis - Mempresentasikan (Writing - Presenting)",
        cp: "Peserta didik mengomunikasikan ide dan pengalaman mereka melalui paragraf terstruktur dan teks berformat sederhana dengan kosakata dan tata bahasa yang tepat."
      }
    ]
  },
  {
    subjectName: "Informatika",
    fase: "Fase D",
    elements: [
      {
        name: "Berpikir Komputasional (BK)",
        cp: "Peserta didik mampu menerapkan algoritma dan pemikiran komputasional untuk memecahkan masalah diskrit berskala kecil-menengah secara efektif."
      },
      {
        name: "Teknologi Informasi dan Komunikasi (TIK)",
        cp: "Peserta didik mampu memanfaatkan aplikasi perkakas pengolah kata, lembar kerja, presentasi, serta pencarian informasi di internet secara efisien."
      },
      {
        name: "Sistem Komputer (SK)",
        cp: "Peserta didik memahami fungsi hardware, software, dan sistem operasi serta interaksi di antara ketiganya."
      },
      {
        name: "Jaringan Komputer dan Internet (JKI)",
        cp: "Peserta didik memahami konektivitas jaringan, enkripsi data sederhana, dan keamanan digital saat mengakses internet."
      },
      {
        name: "Analisis Data (AD)",
        cp: "Peserta didik mampu mengumpulkan, mengolah, menganalisis, dan memvisualisasikan data menggunakan aplikasi perkakas secara akurat."
      },
      {
        name: "Algoritma dan Pemrograman (AP)",
        cp: "Peserta didik mampu membuat program visual (seperti Scratch/Blockly) yang menggunakan variabel, percabangan, dan perulangan."
      },
      {
        name: "Dampak Sosial Informatika (DSI)",
        cp: "Peserta didik memahami etika berinternet, jejak digital, kewargaan digital, serta dampak positif/negatif TIK dalam kehidupan sosial."
      },
      {
        name: "Praktik Lintas Bidang (PLB)",
        cp: "Peserta didik mampu bergotong royong menghasilkan produk artefak komputasional melalui siklus rekayasa perangkat lunak sederhana."
      }
    ]
  },
  {
    subjectName: "PJOK",
    fase: "Fase D",
    elements: [
      {
        name: "Keterampilan Gerak",
        cp: "Peserta didik mampu mempraktikkan variasi dan kombinasi pola gerak dasar spesifik dalam berbagai permainan bola besar, bola kecil, atletik, beladiri, senam, dan aktivitas air."
      },
      {
        name: "Pengetahuan Gerak",
        cp: "Peserta didik mampu menganalisis prosedur variasi dan kombinasi pola gerak dasar spesifik dan taktik permainan/olahraga."
      },
      {
        name: "Pemanfaatan Gerak",
        cp: "Peserta didik mampu merancang dan melakukan aktivitas kebugaran jasmani terkait kesehatan serta menerapkan prinsip pola hidup sehat (gizi seimbang, bahaya merokok, obat terlarang, pergaulan bebas)."
      },
      {
        name: "Pengembangan Karakter dan Nilai-nilai Gerak",
        cp: "Peserta didik menunjukkan sikap proaktif, fair play, kerja sama, dan tanggung jawab pribadi serta sosial dalam aktivitas jasmani."
      }
    ]
  },
  {
    subjectName: "Seni Musik",
    fase: "Fase D",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Peserta didik menyimak, menganalisis, dan mengidentifikasi unsur-unsur musik (ritme, melodi, harmoni, bentuk lagu) serta gaya musik lokal/global."
      },
      {
        name: "Menciptakan (Creating/Making)",
        cp: "Peserta didik membuat komposisi/aransemen musik sederhana menggunakan instrumen atau suara vokal."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Peserta didik memberi masukan, apresiasi, dan kritik konstruktif terhadap karya musik diri sendiri dan orang lain."
      },
      {
        name: "Berdampak (Impacting)",
        cp: "Peserta didik menghasilkan pertunjukan musik yang menumbuhkan rasa percaya diri, kreativitas, dan menghargai nilai-nilai kearifan lokal."
      }
    ]
  },
  {
    subjectName: "Seni Rupa",
    fase: "Fase D",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Peserta didik mengamati dan mengidentifikasi unsur-unsur seni rupa (garis, bidang, bentuk, warna, tekstur, ruang) serta prinsip desain dalam karya visual."
      },
      {
        name: "Menciptakan (Making/Creating)",
        cp: "Peserta didik membuat karya seni rupa 2D atau 3D berdasarkan eksplorasi media, teknik, dan konsep secara kreatif."
      },
      {
        name: "Merekam dan Merefleksikan (Reflecting)",
        cp: "Peserta didik menilai, mengapresiasi, dan mendokumentasikan proses serta hasil karya seni rupa sendiri dan orang lain."
      }
    ]
  },
  {
    subjectName: "Seni Tari",
    fase: "Fase D",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Peserta didik mengamati, mengidentifikasi, dan memeragakan gerak tari tradisi/kreasi berdasarkan ruang, waktu, dan tenaga."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Peserta didik merangkai ragam gerak tari sederhana berdasar pada tema tertentu secara individual maupun kelompok."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Peserta didik mengevaluasi pertunjukan tari dan menghargai keberagaman seni tari Nusantara."
      }
    ]
  },
  {
    subjectName: "Seni Teater",
    fase: "Fase D",
    elements: [
      {
        name: "Mengalami (Experiencing)",
        cp: "Peserta didik melakukan olah tubuh, olah vokal, dan olah rasa serta memahami tata artistik pertunjukan teater."
      },
      {
        name: "Menciptakan (Creating)",
        cp: "Peserta didik menyusun naskah pendek dan mementaskan pertunjukan teater sederhana secara bergotong royong."
      },
      {
        name: "Merefleksikan (Reflecting)",
        cp: "Peserta didik mengevaluasi perannya dalam pertunjukan dan mengapresiasi karya seni teater."
      }
    ]
  },
  {
    subjectName: "Prakarya Budi Daya",
    fase: "Fase D",
    elements: [
      {
        name: "Eksplorasi dan Observasi",
        cp: "Menjelaskan aspek-aspek penting budi daya berdasarkan hasil observasi; menjelaskan produk budi daya serta modifikasi bahan, alat, dan teknik bila diperlukan sesuai potensi lingkungan/kearifan lokal berdasarkan hasil eksplorasi."
      },
      {
        name: "Desain/Perencanaan",
        cp: "Menyusun rencana kegiatan budi daya serta modifikasi bahan, alat, dan teknik bila diperlukan, sesuai potensi lingkungan/kearifan lokal."
      },
      {
        name: "Produksi",
        cp: "Menghasilkan produk budi daya yang aman berdasarkan potensi lingkungan/kearifan lokal dengan modifikasi bahan, alat, dan teknik bila diperlukan, serta ditampilkan dalam kemasan sederhana."
      },
      {
        name: "Evaluasi dan Refleksi",
        cp: "Mengevaluasi dan merefleksikan proses serta produk budi daya yang dihasilkan."
      }
    ]
  },
  {
    subjectName: "Prakarya Kerajinan",
    fase: "Fase D",
    elements: [
      {
        name: "Observasi dan Eksplorasi",
        cp: "Mengamati dan mengeksplorasi aneka ragam produk kerajinan nusantara berupa bahan, alat, teknik, dan prosedur pembuatan secara sistematis dan kontekstual untuk menciptakan ide atau gagasan dalam membuat produk yang kreatif dan inovatif."
      },
      {
        name: "Desain/Perencanaan",
        cp: "Menyusun, membuat, dan mengembangkan rencana produk kerajinan berdasarkan hasil observasi dan eksplorasi."
      },
      {
        name: "Produksi",
        cp: "Membuat produk kerajinan yang kreatif dan inovatif berdasarkan desain/perencanaan yang telah dibuat serta ditampilkan dalam kemasan yang sesuai."
      },
      {
        name: "Refleksi dan Evaluasi",
        cp: "Merefleksikan proses observasi, eksplorasi, desain, serta mengevaluasi produk kerajinan yang dihasilkan."
      }
    ]
  },
  {
    subjectName: "Prakarya Pengolahan",
    fase: "Fase D",
    elements: [
      {
        name: "Observasi dan Eksplorasi",
        cp: "Mengidentifikasi dan mengomunikasikan karakteristik bahan, alat, teknik pengolahan, pengemasan, dan penyajian produk olahan pangan dan atau nonpangan sesuai potensi lingkungan."
      },
      {
        name: "Perencanaan",
        cp: "Merancang modifikasi bahan, alat, atau teknik pengolahan, pengemasan atau penyajian produk olahan pangan dan atau nonpangan."
      },
      {
        name: "Produksi",
        cp: "Membuat, mengemas, dan menyajikan produk olahan pangan dan atau nonpangan hasil rancangan modifikasi dengan menerapkan K3 (kesehatan dan keselamatan kerja)."
      },
      {
        name: "Refleksi dan Evaluasi",
        cp: "Mengevaluasi dan merefleksi setiap tahapan produksi olahan pangan dan atau nonpangan hasil modifikasi."
      }
    ]
  },
  {
    subjectName: "Prakarya Rekayasa",
    fase: "Fase D",
    elements: [
      {
        name: "Observasi dan eksplorasi",
        cp: "Menganalisis aspek-aspek yang penting diobservasi dalam pengembangan produk rekayasa dan mengeksplorasi produk rekayasa teknologi tepat guna yang kreatif, inovatif, dan bernilai ergonomis berdasarkan karakteristik bahan, alat, teknik, atau prosedur pembuatan."
      },
      {
        name: "Desain/perencanaan",
        cp: "Merancang desain produk rekayasa teknologi tepat guna yang bernilai ergonomis melalui modifikasi bahan, alat, teknik, atau prosedur pembuatan dengan memperhatikan potensi dan dampak lingkungan yang siap dikembangkan menjadi model."
      },
      {
        name: "Produksi",
        cp: "Membuat model/prototipe produk rekayasa teknologi tepat guna yang bernilai ergonomis sesuai dengan kebutuhan lingkungan dan/atau kearifan lokal melalui modifikasi bentuk, alat, teknik, atau prosedur pembuatan serta berdampak pada lingkungan maupun kehidupan sehari-hari."
      },
      {
        name: "Refleksi dan Evaluasi",
        cp: "Merefleksikan proses dan hasil observasi, eksplorasi, desain, dan evaluasi produk berdasarkan fungsi dan nilai guna."
      }
    ]
  },
  {
    subjectName: "Koding dan Kecerdasan Artifisial",
    fase: "Fase D",
    elements: [
      {
        name: "Berpikir Komputasional",
        cp: "Menerapkan pengelolaan data, pemecahan masalah sederhana dalam kehidupan masyarakat secara sistematis, dan menuliskan instruksi."
      },
      {
        name: "Literasi Digital",
        cp: "Memproduksi dan mendiseminasi konten digital berupa audio, video, slide, dan infografis."
      },
      {
        name: "Literasi dan Etika Kecerdasan Artifisial",
        cp: "Memahami perbedaan cara manusia dan KA menggabungkan informasi dari beberapa perangkat penginderaan atau sensor, memahami bagaimana komputer memaknai informasi dari perangkat penginderaan atau sensor, memahami kualitas data, serta manfaat dan dampak KA pada kehidupan masyarakat. Memahami etika penggunaan KA dalam kehidupan sehari-hari seperti menjaga data pribadi dalam menggunakan KA, KA adalah sebagai alat bantu sehingga manusia tidak boleh tergantung dan percaya sepenuhnya pada KA karena KA masih sangat mungkin menghasilkan output yang salah, bias, atau melakukan halusinasi, serta menganalisis konten deep fake dalam bentuk gambar, audio, atau video."
      },
      {
        name: "Pemanfaatan dan Pengembangan Kecerdasan Artifisial",
        cp: "Menggunakan perangkat KA sederhana dengan kritis dan mampu menuliskan input bermakna ke dalam sistem KA."
      }
    ]
  },

  // ================= FASE E & FASE F (SMA / SMK / MA) =================
  ...CP_DATABASE_E_F
];

export function getFase(kelas: string): string {
  if (kelas === "PAUD" || kelas === "TK" || kelas === "Fase Fondasi" || kelas === "RA") return "Fase Fondasi";
  if (["Kelas I", "Kelas II"].includes(kelas)) return "Fase A";
  if (["Kelas III", "Kelas IV"].includes(kelas)) return "Fase B";
  if (["Kelas V", "Kelas VI"].includes(kelas)) return "Fase C";
  if (["Kelas VII", "Kelas VIII", "Kelas IX"].includes(kelas)) return "Fase D";
  if (kelas === "Kelas X") return "Fase E";
  if (["Kelas XI", "Kelas XII"].includes(kelas)) return "Fase F";
  return "";
}

export function findOfficialCp(subject: string, kelas: string): CpData | null {
  let fase = getFase(kelas);
  if (!fase) {
    if (kelas.includes("Fondasi") || kelas.includes("PAUD") || kelas.includes("TK")) fase = "Fase Fondasi";
    else if (kelas.includes("A")) fase = "Fase A";
    else if (kelas.includes("B")) fase = "Fase B";
    else if (kelas.includes("C")) fase = "Fase C";
    else if (kelas.includes("D")) fase = "Fase D";
    else if (kelas.includes("E")) fase = "Fase E";
    else if (kelas.includes("F")) fase = "Fase F";
  }
  if (!fase) return null;

  const cleanSubject = subject.toLowerCase().trim();

  let targetSubject = "";
  if (cleanSubject.includes("pjok") || cleanSubject.includes("penjas") || cleanSubject.includes("olahraga") || cleanSubject.includes("jasmani")) {
    targetSubject = "PJOK";
  } else if (cleanSubject.includes("seni musik") || cleanSubject.includes("musik")) {
    targetSubject = "Seni Musik";
  } else if (cleanSubject.includes("seni rupa") || cleanSubject.includes("rupa")) {
    targetSubject = "Seni Rupa";
  } else if (cleanSubject.includes("seni tari") || cleanSubject.includes("tari")) {
    targetSubject = "Seni Tari";
  } else if (cleanSubject.includes("seni teater") || cleanSubject.includes("teater")) {
    targetSubject = "Seni Teater";
  } else if (cleanSubject.includes("paud") || cleanSubject.includes("tk") || cleanSubject.includes("taman kanak")) {
    targetSubject = "PAUD";
  } else if (cleanSubject.includes("pancasila") || cleanSubject.includes("ppkn") || cleanSubject.includes("pkn")) {
    targetSubject = "Pendidikan Pancasila";
  } else if (cleanSubject.includes("matematika") || cleanSubject === "math" || cleanSubject === "mat") {
    targetSubject = "Matematika";
  } else if (cleanSubject.includes("ipas") || cleanSubject.includes("sains dan sosial") || cleanSubject.includes("ilmu pengetahuan alam dan sosial")) {
    targetSubject = "IPAS";
  } else if (cleanSubject.includes("ilmu pengetahuan alam") || cleanSubject === "ipa" || cleanSubject.includes(" (ipa)")) {
    targetSubject = "Ilmu Pengetahuan Alam (IPA)";
  } else if (cleanSubject.includes("ilmu pengetahuan sosial") || cleanSubject === "ips" || cleanSubject.includes(" (ips)")) {
    targetSubject = "Ilmu Pengetahuan Sosial (IPS)";
  } else if (cleanSubject.includes("informatika") || cleanSubject.includes("tik") || cleanSubject.includes("komputer")) {
    targetSubject = "Informatika";
  } else if (cleanSubject.includes("budi daya") || cleanSubject.includes("budidaya")) {
    targetSubject = "Prakarya Budi Daya";
  } else if (cleanSubject.includes("kerajinan")) {
    targetSubject = "Prakarya Kerajinan";
  } else if (cleanSubject.includes("pengolahan")) {
    targetSubject = "Prakarya Pengolahan";
  } else if (cleanSubject.includes("rekayasa")) {
    targetSubject = "Prakarya Rekayasa";
  } else if (cleanSubject.includes("bahasa indonesia") || cleanSubject === "indonesia") {
    targetSubject = "Bahasa Indonesia";
  } else if (cleanSubject.includes("inggris") || cleanSubject.includes("english")) {
    targetSubject = "Bahasa Inggris";
  } else if (cleanSubject.includes("koding") || cleanSubject.includes("kecerdasan artifisial") || cleanSubject.includes("ai")) {
    targetSubject = "Koding dan Kecerdasan Artifisial";
  } else if (cleanSubject.includes("islam") || cleanSubject.includes("pai")) {
    targetSubject = "Pendidikan Agama Islam dan Budi Pekerti";
  } else if (cleanSubject.includes("kristen")) {
    targetSubject = "Pendidikan Agama Kristen dan Budi Pekerti";
  } else if (cleanSubject.includes("katolik")) {
    targetSubject = "Pendidikan Agama Katolik dan Budi Pekerti";
  } else if (cleanSubject.includes("hindu")) {
    targetSubject = "Pendidikan Agama Hindu dan Budi Pekerti";
  } else if (cleanSubject.includes("buddha") || cleanSubject.includes("budha")) {
    targetSubject = "Pendidikan Agama Buddha dan Budi Pekerti";
  } else if (cleanSubject.includes("khonghucu") || cleanSubject.includes("konghucu")) {
    targetSubject = "Pendidikan Agama Khonghucu dan Budi Pekerti";
  } else {
    targetSubject = subject;
  }

  const match = CP_DATABASE_046.find((item) => {
    if (item.fase.toLowerCase() !== fase.toLowerCase()) return false;
    const itemSub = item.subjectName.toLowerCase();
    const targetSub = targetSubject.toLowerCase();
    const origSub = cleanSubject;

    if (itemSub === targetSub || itemSub === origSub) return true;
    if (itemSub.includes(targetSub) || targetSub.includes(itemSub)) return true;
    if (origSub.includes(itemSub) || itemSub.includes(origSub)) return true;

    // Special handles
    if ((targetSubject === "Pendidikan Agama Islam dan Budi Pekerti" || origSub.includes("islam")) && itemSub.includes("islam")) return true;
    if ((targetSubject === "PJOK" || origSub.includes("pjok")) && itemSub.includes("pjok")) return true;
    if (origSub.includes("budi daya") && itemSub.includes("budi daya")) return true;
    if (origSub.includes("kerajinan") && itemSub.includes("kerajinan")) return true;
    if (origSub.includes("pengolahan") && itemSub.includes("pengolahan")) return true;
    if (origSub.includes("rekayasa") && itemSub.includes("rekayasa")) return true;

    return false;
  });
  return match || null;
}

export function formatCpForTextarea(cpData: CpData): string {
  const isPai =
    cpData.subjectName === "PAI" ||
    cpData.subjectName.toLowerCase().includes("agama islam");
  const docRef = isPai
    ? "Sesuai Keputusan No. 020/2026 (Pendidikan Agama Islam)"
    : "Sesuai BSKAP No. 046/H/KR/2025";
  let formatted = `${docRef} (Fase: ${cpData.fase}):\n\n`;
  cpData.elements.forEach((el, index) => {
    formatted += `${index + 1}. Elemen ${el.name}:\n   CP: ${el.cp}\n\n`;
  });
  return formatted.trim();
}
