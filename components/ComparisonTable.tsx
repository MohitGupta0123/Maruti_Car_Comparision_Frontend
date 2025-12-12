// // src/components/ComparisonTable.tsx
// import React, { useMemo, useState } from 'react';
// import { ComparisonResponse, FeatureGroup, GroupedFeature } from '../types';
// import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

// interface ComparisonTableProps {
//   data: ComparisonResponse | null;
// }

// const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
//   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
//   const NO_INFO = "No information Available";

//   const groups: FeatureGroup[] = useMemo(() => {
//     if (!data) return [];

//     const groupMap: Record<string, GroupedFeature[]> = {};
//     const priceGroup: GroupedFeature[] = [];
//     const additionalGroup: GroupedFeature[] = [];

//     const variants = data.columns.slice(1);

//     data.data.forEach(row => {
//       const featureText = row.feature;
//       const values: { [key: string]: string } = {};

//       variants.forEach(v => {
//         const val = row[v];
//         values[v] = val && val.trim() !== "" ? val : NO_INFO;
//       });

//       const hasAnyInfo = Object.values(values).some(val => val !== NO_INFO);
//       if (!hasAnyInfo) {
//         return;
//       }

//       const ftLower = featureText.trim().toLowerCase();

//       if (ftLower.startsWith("price range")) {
//         priceGroup.push({ featureName: featureText, values });
//         return;
//       }

//       if (ftLower.startsWith("variant launched")) {
//         priceGroup.push({ featureName: featureText, values });
//         return;
//       }

//       const separatorIndex = featureText.indexOf(" - ");
//       if (separatorIndex !== -1) {
//         const category = featureText.substring(0, separatorIndex).trim();
//         const featureName = featureText.substring(separatorIndex + 3).trim();

//         if (!groupMap[category]) {
//           groupMap[category] = [];
//         }
//         groupMap[category].push({ featureName, values });
//       } else {
//         additionalGroup.push({ featureName: featureText, values });
//       }
//     });

//     const result: FeatureGroup[] = [];

//     if (priceGroup.length > 0) {
//       result.push({ groupName: "Price & Basic Info", items: priceGroup });
//     }

//     Object.keys(groupMap).forEach(key => {
//       result.push({ groupName: key, items: groupMap[key] });
//     });

//     if (additionalGroup.length > 0) {
//       result.push({ groupName: "Additional Features", items: additionalGroup });
//     }

//     return result;
//   }, [data]);

//   useMemo(() => {
//     if (groups.length > 0) {
//       const initialOpenState: Record<string, boolean> = {};
//       groups.forEach(g => (initialOpenState[g.groupName] = true));
//       setOpenGroups(initialOpenState);
//     }
//   }, [groups.length]);

//   const toggleGroup = (groupName: string) => {
//     setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
//   };

//   if (!data) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white rounded-xl border-2 border-dashed border-slate-200 p-10">
//         <div className="bg-blue-100 p-4 rounded-full mb-4">
//           <AlertCircle size={40} className="text-blue-500" />
//         </div>
//         <h3 className="text-lg font-semibold text-slate-800">
//           No comparison generated yet
//         </h3>
//         <p className="mt-2 text-center max-w-sm text-sm">
//           Please select two vehicles from the left panel and click &quot;Compare Now&quot; to view detailed comparison.
//         </p>
//       </div>
//     );
//   }

//   const variants = data.columns.slice(1);

//   // simple helper to give bright solid colours to extra columns if ever added
//   const variantBg = (idx: number) => {
//     if (idx === 0) return 'bg-blue-600 text-white';
//     if (idx === 1) return 'bg-emerald-600 text-white';
//     if (idx === 2) return 'bg-violet-600 text-white';
//     return 'bg-sky-600 text-white';
//   };

//   return (
//     <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-slate-200">
//       {/* NEW colourful header row */}
//       <div className="grid grid-cols-3 border-b border-slate-200">
//         <div className="p-4 font-semibold uppercase tracking-[0.08em] text-xs md:text-sm flex items-center bg-slate-900 text-white">
//           Feature
//         </div>
//         {variants.map((v, idx) => (
//           <div
//             key={idx}
//             className={`p-4 font-semibold text-sm md:text-base border-l border-white flex items-center ${variantBg(
//               idx
//             )}`}
//           >
//             <span className="truncate">{v}</span>
//           </div>
//         ))}
//       </div>

