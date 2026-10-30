import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import Logo from "@/components/_general/logo/logo";
import { ROUTE } from "@/libs/_general/route/route-config";

const DAYS = ["一", "二", "三", "四", "五", "六", "日"] as const;
const ROWS = [
  { name: "阿明", cells: [1, 0, 1, 1, 0, 1, 0] },
  { name: "小華", cells: [0, 1, 1, 0, 1, 1, 0] },
  { name: "美玲", cells: [1, 1, 0, 1, 1, 0, 1] },
  { name: "志強", cells: [1, 0, 1, 0, 1, 1, 1] },
  { name: "雅婷", cells: [0, 1, 0, 1, 0, 1, 1] },
] as const;

function HeroRosterGrid() {
  return (
    <div className="home-hero-grid" aria-hidden="true">
      <div className="home-hero-grid-head">
        <span className="home-hero-grid-corner" />
        {DAYS.map((day) => (
          <span key={day} className="home-hero-grid-day">
            {day}
          </span>
        ))}
      </div>
      {ROWS.map((row) => (
        <div key={row.name} className="home-hero-grid-row">
          <span className="home-hero-grid-name">{row.name}</span>
          {row.cells.map((filled, i) => (
            <span
              key={`${row.name}-${DAYS[i]}`}
              className={
                filled ? "home-hero-grid-cell is-filled" : "home-hero-grid-cell"
              }
            />
          ))}
        </div>
      ))}
      <div className="home-hero-grid-sweep" />
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero-atmosphere" aria-hidden="true" />
      <div className="home-hero-content">
        <div className="home-hero-brand home-hero-enter">
          <Logo size="hero" className="justify-center" />
        </div>
        <h1 className="home-hero-headline home-hero-enter home-hero-enter-delay-1">
          一週班表，一次排好
        </h1>
        <p className="home-hero-support home-hero-enter home-hero-enter-delay-2">
          簡化日程安排，有效率管理團隊。
        </p>
        <div className="home-hero-actions home-hero-enter home-hero-enter-delay-3">
          <CustomButton className="min-w-40" size="lg" asChild>
            <CustomLink href={ROUTE.public.login}>開始使用</CustomLink>
          </CustomButton>
          <CustomButton variant="ghost" size="sm" asChild>
            <CustomLink href={ROUTE.public.signUp.base}>註冊帳號</CustomLink>
          </CustomButton>
        </div>
      </div>
      <div className="home-hero-visual" aria-hidden="true">
        <HeroRosterGrid />
      </div>
    </section>
  );
}
