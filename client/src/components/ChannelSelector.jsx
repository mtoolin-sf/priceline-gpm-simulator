import React from 'react';
import { useCart } from '../context/CartContext';

const CHANNELS = [
  { id: 'Online', label: 'Online' },
  { id: 'In Store', label: 'In Store' },
  { id: 'App', label: 'App' },
  { id: 'Out of Store', label: 'Out of Store' },
];

export default function ChannelSelector() {
  const { state, dispatch } = useCart();
  return (
    <div className="flex flex-wrap gap-2">
      {CHANNELS.map(ch => (
        <button
          key={ch.id}
          onClick={() => dispatch({ type: 'SET_CHANNEL', payload: ch.id })}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
            state.channel === ch.id
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-pink-200'
          }`}
          style={state.channel === ch.id ? { backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : {}}
        >
          {ch.label}
        </button>
      ))}
    </div>
  );
}
