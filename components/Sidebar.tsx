// // src/components/Sidebar.tsx
// import React, { useEffect, useState } from 'react';
// import { ModelDetails, SelectionState } from '../types';
// import { fetchModelDetails } from '../services/api';
// import { ChevronDown, CarFront } from 'lucide-react';

// interface SidebarProps {
//   onCompare: (selection1: SelectionState, selection2: SelectionState) => void;
//   isLoading: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({ onCompare, isLoading }) => {
//   const [modelData, setModelData] = useState<ModelDetails | null>(null);

//   const [sel1, setSel1] = useState<SelectionState>({ brand: '', model: '', variant: '' });
//   const [sel2, setSel2] = useState<SelectionState>({ brand: '', model: '', variant: '' });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchModelDetails();
//         setModelData(data);
//       } catch (err) {
//         console.error("Failed to fetch model details", err);
//       }
//     };
//     loadData();
//   }, []);

//   const handleSelectionChange = (
//     vehicleNum: 1 | 2,
//     field: keyof SelectionState,
//     value: string
//   ) => {
//     const setSel = vehicleNum === 1 ? setSel1 : setSel2;
//     const currentSel = vehicleNum === 1 ? sel1 : sel2;

//     if (field === 'brand') {
//       setSel({ brand: value, model: '', variant: '' });
//     } else if (field === 'model') {
//       setSel({ ...currentSel, model: value, variant: '' });
//     } else {
//       setSel({ ...currentSel, variant: value });
//     }
//   };

//   const isCompareDisabled = !sel1.variant || !sel2.variant || isLoading;

//   const renderDropdown = (
//     label: string,
//     value: string,
//     options: string[],
//     onChange: (val: string) => void,
//     disabled: boolean = false
//   ) => (
//     <div className="mb-2">
//       <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
//         {label}
//       </label>
//       <div className="relative">
//         <select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           disabled={disabled || options.length === 0}
//           className={`block w-full appearance-none bg-white border border-slate-300 text-slate-800 py-1.5 px-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//             disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'cursor-pointer'
//           }`}
//         >
//           <option value="">Select {label}</option>
//           {options.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt}
//             </option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
//           <ChevronDown size={16} />
//         </div>
//       </div>
//     </div>
//   );

//   if (!modelData) {
//     return (
//       <aside className="w-full md:w-[520px] lg:w-[420px] bg-sky-50 text-slate-700 flex-shrink-0 flex flex-col h-full border-r border-slate-200">
//         <div className="p-6 text-sm text-slate-500">Loading options...</div>
//       </aside>
//     );
//   }

//   return (
//     <aside
//       className="
//         w-full 
//         md:w-[520px] 
//         lg:w-[420px] 
//         bg-rose-200 text-slate-900 
//         flex-shrink-0 flex flex-col h-full 
//         border-r border-slate-200
//       "
//     >
//       {/* <div className="p-5 border-b border-black-200 bg-amber-200"> */}
//       <div className="p-5 border-b border-black-200 bg-amber-500">
//         <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
//           <CarFront className="text-black-500" />
//           <span>Select Cars</span>
//         </h2>
//         <p className="text-sm text-black-500 mt-1">
//           Choose two vehicles to compare variants and features.
//         </p>
//       </div>

//       <div className="px-5 pt-4 pb-3 flex-1 overflow-y-auto space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Vehicle 1 */}
//           <div className="bg-white rounded-xl p-3 border border-blue-200 shadow-sm">
//             <h3 className="text-base font-semibold text-blue-600 mb-2 flex items-center gap-2">
//               <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
//                 1
//               </span>
//               Vehicle 1
//             </h3>
//             {renderDropdown('Brand', sel1.brand, modelData.brands, (v) => handleSelectionChange(1, 'brand', v))}
//             {renderDropdown(
//               'Model',
//               sel1.model,
//               sel1.brand ? modelData.models[sel1.brand] || [] : [],
//               (v) => handleSelectionChange(1, 'model', v),
//               !sel1.brand
//             )}
//             {renderDropdown(
//               'Variant',
//               sel1.variant,
//               sel1.model ? modelData.variants[sel1.model] || [] : [],
//               (v) => handleSelectionChange(1, 'variant', v),
//               !sel1.model
//             )}
//           </div>

//           {/* Vehicle 2 */}
//           <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm">
//             <h3 className="text-base font-semibold text-emerald-600 mb-2 flex items-center gap-2">
//               <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
//                 2
//               </span>
//               Vehicle 2
//             </h3>
//             {renderDropdown('Brand', sel2.brand, modelData.brands, (v) => handleSelectionChange(2, 'brand', v))}
//             {renderDropdown(
//               'Model',
//               sel2.model,
//               sel2.brand ? modelData.models[sel2.brand] || [] : [],
//               (v) => handleSelectionChange(2, 'model', v),
//               !sel2.brand
//             )}
//             {renderDropdown(
//               'Variant',
//               sel2.variant,
//               sel2.model ? modelData.variants[sel2.model] || [] : [],
//               (v) => handleSelectionChange(2, 'variant', v),
//               !sel2.model
//             )}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg px-3 py-2 text-[11px] text-slate-600 border border-slate-200 shadow-sm">
//           Tip: Select the brand and model with different variants to see feature differences.
//         </div>
//       </div>

