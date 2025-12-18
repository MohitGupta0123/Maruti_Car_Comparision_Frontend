// src/components/Sidebar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ModelDetails, SelectionState } from '../types';
import { fetchModelDetails } from '../services/api';
import { ChevronDown, CarFront, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onCompare: (selections: SelectionState[]) => void;
  isLoading: boolean;
}

// ---------------- Animations ----------------
const headerVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cardsContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const tipVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.25, ease: 'easeOut' } },
};

const buttonVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.35, ease: 'easeOut' } },
};

const Sidebar: React.FC<SidebarProps> = ({ onCompare, isLoading }) => {
  const [modelData, setModelData] = useState<ModelDetails | null>(null);

  // ✅ dynamic vehicle cards
  const [selections, setSelections] = useState<SelectionState[]>([
    { brand: '', model: '', variant: '', version: '' },
    { brand: '', model: '', variant: '', version: '' },
  ]);

  // Sidebar open/close (default: open)
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // ✅ Key to re-trigger content animation when data arrives / sidebar opens / cards change
  const [contentKey, setContentKey] = useState(0);

  const hasData = useMemo(() => !!modelData, [modelData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchModelDetails();
        setModelData(data);
      } catch (err) {
        console.error('Failed to fetch model details', err);
      }
    };
    loadData();
  }, []);

  // ✅ When sidebar is open and data becomes available, replay content animation
  useEffect(() => {
    if (isOpen && hasData) {
      setContentKey((k) => k + 1);
    }
  }, [isOpen, hasData]);

  // ✅ FIX: bump contentKey when adding/removing cards so new card becomes visible immediately
  const addVehicleCard = () => {
    setSelections((prev) => [...prev, { brand: '', model: '', variant: '', version: '' }]);
    setContentKey((k) => k + 1);
  };

  const removeVehicleCard = (idx: number) => {
    setSelections((prev) => prev.filter((_, i) => i !== idx));
    setContentKey((k) => k + 1);
  };

  const handleSelectionChange = (idx: number, field: keyof SelectionState, value: string) => {
    setSelections((prev) => {
      const next = [...prev];
      const current = next[idx];

      if (field === 'brand') next[idx] = { brand: value, model: '', variant: '', version: '' };
      else if (field === 'model') next[idx] = { ...current, model: value, variant: '', version: '' };
      else if (field === 'variant') next[idx] = { ...current, variant: value, version: '' };
      else next[idx] = { ...current, version: value };

      return next;
    });
  };

  // ✅ duplicates logic: version dropdown appears only for duplicate brand+model+variant
  const keyOf = (s: SelectionState) =>
    s.brand && s.model && s.variant ? `${s.brand}__${s.model}__${s.variant}` : '';

  const duplicateKeys = useMemo(() => {
    const counts: Record<string, number> = {};
    selections.forEach((s) => {
      const k = keyOf(s);
      if (!k) return;
      counts[k] = (counts[k] || 0) + 1;
    });

    const dups = new Set<string>();
    Object.entries(counts).forEach(([k, c]) => {
      if (c > 1) dups.add(k);
    });
    return dups;
  }, [selections]);

  const needsVersion = (s: SelectionState) => duplicateKeys.has(keyOf(s));

  const getVersionOptions = (model: string) =>
    modelData ? modelData.versions?.[model] || [] : [];

  // ✅ disable compare: require variant for all; require version only for duplicates
  const isCompareDisabled =
    isLoading ||
    selections.some((s) => !s.variant) ||
    selections.some((s) => needsVersion(s) && !s.version);

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    onChange: (val: string) => void,
    disabled: boolean = false
  ) => (
    <div className="mb-2">
      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || options.length === 0}
          className={`block w-full appearance-none bg-white border border-slate-300 text-slate-800 py-1.5 px-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );

  // ---------- CLOSED STATE UI ----------
  if (!isOpen) {
    return (
      <aside
        className="
          w-10 md:w-12 lg:w-14
          bg-blue-700
          text-slate-900
          flex-shrink-0
          h-full
          border-r border-slate-200
          flex items-center justify-center
        "
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            h-[80%] w-full
            flex flex-col items-center justify-center
            gap-2
            rounded-full
            bg-white/90 hover:bg-white
            shadow-md
            transition-colors
          "
          aria-label="Open car selection sidebar"
        >
          <ChevronRight size={18} className="text-black-700" />
          <span
            className="
              text-[11px] font-bold tracking-wide text-slate-700
              transform -rotate-90
            "
          >
            Select Cars Here
          </span>
        </button>
      </aside>
    );
  }

  // ---------- OPEN STATE UI ----------
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          key="sidebar-open"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="
            w-full 
            md:w-[520px] 
            lg:w-[420px] 
            bg-white-200 text-slate-900 
            flex-shrink-0 flex flex-col h-full 
            border-r border-slate-200
          "
        >
          {/* Header */}
          <motion.div
            variants={headerVariant}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between p-5 border-b border-black-200 bg-blue-500"
          >
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <CarFront className="text-black-500" />
                <span>Select Cars</span>
              </h2>
              <p className="text-sm text-black-500 mt-1">
                Choose vehicles to compare variants and features.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                ml-2 inline-flex items-center justify-center
                rounded-full border border-slate-300
                bg-white p-1.5 shadow-sm
                hover:bg-slate-100
                transition-colors
              "
              aria-label="Close sidebar"
            >
              <ChevronLeft size={18} className="text-slate-700" />
            </button>
          </motion.div>

          <div className="px-5 pt-4 pb-3 flex-1 overflow-y-auto space-y-3">
            {!modelData ? (
              <div className="text-sm text-slate-600">Loading options...</div>
            ) : (
              // ✅ key remounts so newly added cards appear immediately (no blank space)
              <motion.div key={contentKey} initial="hidden" animate="visible" className="space-y-3">
                <motion.div variants={cardsContainerVariant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selections.map((sel, idx) => {
                    const showVersion = needsVersion(sel);
                    const versionOptions = sel.model ? getVersionOptions(sel.model) : [];

                    return (
                      <motion.div
                        key={`${idx}-${contentKey}`}
                        variants={cardVariant}
                        className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm"
                      >
                        <h3 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          Vehicle {idx + 1}
                        </h3>

                        {renderDropdown('Brand', sel.brand, modelData.brands, (v) =>
                          handleSelectionChange(idx, 'brand', v)
                        )}

                        {renderDropdown(
                          'Model',
                          sel.model,
                          sel.brand ? modelData.models[sel.brand] || [] : [],
                          (v) => handleSelectionChange(idx, 'model', v),
                          !sel.brand
                        )}

                        {renderDropdown(
                          'Variant',
                          sel.variant,
                          sel.model ? modelData.variants[sel.model] || [] : [],
                          (v) => handleSelectionChange(idx, 'variant', v),
                          !sel.model
                        )}

                        {showVersion &&
                          renderDropdown(
                            'Version',
                            sel.version || '',
                            versionOptions,
                            (v) => handleSelectionChange(idx, 'version', v),
                            false
                          )}

                        {selections.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeVehicleCard(idx)}
                            className="mt-2 text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  variants={tipVariant}
                  className="bg-white rounded-lg px-3 py-2 text-[11px] text-slate-600 border border-slate-200 shadow-sm"
                >
                  Tip: If you select the same car+variant multiple times, you’ll be asked to pick versions for each.
                </motion.div>

                <button
                  type="button"
                  onClick={addVehicleCard}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-50"
                >
                  + Add Vehicle
                </button>
              </motion.div>
            )}
          </div>

          {/* Compare button */}
          <motion.div
            key={`footer-${contentKey}`}
            variants={buttonVariant}
            initial="hidden"
            animate="visible"
            className="p-5 border-t border-slate-200 bg-sky-50"
          >
            <button
              onClick={() => onCompare(selections)}
              disabled={isCompareDisabled}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 ${
                isCompareDisabled
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Comparing...' : 'Compare Now'}
            </button>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
