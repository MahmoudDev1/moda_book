export default function SkeletonPost() {
  return (
    <div className="rounded-md p-4 w-full">
      <div className="animate-pulse">
        <div className="flex gap-2">
          <div className="rounded-full bg-gray-400 h-11 w-11"></div>
          <div>
            <div className="mt-2 h-2 w-36 bg-gray-400 rounded"></div>
            <div className="mt-2 h-2 w-20 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="flex-1 space-y-6 py-1 mt-5">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-400 rounded col-span-2"></div>
              <div className="h-2 bg-gray-400 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
