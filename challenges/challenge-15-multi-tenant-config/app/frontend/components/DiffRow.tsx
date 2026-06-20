type Props = { label: string; valueA: string; valueB: string };

export function DiffRow({ label, valueA, valueB }: Props) {
  const differs = valueA !== valueB;
  return (
    <tr className={differs ? "bg-yellow-50" : ""}>
      <td className="px-4 py-2 text-sm font-medium text-gray-500 w-44">{label}</td>
      <td className={`px-4 py-2 text-sm ${differs ? "text-gray-900 font-medium" : "text-gray-700"}`}>
        {valueA || "—"}
      </td>
      <td className={`px-4 py-2 text-sm ${differs ? "text-gray-900 font-medium" : "text-gray-700"}`}>
        {valueB || "—"}
      </td>
    </tr>
  );
}
