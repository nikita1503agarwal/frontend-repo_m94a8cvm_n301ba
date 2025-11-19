export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
      <img src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947'} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold">{item.name}</h4>
          <span className="text-blue-200">${item.price.toFixed(2)}</span>
        </div>
        {item.description && <p className="text-blue-200/80 text-sm mt-1">{item.description}</p>}
        <div className="mt-3 flex justify-end">
          <button onClick={() => onAdd?.(item)} className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm">Add</button>
        </div>
      </div>
    </div>
  )
}
