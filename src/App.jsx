import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Feather, ShoppingBag, Bookmark, 
  ChevronRight, ArrowRight, ShieldCheck, CheckCircle2, 
  Search, SlidersHorizontal, Calculator, Send, Eye,
  Volume2, Info, Star, Package, RefreshCw, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DAFTAR_BUKU = [
  {
    id: 1,
    judul: "Malam Sebelum Kejatuhan Algoritma",
    penulis: "Aksa Dananjaya",
    kategori: "Fiksi Spekulatif",
    harga: 165000,
    diskon: 145000,
    rating: 4.9,
    halaman: 312,
    isbn: "978-623-01-9921-4",
    kertas: "Munken Print Cream 80gsm Swedia",
    jilid: "Jahitan Benang Terbuka (Otabind)",
    sampul: "Hardcover Linum dengan Foil Perak Dingin",
    suasana: "Kontemplasi Tengah Malam",
    deskripsi: "Sebuah diseksi puitis terhadap kecemasan digital generasi yang tumbuh di antara ruang obrolan anonim dan kota megapolitan Jakarta tahun 2041.",
    soundtrack: "Brian Eno — Music for Airports",
    stok: 14
  },
  {
    id: 2,
    judul: "Panduan Melarikan Diri dari Jam Kantor",
    penulis: "Citra Kirana Devi",
    kategori: "Esai Eksistensial",
    harga: 135000,
    diskon: null,
    rating: 4.8,
    halaman: 228,
    isbn: "978-623-01-8842-1",
    kertas: "Holmen Book Swedia 70gsm Ringan",
    jilid: "Softcover Sayap Lipat Ganda (French Flaps)",
    sampul: "Kertas Seni Bertaut Tekstur Pasir",
    suasana: "Anti-Kelelahan Korporat",
    deskripsi: "Menolak mitos produktivitas tiada henti. Narasi reflektif tentang hak istirahat, burnout sunyi di SCBD, dan membangun otonomi hidup mandiri.",
    soundtrack: "Lamp — For Lovers (Tokyo 2000)",
    stok: 8
  },
  {
    id: 3,
    judul: "Anatomi Hujan dan Hal-Hal yang Gagal Diabadikan",
    penulis: "Renata Malik",
    kategori: "Puisi & Visual",
    harga: 185000,
    diskon: 172000,
    rating: 5.0,
    halaman: 160,
    isbn: "978-623-01-7719-0",
    kertas: "Fedrigoni Arena Natural Rough 120gsm",
    jilid: "Binding Pita Sutra Hitam Manual",
    sampul: "Tipografi Embos Buta pada Linen Alami",
    suasana: "Melankolia Hujan",
    deskripsi: "Kumpulan soneta kontemporer bersanding dengan arsip fotografi monokrom sudut-sudut kota Bandung lama yang perlahan dilupakan zaman.",
    soundtrack: "Ryuichi Sakamoto — Opus",
    stok: 5
  },
  {
    id: 4,
    judul: "Monolog Layar Mati (Skenario Film)",
    penulis: "Tegar Wicaksono",
    kategori: "Skrip & Sinema",
    harga: 150000,
    diskon: null,
    rating: 4.7,
    halaman: 204,
    isbn: "978-623-01-6631-9",
    kertas: "Munken Pure Rough 100gsm",
    jilid: "Jilid Kawat Jepang Terbuka Eksperimental",
    sampul: "Cardboard Kraft Daur Ulang 400gsm",
    suasana: "Distopia Sinematik",
    deskripsi: "Naskah skenario panjang film independen yang menelusuri kisah operator menara seluler terpencil di Laut Maluku.",
    soundtrack: "Tim Hecker — Ravedeath, 1972",
    stok: 19
  }
];

const SUASANA_HATI = [
  "Semua",
  "Kontemplasi Tengah Malam",
  "Anti-Kelelahan Korporat",
  "Melankolia Hujan",
  "Distopia Sinematik"
];

