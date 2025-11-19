import { Star } from "lucide-react"

export default function RestaurantCard({ restaurant, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(restaurant)}
      className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition flex gap-4 w-full"
    >
      <img
        src={restaurant.image_url || "https://images.unsplash.com/photo-1548365328-9f547fb09556"}
        alt={restaurant.name}
        className="w-24 h-24 object-cover rounded-xl"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm">{restaurant.rating?.toFixed?.(1) || restaurant.rating}</span>
          </div>
        </div>
        <p className="text-blue-200/80 text-sm">{restaurant.cuisine} • {restaurant.delivery_time_min} min • ${restaurant.delivery_fee.toFixed(2)}</p>
        {restaurant.address && (
          <p className="text-blue-200/60 text-xs mt-1">{restaurant.address}</p>
        )}
      </div>
    </button>
  )
}
