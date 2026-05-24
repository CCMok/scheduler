'use client'

import CustomButton from "@/components/_general/_custom/button/custom-button";
import HeaderLayout from "@/components/_general/header/header-layout";
import { Badge } from "@/external/shadcn/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Checkbox } from "@/external/shadcn/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { Input } from "@/external/shadcn/components/ui/input";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { cn } from "@/external/shadcn/libs/utils";
import { ROUTE } from "@/libs/_general/route/route-config";
import { createTeamAction } from "@/libs/team/create/create-team-action";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ClipboardList, Plus, Save, Sparkles, Trash2, UserRoundPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type PostDraft = {
  name: string;
}

type WorkerDraft = {
  name: string;
  posts: number[];
}

const steps = [
  { title: '基本資料', description: '命名團隊', icon: UsersRound },
  { title: '職位', description: '建立需要排班的位置', icon: BriefcaseBusiness },
  { title: '職員', description: '加入會參與排班的人員', icon: UserRoundPlus },
  { title: '職員職位', description: '設定每位職員可擔任的職位', icon: ClipboardList },
] as const;

const postTemplates = [
  { label: '標準三班', posts: ['早班', '中班', '夜班'] },
  { label: '營運現場', posts: ['櫃檯', '場務', '支援', '主管'] },
] as const;

const workerTemplates = [
  { label: '小隊', workers: ['Alex', 'Casey', 'Jordan', 'Morgan'] },
  { label: '八人團隊', workers: ['職員 1', '職員 2', '職員 3', '職員 4', '職員 5', '職員 6', '職員 7', '職員 8'] },
] as const;