export default function App() {
  const [tabAktif, setTabAktif] = useState('toko');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [suasanaFilter, setSuasanaFilter] = useState('Semua');
  const [kataKunci, setKataKunci] = useState('');
  const [modalBuku, setModalBuku] = useState(null);
  const [keranjang, setKeranjang] = useState([]);
  const [drawerKeranjang, setDrawerKeranjang] = useState(false);
  const [notifikasi, setNotifikasi] = useState(null);

  const [oplah, setOplah] = useState(200);
  const [tebalHalaman, setTebalHalaman] = useState(220);
  const [jenisKertas, setJenisKertas] = useState('munken');
  const [jenisJilid, setJenisJilid] = useState('softcover');
  const [hargaJual, setHargaJual] = useState(145000);

  const [tahapNaskah, setTahapNaskah] = useState(1);
  const [formNaskah, setFormNaskah] = useState({
    judul: '',
    namaPenulis: '',
    email: '',
    genre: 'Fiksi Spekulatif',
    sinopsis: '',
    paketPilihan: 'Kurasi Editorial'
  });
  const [naskahTerkirim, setNaskahTerkirim] = useState(false);

  const tampilkanNotif = (pesan) => {
    setNotifikasi(pesan);
    setTimeout(() => setNotifikasi(null), 3000);
  };

  const bukuTerfilter = useMemo(() => {
    return DAFTAR_BUKU.filter(buku => {
      const matchKategori = kategoriFilter === 'Semua' || buku.kategori === kategoriFilter;
      const matchSuasana = suasanaFilter === 'Semua' || buku.suasana === suasanaFilter;
      const matchCari = buku.judul.toLowerCase().includes(kataKunci.toLowerCase()) || 
                          buku.penulis.toLowerCase().includes(kataKunci.toLowerCase());
      return matchKategori && matchSuasana && matchCari;
    });
  }, [kategoriFilter, suasanaFilter, kataKunci]);

  const tambahKeKeranjang = (buku) => {
    setKeranjang(prev => {
      const itemAda = prev.find(item => item.id === buku.id);
      if (itemAda) {
        return prev.map(item => item.id === buku.id ? { ...item, jumlah: item.jumlah + 1 } : item);
      }
      return [...prev, { ...buku, jumlah: 1 }];
    });
    tampilkanNotif(`"${buku.judul}" ditambahkan ke keranjang arsip.`);
  };

  const hasilKalkulasi = useMemo(() => {
    const tarifKertas = jenisKertas === 'munken' ? 95 : 75;
    const biayaIsi = tebalHalaman * tarifKertas;
    const biayaSampul = jenisJilid === 'hardcover' ? 24000 : 12000;
    const biayaSetupJilid = 500000 / oplah;
    const ongkosCetakPerBuku = Math.round(biayaIsi + biayaSampul + biayaSetupJilid);
    const totalModalProduksi = ongkosCetakPerBuku * oplah;
    const omsetKotor = hargaJual * oplah;
    const estimasiLabaKotor = omsetKotor - totalModalProduksi;
    const estimasiRoyaltiPenulis = Math.round(hargaJual * 0.15 * oplah);

    return {
      ongkosPerBuku: ongkosCetakPerBuku,
      totalModal: totalModalProduksi,
      estimasiLaba: estimasiLabaKotor,
      royaltiPenulis: estimasiRoyaltiPenulis
    };
  }, [oplah, tebalHalaman, jenisKertas, jenisJilid, hargaJual]);

  const handleKirimNaskah = (e) => {
    e.preventDefault();
    setNaskahTerkirim(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0B0C10', '#C8F902', '#F3F4F6']
    });
  };

  const totalBelanja = keranjang.reduce((sum, item) => {
    const hargaAktif = item.diskon || item.harga;
    return sum + (hargaAktif * item.jumlah);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121316] font-sans antialiased selection:bg-[#C8F902] selection:text-black">
      {notifikasi && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121316] text-[#FDFBF7] px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/10 text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#C8F902]" />
          <span>{notifikasi}</span>
        </div>
      )}

      <div className="bg-[#121316] text-[#C8F902] py-2 text-xs tracking-widest uppercase overflow-hidden font-mono border-b border-black/10">
        <div className="whitespace-nowrap flex space-x-12 animate-marquee">
          <span>• AETHEL EDITIONS — STUDIO PENERBITAN KONTEMPORER & ARSIP LITERATUR INDIE</span>
          <span>• PENGIRIMAN GRATIS NASIONAL UNTUK PESANAN DI ATAS RP 250.000</span>
          <span>• KURASI RESMI EDISI CETAK TAHUN 2026 BERHAK CIPTA PENUH</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#121316]/10 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="cursor-pointer" onClick={() => setTabAktif('toko')}>
            <span className="text-2xl font-serif font-black tracking-tight flex items-center gap-2">
              AETHEL <span className="text-xs font-mono font-normal tracking-widest bg-[#121316] text-[#FDFBF7] px-2 py-0.5 rounded">EDITIONS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-2 bg-[#121316]/5 p-1 rounded-xl">
            <button 
              onClick={() => setTabAktif('toko')} 
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tabAktif === 'toko' ? 'bg-[#121316] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Katalog Buku
            </button>
            <button 
              onClick={() => setTabAktif('penerbitan')} 
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                tabAktif === 'penerbitan' ? 'bg-[#121316] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-[#C8F902]" />
              Studio Penerbitan
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDrawerKeranjang(true)}
            className="relative p-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            {keranjang.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#121316] text-[#C8F902] font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {keranjang.reduce((acc, curr) => acc + curr.jumlah, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {tabAktif === 'toko' && (
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <section className="border border-[#121316] rounded-3xl p-8 lg:p-14 bg-[#121316] text-[#FDFBF7] relative overflow-hidden mb-16">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block text-xs font-mono tracking-widest text-[#C8F902] uppercase mb-4">
                Edisi Khusus Sastra Masa Depan
              </span>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
                Buku yang layak disimpan di rak, bukan sekadar dibaca lalu dilupakan.
              </h1>
              <p className="text-neutral-400 text-base lg:text-lg mb-8 leading-relaxed">
                Kurasi buku fisik independen dengan standar cetak artisanal Eropa: kertas Munken Swedia, jilid jahit terbuka bebas pecah, dan gagasan berani tanpa kompromi.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#katalog" 
                  className="px-6 py-3 rounded-xl bg-[#C8F902] text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Jelajahi Koleksi <ArrowRight className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setTabAktif('penerbitan')} 
                  className="px-6 py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 font-semibold text-sm transition-colors text-white"
                >
                  Terbitkan Naskah Anda
                </button>
              </div>
            </div>
          </section>

          <section id="katalog" className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold">Katalog Terkurasi</h2>
                <p className="text-sm text-neutral-500">Menampilkan {bukuTerfilter.length} karya rilisan fisik eksklusif</p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari judul atau nama penulis..."
                  value={kataKunci}
                  onChange={(e) => setKataKunci(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C8F902]" /> Frekuensi:
              </span>
              {SUASANA_HATI.map(suasana => (
                <button
                  key={suasana}
                  onClick={() => setSuasanaFilter(suasana)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                    suasanaFilter === suasana 
                      ? 'bg-[#121316] text-[#FDFBF7] border-black' 
                      : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                  }`}
                >
                  {suasana}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bukuTerfilter.map(buku => (
              <div 
                key={buku.id}
                className="group bg-white border border-neutral-200 rounded-2xl p-5 hover:border-black transition-all hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div 
                    onClick={() => setModalBuku(buku)}
                    className="h-64 rounded-xl bg-gradient-to-tr from-[#121316] via-[#2A2B30] to-[#121316] p-6 text-white flex flex-col justify-between cursor-pointer relative overflow-hidden group-hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-[#C8F902]">
                        {buku.kategori}
                      </span>
                      <span className="text-xs font-mono opacity-60">#{buku.id.toString().padStart(3, '0')}</span>
                    </div>

                    <div>
                      <p className="text-xs font-mono opacity-70 mb-1">{buku.penulis}</p>
                      <h3 className="font-serif font-bold text-lg leading-snug line-clamp-2">{buku.judul}</h3>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono opacity-60 border-t border-white/10 pt-2">
                      <span>{buku.halaman} Hal.</span>
                      <span>Otabind</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-500">{buku.penulis}</span>
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                        <span>{buku.rating}</span>
                      </div>
                    </div>
                    <h4 
                      onClick={() => setModalBuku(buku)}
                      className="font-serif font-bold text-base cursor-pointer hover:underline line-clamp-1"
                    >
                      {buku.judul}
                    </h4>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    {buku.diskon ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-bold text-sm">Rp {buku.diskon.toLocaleString('id-ID')}</span>
                        <span className="text-[11px] text-neutral-400 line-through">Rp {buku.harga.toLocaleString('id-ID')}</span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-sm">Rp {buku.harga.toLocaleString('id-ID')}</span>
                    )}
                  </div>

                  <button 
                    onClick={() => tambahKeKeranjang(buku)}
                    className="p-2.5 rounded-lg bg-[#121316] text-[#FDFBF7] hover:bg-neutral-800 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {tabAktif === 'penerbitan' && (
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2 inline-block">
              Penerbitan Terbuka & Transparan
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Wujudkan naskah Anda menjadi buku fisik berstandar museum.
            </h1>
            <p className="text-neutral-600 text-sm lg:text-base leading-relaxed">
              Tanpa perantara berbelit, tanpa penahanan hak cipta sepihak. Anda memegang 100% Hak Cipta atas naskah Anda selamanya.
            </p>
          </div>

          <section className="bg-white border border-neutral-300 rounded-3xl p-8 lg:p-12 shadow-sm mb-16">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
              <Calculator className="w-6 h-6 text-neutral-800" />
              <div>
                <h2 className="font-serif font-bold text-xl">Kalkulator Biaya Cetak & Estimasi Royalti</h2>
                <p className="text-xs text-neutral-500">Simulasikan biaya produksi riil dan potensi profit naskah Anda.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Oplah Cetakan:</span>
                    <span className="font-mono font-bold">{oplah} Eksemplar</span>
                  </div>
                  <input 
                    type="range" min="50" max="1000" step="50"
                    value={oplah}
                    onChange={(e) => setOplah(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-1">
                    <span>50 Buku</span>
                    <span>500 Buku</span>
                    <span>1000 Buku</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Ketebalan Halaman:</span>
                    <span className="font-mono font-bold">{tebalHalaman} Halaman</span>
                  </div>
                  <input 
                    type="range" min="80" max="450" step="10"
                    value={tebalHalaman}
                    onChange={(e) => setTebalHalaman(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-2">Pilihan Kertas Isi:</label>
                    <select 
                      value={jenisKertas}
                      onChange={(e) => setJenisKertas(e.target.value)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none"
                    >
                      <option value="munken">Munken Cream Swedia (Premium)</option>
                      <option value="holmen">Holmen Book Ringan (Standar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-2">Model Jilid & Sampul:</label>
                    <select 
                      value={jenisJilid}
                      onChange={(e) => setJenisJilid(e.target.value)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none"
                    >
                      <option value="softcover">Softcover French Flaps</option>
                      <option value="hardcover">Hardcover Linum Eksklusif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-2">Target Harga Jual Eceran (HJE):</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">Rp</span>
                    <input 
                      type="number"
                      step="5000"
                      value={hargaJual}
                      onChange={(e) => setHargaJual(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 text-sm font-mono border border-neutral-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121316] text-[#FDFBF7] p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C8F902] uppercase">
                    Hasil Analisis Finansial
                  </span>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-xs text-neutral-400">Modal Produksi per Buku:</span>
                      <span className="font-mono text-base font-bold text-white">
                        Rp {hasilKalkulasi.ongkosPerBuku.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-xs text-neutral-400">Total Modal Investasi Cetak:</span>
                      <span className="font-mono text-base font-bold text-white">
                        Rp {hasilKalkulasi.totalModal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-xs text-[#C8F902]">Estimasi Royalti Penulis (15%):</span>
                      <span className="font-mono text-lg font-bold text-[#C8F902]">
                        Rp {hasilKalkulasi.royaltiPenulis.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-neutral-400">Potensi Laba Bersih Mandiri:</span>
                      <span className="font-mono text-lg font-bold text-white">
                        Rp {hasilKalkulasi.estimasiLaba.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>* Sudah termasuk pendaftaran nomor ISBN & barcode resmi.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-neutral-300 rounded-3xl p-8 lg:p-12">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Pintu Masuk Kurasi</span>
                <h3 className="text-2xl font-serif font-bold mt-1">Formulir Pengajuan Naskah</h3>
              </div>

              {naskahTerkirim ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#C8F902] text-black rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif font-bold">Naskah Berhasil Terkirim!</h4>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Terima kasih, <strong>{formNaskah.namaPenulis}</strong>. Tim redaksi Aethel Editions akan mengulas manuskrip <em>"{formNaskah.judul}"</em> dalam 7 hari kerja.
                  </p>
                  <button 
                    onClick={() => { setNaskahTerkirim(false); setTahapNaskah(1); }}
                    className="mt-6 px-6 py-2.5 bg-[#121316] text-[#FDFBF7] rounded-xl text-xs font-semibold"
                  >
                    Ajukan Naskah Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleKirimNaskah} className="space-y-6">
                  {tahapNaskah === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Judul Sementara Naskah:</label>
                        <input 
                          type="text" required
                          placeholder="cth. Suara di Balik Kabut Dataran Tinggi"
                          value={formNaskah.judul}
                          onChange={(e) => setFormNaskah({...formNaskah, judul: e.target.value})}
                          className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Nama Lengkap / Nama Pena:</label>
                        <input 
                          type="text" required
                          placeholder="cth. Arya Sena"
                          value={formNaskah.namaPenulis}
                          onChange={(e) => setFormNaskah({...formNaskah, namaPenulis: e.target.value})}
                          className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Alamat Email Bisnis:</label>
                        <input 
                          type="email" required
                          placeholder="penulis@domain.com"
                          value={formNaskah.email}
                          onChange={(e) => setFormNaskah({...formNaskah, email: e.target.value})}
                          className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => {
                          if (formNaskah.judul && formNaskah.namaPenulis) setTahapNaskah(2);
                          else tampilkanNotif("Mohon lengkapi data naskah dan penulis terlebih dahulu.");
                        }}
                        className="w-full py-3 bg-[#121316] text-[#FDFBF7] font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                      >
                        Langkah Selanjutnya <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {tahapNaskah === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Genre Karya:</label>
                        <select 
                          value={formNaskah.genre}
                          onChange={(e) => setFormNaskah({...formNaskah, genre: e.target.value})}
                          className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none"
                        >
                          <option>Fiksi Spekulatif</option>
                          <option>Esai Eksistensial</option>
                          <option>Puisi & Visual</option>
                          <option>Skrip & Sinema</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Sinopsis Singkat & Premis (Maks. 250 Kata):</label>
                        <textarea 
                          rows={4} required
                          placeholder="Jelaskan gagasan utama, alur sentral, dan target audiens pembaca karya Anda..."
                          value={formNaskah.sinopsis}
                          onChange={(e) => setFormNaskah({...formNaskah, sinopsis: e.target.value})}
                          className="w-full p-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setTahapNaskah(1)}
                          className="w-1/3 py-3 border border-neutral-300 font-semibold text-xs rounded-xl"
                        >
                          Kembali
                        </button>
                        <button 
                          type="submit"
                          className="w-2/3 py-3 bg-[#C8F902] text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                        >
                          Kirim Pengajuan Naskah <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </section>
        </main>
      )}

      {modalBuku && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] max-w-2xl w-full rounded-3xl border border-black p-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setModalBuku(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono uppercase bg-[#121316] text-[#C8F902] px-2.5 py-1 rounded">
              {modalBuku.kategori}
            </span>

            <h2 className="text-3xl font-serif font-bold mt-4">{modalBuku.judul}</h2>
            <p className="text-sm text-neutral-600 font-mono mt-1">Karya: {modalBuku.penulis}</p>

            <p className="mt-4 text-sm leading-relaxed text-neutral-700">
              {modalBuku.deskripsi}
            </p>

            <div className="mt-6 p-4 bg-neutral-100 rounded-2xl space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Nomor ISBN:</span>
                <span className="font-bold">{modalBuku.isbn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Kertas Isi:</span>
                <span>{modalBuku.kertas}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Struktur Jilid:</span>
                <span>{modalBuku.jilid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Edisi Sampul:</span>
                <span>{modalBuku.sampul}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-neutral-500 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Soundtrack Pendamping:
                </span>
                <span className="italic">{modalBuku.soundtrack}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-mono">Harga Resmi:</span>
                <p className="font-serif font-bold text-2xl">
                  Rp {(modalBuku.diskon || modalBuku.harga).toLocaleString('id-ID')}
                </p>
              </div>

              <button 
                onClick={() => {
                  tambahKeKeranjang(modalBuku);
                  setModalBuku(null);
                }}
                className="px-6 py-3 bg-[#121316] text-[#FDFBF7] rounded-xl text-xs font-semibold hover:bg-neutral-800 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Masukkan ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {drawerKeranjang && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-[#FDFBF7] w-full max-w-md h-full p-6 flex flex-col justify-between border-l border-black shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg">Keranjang Belanja</h3>
                </div>
                <button onClick={() => setDrawerKeranjang(false)} className="p-1 hover:bg-neutral-200 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh]">
                {keranjang.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-12">Keranjang belanja Anda masih kosong.</p>
                ) : (
                  keranjang.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-serif font-bold text-sm line-clamp-1">{item.judul}</h4>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                          {item.jumlah} x Rp {(item.diskon || item.harga).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-xs">
                        Rp {((item.diskon || item.harga) * item.jumlah).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {keranjang.length > 0 && (
              <div className="border-t border-neutral-200 pt-4 space-y-4">
                <div className="flex justify-between font-mono text-sm">
                  <span>Total Transaksi:</span>
                  <span className="font-bold text-base">Rp {totalBelanja.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={() => {
                    tampilkanNotif("Pesanan berhasil diproses. Terima kasih!");
                    setKeranjang([]);
                    setDrawerKeranjang(false);
                  }}
                  className="w-full py-3.5 bg-[#121316] text-[#C8F902] font-semibold text-xs rounded-xl hover:bg-neutral-900 transition-colors"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="mt-20 border-t border-neutral-200 py-12 text-center text-xs text-neutral-500 font-mono">
        <p>© 2026 Aethel Editions — Divisi Penerbitan Mandiri & Kurasi Sastra Kontemporer.</p>
        <p className="mt-1">Dicetak di Indonesia dengan Standar Kertas Berkelanjutan FSC Certified.</p>
      </footer>
    </div>
  );
}