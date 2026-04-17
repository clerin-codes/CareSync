export default function Loader({ size = 40, text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="rounded-full border-3 border-teal-100 border-t-[#178d95] animate-spin"
        style={{ width: size, height: size }}
        aria-label="Loading"
      />
      {text && <div className="text-sm text-gray-500 animate-pulse mt-2">{text}</div>}
    </div>
  );
}