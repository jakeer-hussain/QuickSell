import React, { useState, useMemo } from 'react';
import { 
  Search, 
  User, 
  Plus, 
  MessageCircle, 
  Tag, 
  Check, 
  ShoppingBag, 
  Lock, 
  Mail, 
  UserPlus, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

// Predefined Mock Users
const MOCK_USERS = {
  seller1: {
    id: 'user_1',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    email: 'alex@reseller.com',
    rating: 4.9,
    sales: 12,
    joined: 'Jan 2026'
  },
  buyer1: {
    id: 'user_2',
    name: 'Jordan Finch',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    email: 'jordan@reseller.com',
    rating: 4.7,
    sales: 3,
    joined: 'March 2026'
  }
};

// Initial Products Data
const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    title: 'Vintage Mechanical Keyboard',
    description: 'A beautifully restored tactile mechanical keyboard featuring custom claymorphic pastel keycaps and yellow switch mechanisms. Perfect for developers and designers who love high tactile feedback and satisfying clicks.',
    price: 125,
    category: 'Electronics',
    status: 'Available', // 'Available' or 'Sold'
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    qna: [
      { id: 'q1', asker: 'Jordan Finch', askerId: 'user_2', question: 'Does this come with a USB-C cable?', answer: 'Yes, it comes with a matching custom pastel pink USB-C braided cable!' },
      { id: 'q2', asker: 'Morgan Wood', askerId: 'user_3', question: 'Are the switches hot-swappable?', answer: '' } // empty answer means pending seller response
    ]
  },
  {
    id: 'prod_2',
    title: 'Minimalist Clay Mug Set',
    description: 'A set of four organic-shaped clay mugs with premium light blue and cream glazing. Each mug is individually crafted and perfect for cozy morning coffee sessions.',
    price: 45,
    category: 'Home & Living',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    qna: [
      { id: 'q3', asker: 'Taylor Smith', askerId: 'user_4', question: 'Are they dishwasher safe?', answer: 'Absolutely! They are twice-baked clay and safe for both dishwasher and microwave.' }
    ]
  },
  {
    id: 'prod_3',
    title: 'Pastel Yellow Retro Camera',
    description: 'Fully functional analog 35mm camera with a unique pastel finish. Perfect companion for capturing street life with a nostalgic touch. Comes with a complimentary film roll.',
    price: 180,
    category: 'Electronics',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    ownerId: 'user_2',
    ownerName: 'Jordan Finch',
    ownerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    qna: []
  },
  {
    id: 'prod_4',
    title: 'Lilac High-top Sneakers',
    description: 'Comfortable street wear sneakers in size 9. Beautiful lavender tone with double rubber soles. Only worn once, in pristine condition like new.',
    price: 85,
    category: 'Fashion',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    ownerId: 'user_2',
    ownerName: 'Jordan Finch',
    ownerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    qna: [
      { id: 'q4', asker: 'Alex Rivera', askerId: 'user_1', question: 'Is the size standard or does it run slightly small?', answer: 'It is a true-to-size standard US Men 9 / Women 10.5!' }
    ]
  },
  {
    id: 'prod_5',
    title: 'Ergonomic Pastel Work Chair',
    description: 'Sleek desk chair designed for long study/work hours. Featuring soft mint green upholstery with premium lumbar support and bouncy gas lift cylinders.',
    price: 240,
    category: 'Home & Living',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600',
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    qna: []
  }
];