export default function TeamNewWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [posts, setPosts] = useState<PostDraft[]>([{ name: '' }]);
  const [workers, setWorkers] = useState<WorkerDraft[]>([{ name: '', posts: [] }]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const trimmedPosts = posts.map(post => post.name.trim()).filter(Boolean);
  const trimmedWorkers = workers.map(worker => worker.name.trim()).filter(Boolean);
  const canGoNext = getCanGoNext(currentStep, teamName, posts, workers);

  const updatePostName = (index: number, name: string) => {
    setPosts(currentPosts => currentPosts.map((post, postIndex) =>
      postIndex === index ? { name } : post
    ));
  }

  const updateWorkerName = (index: number, name: string) => {
    setWorkers(currentWorkers => currentWorkers.map((worker, workerIndex) =>
      workerIndex === index ? { ...worker, name } : worker
    ));
  }

  const addPost = () => setPosts(currentPosts => [...currentPosts, { name: '' }]);

  const addWorker = () => setWorkers(currentWorkers => [...currentWorkers, { name: '', posts: [] }]);

  const removePost = (index: number) => {
    setPosts(currentPosts => currentPosts.filter((_, postIndex) => postIndex !== index));
    setWorkers(currentWorkers => currentWorkers.map(worker => ({
      ...worker,
      posts: worker.posts
        .filter(postIndex => postIndex !== index)
        .map(postIndex => postIndex > index ? postIndex - 1 : postIndex),
    })));
  }

  const removeWorker = (index: number) => {
    setWorkers(currentWorkers => currentWorkers.filter((_, workerIndex) => workerIndex !== index));
  }

  const applyPostTemplate = (templatePosts: readonly string[]) => {
    setPosts(templatePosts.map(name => ({ name })));
    setWorkers(currentWorkers => currentWorkers.map(worker => ({
      ...worker,
      posts: worker.posts.filter(postIndex => postIndex < templatePosts.length),
    })));
  }

  const applyWorkerTemplate = (templateWorkers: readonly string[]) => {
    setWorkers(templateWorkers.map(name => ({ name, posts: [] })));
  }

  const toggleWorkerPost = (workerIndex: number, postIndex: number) => {
    setWorkers(currentWorkers => currentWorkers.map((worker, index) => {
      if (index !== workerIndex) return worker;
      const isSelected = worker.posts.includes(postIndex);
      return {
        ...worker,
        posts: isSelected
          ? worker.posts.filter(currentPostIndex => currentPostIndex !== postIndex)
          : [...worker.posts, postIndex].sort((a, b) => a - b),
      }
    }));
  }

  const assignAllPosts = (workerIndex: number) => {
    setWorkers(currentWorkers => currentWorkers.map((worker, index) =>
      index === workerIndex ? { ...worker, posts: posts.map((_, postIndex) => postIndex) } : worker
    ));
  }

  const clearWorkerPosts = (workerIndex: number) => {
    setWorkers(currentWorkers => currentWorkers.map((worker, index) =>
      index === workerIndex ? { ...worker, posts: [] } : worker
    ));
  }

  const saveTeam = () => {
    startTransition(async () => {
      const response = await createTeamAction({
        name: teamName.trim(),
        posts: posts.map(post => ({ name: post.name.trim() })),
        workers: workers.map(worker => ({
          name: worker.name.trim(),
          posts: worker.posts,
        })),
      });

      if (!response.isSuccess) {
        toast.error(response.message);
        return;
      }

      toast.success('團隊建立成功');
      router.push(ROUTE.private.roster.autoNew(response.data));
    });
  }

  return (
    <HeaderLayout
      title={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>設定</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={ROUTE.private.setting.team.base()}>團隊</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>新增</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>新增團隊</CardTitle>
            <CardDescription>完成後會直接前往自動建立更表</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isDone = currentStep > index;

              return (
                <button
                  key={step.title}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors',
                    isActive && 'border-primary bg-primary/5',
                    isDone && 'bg-muted/50'
                  )}
                  onClick={() => setCurrentStep(index)}
                >
                  <span className={cn(
                    'flex size-9 items-center justify-center rounded-md border bg-background',
                    isActive && 'border-primary text-primary',
                    isDone && 'bg-primary text-primary-foreground'
                  )}>
                    {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{step.title}</span>
                    <span className="block truncate text-sm text-muted-foreground">{step.description}</span>
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="min-h-0">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
              <Badge variant="outline">{currentStep + 1} / {steps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="min-h-[420px]">
            {currentStep === 0 && (
              <BasicInfoStep teamName={teamName} setTeamName={setTeamName} />
            )}
            {currentStep === 1 && (
              <PostsStep
                posts={posts}
                updatePostName={updatePostName}
                addPost={addPost}
                removePost={removePost}
                applyTemplate={applyPostTemplate}
              />
            )}
            {currentStep === 2 && (
              <WorkersStep
                workers={workers}
                updateWorkerName={updateWorkerName}
                addWorker={addWorker}
                removeWorker={removeWorker}
                applyTemplate={applyWorkerTemplate}
              />
            )}
            {currentStep === 3 && (
              <WorkerPostsStep
                posts={posts}
                workers={workers}
                toggleWorkerPost={toggleWorkerPost}
                assignAllPosts={assignAllPosts}
                clearWorkerPosts={clearWorkerPosts}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t pt-4">
            <CustomButton asChild variant="outline">
              <Link href={ROUTE.private.setting.team.base()}>
                <ArrowLeft />
                返回
              </Link>
            </CustomButton>
            <div className="flex gap-2">
              <CustomButton
                variant="outline"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(step => Math.max(0, step - 1))}
              >
                <ArrowLeft />
                上一步
              </CustomButton>
              {currentStep < steps.length - 1 ? (
                <CustomButton
                  disabled={!canGoNext}
                  onClick={() => setCurrentStep(step => Math.min(steps.length - 1, step + 1))}
                >
                  下一步
                  <ArrowRight />
                </CustomButton>
              ) : (
                <CustomButton
                  disabled={!canGoNext || isPending}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <Save />
                  儲存
                </CustomButton>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認建立團隊?</DialogTitle>
            <DialogDescription>
              將建立 {teamName.trim()}，包含 {trimmedPosts.length} 個職位、{trimmedWorkers.length} 位職員，並套用目前的職位配對。
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {trimmedPosts.map(post => <Badge key={post} variant="secondary">{post}</Badge>)}
            </div>
          </div>
          <DialogFooter>
            <CustomButton variant="outline" disabled={isPending} onClick={() => setIsConfirmOpen(false)}>取消</CustomButton>
            <CustomButton disabled={isPending} onClick={saveTeam}>
              <Save />
              確認儲存
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HeaderLayout>
  )
}

function BasicInfoStep({
  teamName,
  setTeamName,
}: Readonly<{
  teamName: string;
  setTeamName: (name: string) => void;
}>) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-8">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2 font-medium">
          <UsersRound className="size-4" />
          團隊名稱
        </div>
        <Input
          value={teamName}
          onChange={(event) => setTeamName(event.target.value)}
          placeholder="例如：前台營運團隊"
          autoFocus
        />
      </div>
    </div>
  )
}

function PostsStep({
  posts,
  updatePostName,
  addPost,
  removePost,
  applyTemplate,
}: Readonly<{
  posts: PostDraft[];
  updatePostName: (index: number, name: string) => void;
  addPost: () => void;
  removePost: (index: number) => void;
  applyTemplate: (posts: readonly string[]) => void;
}>) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div key={index} className="flex items-center gap-3 rounded-md border p-3">
            <Badge variant="outline" className="size-8 rounded-md">{index + 1}</Badge>
            <Input
              value={post.name}
              onChange={(event) => updatePostName(index, event.target.value)}
              placeholder="職位名稱"
            />
            <CustomButton variant="ghost" size="icon" disabled={posts.length === 1} onClick={() => removePost(index)}>
              <Trash2 />
            </CustomButton>
          </div>
        ))}
        <CustomButton variant="outline" onClick={addPost}>
          <Plus />
          新增職位
        </CustomButton>
      </div>
      <TemplatePanel title="職位範本">
        {postTemplates.map(template => (
          <CustomButton key={template.label} variant="outline" className="justify-start" onClick={() => applyTemplate(template.posts)}>
            <Sparkles />
            {template.label}
          </CustomButton>
        ))}
      </TemplatePanel>
    </div>
  )
}

