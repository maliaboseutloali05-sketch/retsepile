/**
 * Summary - four small figures about the whole drawer (not the filtered view).
 * `stats` is the object produced by summarise() in utils/students.js.
 * When the drawer is empty the averages are null, so we show a dash.
 */
export default function Summary({ stats }) {
  const items = [
    { label: 'Files in drawer', value: stats.total },
    { label: 'Average age', value: stats.averageAge ?? '—' },
    { label: 'Full-time', value: stats.fullTimePercent === null ? '—' : `${stats.fullTimePercent}%` },
    { label: 'Courses', value: stats.courses },
  ];

  return (
    <dl className="summary">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
