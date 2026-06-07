function ProfileHeader({
  user,
  totalListings,
  completedSales
}) {
  return (
    <div className="clay-card p-6 md:p-8 bg-gradient-to-tr from-pink-50 via-white to-indigo-50 border border-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-3xl text-white font-extrabold uppercase shadow-lg">
              {user.name.substring(0, 2)}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-800">
              {user.name}
            </h3>

            <p className="text-xs text-indigo-600 font-bold tracking-wider">
              {user.email}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1.5 text-xs text-slate-500 font-bold">

              <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">
                📦 {totalListings} Total Listings
              </span>

              <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">
                🎉 {completedSales} Completed Sales
              </span>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;