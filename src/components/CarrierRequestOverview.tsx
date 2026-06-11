import { useParams } from "react-router-dom";
import { useGetFreightBidQuery } from "@/redux/api/freightApi";
import { Building, Briefcase, Truck, Package, MapPin, Calendar, Clock, Tag } from "lucide-react";

export default function CarrierRequestOverview() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetFreightBidQuery(token || "", {
    skip: !token,
  });

  if (!details) return null;

  const isExpired = new Date() > new Date(details.bidDeadline);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Shipment Details</h3>
        <div className="flex flex-col gap-5">
          {/* Carrier */}
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Carrier</p>
              <p className="text-sm font-semibold text-slate-800">{details.carrierName}</p>
            </div>
          </div>

          {/* Project */}
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Project</p>
              <p className="text-sm font-semibold text-slate-800">{details.projectName}</p>
            </div>
          </div>

          {/* Job ID & Delivery Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Job ID</p>
                <p className="text-sm font-semibold text-slate-800">{details.jobId}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Delivery #</p>
                <p className="text-sm font-semibold text-slate-800 text-nowrap truncate">{details.deliveryNumber}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Description</p>
              <p className="text-sm font-semibold text-slate-800">{details.description}</p>
            </div>
          </div>

          {/* Route Section */}
          <div className="pt-4 border-t border-slate-50 flex flex-col gap-4 relative">
            {/* Dotted vertical connector */}
            <div className="absolute left-[25px] top-[40px] bottom-[30px] border-l-2 border-dashed border-slate-200" />

            <div className="flex gap-3 items-start relative z-10">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pickup</p>
                <p className="text-sm font-semibold text-slate-800">{details.pickupLocation}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start relative z-10">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Delivery</p>
                <p className="text-sm font-semibold text-slate-800">{details.deliveryLocation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deadline Section */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className={`p-4 rounded-2xl flex flex-col gap-2 ${isExpired ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
          <div className="flex items-center gap-2">
            {isExpired ? <Clock className="h-5 w-5 text-red-600" /> : <Calendar className="h-5 w-5 text-amber-600" />}
            <span className="font-bold text-sm">
              {isExpired ? "Bidding Closed" : "Bid Deadline"}
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            {formatDate(details.bidDeadline)}
          </p>
          {!isExpired && (
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              Submit your rate before the deadline above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
