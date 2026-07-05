'use client'

import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { Input } from "@/external/shadcn/components/ui/input"
import { Fragment, useState } from "react";
import { Post } from "@/external/prisma/generated/browser";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/external/shadcn/components/ui/item";
import { Plus, User } from "lucide-react";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { cn } from "@/external/shadcn/libs/utils";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { DetailPanelMode, DetailPanelState } from "../../detail-panel-state";

const POST_NAME_INPUT_ID = 'post-name';

export default function SelectPostPanel({
  className,
  posts,
  detailPanelState,
  setDetailPanelState
}: Readonly<{
  className?: string;
  posts: Post[];
  detailPanelState: DetailPanelState;
  setDetailPanelState: (state: DetailPanelState) => void;
}>) {
  const [inputName, setInputName] = useState('');
  const filteredPosts = posts.filter(p => p.name.toLowerCase().includes(inputName.toLowerCase()));
  return (
    <Card className={className}>
      <CardContent className='space-y-2 flex-1 min-h-0 flex flex-col'>
        <div className='flex space-x-2'>
          <Input
            id={POST_NAME_INPUT_ID}
            name={POST_NAME_INPUT_ID}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="搜尋..."
            autoComplete="off"
          />
          <CustomButton
            variant='outline'
            size='icon'
            onClick={() => setDetailPanelState({ mode: DetailPanelMode.CREATE })}
          >
            <Plus />
          </CustomButton>
        </div>
        <ScrollArea className='flex-1 min-h-0 border rounded-md'>
          <ItemGroup>
            {filteredPosts.map((post, index) => (
              <Fragment key={post.id}>
                {index > 0 && (
                  <ItemSeparator />
                )}
                <Item
                  className={cn(
                    'cursor-pointer rounded-none',
                    detailPanelState.mode === DetailPanelMode.UPDATE && detailPanelState.id === post.id && 'bg-accent'
                  )}
                  size='sm'
                  onClick={() => setDetailPanelState({ mode: DetailPanelMode.UPDATE, id: post.id })}
                >
                  <ItemMedia>
                    <User className='size-4' />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{post.name}</ItemTitle>
                  </ItemContent>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}