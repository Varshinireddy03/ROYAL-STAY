export default function Card({ title, children }) {
  return (
    <div className="bg-white p-5 shadow-md border rounded-xl">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
}

