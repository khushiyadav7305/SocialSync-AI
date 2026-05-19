interface Props {
  title: string;
  value: string;
}

export default function StatsCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="text-gray-500 text-sm">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}