export default function SectionLabel({ children, className= "" }) {
    return (
      <p className={`text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1 ${className}`}>
        {children}
      </p>
    );
  }