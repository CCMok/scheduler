import { ThemeToggle } from "@/components/root/buttons/theme-toggle";
import { Button } from "@/shadcn/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">歡迎使用 Scheduler</h1>
        <p className="text-lg text-secondary-foreground mb-6">
          簡化您的日程安排並有效率地管理您的時間。
        </p>
        <Button className="px-6 py-3">
          開始使用
        </Button>
      </div>
    </div>
  );
}
