// 'use client'

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import MDEditor from '@uiw/react-md-editor';
// import { Button } from '@/components/ui/Button';
// import { Category, Post, Tag } from '@prisma/client';
// import { Skeleton } from '@/components/ui/skeleton';
// import {ImageUpload} from '@/components/admin/ImageUpload';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
// import { Label } from '@/components/ui/Label';
// import { Switch } from '@/components/ui/Switch';
// import { saveMedia } from '@/lib/api/media';
// import { getCategories } from '@/lib/api/categories';
// import { getTags } from '@/lib/api/tags';
// import { useDebounce } from 'use-debounce';
// import { PostWithTags } from '@/types/post';
// import rehypePrism from 'rehype-prism-plus';
// import 'prismjs/themes/prism-tomorrow.css';
// import Prism from 'prismjs';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-typescript';

// export default function EditPostPage({ params }: { params: { postId: string } }) {
//     const router = useRouter();
//     const [post, setPost] = useState<PostWithTags | null>(null);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [tags, setTags] = useState<Tag[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [debouncedContent] = useDebounce(post?.content, 1000);

//     // 动态加载 Prism
//     useEffect(() => {
//         import('prismjs').then(Prism => {
//             require('prismjs/components/prism-javascript');
//             require('prismjs/components/prism-typescript');
//             Prism.highlightAll();
//         });
//     }, []);

//     // 加载文章数据
//     useEffect(() => {
//         const loadInitialData = async () => {
//             try {
//                 const [cats, tags] = await Promise.all([getCategories(), getTags()]);
//                 setCategories(cats);
//                 setTags(tags);

//                 const res = await fetch(`/api/admin/posts/${params.postId}`);
//                 if (!res.ok) throw new Error('加载失败');
//                 const data = await res.json();
//                 setPost(data);
//             } catch (error) {
//                 console.error('初始化错误:', error);
//                 router.replace('/admin/posts');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadInitialData();
//     }, [params.postId]);

//     // 自动保存草稿
//     useEffect(() => {
//         if (debouncedContent && post) autoSaveDraft();
//     }, [debouncedContent]);

//     const autoSaveDraft = async () => {
//         try {
//             await fetch(`/api/admin/posts/${params.postId}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     ...post,
//                     status: 'DRAFT',
//                     autoSave: true,
//                 }),
//             });
//         } catch (error) {
//             console.error('自动保存失败:', error);
//         }
//     };

//     const handleImageUpload = async (file: File) => {
//         try {
//             const formData = new FormData();
//             formData.append('file', file);
//             const media = await saveMedia(formData);
    
//             setPost(prev => {
//                 if (prev === null) {
//                     return null; // 如果 prev 是 null，直接返回 null
//                 }
//                 return {
//                     ...prev,
//                     coverImage: media.url,
//                 };
//             });
//         } catch (error) {
//             console.error('图片上传失败:', error);
//             alert('图片上传失败');
//         }
//     };
    
    

//     const handleSubmit = async (status?: Post['status']) => {
//         if (!post) {
//             console.error('Post 数据为空');
//             alert('Post 数据为空，请稍后重试');
//             return;
//         }
    
//         setIsSubmitting(true);
//         try {
//             const payload = {
//                 ...post,
//                 status: status || post.status,
//                 isPublished: status === 'PUBLISHED',
//             };
    
//             const res = await fetch(`/api/admin/posts/${params.postId}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });
    
//             if (!res.ok) throw new Error(res.statusText);
    
//             const result = await res.json();
//             router.push(`/admin/posts/edit/${result.id}`);
//         } catch (error) {
//             console.error('提交失败:', error);
//             alert('提交失败，请稍后重试');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
    

//     if (isLoading || !post) {
//         return (
//             <div className="space-y-6">
//                 <Skeleton className="h-10 w-full" />
//                 <Skeleton className="h-[600px] w-full" />
//                 <div className="flex space-x-4">
//                     <Skeleton className="h-10 w-24" />
//                     <Skeleton className="h-10 w-24" />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 max-w-6xl mx-auto">
//             {/* 基础信息 */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label>文章标题</Label>
//                     <input
//                         value={post.title}
//                         onChange={e => setPost({ ...post, title: e.target.value })}
//                         placeholder="请输入文章标题"
//                         className="text-2xl font-bold w-full border rounded p-2"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <Label>分类选择</Label>
//                     <Select
//                         value={post.categoryId}
//                         onValueChange={value => setPost({ ...post, categoryId: value })}
//                     >
//                         <SelectTrigger>
//                             <SelectValue placeholder="选择分类" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {categories.map(category => (
//                                 <SelectItem key={category.id} value={category.id}>
//                                     {category.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>

//             {/* 封面图片 */}
//             <div className="space-y-2">
//                 <Label>封面图片</Label>
//                 <ImageUpload
//                     initialImage={post.coverImage || ''}
//                     onUpload={handleImageUpload}
//                     onRemove={() => setPost({ ...post, coverImage: '' })}
//                 />
//             </div>

//             {/* Markdown编辑器 */}
//             <div className="space-y-2">
//                 <Label>文章内容</Label>
//                 <div data-color-mode="light" className="border rounded overflow-hidden">
//                     <MDEditor
//                         value={post.content}
//                         onChange={value => setPost({ ...post, content: value || '' })}
//                         previewOptions={{
//                             rehypePlugins: [
//                                 [rehypePrism, {
//                                     ignoreMissing: true,
//                                     resolvePrism: () => Prism
//                                 }]
//                             ]
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* SEO设置 */}
//             <div className="grid grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                     <Label>Meta标题</Label>
//                     <input
//                         value={post.metaTitle || ''}
//                         onChange={e => setPost({ ...post, metaTitle: e.target.value })}
//                         placeholder="SEO标题"
//                         className="w-full border rounded p-2"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>Meta描述</Label>
//                     <textarea
//                         value={post.metaDescription || ''}
//                         onChange={e => setPost({ ...post, metaDescription: e.target.value })}
//                         placeholder="SEO描述"
//                         className="w-full border rounded p-2 h-24"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>关键词</Label>
//                     <input
//                         value={post.keywords || ''}
//                         onChange={e => setPost({ ...post, keywords: e.target.value })}
//                         placeholder="逗号分隔的关键词"
//                         className="w-full border rounded p-2"
//                     />
//                 </div>
//             </div>

//             {/* 操作按钮 */}
//             <div className="flex justify-between items-center">
//                 <div className="flex gap-4">
//                     <Button
//                         onClick={() => handleSubmit('DRAFT')}
//                         disabled={isSubmitting}
//                         variant="outline"
//                     >
//                         {isSubmitting ? '保存中...' : '保存草稿'}
//                     </Button>
//                     <Button
//                         onClick={() => handleSubmit('PENDING')}
//                         disabled={isSubmitting || !post.title}
//                     >
//                         {isSubmitting ? '提交中...' : '提交审核'}
//                     </Button>
//                 </div>

//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center space-x-2">
//                         <Switch
//                             id="featured"
//                             checked={post.isFeatured}
//                             onCheckedChange={checked => setPost({ ...post, isFeatured: checked })}
//                         />
//                         <Label htmlFor="featured">设为推荐</Label>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }