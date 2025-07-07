'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Trash2, ShoppingBag, Loader } from 'lucide-react';
import { useCart } from '@/app/hooks/useCart';

type CartItem = {
  id: string;
  quantity: number;
  product?: {
    name?: string;
    price?: number;
    imageUrl?: string;
  };
  medicine?: {
    name?: string;
    price?: number;
    imageUrl?: string;
  };
};

type CartItemProps = {
  cartItems: CartItem[];
  processingAction: { [key: string]: string };
  setProcessingAction: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

// Memoized individual cart item component to prevent unnecessary re-renders
const CartItemRow = memo(({ 
  item, 
  processingAction, 
  onUpdateQuantity, 
  onRemoveItem 
}: { 
  item: CartItem;
  processingAction: { [key: string]: string };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}) => {
  const price = Number(item.product?.price || item.medicine?.price || 0);
  const name = item.product?.name || item.medicine?.name || 'Unknown Item';
  const imageUrl = item.product?.imageUrl;

  return (
    <div key={item.id} className="p-4 flex items-center gap-3 border-b border-gray-100">
      {/* Product Image */}
      <div className="h-12 w-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-1">{name}</h3>
        <p className="text-sm text-teal-600 font-medium">₹{price.toFixed(0)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-300 rounded">
        <button
          className="text-gray-400 hover:text-teal-600 transition-colors p-1 hover:bg-teal-50"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1 || processingAction[item.id] === 'update'}
        >
          <ChevronDown size={14} />
        </button>
        <span className="text-sm px-3 py-1 min-w-[2rem] text-center border-l border-r border-gray-300">
          {String(item.quantity).padStart(2, '0')}
        </span>
        <button
          className="text-gray-400 hover:text-teal-600 transition-colors p-1 hover:bg-teal-50"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={processingAction[item.id] === 'update'}
        >
          <ChevronUp size={14} />
        </button>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemoveItem(item.id)} 
        className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
        disabled={processingAction[item.id] === 'remove'}
      >
        {processingAction[item.id] === 'remove' ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
});

CartItemRow.displayName = 'CartItemRow';

const CartItemList = ({ cartItems, processingAction, setProcessingAction }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProcessingAction((prev) => ({ ...prev, [id]: 'update' }));
    await updateQuantity(id, newQuantity);
    setProcessingAction((prev) => ({ ...prev, [id]: '' }));
  };

  const handleRemoveItem = async (id: string) => {
    setProcessingAction((prev) => ({ ...prev, [id]: 'remove' }));
    await removeItem(id);
    setProcessingAction((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="bg-white">
      {cartItems.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          processingAction={processingAction}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      ))}
    </div>
  );
};

export default memo(CartItemList);