function WorkersStep({
  workers,
  updateWorkerName,
  addWorker,
  removeWorker,
  applyTemplate,
}: Readonly<{
  workers: WorkerDraft[];
  updateWorkerName: (index: number, name: string) => void;
  addWorker: () => void;
  removeWorker: (index: number) => void;
  applyTemplate: (workers: readonly string[]) => void;
}>) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
      <div className="grid gap-3 md:grid-cols-2">
        {workers.map((worker, index) => (
          <div key={index} className="flex items-center gap-3 rounded-md border p-3">
            <Badge variant="outline" className="size-8 rounded-md">{index + 1}</Badge>
            <Input
              value={worker.name}
              onChange={(event) => updateWorkerName(index, event.target.value)}
              placeholder="職員名稱"
            />
            <CustomButton variant="ghost" size="icon" disabled={workers.length === 1} onClick={() => removeWorker(index)}>
              <Trash2 />
            </CustomButton>
          </div>
        ))}
        <CustomButton variant="outline" className="h-[62px]" onClick={addWorker}>
          <Plus />
          新增職員
        </CustomButton>
      </div>
      <TemplatePanel title="職員範本">
        {workerTemplates.map(template => (
          <CustomButton key={template.label} variant="outline" className="justify-start" onClick={() => applyTemplate(template.workers)}>
            <Sparkles />
            {template.label}
          </CustomButton>
        ))}
      </TemplatePanel>
    </div>
  )
}

function WorkerPostsStep({
  posts,
  workers,
  toggleWorkerPost,
  assignAllPosts,
  clearWorkerPosts,
}: Readonly<{
  posts: PostDraft[];
  workers: WorkerDraft[];
  toggleWorkerPost: (workerIndex: number, postIndex: number) => void;
  assignAllPosts: (workerIndex: number) => void;
  clearWorkerPosts: (workerIndex: number) => void;
}>) {
  const validPosts = posts.map(post => post.name.trim()).filter(Boolean);
  const validWorkers = workers.map(worker => ({
    ...worker,
    name: worker.name.trim(),
  })).filter(worker => worker.name);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 p-3">
        <span className="text-sm font-medium">職位覆蓋</span>
        <Separator orientation="vertical" className="h-5" />
        {validPosts.map((post, postIndex) => {
          const count = validWorkers.filter(worker => worker.posts.includes(postIndex)).length;
          return <Badge key={post} variant={count > 0 ? 'secondary' : 'destructive'}>{post}: {count}</Badge>
        })}
      </div>
      <ScrollArea className="h-[430px] rounded-md border">
        <div className="min-w-[720px] divide-y">
          <div className="grid grid-cols-[180px_1fr_140px] gap-3 bg-muted/40 p-3 text-sm font-medium">
            <span>職員</span>
            <span>可擔任職位</span>
            <span>快速設定</span>
          </div>
          {validWorkers.map((worker, workerIndex) => (
            <div key={`${worker.name}-${workerIndex}`} className="grid grid-cols-[180px_1fr_140px] items-center gap-3 p-3">
              <div>
                <div className="font-medium">{worker.name}</div>
                <div className="text-sm text-muted-foreground">已選 {worker.posts.length} 個職位</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {validPosts.map((post, postIndex) => (
                  <label key={post} className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted/50">
                    <Checkbox
                      checked={worker.posts.includes(postIndex)}
                      onCheckedChange={() => toggleWorkerPost(workerIndex, postIndex)}
                    />
                    <span>{post}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <CustomButton variant="outline" size="sm" onClick={() => assignAllPosts(workerIndex)}>全選</CustomButton>
                <CustomButton variant="ghost" size="sm" onClick={() => clearWorkerPosts(workerIndex)}>清除</CustomButton>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function TemplatePanel({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="h-fit rounded-md border bg-muted/30 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Sparkles className="size-4" />
        {title}
      </div>
      <div className="grid gap-2">
        {children}
      </div>
    </div>
  )
}

const getCanGoNext = (
  currentStep: number,
  teamName: string,
  posts: PostDraft[],
  workers: WorkerDraft[],
): boolean => {
  if (currentStep === 0) return teamName.trim().length > 0;
  if (currentStep === 1) return posts.length > 0 && posts.every(post => post.name.trim().length > 0);
  if (currentStep === 2) return workers.length > 0 && workers.every(worker => worker.name.trim().length > 0);
  return teamName.trim().length > 0
    && posts.length > 0
    && workers.length > 0
    && posts.every(post => post.name.trim().length > 0)
    && workers.every(worker => worker.name.trim().length > 0);
}