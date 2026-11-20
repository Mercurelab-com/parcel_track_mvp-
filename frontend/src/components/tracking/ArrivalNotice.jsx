import React from 'react';
import { CheckCircle2, CheckCheck } from 'lucide-react';

export default function ArrivalNotice({ parcel }) {
  if (parcel.status === 'ARRIVED') {
    return (
      <div className="bg-[#F0FDFA] border-2 border-[#99F6E4] rounded-xl p-5 sm:p-6 text-[#0F766E] shadow-sm space-y-2 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-[#0D9488] flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#0F766E] leading-tight">
              Ready for Collection at {parcel.destination}
            </h3>
            <p className="text-xs sm:text-sm text-[#0F766E]/90 mt-0.5">
              The parcel has reached the {parcel.destination} destination agency and is ready for collection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (parcel.status === 'COLLECTED') {
    return (
      <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-5 text-[#334155] shadow-2xs space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-[#475569] flex-shrink-0">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#1E293B]">
              Parcel Handover Completed
            </h3>
            <p className="text-xs text-[#64748B]">
              The parcel has been collected by the recipient.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