//       <div className="p-5 border-t border-slate-200 bg-sky-50">
//         <button
//           onClick={() => onCompare(sel1, sel2)}
//           disabled={isCompareDisabled}
//           className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 ${
//             isCompareDisabled
//               ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
//           }`}
//         >
//           {isLoading ? 'Comparing...' : 'Compare Now'}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;





















// src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { ModelDetails, SelectionState } from '../types';
import { fetchModelDetails } from '../services/api';
import { ChevronDown, CarFront, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  onCompare: (selection1: SelectionState, selection2: SelectionState) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onCompare, isLoading }) => {
  const [modelData, setModelData] = useState<ModelDetails | null>(null);

  const [sel1, setSel1] = useState<SelectionState>({ brand: '', model: '', variant: '' });
  const [sel2, setSel2] = useState<SelectionState>({ brand: '', model: '', variant: '' });

  // Sidebar open/close (default: open)
  const [isOpen, setIsOpen] = useState<boolean>(true);

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

  const handleSelectionChange = (
    vehicleNum: 1 | 2,
    field: keyof SelectionState,
    value: string
  ) => {
    const setSel = vehicleNum === 1 ? setSel1 : setSel2;
    const currentSel = vehicleNum === 1 ? sel1 : sel2;

    if (field === 'brand') {
      setSel({ brand: value, model: '', variant: '' });
    } else if (field === 'model') {
      setSel({ ...currentSel, model: value, variant: '' });
    } else {
      setSel({ ...currentSel, variant: value });
    }
  };

  const isCompareDisabled = !sel1.variant || !sel2.variant || isLoading;

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
          bg-amber-500
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
    <aside
      className="
        w-full 
        md:w-[520px] 
        lg:w-[420px] 
        bg-rose-200 text-slate-900 
        flex-shrink-0 flex flex-col h-full 
        border-r border-slate-200
        transition-all duration-300
      "
    >
      {/* Header with title + close button */}
      <div className="flex items-center justify-between p-5 border-b border-black-200 bg-amber-500">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <CarFront className="text-black-500" />
            <span>Select Cars</span>
          </h2>
          <p className="text-sm text-black-500 mt-1">
            Choose two vehicles to compare variants and features.
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
      </div>

      <div className="px-5 pt-4 pb-3 flex-1 overflow-y-auto space-y-3">
        {!modelData ? (
          <div className="text-sm text-slate-600">Loading options...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle 1 */}
              <div className="bg-white rounded-xl p-3 border border-blue-200 shadow-sm">
                <h3 className="text-base font-semibold text-blue-600 mb-2 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                    1
                  </span>
                  Vehicle 1
                </h3>
                {renderDropdown('Brand', sel1.brand, modelData.brands, (v) =>
                  handleSelectionChange(1, 'brand', v)
                )}
                {renderDropdown(
                  'Model',
                  sel1.model,
                  sel1.brand ? modelData.models[sel1.brand] || [] : [],
                  (v) => handleSelectionChange(1, 'model', v),
                  !sel1.brand
                )}
                {renderDropdown(
                  'Variant',
                  sel1.variant,
                  sel1.model ? modelData.variants[sel1.model] || [] : [],
                  (v) => handleSelectionChange(1, 'variant', v),
                  !sel1.model
                )}
              </div>

              {/* Vehicle 2 */}
              <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm">
                <h3 className="text-base font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    2
                  </span>
                  Vehicle 2
                </h3>
                {renderDropdown('Brand', sel2.brand, modelData.brands, (v) =>
                  handleSelectionChange(2, 'brand', v)
                )}
                {renderDropdown(
                  'Model',
                  sel2.model,
                  sel2.brand ? modelData.models[sel2.brand] || [] : [],
                  (v) => handleSelectionChange(2, 'model', v),
                  !sel2.brand
                )}
                {renderDropdown(
                  'Variant',
                  sel2.variant,
                  sel2.model ? modelData.variants[sel2.model] || [] : [],
                  (v) => handleSelectionChange(2, 'variant', v),
                  !sel2.model
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg px-3 py-2 text-[11px] text-slate-600 border border-slate-200 shadow-sm">
              Tip: Select the brand and model with different variants to see feature differences.
            </div>
          </>
        )}
      </div>

      <div className="p-5 border-t border-slate-200 bg-sky-50">
        <button
          onClick={() => onCompare(sel1, sel2)}
          disabled={isCompareDisabled}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 ${
            isCompareDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
          }`}
        >
          {isLoading ? 'Comparing...' : 'Compare Now'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
