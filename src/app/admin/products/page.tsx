'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { AdminLayout } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Shirt,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { state, dispatch, calculatePoints } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Men');
  const [formPrice, setFormPrice] = useState<number | ''>(1999);
  const [formTag, setFormTag] = useState('New Arrival');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formInStore, setFormInStore] = useState(true);

  const filteredProducts = state.products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTag = p.tag.toLowerCase().includes(q);
      if (!matchName && !matchTag) return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Men');
    setFormPrice(1999);
    setFormTag('New Arrival');
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80');
    setFormInStore(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormTag(p.tag);
    setFormDesc(p.description);
    setFormImage(p.image);
    setFormInStore(p.inStore);
    setIsModalOpen(true);
  };

  const handleToggleStoreAvailability = (p: Product) => {
    const updated: Product = { ...p, inStore: !p.inStore };
    dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
    toast.success(`${p.name} marked as ${updated.inStore ? 'Available in Store' : 'Out of Stock in Store'}.`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from store catalogue?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast.success(`Product "${name}" deleted.`);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || typeof formPrice !== 'number' || formPrice <= 0) {
      toast.error('Please enter a valid product name and retail price.');
      return;
    }

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        price: formPrice,
        tag: formTag.trim(),
        description: formDesc.trim(),
        image: formImage.trim() || editingProduct.image,
        inStore: formInStore,
      };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      toast.success(`Product "${updated.name}" updated successfully.`);
    } else {
      const newProduct: Product = {
        id: `PRD${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        price: formPrice,
        tag: formTag.trim() || 'New',
        description: formDesc.trim() || 'Premium retail garment available at Westside stores.',
        image:
          formImage.trim() ||
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        inStore: formInStore,
        colors: ['Black', 'White', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success(`New product "${newProduct.name}" added to catalogue!`);
    }

    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="Store Product Catalogue Management"
      subtitle="Manage clothes and accessories shown to in-store shoppers for physical browsing."
      actionButton={
        <Button
          onClick={handleOpenCreateModal}
          size="sm"
          className="bg-[#159028] hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Store Garment
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products by title or tag..."
                className="pl-9 h-11 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Men', 'Women', 'Kids', 'Accessories'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0D0D0D] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Table */}
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">In-Store Price</th>
                  <th className="py-3 px-4 text-right">Points Value</th>
                  <th className="py-3 px-4 text-center">Store Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{p.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {p.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="outline" className="text-[10px]">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-stone-900 whitespace-nowrap font-serif text-sm">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-[#159028]">
                        +{calculatePoints(p.price)} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStoreAvailability(p)}
                        className="cursor-pointer"
                        title="Click to toggle availability"
                      >
                        <Badge
                          variant={p.inStore ? 'green' : 'secondary'}
                          className="text-[10px]"
                        >
                          {p.inStore ? 'Available In Store' : 'Rack Depleted'}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(p)}
                          className="h-7 w-7 p-0 text-stone-600 hover:text-stone-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Add / Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900">
                  {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalogue'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Name</label>
                  <Input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Relaxed Fit Linen Shirt"
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as any)}
                      className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2 text-xs"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Retail Price (₹)</label>
                    <Input
                      type="number"
                      value={formPrice}
                      onChange={e => setFormPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="1999"
                      className="h-10 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Product Tag</label>
                    <Input
                      value={formTag}
                      onChange={e => setFormTag(e.target.value)}
                      placeholder="e.g. Bestseller / New Arrival"
                      className="h-10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                    <Input
                      value={formImage}
                      onChange={e => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <Input
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Fabric, cut, and fit description..."
                    className="h-10 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="inStoreCheck"
                    checked={formInStore}
                    onChange={e => setFormInStore(e.target.checked)}
                    className="rounded text-[#159028] focus:ring-[#159028]"
                  />
                  <label htmlFor="inStoreCheck" className="text-xs text-stone-700 font-medium">
                    Available in Physical Stores Nationwide
                  </label>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#159028] hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    {editingProduct ? 'Save Changes' : 'Add to Catalogue'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