export default function App() {
  // Navigation & Session States
  const [activePage, setActivePage] = useState('explore'); // 'explore' | 'detail' | 'profile' | 'auth'
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.seller1); // Starts logged in as Alex Rivera
  const [selectedProductId, setSelectedProductId] = useState('prod_1');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Available' | 'Sold'
  const [maxPrice, setMaxPrice] = useState(300);

  // New Listing States
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600');

  // Interactive custom notifications helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Users (to test Seller vs Buyer perspective)
  const toggleUser = () => {
    if (currentUser.id === 'user_1') {
      setCurrentUser(MOCK_USERS.buyer1);
      triggerToast('Switched to Jordan Finch (Buyer Mode) 👤');
    } else {
      setCurrentUser(MOCK_USERS.seller1);
      triggerToast('Switched to Alex Rivera (Seller Mode) 👤');
    }
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || product.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || product.status === statusFilter;
      const matchPrice = product.price <= maxPrice;
      return matchSearch && matchCategory && matchStatus && matchPrice;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, maxPrice]);

  // Add Product Flow
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      triggerToast('Please complete Title and Price! ⚠️');
      return;
    }
    const newProduct = {
      id: `prod_${Date.now()}`,
      title: newTitle,
      description: newDescription || 'No description provided.',
      price: Number(newPrice),
      category: newCategory,
      status: 'Available',
      image: newImage,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      qna: []
    };

    setProducts([newProduct, ...products]);
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    triggerToast('New listing posted successfully! 🚀');
  };

  // Toggle Sold Status
  const toggleProductStatus = (productId) => {
    setProducts(prevProducts => 
      prevProducts.map(p => {
        if (p.id === productId) {
          const updatedStatus = p.status === 'Available' ? 'Sold' : 'Available';
          triggerToast(`Marked "${p.title}" as ${updatedStatus}! 🎉`);
          return { ...p, status: updatedStatus };
        }
        return p;
      })
    );
  };

  // Add a Question
  const [questionText, setQuestionText] = useState('');
  const handleAddQuestion = (productId) => {
    if (!questionText.trim()) return;
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            qna: [
              ...p.qna,
              {
                id: `q_${Date.now()}`,
                asker: currentUser.name,
                askerId: currentUser.id,
                question: questionText,
                answer: ''
              }
            ]
          };
        }
        return p;
      })
    );
    setQuestionText('');
    triggerToast('Your question was posted to the seller! 💬');
  };

  // Answer a Question
  const [answerTexts, setAnswerTexts] = useState({}); // key: questionId, value: string
  const handleAnswerQuestion = (productId, questionId) => {
    const text = answerTexts[questionId];
    if (!text || !text.trim()) return;

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            qna: p.qna.map(q => {
              if (q.id === questionId) {
                return { ...q, answer: text };
              }
              return q;
            })
          };
        }
        return p;
      })
    );
    setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
    triggerToast('Answer submitted to potential buyer! ✉️');
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 font-sans selection:bg-pink-200">
      
      {/* Dynamic Claymorphism Styles Injector */}
      <style>{`
        .clay-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          border: 3px solid rgba(255, 255, 255, 0.9);
          border-radius: 28px;
          box-shadow: 
            12px 16px 28px -4px rgba(165, 180, 203, 0.4), 
            inset -6px -8px 14px rgba(165, 180, 203, 0.3), 
            inset 6px 8px 12px rgba(255, 255, 255, 0.9);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .clay-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            16px 22px 34px -4px rgba(165, 180, 203, 0.5), 
            inset -8px -10px 18px rgba(165, 180, 203, 0.25), 
            inset 8px 10px 16px rgba(255, 255, 255, 0.95);
        }
        .clay-input {
          background: rgba(243, 246, 250, 0.9);
          border: 3px solid rgba(255, 255, 255, 1);
          border-radius: 20px;
          box-shadow: 
            inset 3px 4px 8px rgba(165, 180, 203, 0.25), 
            inset -3px -4px 8px rgba(255, 255, 255, 0.8),
            2px 3px 6px rgba(0, 0, 0, 0.02);
          transition: all 0.25s ease;
        }
        .clay-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 1);
          box-shadow: 
            inset 1px 2px 4px rgba(165, 180, 203, 0.1), 
            inset -1px -2px 4px rgba(255, 255, 255, 0.5),
            4px 6px 12px rgba(115, 110, 254, 0.15);
          border-color: rgba(115, 110, 254, 0.3);
        }
        .clay-btn-purple {
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          box-shadow: 
            0 8px 16px -2px rgba(99, 102, 241, 0.4), 
            inset -4px -6px 10px rgba(0, 0, 0, 0.2), 
            inset 4px 6px 10px rgba(255, 255, 255, 0.35);
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .clay-btn-purple:active {
          transform: scale(0.96);
          box-shadow: 
            0 4px 8px -1px rgba(99, 102, 241, 0.4), 
            inset -2px -3px 5px rgba(0, 0, 0, 0.25), 
            inset 2px 3px 5px rgba(255, 255, 255, 0.25);
        }
        .clay-btn-pink {
          background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          box-shadow: 
            0 8px 16px -2px rgba(236, 72, 153, 0.4), 
            inset -4px -6px 10px rgba(0, 0, 0, 0.2), 
            inset 4px 6px 10px rgba(255, 255, 255, 0.35);
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .clay-btn-pink:active {
          transform: scale(0.96);
          box-shadow: 
            0 4px 8px -1px rgba(236, 72, 153, 0.4), 
            inset -2px -3px 5px rgba(0, 0, 0, 0.25), 
            inset 2px 3px 5px rgba(255, 255, 255, 0.25);
        }
        .clay-btn-green {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-radius: 16px;
          box-shadow: 
            0 8px 16px -2px rgba(16, 185, 129, 0.3), 
            inset -3px -5px 8px rgba(0, 0, 0, 0.15), 
            inset 3px 5px 8px rgba(255, 255, 255, 0.3);
          color: white;
          transition: all 0.2s ease;
        }
        .clay-btn-green:active {
          transform: scale(0.96);
        }
        .clay-badge-available {
          background: #d1fae5;
          color: #065f46;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 
            inset -2px -3px 6px rgba(16, 185, 129, 0.15), 
            inset 2px 3px 6px rgba(255, 255, 255, 0.8),
            2px 4px 8px rgba(16, 185, 129, 0.08);
          border-radius: 9999px;
        }
        .clay-badge-sold {
          background: #fee2e2;
          color: #991b1b;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 
            inset -2px -3px 6px rgba(239, 68, 68, 0.15), 
            inset 2px 3px 6px rgba(255, 255, 255, 0.8),
            2px 4px 8px rgba(239, 68, 68, 0.08);
          border-radius: 9999px;
        }
        .clay-nav-btn {
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 
            inset -2px -3px 6px rgba(165, 180, 203, 0.2), 
            inset 2px 3px 6px rgba(255, 255, 255, 0.8),
            2px 4px 8px rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .clay-nav-btn:hover {
          transform: translateY(-2px);
          background-color: white;
        }
        /* Custom scrollbar for beautiful premium feel */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f4f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 2px solid #f0f4f9;
        }
      `}</style>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-xl animate-bounce">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
          <span className="font-semibold text-slate-700">{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <header className="sticky top-0 z-40 px-4 py-3 md:px-8 bg-white/60 backdrop-blur-md border-b-2 border-white/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActivePage('explore')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-md transform group-hover:rotate-6 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ReSeller
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Clay Edition</p>
            </div>
          </div>

          {/* Utility Demo Switcher */}
          <div className="flex items-center gap-2 bg-indigo-50/70 p-1.5 rounded-2xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-600 px-2">Viewing as:</span>
            <button 
              onClick={toggleUser} 
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-white shadow-sm text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-300"
              />
              <span>{currentUser.name}</span>
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                {currentUser.id === 'user_1' ? 'Seller' : 'Buyer'}
              </span>
            </button>
          </div>

          {/* Primary Navigation links */}
          <nav className="flex items-center gap-3">
            <button 
              onClick={() => setActivePage('explore')}
              className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn ${activePage === 'explore' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-white/80 text-slate-600'}`}
            >
              🛍️ Shop Explore
            </button>
            <button 
              onClick={() => setActivePage('profile')}
              className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn ${activePage === 'profile' ? 'bg-pink-100 text-pink-600 border-pink-200' : 'bg-white/80 text-slate-600'}`}
            >
              👤 Dashboard
            </button>
            <button 
              onClick={() => setActivePage('auth')}
              className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn ${activePage === 'auth' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-white/80 text-slate-600'}`}
            >
              🔑 Join / Login
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        {/* ==================== EXPLORE PAGE ==================== */}
        {activePage === 'explore' && (
          <div className="space-y-8">
            
            {/* Soft Clay Jumbotron / Hero */}
            <div className="clay-card p-6 md:p-10 bg-gradient-to-br from-indigo-50/50 via-pink-50/30 to-purple-50/40 border border-white relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-pink-100 text-pink-600 rounded-full border border-pink-200">
                  <Sparkles className="w-3.5 h-3.5" /> Fun, Interactive Clay Design UI
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                  Buy & Sell with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Squishy, Cozier</span> Feel!
                </h2>
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  Welcome to ReSeller. Clean pastel design with soft physical shadows. Try switching simulated accounts above to experience both buyer questions & seller dashboard perspectives.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center opacity-20 pointer-events-none">
                <ShoppingBag className="w-56 h-56 text-indigo-300" />
              </div>
            </div>

            {/* Filter and Search Section */}
            <div className="clay-card p-6 bg-white/90">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                
                {/* Search Bar */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> What are you looking for?
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search tech, shoes, homeware..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 clay-input text-sm font-semibold"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  </div>
                </div>

                {/* Category Select */}
                <div className="lg:col-span-3 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Category Filter
                  </label>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 clay-input text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option value="All">🌈 All Categories</option>
                    <option value="Electronics">💻 Electronics</option>
                    <option value="Home & Living">🏡 Home & Living</option>
                    <option value="Fashion">🧥 Fashion</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Status
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {['All', 'Available', 'Sold'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`py-1.5 text-[11px] font-extrabold rounded-lg transition-all ${
                          statusFilter === status 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter Slider */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-slate-500 tracking-wider">
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Max Price</span>
                    <span className="text-indigo-600 font-black">${maxPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>$10</span>
                    <span>$500</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Product Grid Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <span>✨ Featured Finds</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                    {filteredProducts.length} items
                  </span>
                </h3>
                
                {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All' || maxPrice < 500 ? (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('All');
                      setStatusFilter('All');
                      setMaxPrice(300);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="clay-card p-12 text-center bg-white/70 max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-300">
                    <Filter className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700">No products match your filters!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Try broadening your search query or selecting "All Categories" to view more products.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="clay-card bg-white flex flex-col justify-between overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setActivePage('detail');
                      }}
                    >
                      {/* Image Container with tag */}
                      <div className="p-4 relative">
                        <div className="w-full h-48 rounded-2xl overflow-hidden relative border-2 border-white/80 shadow-inner bg-slate-50">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        
                        {/* Sold Badge */}
                        <div className="absolute top-6 right-6">
                          {product.status === 'Sold' ? (
                            <span className="px-3 py-1.5 text-xs font-black tracking-wider uppercase clay-badge-sold shadow-sm">
                              🔒 SOLD
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 text-xs font-black tracking-wider uppercase clay-badge-available shadow-sm">
                              🟢 AVAILABLE
                            </span>
                          )}
                        </div>

                        {/* Category Indicator */}
                        <div className="absolute top-6 left-6">
                          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-600 rounded-lg shadow-sm border border-slate-100">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Details Area */}
                      <div className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="font-black text-lg text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors">
                            {product.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Price and Action row */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Price tag</span>
                            <div className="text-2xl font-black text-indigo-600">${product.price}</div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-indigo-500 bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/50 hover:bg-indigo-100/50 transition-all">
                            <span>Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Owner Badge */}
                        <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-xl text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <img src={product.ownerAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span>Listed by <b>{product.ownerName}</b></span>
                          </span>
                          {product.qna.length > 0 && (
                            <span className="flex items-center gap-1 text-pink-500">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{product.qna.length}</span>
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== PRODUCT DETAILS PAGE ==================== */}
        {activePage === 'detail' && (
          <div className="space-y-8">
            
            {/* Back button */}
            <button 
              onClick={() => setActivePage('explore')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 font-bold rounded-xl border-2 border-white shadow-sm hover:text-slate-800 transition-all text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to listings explore
            </button>

            {/* Two-Column Detail View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Image Gallery */}
              <div className="lg:col-span-6 clay-card p-6 bg-white space-y-4">
                <div className="w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden border-2 border-white shadow-inner bg-slate-100 relative">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.title} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Indicator Pill Overlay */}
                  <div className="absolute top-4 right-4">
                    {selectedProduct.status === 'Sold' ? (
                      <span className="px-4 py-2 text-sm font-black tracking-wider uppercase clay-badge-sold shadow-md">
                        🔒 Sold Out
                      </span>
                    ) : (
                      <span className="px-4 py-2 text-sm font-black tracking-wider uppercase clay-badge-available shadow-md">
                        🟢 Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Fun Clay Image Tips */}
                <div className="flex items-center gap-3 bg-pink-50/50 p-4 rounded-xl border border-pink-100 text-xs text-pink-700 font-semibold">
                  <Info className="w-5 h-5 text-pink-500 shrink-0" />
                  <p>Clay Tip: Always communicate with the seller on this page’s Q&A thread below to discuss delivery & quality checks!</p>
                </div>
              </div>

              {/* Right Column: Detailed Specs & Seller Info */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Clay Details card */}
                <div className="clay-card p-6 md:p-8 bg-white space-y-6">
                  
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-lg">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-black text-slate-800">
                      {selectedProduct.title}
                    </h2>
                  </div>

                  <div className="flex items-end justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-black text-slate-400">Fixed Sale Price</span>
                      <div className="text-4xl font-black text-indigo-600">${selectedProduct.price}</div>
                    </div>
                    {/* Mark as Sold for Seller Quick Actions */}
                    {selectedProduct.ownerId === currentUser.id ? (
                      <button 
                        onClick={() => toggleProductStatus(selectedProduct.id)}
                        className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-md rounded-xl ${
                          selectedProduct.status === 'Sold' 
                            ? 'clay-btn-purple' 
                            : 'bg-red-500 hover:bg-red-600 text-white border-2 border-white'
                        }`}
                      >
                        {selectedProduct.status === 'Sold' ? '🔓 Set Available' : '🔒 Mark as Sold'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => triggerToast("Purchase flow simulated! Talk with the seller below. 🛍️")}
                        disabled={selectedProduct.status === 'Sold'}
                        className={`px-6 py-3 font-bold text-sm ${selectedProduct.status === 'Sold' ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-none shadow-none' : 'clay-btn-pink'}`}
                      >
                        {selectedProduct.status === 'Sold' ? 'Sold Out' : 'Buy Product Now'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Item Description</h4>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Owner Metadata Row */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedProduct.ownerAvatar} 
                        alt={selectedProduct.ownerName} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Owner / Seller</span>
                        <h5 className="font-bold text-slate-800 text-sm">{selectedProduct.ownerName}</h5>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black text-slate-400 block">Seller Rating</span>
                      <span className="text-sm font-bold text-amber-500">⭐ {selectedProduct.ownerId === 'user_1' ? '4.9' : '4.7'} / 5.0</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Q&A Interactive Segment (Important Feature) */}
            <div className="clay-card p-6 md:p-8 bg-white space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-500" /> Discussion & Queries
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Ask questions or clear up product specifications with the seller directly.</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                  {selectedProduct.qna.length} Queries
                </span>
              </div>

              {/* Ask Question Input Form (Rendered for everyone except current owner) */}
              {selectedProduct.ownerId !== currentUser.id ? (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">
                    Have a question for {selectedProduct.ownerName}?
                  </h4>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g., Is delivery fee included? Are there any minor scratches?" 
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="flex-1 px-4 py-3 clay-input text-sm font-medium"
                    />
                    <button 
                      onClick={() => handleAddQuestion(selectedProduct.id)}
                      className="px-5 py-3 clay-btn-purple text-xs font-black uppercase tracking-wider"
                    >
                      Ask Seller
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-700 font-semibold">
                  👑 You are viewing your own listed product! Potential buyer queries will show up below. You can answer them instantly.
                </div>
              )}

              {/* Q&A Thread List */}
              <div className="space-y-4">
                {selectedProduct.qna.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <p className="text-sm font-bold">No queries asked yet!</p>
                    <p className="text-xs">Be the first to ask the seller a question regarding this item.</p>
                  </div>
                ) : (
                  selectedProduct.qna.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3.5">
                      
                      {/* Question section */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded uppercase">
                            Question
                          </span>
                          <span className="text-xs font-black text-slate-700">{q.asker}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 pl-1">{q.question}</p>
                      </div>

                      {/* Answer section */}
                      <div className="pl-4 border-l-2 border-indigo-100 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">
                            Seller Answer
                          </span>
                          <span className="text-xs font-bold text-slate-600">{selectedProduct.ownerName}</span>
                        </div>
                        
                        {q.answer ? (
                          <p className="text-sm font-medium text-slate-600 italic">
                            "{q.answer}"
                          </p>
                        ) : (
                          // Answer Form (only viewable and inputtable by actual seller of product)
                          selectedProduct.ownerId === currentUser.id ? (
                            <div className="flex gap-2 mt-2 pt-1 max-w-lg">
                              <input 
                                type="text" 
                                placeholder="Write your reply here..." 
                                value={answerTexts[q.id] || ''}
                                onChange={(e) => setAnswerTexts({ ...answerTexts, [q.id]: e.target.value })}
                                className="flex-1 px-3 py-1.5 clay-input text-xs font-semibold"
                              />
                              <button 
                                onClick={() => handleAnswerQuestion(selectedProduct.id, q.id)}
                                className="px-3.5 py-1.5 clay-btn-green text-xs font-bold"
                              >
                                Submit Answer
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">
                              ⏳ Pending seller response...
                            </p>
                          )
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================== USER PROFILE / DASHBOARD PAGE ==================== */}
        {activePage === 'profile' && (
          <div className="space-y-8">
            
            {/* User Bio Header */}
            <div className="clay-card p-6 md:p-8 bg-gradient-to-tr from-pink-50 via-white to-indigo-50 border border-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                  <div className="relative">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800">{currentUser.name}</h3>
                    <p className="text-xs text-indigo-600 font-bold tracking-wider">{currentUser.email}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1.5 text-xs text-slate-500 font-bold">
                      <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">⭐ {currentUser.rating} Seller Rating</span>
                      <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">📦 {currentUser.sales} Completed Sales</span>
                      <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">🗓️ Member since {currentUser.joined}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/85 p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center text-center space-y-1 shrink-0">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Account Balance</span>
                  <span className="text-3xl font-black text-emerald-600">$1,480.00</span>
                  <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">verified wallet</span>
                </div>

              </div>
            </div>

            {/* Main Profile Grid split: List a New Product & My Active Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* List a New Product Form (Clay styled card) */}
              <div className="lg:col-span-5 clay-card p-6 md:p-8 bg-white space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-500" /> Create New Listing
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Post a new item for sale instantly to the marketplace.</p>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Pastel Jordan 1s" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 clay-input text-sm font-semibold"
                    />
                  </div>

                  {/* Category and Price Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Category</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-3 clay-input text-sm font-semibold appearance-none cursor-pointer"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Home & Living">Home & Living</option>
                        <option value="Fashion">Fashion</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Price ($ USD)</label>
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-4 py-3 clay-input text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Photo Preset Mock Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">Choose Mock Photo Preset</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'Tech', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Soles', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Watch', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Decor', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400' }
                      ].map((preset, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setNewImage(preset.url)}
                          className={`h-12 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${newImage === preset.url ? 'border-pink-500 scale-95 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Item Details & Specs</label>
                    <textarea 
                      placeholder="Describe details, sizes, quality parameters..." 
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-4 py-3 clay-input text-sm font-semibold"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 clay-btn-purple font-black text-sm uppercase tracking-wider"
                  >
                    🎉 Post Item Listing
                  </button>

                </form>
              </div>

              {/* My Products List & Manage Dashboard */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      📦 My Active Listings
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Manage and mark your products as Sold or Available instantly.</p>
                  </div>
                </div>

                {products.filter(p => p.ownerId === currentUser.id).length === 0 ? (
                  <div className="clay-card p-10 bg-white/70 text-center space-y-3">
                    <p className="text-sm font-bold text-slate-600">No active products listed under your user profile.</p>
                    <p className="text-xs text-slate-500">Create a brand new listing on the left panel to test active controls!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.filter(p => p.ownerId === currentUser.id).map(p => (
                      <div 
                        key={p.id} 
                        className="clay-card p-4 bg-white hover:translate-y-0 hover:shadow-md flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                      >
                        <div 
                          className="flex items-center gap-4 cursor-pointer"
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setActivePage('detail');
                          }}
                        >
                          <img 
                            src={p.image} 
                            alt={p.title} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
                              {p.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-indigo-600">${p.price}</span>
                              <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Toggle for Marking Sold */}
                        <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                          
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5">Quick Toggle Status</span>
                            {p.status === 'Sold' ? (
                              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider clay-badge-sold">
                                SOLD OUT
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider clay-badge-available">
                                SELLING ACTIVE
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleProductStatus(p.id)}
                            className={`p-2.5 rounded-xl border-2 transition-all ${
                              p.status === 'Sold' 
                                ? 'bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200' 
                                : 'bg-red-100 border-red-200 text-red-700 hover:bg-red-200'
                            }`}
                            title={p.status === 'Sold' ? "Mark as Available" : "Mark as Sold"}
                          >
                            {p.status === 'Sold' ? (
                              <Check className="w-4 h-4 font-bold" />
                            ) : (
                              <Tag className="w-4 h-4 font-bold" />
                            )}
                          </button>

                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ==================== LOGIN & SIGNUP PAGE ==================== */}
        {activePage === 'auth' && (
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Claymorphic Registration Form */}
            <div className="clay-card p-8 bg-white space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-md mx-auto transform rotate-3">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Welcome to ReSeller</h3>
                <p className="text-xs text-slate-500 font-semibold">Join thousands of collectors exchanging items in aesthetic style!</p>
              </div>

              {/* Toggle Sub-tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button className="py-2.5 text-xs font-black bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-100">
                  🔓 Log In
                </button>
                <button 
                  onClick={() => triggerToast('Registration mock verified! 🎉')}
                  className="py-2.5 text-xs font-black text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  📝 Register Account
                </button>
              </div>

              {/* Forms inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g., alex@reseller.com" 
                    defaultValue="alex@reseller.com"
                    className="w-full px-4 py-3 clay-input text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Secure Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    defaultValue="mypassword"
                    className="w-full px-4 py-3 clay-input text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-indigo-500" /> Keep me logged in
                  </label>
                  <a href="#" className="hover:underline text-indigo-600">Forgot?</a>
                </div>

                <button 
                  onClick={() => {
                    triggerToast('Logged in as Alex Rivera! Welcome back 👤');
                    setActivePage('explore');
                  }}
                  className="w-full py-3.5 clay-btn-purple font-black text-sm uppercase tracking-wider mt-4"
                >
                  🔓 Authenticate & Enter
                </button>
              </div>

            </div>

            {/* Quick Demo Assist details */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center text-xs text-indigo-700 font-semibold">
              ✨ Fast Switch: You are currently simulating <b>{currentUser.name}</b>. You can switch to Jordan Finch in the navbar header at any time!
            </div>

          </div>
        )}

      </main>

      {/* Aesthetic Footer */}
      <footer className="mt-20 border-t-2 border-white/50 bg-white/40 py-10 text-center text-xs text-slate-500 font-semibold space-y-2">
        <p>© 2026 ReSeller Claymorphic UI Labs. Crafted with 💖 for fluid interaction.</p>
        <p className="text-[10px] text-slate-400">All sample items and questions are completely stateful. Test adding questions, toggling sold states, and adding products!</p>
      </footer>

    </div>
  );
}
