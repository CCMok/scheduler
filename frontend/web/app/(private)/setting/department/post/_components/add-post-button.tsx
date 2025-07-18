'use client';

import CustomButton from "@/components/button/custom-button";
import { Plus } from "lucide-react";

export default function AddPostButton() {
  const handleAddPost = () => {
    // TODO: Implement add post functionality
    console.log('Add new post');
  };

  return (
    <CustomButton onClick={handleAddPost}>
      <Plus />
      新增
    </CustomButton>
  );
} 