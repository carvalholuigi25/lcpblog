"use client";
import { useParams } from 'next/navigation';
import News from '@/app/components/news';

export default function NewsPage() {
  const { id } = useParams();

  return (
    <News pid={parseInt(""+id, 0)} />
  );
}