//       {/* Table Body */}
//       <div className="divide-y divide-slate-100">
//         {groups.map(group => {
//           const isOpen = openGroups[group.groupName] ?? true;
//           return (
//             <div key={group.groupName} className="bg-white">
//               {/* Group Header */}
//               <button
//                 onClick={() => toggleGroup(group.groupName)}
//                 className="w-full flex items-center justify-between px-4 py-3 bg-sky-50 hover:bg-sky-100 transition-colors text-left focus:outline-none border-b border-slate-100"
//               >
//                 <span className="font-semibold text-slate-900 flex items-center gap-2 text-sm md:text-base">
//                   <span className="inline-block w-1.5 h-6 rounded-full bg-blue-500" />
//                   {group.groupName}
//                   <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
//                     {group.items.length} items
//                   </span>
//                 </span>
//                 {isOpen ? (
//                   <ChevronUp size={18} className="text-slate-500" />
//                 ) : (
//                   <ChevronDown size={18} className="text-slate-500" />
//                 )}
//               </button>

//               {/* Group Content */}
//               {isOpen && (
//                 <div className="divide-y divide-slate-50">
//                   {group.items.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className={`grid grid-cols-3 transition-colors ${
//                         item.featureName === 'Price Range'
//                           ? 'bg-amber-50'
//                           : 'hover:bg-slate-50'
//                       }`}
//                     >
//                       <div className="p-4 text-xs md:text-sm font-medium text-slate-700 border-r border-slate-100 flex items-center">
//                         {item.featureName}
//                       </div>
//                       {variants.map((v, vIdx) => (
//                         <div
//                           key={vIdx}
//                           className={`p-4 text-xs md:text-sm border-l border-slate-100 flex items-center ${
//                             item.values[v] === NO_INFO
//                               ? 'text-slate-400 italic'
//                               : 'text-slate-900'
//                           } ${
//                             item.featureName === 'Price Range'
//                               ? 'font-semibold text-base md:text-lg'
//                               : ''
//                           }`}
//                         >
//                           {item.values[v]}
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ComparisonTable;



























// src/components/ComparisonTable.tsx
import React, { useMemo, useState } from 'react';
import { ComparisonResponse, FeatureGroup, GroupedFeature } from '../types';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ComparisonTableProps {
  data: ComparisonResponse | null;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const NO_INFO = 'No information Available';

  const groups: FeatureGroup[] = useMemo(() => {
    if (!data) return [];

    const groupMap: Record<string, GroupedFeature[]> = {};
    const priceGroup: GroupedFeature[] = [];
    const additionalGroup: GroupedFeature[] = [];

    const variants = data.columns.slice(1);

    data.data.forEach((row) => {
      const featureText = row.feature;
      const values: { [key: string]: string } = {};

      variants.forEach((v) => {
        const val = row[v];
        values[v] = val && val.trim() !== '' ? val : NO_INFO;
      });

      const hasAnyInfo = Object.values(values).some((val) => val !== NO_INFO);
      if (!hasAnyInfo) {
        return;
      }

      const ftLower = featureText.trim().toLowerCase();

      if (ftLower.startsWith('price range')) {
        priceGroup.push({ featureName: featureText, values });
        return;
      }

      if (ftLower.startsWith('variant launched')) {
        priceGroup.push({ featureName: featureText, values });
        return;
      }

      const separatorIndex = featureText.indexOf(' - ');
      if (separatorIndex !== -1) {
        const category = featureText.substring(0, separatorIndex).trim();
        const featureName = featureText.substring(separatorIndex + 3).trim();

        if (!groupMap[category]) {
          groupMap[category] = [];
        }
        groupMap[category].push({ featureName, values });
      } else {
        additionalGroup.push({ featureName: featureText, values });
      }
    });

    const result: FeatureGroup[] = [];

    if (priceGroup.length > 0) {
      result.push({ groupName: 'Price & Basic Info', items: priceGroup });
    }

    Object.keys(groupMap).forEach((key) => {
      result.push({ groupName: key, items: groupMap[key] });
    });

    if (additionalGroup.length > 0) {
      result.push({ groupName: 'Additional Features', items: additionalGroup });
    }

    return result;
  }, [data]);

  useMemo(() => {
    if (groups.length > 0) {
      const initialOpenState: Record<string, boolean> = {};
      groups.forEach((g) => (initialOpenState[g.groupName] = true));
      setOpenGroups(initialOpenState);
    }
  }, [groups.length]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white rounded-xl border-2 border-dashed border-slate-200 p-10">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <AlertCircle size={40} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          No comparison generated yet
        </h3>
        <p className="mt-2 text-center max-w-sm text-sm">
          Please select two vehicles from the left panel and click &quot;Compare
          Now&quot; to view detailed comparison.
        </p>
      </div>
    );
  }

  const variants = data.columns.slice(1);

  const variantBg = (idx: number) => {
    if (idx === 0) return 'bg-blue-600 text-white';
    if (idx === 1) return 'bg-emerald-600 text-white';
    if (idx === 2) return 'bg-violet-600 text-white';
    return 'bg-sky-600 text-white';
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-slate-200">
      {/* Colourful header row */}
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className="p-4 font-semibold uppercase tracking-[0.08em] text-xs md:text-sm flex items-center bg-slate-900 text-white">
          Feature
        </div>
        {variants.map((v, idx) => (
          <div
            key={idx}
            className={`p-4 font-semibold text-sm md:text-base border-l border-white flex items-center ${variantBg(
              idx
            )}`}
          >
            <span className="truncate">{v}</span>
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {groups.map((group) => {
          const isOpen = openGroups[group.groupName] ?? true;
          return (
            <div key={group.groupName} className="bg-white">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.groupName)}
                className="w-full flex items-center justify-between px-4 py-3 bg-sky-50 hover:bg-sky-100 transition-colors text-left focus:outline-none border-b border-slate-100"
              >
                <span className="font-semibold text-slate-900 flex items-center gap-2 text-sm md:text-base">
                  <span className="inline-block w-1.5 h-6 rounded-full bg-blue-500" />
                  {group.groupName}
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {group.items.length} items
                  </span>
                </span>
                {isOpen ? (
                  <ChevronUp size={18} className="text-slate-500" />
                ) : (
                  <ChevronDown size={18} className="text-slate-500" />
                )}
              </button>

              {/* Group Content */}
              {isOpen && (
                <div className="divide-y divide-slate-50">
                  {group.items.map((item, idx) => {
                    const isPriceRow = item.featureName === 'Price Range';

                    // NEW: detect if this row has differing values between variants
                    const variantValues = variants.map((v) => item.values[v]);
                    const nonNoInfoValues = variantValues.filter(
                      (val) => val !== NO_INFO
                    );
                    const uniqueVals = Array.from(new Set(nonNoInfoValues));
                    const isDifferent = uniqueVals.length > 1;

                    const rowBgClasses = isPriceRow
                      ? 'bg-green-100'
                      : isDifferent
                      ? 'bg-amber-50/60 hover:bg-amber-100'
                      : 'hover:bg-slate-50';

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-3 transition-colors ${rowBgClasses}`}
                      >
                        <div className="p-4 text-xs md:text-sm font-medium text-slate-700 border-r border-slate-100 flex items-center justify-between gap-2">
                          <span>{item.featureName}</span>
                          {isDifferent && !isPriceRow && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
                              Differs
                            </span>
                          )}
                        </div>
                        {variants.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            className={`p-4 text-xs md:text-sm border-l border-slate-100 flex items-center ${
                              item.values[v] === NO_INFO
                                ? 'text-slate-400 italic'
                                : 'text-slate-900'
                            } ${
                              isPriceRow
                                ? 'font-semibold text-base md:text-lg'
                                : ''
                            }`}
                          >
                            {item.values[v]}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonTable;
