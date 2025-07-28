'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, PlusCircle, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  isDiscontinued: boolean;
  manufacturerName: string;
  type: string;
  packSizeLabel: string;
  composition1: string;
  composition2: string;
  quantity: number;
  imageUrl?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    isDiscontinued: false,
    manufacturerName: '',
    type: '',
    packSizeLabel: '',
    composition1: '',
    composition2: '',
    quantity: 0,
    imageUrl: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Filter states
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);

  const types = ['allopathy', 'ayurveda', 'homeopathy'];
  const manufacturers = Array.from(new Set(products.map(p => p.manufacturerName))).sort();
  const stockStatuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        const productArray = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];

        console.log('Product Array:', productArray); // Debug log
        setProducts(productArray);
        setFilteredProducts(productArray);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected filters
  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    if (selectedType) {
      result = result.filter(product => product.type === selectedType);
    }

    if (selectedManufacturer) {
      result = result.filter(product => product.manufacturerName === selectedManufacturer);
    }

    if (selectedStockStatus && selectedStockStatus !== 'All') {
      if (selectedStockStatus === 'Low Stock') {
        result = result.filter(product => product.quantity > 0 && product.quantity <= 10);
      } else if (selectedStockStatus === 'In Stock') {
        result = result.filter(product => product.quantity > 10);
      } else if (selectedStockStatus === 'Out of Stock') {
        result = result.filter(product => product.quantity === 0);
      }
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.manufacturerName.toLowerCase().includes(lowerCaseQuery) ||
          product.composition1.toLowerCase().includes(lowerCaseQuery) ||
          (product.composition2 && product.composition2.toLowerCase().includes(lowerCaseQuery))
      );
    }

    if (tableSearchQuery) {
      const lowerCaseQuery = tableSearchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.manufacturerName.toLowerCase().includes(lowerCaseQuery) ||
          product.composition1.toLowerCase().includes(lowerCaseQuery) ||
          (product.composition2 && product.composition2.toLowerCase().includes(lowerCaseQuery)) ||
          product.packSizeLabel.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredProducts(result);
  }, [
    selectedType,
    selectedManufacturer,
    selectedStockStatus,
    searchQuery,
    tableSearchQuery,
    products,
  ]);

  const resetFilters = () => {
    setSelectedType('');
    setSelectedManufacturer('');
    setSelectedStockStatus('');
    setSearchQuery('');
    setTableSearchQuery('');
  };

  const getStockClassName = (quantity: number) => {
    if (quantity === 0) return 'text-red-600';
    if (quantity <= 10) return 'text-amber-600';
    return 'text-green-600';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !newProduct.name ||
      !newProduct.manufacturerName ||
      !newProduct.type ||
      !newProduct.packSizeLabel ||
      !newProduct.composition1
    ) {
      setFormError(
        'Please fill in all required fields (Name, Manufacturer, Type, Pack Size, Composition 1).'
      );
      return;
    }

    if (newProduct.price < 0 || newProduct.quantity < 0) {
      setFormError('Price and Quantity cannot be negative.');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const addedProduct = await response.json();

      setProducts([...products, addedProduct]);
      setFilteredProducts([...products, addedProduct]);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        price: 0,
        isDiscontinued: false,
        manufacturerName: '',
        type: '',
        packSizeLabel: '',
        composition1: '',
        composition2: '',
        quantity: 0,
        imageUrl: '',
      });
    } catch (err) {
      console.error('Error adding product:', err);
      setFormError('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setFormError(null);

    if (
      !editProduct.name ||
      !editProduct.manufacturerName ||
      !editProduct.type ||
      !editProduct.packSizeLabel ||
      !editProduct.composition1
    ) {
      setFormError(
        'Please fill in all required fields (Name, Manufacturer, Type, Pack Size, Composition 1).'
      );
      return;
    }

    if (editProduct.price < 0 || editProduct.quantity < 0) {
      setFormError('Price and Quantity cannot be negative.');
      return;
    }

    try {
      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();

      setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
      setFilteredProducts(
        filteredProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setIsEditDialogOpen(false);
      setEditProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setFormError('Failed to update product. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'price' || name === 'quantity'
          ? parseFloat(value) || 0
          : value;

    if (isEditDialogOpen && editProduct) {
      setEditProduct(prev => (prev ? { ...prev, [name]: updatedValue } : prev));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: updatedValue }));
    }
  };

  const openEditDialog = (product: Product) => {
    setEditProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Manufacturer</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={selectedManufacturer}
            onChange={e => setSelectedManufacturer(e.target.value)}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map(manufacturer => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock Status</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={selectedStockStatus}
            onChange={e => setSelectedStockStatus(e.target.value)}
          >
            {stockStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={resetFilters}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">{error}</div>}

      {/* Add Product Dialog */}
      {isAddDialogOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close dialog"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 rounded-md bg-red-100 p-2 text-red-700">{formError}</div>
            )}
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer *</label>
                  <input
                    type="text"
                    name="manufacturerName"
                    value={newProduct.manufacturerName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type *</label>
                  <select
                    name="type"
                    value={newProduct.type}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Select Type</option>
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pack Size *</label>
                  <input
                    type="text"
                    name="packSizeLabel"
                    value={newProduct.packSizeLabel}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Composition 1 *</label>
                  <input
                    type="text"
                    name="composition1"
                    value={newProduct.composition1}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Composition 2</label>
                  <input
                    type="text"
                    name="composition2"
                    value={newProduct.composition2}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDiscontinued"
                    checked={newProduct.isDiscontinued}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Discontinued</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      {isEditDialogOpen && editProduct && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close dialog"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 rounded-md bg-red-100 p-2 text-red-700">{formError}</div>
            )}
            <form onSubmit={handleEditProduct}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer *</label>
                  <input
                    type="text"
                    name="manufacturerName"
                    value={editProduct.manufacturerName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type *</label>
                  <select
                    name="type"
                    value={editProduct.type}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Select Type</option>
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pack Size *</label>
                  <input
                    type="text"
                    name="packSizeLabel"
                    value={editProduct.packSizeLabel}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Composition 1 *</label>
                  <input
                    type="text"
                    name="composition1"
                    value={editProduct.composition1}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Composition 2</label>
                  <input
                    type="text"
                    name="composition2"
                    value={editProduct.composition2}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editProduct.quantity}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editProduct.imageUrl || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDiscontinued"
                    checked={editProduct.isDiscontinued}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Discontinued</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-md bg-white shadow">
        <div className="flex flex-col items-center justify-between border-b p-4 md:flex-row">
          <div className="mb-4 flex items-center md:mb-0">
            <span className="mr-2">Show</span>
            <select
              className="rounded-md border border-gray-300 px-2 py-1"
              value={entriesPerPage}
              onChange={e => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md border border-gray-300 px-3 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={tableSearchQuery}
              onChange={e => setTableSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Composition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Pack Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.slice(0, entriesPerPage).map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-200">
                        {product?.imageUrl ? (
                          <div className="relative h-10 w-10">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.manufacturerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{Number(product.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getStockClassName(product.quantity)}`}>
                        {getStockStatus(product.quantity)} ({product.quantity})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.composition1}
                        {product.composition2 && `, ${product.composition2}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.packSizeLabel}</div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditDialog(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              console.log('Delete product', product.id);
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
