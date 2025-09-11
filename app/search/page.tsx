import MedicineCard from '../components/MedicineCard';
import { prisma } from '@/lib/client';

// Import Medicine type or define it here
interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

async function getMedicines(query: string): Promise<Medicine[]> {
  if (!query) return [];

  const medicines = await prisma.medicine.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    take: 40
  })

  return medicines.map(med => ({
    id: med.id,
    name: med.name,
    description: med.description ?? '',
    price: typeof med.price === 'object' && 'toNumber' in med.price ? med.price.toNumber() : Number(med.price),
    imageUrl: med.imageUrl ?? '',
  }))
}

export default async function Searchbar({ searchParams }: { searchParams: Record<string, string> }) {
  // const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const [searchCache, setSearchCache] = useState<{ [key: string]: MedicineResult }>({});
  // const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  // // Clear cache when component unmounts or if it gets too large
  // useEffect(() => {
  //   const timeout = searchTimeoutRef.current; // copy to variable
  //   return () => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   };
  // }, []);

  // // Limit cache size to prevent memory issues
  // useEffect(() => {
  //   const cacheKeys = Object.keys(searchCache);
  //   if (cacheKeys.length > 50) {
  //     // Limit cache to last 50 searches
  //     const newCache = { ...searchCache };
  //     delete newCache[cacheKeys[0]];
  //     setSearchCache(newCache);
  //   }
  // }, [searchCache]);

  // // Subscribe to search results
  // useEffect(() => {
  //   const unsubscribe = searchEventEmitter.subscribe((results: Medicine[]) => {
  //     setSearchResults(results);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const query = searchParams?.q || '';
  const searchResults = await getMedicines(query);

  return (
    <div className="relative">
      <main className="flex items-center justify-center px-4 py-8">
        {searchResults.length > 0 ? (
          <div className="grid w-[90%] max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Search for medicines to see results</div>
        )}
      </main>
    </div>
  );
}
