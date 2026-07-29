'use client';

// ===================================================================
// Step 2 — Interests
// Select up to 5 interests. Searchable grid with categories.
// ===================================================================
import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Interest } from '@/types';

interface InterestStepProps {
  interests: Interest[];       // All available interests from DB
  selected: string[];          // Selected interest IDs
  onChange: (ids: string[]) => void;
  error?: string;
  isLoading?: boolean;
}

export function InterestStep({ interests, selected, onChange, error, isLoading }: InterestStepProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return interests;
    const q = query.toLowerCase();
    return interests.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }, [interests, query]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };

  const selectedInterests = interests.filter(i => selected.includes(i.id));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          What are you into?
        </h2>
        <p className="text-muted-foreground">
          Pick up to 5 interests — we'll show you people who share them.
        </p>
      </div>

      {/* Selected pills */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-nexus-indigo/5 border border-nexus-indigo/20 rounded-xl">
          {selectedInterests.map(interest => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggle(interest.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-nexus-indigo text-white text-xs font-medium
                         hover:bg-nexus-indigo-dark transition-colors"
            >
              <span>{interest.icon}</span>
              {interest.name}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search interests..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-nexus pl-9 h-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Interest grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto scrollbar-none pr-1">
          {filtered.map(interest => {
            const isSelected = selected.includes(interest.id);
            const isDisabled = !isSelected && selected.length >= 5;
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggle(interest.id)}
                disabled={isDisabled}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm',
                  'transition-all duration-150 active:scale-[0.97]',
                  isSelected
                    ? 'border-nexus-indigo bg-nexus-indigo/10 text-nexus-indigo font-medium'
                    : 'border-border bg-background text-foreground hover:border-foreground/30 hover:bg-muted/50',
                  isDisabled && 'opacity-30 cursor-not-allowed'
                )}
              >
                <span className="text-base shrink-0">{interest.icon}</span>
                <span className="truncate leading-tight">{interest.name}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground text-sm py-8">
              No interests found for "{query}"
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        {selected.length}/5 selected
      </p>
    </div>
  );
}
