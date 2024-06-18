export default function SearchBox() {
  return (
    <div className="search">
      <input
        type="search"
        className={`bg-gray-50 border border-1 border-gray-300 outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5`}
        placeholder="Search by user name..."
        // onChange={change}
      />
    </div>
  );
}
