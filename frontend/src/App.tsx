import { useState, useEffect } from 'react';
import { Search, Server, Database, HardDrive, Cloud, X, Plus, Check, AlertCircle } from 'lucide-react';

// --- Types ---
interface ServiceData {
  id: string;
  name: string;
  category: 'Compute' | 'Storage' | 'Database' | 'Networking' | 'AI/ML' | 'Other';
  description: string;
  useCase: string;
  pricingModel: string;
  freeTier: string;
  pros: string[];
  cons: string[];
}

// --- Mock Data (Fallback in case backend is off) ---
const MOCK_SERVICES: ServiceData[] = [
  {
    id: 'ec2',
    name: 'Amazon EC2',
    category: 'Compute',
    description: 'Secure, resizable compute capacity in the cloud.',
    useCase: 'Hosting websites, enterprise apps.',
    pricingModel: 'On-Demand, Spot, Reserved',
    freeTier: '750 hours/month for 12 months',
    pros: ['Highly flexible', 'Full root access'],
    cons: ['Requires management', 'Can be expensive']
  }
];

// --- Components ---

const ComparisonTable = ({ 
  selected, 
  onRemove 
}: { 
  selected: ServiceData[], 
  onRemove: (id: string) => void 
}) => {
  if (selected.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-6">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 font-semibold text-slate-500 w-48 sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Feature</th>
            {selected.map(s => (
              <th key={s.id} className="p-4 min-w-[250px] relative group">
                <div className="flex justify-between items-start">
                  <span className="text-lg font-bold text-slate-800">{s.name}</span>
                  <button 
                    onClick={() => onRemove(s.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mt-1">
                  {s.category}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="p-4 font-medium text-slate-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Description</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-700 align-top">{s.description}</td>
            ))}
          </tr>
          <tr className="bg-slate-50/50">
            <td className="p-4 font-medium text-slate-600 sticky left-0 bg-slate-50/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Best Use Case</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-700 align-top italic">{s.useCase}</td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-slate-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Pricing Model</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-700 align-top">{s.pricingModel}</td>
            ))}
          </tr>
          <tr className="bg-yellow-50/30">
            <td className="p-4 font-medium text-orange-700 sticky left-0 bg-yellow-50/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Free Tier</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-800 font-medium align-top">{s.freeTier}</td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-slate-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Pros</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-700 align-top">
                <ul className="list-none space-y-1">
                  {s.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-green-500 mt-1 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr className="bg-slate-50/50">
            <td className="p-4 font-medium text-slate-600 sticky left-0 bg-slate-50/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Cons</td>
            {selected.map(s => (
              <td key={s.id} className="p-4 text-sm text-slate-700 align-top">
                <ul className="list-none space-y-1">
                  {s.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X size={14} className="text-red-400 mt-1 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default function App() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FETCHING FROM YOUR LOCAL PYTHON BACKEND
        const response = await fetch('https://kxozc2vuvuoj2qlnvo3kxemaga0ruebx.lambda-url.us-east-1.on.aws/');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        setServices(jsonResponse.data);
        setDataSource('api');
      } catch (e) {
        console.log("Backend API not reachable, falling back to mock data.");
        setServices(MOCK_SERVICES);
        setDataSource('mock');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ['All', 'Compute', 'Storage', 'Database'];

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("You can compare up to 3 services at a time.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedServicesData = services.filter(s => selectedIds.includes(s.id));

  // --- Icon Mapper ---
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'Compute': return <Server className="text-orange-500" />;
      case 'Storage': return <HardDrive className="text-green-500" />;
      case 'Database': return <Database className="text-blue-500" />;
      default: return <Cloud className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Cloud className="text-blue-400" /> AWS Service Comparator
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Compare features, pricing, and free tier limits.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search services (e.g., 'Lambda' or 'Serverless')..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        
        {/* Data Source Indicator */}
        <div className="flex justify-end mb-2">
            {dataSource === 'mock' ? (
                 <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1 border border-orange-100">
                    <AlertCircle size={12} /> Running in Offline Mode (Mock Data)
                 </span>
            ) : (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1 border border-green-100">
                    <Check size={12} /> Connected to Backend API
                 </span>
            )}
        </div>

        {/* Comparison View (Conditional) */}
        {selectedIds.length > 0 && (
          <div className="mb-10 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
              <h2 className="font-bold text-blue-900 flex items-center gap-2">
                 Comparison Board <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">{selectedIds.length}/3</span>
              </h2>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-xs text-blue-700 hover:underline"
              >
                Clear All
              </button>
            </div>
            <ComparisonTable selected={selectedServicesData} onRemove={toggleSelection} />
          </div>
        )}

        {/* Service Selection Area */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-white rounded-xl shadow-sm animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => {
              const isSelected = selectedIds.includes(service.id);
              return (
                <div 
                  key={service.id} 
                  className={`bg-white rounded-xl border transition-all duration-200 flex flex-col ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-100 shadow-md scale-[1.02]' 
                      : 'border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        {getIcon(service.category)}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <span className="font-semibold text-slate-700">Use Case:</span> {service.useCase.split(',')[0]}
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                    <button
                      onClick={() => toggleSelection(service.id)}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                      }`}
                    >
                      {isSelected ? (
                        <> <X size={16} /> Remove </>
                      ) : (
                        <> <Plus size={16} /> Add to Compare </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}