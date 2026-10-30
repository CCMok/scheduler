const DAYS = ["一", "二", "三", "四", "五", "六", "日"] as const;
const ROWS = [
  { name: "阿明", cells: [1, 0, 1, 1, 0, 1, 0] },
  { name: "小華", cells: [0, 1, 1, 0, 1, 1, 0] },
  { name: "美玲", cells: [1, 1, 0, 1, 1, 0, 1] },
] as const;

export default function AuthQuietGrid() {
  return (
    <div className="auth-quiet-grid" aria-hidden="true">
      <div className="auth-quiet-grid-head">
        <span className="auth-quiet-grid-corner" />
        {DAYS.map((day) => (
          <span key={day} className="auth-quiet-grid-day">
            {day}
          </span>
        ))}
      </div>
      {ROWS.map((row) => (
        <div key={row.name} className="auth-quiet-grid-row">
          <span className="auth-quiet-grid-name">{row.name}</span>
          {row.cells.map((filled, i) => (
            <span
              key={`${row.name}-${DAYS[i]}`}
              className={
                filled
                  ? "auth-quiet-grid-cell is-filled"
                  : "auth-quiet-grid-cell"
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
