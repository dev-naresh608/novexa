export default function SectionCard({ children, className = "" }) {
    return (
      <div
        className={`bg-white border border-gray-100 rounded-xl min-w-[250px] p-4 shadow-sm ${className}`}
      >
        {children}
      </div>
    );
  }
